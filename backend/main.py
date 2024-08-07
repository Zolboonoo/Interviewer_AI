from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import google.generativeai as genai
import json
import time
import requests

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
@app.post("/GenerateReqTest")
def send_message_to_python_test(message: ChatData):
  try:
    time.sleep(2)
    response = "this is response"
    print(message)
    return {'message': response}

  except Exception as e:
    # Log the exception to understand the error
    print(f"Error occurred: {str(e)}")
    raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/GenerateReq")
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
        return {'message': response.text}

    except Exception as e:
        # Log the exception to understand the error
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


with open('/Users/3031246/Documents/github/javaScript_projects/Daily_Report_Sender/frontend/data.json', 'r') as f:
    smtp_config = json.load(f)

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



