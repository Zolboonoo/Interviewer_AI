import torch
from TTS.api import TTS # type: ignore
import gradio as gr # type: ignore

# Get device
# device = "cuda" if torch.cuda.is_available() else "cpu"

# def generate_audio(text="これはテストです。", file_path="generatedData/audio.wav"):
#     tts = TTS(model_name="tts_models/ja/kokoro/tacotron2-DDC").to(device)
#     tts.tts_to_file(text=text, file_path=file_path)
#     return file_path


def generate_audio(text: str, file_path: str) -> str:
  device = "cuda" if torch.cuda.is_available() else "cpu"
  tts = TTS(model_name="tts_models/ja/kokoro/tacotron2-DDC").to(device)
  tts.tts_to_file(text=text, file_path=file_path)
  return file_path

text  ="テストです。"
file_path = "generatedData/audio.wav"
print(generate_audio(text, file_path))
