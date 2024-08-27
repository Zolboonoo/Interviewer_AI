from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from faster_whisper import WhisperModel
from pydantic import BaseModel
from typing import List, Dict
import google.generativeai as genai
import json
import time
import requests
import shutil
import os
import os.path
from pathlib import Path
import re

# sst libraries
import torch
from TTS.api import TTS # type: ignore
import gradio as gr # type: ignore


app = FastAPI()

if __name__ == "__main__":
  import uvicorn
  uvicorn.run(app, host="localhost", port=8000)

app.add_middleware(
  CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["POST"],  # Specify the HTTP methods allowed by your backend endpoint
    allow_headers=["Content-Type"],
)
class Message(BaseModel):
  message: str

class HistoryItem(BaseModel):
  role: str
  parts: list[str] 

class ChatData(BaseModel):
  message: str
  history: List[Dict[str, str]]

# Generate requests test
@app.post("/GenerateReqTextTest")
def send_message_to_python_test(message: ChatData):
  try:
    time.sleep(5)
    response = "レスポンステスト"
    # print(message)
    return {'message': response}

  except Exception as e:
    # Log the exception to understand the error
    print(f"Error occurred: {str(e)}")
    raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/GenerateReqText")
def send_message_to_python(message: ChatData):
  try:
    genai.configure(api_key="AIzaSyB3r5lNVV0qnt3Jk1sBOpe9a3RBUe3vVHo")

    generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
    }

    model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    system_instruction="""君は日本人の礼儀がよくわかるボットだ。そしてIT企業の面接官である。僕は今君の担当している開発の案件に参加したいとおもっている。\n
    そして、君は面接官になりきって僕と会話してください。  \n
    絶対守るルール：\n
    **面接終了後、適切なフィードバックを提供する。\n
    **採用・不採用の理由を明確に伝える。\n
    **僕の名前は知らない場合は奥井と読んでください。\n
    聞くべき質問一覧\n
    **前職ではどのような業務を担当していましたか？\n
    **特定の技術やツールについての知識を教えてください。(私が言った内容から)\n
    """,

    # safety_settings = Adjust safety settings
    # See https://ai.google.dev/gemini-api/docs/safety-settings
    )

    print(message.history)
    chat_session = model.start_chat(history=message.history)

    response = chat_session.send_message(message.message)
    responce_text = response.text
    return {'message': response.text}
  
    # Define the path to save the generated audio file
    audio_file_path = "static/generated_audio.wav"

    # Generate the audio file
    generate_audio(text=responce_text, file_path=audio_file_path)

    # Return the URL or file path to the audio file
    return {"message": responce_text, "audio_url": f"/audio/generated_audio.wav"}


  except Exception as e:
    # Log the exception to understand the error
    print(f"Error occurred: {str(e)}")
    raise HTTPException(status_code=500, detail="Internal server error")

# Generate audio file from text
def generate_audio(text: str, file_path: str) -> str:
  try:
    device = "cuda" if torch.cuda.is_available() else "cpu"
    tts = TTS(model_name="tts_models/ja/kokoro/tacotron2-DDC").to(device)
    tts.tts_to_file(text=text, file_path=file_path)
    return Path(file_path)
  except Exception as e:
    # Log the exception to understand the error
    print(f"Error occurred while generating audio: {str(e)}")
    return Path("generatedData/failed.wav")

SAVE_DIRECTORY = "generatedData"

@app.post('/GenerateReqAudio')
async def get_audio(message: Message):
  print(message.message)
  save_path = Path("generatedData/audio.wav")
  audio_path =  generate_audio(str(message.message),save_path)
  
  print("file path:"+str(audio_path))
  
  if audio_path.exists():
    return FileResponse(audio_path)
  else:
    raise HTTPException(status_code=404, detail="File not found")


@app.post('/GenerateReqAudioTest')
async def get_audio(message: Message):
  audio_path = Path("generatedData/test.wav")
  try:
    if audio_path.exists():
      return FileResponse(audio_path)
    else:
      raise HTTPException(status_code=404, detail="File not found")
  except Exception as e:
    # Log the exception to understand the error
    print(f"Error occurred: {str(e)}")
    raise HTTPException(status_code=500, detail="Internal server error")


UPLOAD_DIRECTORY = "recordData"
# text to speech api handler
@app.post("/SpeechToText")
async def upload_file(file: UploadFile = File(...)):
  # Ensure the upload directory exists
  os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)
  
  # Sanitize filename
  filename = sanitize_filename(file.filename)
  file_location = os.path.join(UPLOAD_DIRECTORY, filename)

  # Debug: Print the filename to see what is being used
  print(f"Saving file to {file_location}")

  # Save the uploaded file
  try:
    with open(file_location, "wb") as f:
      # Write the file's contents
      f.write(await file.read())
      print(f"File saved successfully: {file_location}")
  except OSError as e:
    print(f"Error saving file: {e}")
    return {"error": "Error saving file"}

  return {"message": fast_whisper_stt(file_location)}

@app.post("/SpeechToTextTest")
async def upload_file_test(file: UploadFile = File(...)):
  try:
    time.sleep(2)
    print("Test is successfully:")
  except OSError as e:
    print(f"Error saving file: {e}")
    return {"error": "Error saving file"}
  return {"message":"STT work is done \n Done!" }

def sanitize_filename(filename: str) -> str:
  # Remove any characters that are not allowed in filenames
  return re.sub(r'[<>:"/\\|?*\x00-\x1F]', '', filename)


def fast_whisper_stt(filename: str) -> str:
  model = WhisperModel('medium', device="cpu", compute_type="int8")
  segments, info = model.transcribe(filename, beam_size=5, language="ja", condition_on_previous_text=False)

  seg = []
  for segment in segments:
    print("history segment:")
    print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))
    seg.append(segment.text)
  return " ".join(seg)

class DateModel(BaseModel):
  message: str

@app.post("/updateDate")
def update_date_in_json(date: DateModel):
  try:
    data_file = '/Users/3031246/Documents/github/javaScript_projects/Daily_Report_Sender/frontend/data.json'

    print(f"Opening file: {data_file}")
    with open(data_file, 'r', encoding='utf-8') as file:
      data = json.load(file)

    # Update the 'date' field in the JSON data
    data['date'] = [{"todayDate": date.message}]

    # Write updated data back to the JSON file
    with open(data_file, 'w', encoding='utf-8') as file:
      json.dump(data, file, indent=2)
    
    return {"message": date.message}

  except Exception as e:
    print(f"Error occurred: {str(e)}")
    raise HTTPException(status_code=500, detail="Internal server error")