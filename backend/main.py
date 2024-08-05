from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from email.message import EmailMessage
import google.generativeai as genai
import smtplib
import json
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["POST"],  # Specify the HTTP methods allowed by your backend endpoint
    allow_headers=["Content-Type"],
)
class Message(BaseModel):
    message: str

@app.post("/GenerateReq")
def send_message_to_python(message: Message):
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
        system_instruction="""君はメールを上手に礼儀正しく直して書くチャットボットだ。与えられるメールを次のポイントを押さえながら書き直して本番のメールを書いてください。\n
        絶対守るルール：\n
        **自分の返事、回答は一切書かないこと。\n
        **メール本文のみ回答してください\n
        **一行の文字数を３０ぐらいにする。(読む相手に読みやすくするため)\n  
        メールに次の情報を使ってもいい。\n
        私の名前：バトムンフ・バトゾルボー\n
        今日の日付：2024/7/17（水）\n
        \n
        メール書くときに気を付けるポイント：\n
        丁寧な挨拶と敬意の表現: 日本ではビジネスメールでも丁寧な言葉遣いが重要です。始めの挨拶や相手への敬意を示す表現を使いましょう。\n
        \n
        例: 「いつもお世話になっております。」、「ご連絡ありがとうございます。」\n
        明確な目的の記載: メールの最初に、そのメールの目的や要件を明確に記述します。相手がすぐに内容を把握できるようにします。\n
        \n
        例: 「件名の打ち合わせについてご確認をお願いします。」\n
        具体的な情報の提供: 必要な情報や資料があれば、メールに添付するか、リンクを貼って提供します。簡潔かつ明確に情報を伝えることがポイントです。\n
        \n
        要件や依頼の明示: メールの本文で、具体的な要件や依頼事項を明確に伝えます。相手が何をすべきか、いつまでに行うべきかを明確にしておきます。\n
        \n
        例: 「来週までに報告書の修正をお願いいたします。」\n
        返信を促す場合のフォローアップ: 返事を求める場合は、丁寧にその旨を伝え、必要に応じて期日や連絡手段を明示します。\n
        \n
        例: 「ご確認の上、ご返答をお願いいたします。」\n
        最後の挨拶と締めくくり: メールの最後に再度の挨拶と感謝の言葉を添えて、丁寧に締めくくります。\n
        \n
        例: 「何かご不明点がございましたら、お気軽にご連絡ください。よろしくお願いいたします。」""",


        # safety_settings = Adjust safety settings
        # See https://ai.google.dev/gemini-api/docs/safety-settings
        )

        chat_session = model.start_chat(history=[])

        response = chat_session.send_message(message.message)
        return {'message': response.text}

    except Exception as e:
        # Log the exception to understand the error
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


with open('/Users/3031246/Documents/github/javaScript_projects/Daily_Report_Sender/frontend/data.json', 'r') as f:
    smtp_config = json.load(f)

class MailData(BaseModel):
    emailSubject: str
    emailBody: str
    recipientEmail: str

@app.post("/sendMail")
async def send_mail(mail_data: MailData = Body(...)):
  try:
    smtp_host = smtp_config["smtp"]['smtp_host']
    smtp_port = smtp_config["smtp"]['smtp_port']
    sender_email = smtp_config["smtp"]['sender_email']
    sender_password = smtp_config["smtp"]['sender_password']

    # Create the EmailMessage object
    message = EmailMessage()
    message['Subject'] = mail_data.emailSubject
    message['From'] = sender_email
    message['To'] = mail_data.recipientEmail
    message.set_content(mail_data.emailBody)

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(message)
        return {"message": "Email sent successfully"}

  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

if __name__ == "__main__":
  import uvicorn
  uvicorn.run(app, host="localhost", port=8000)




class DateModel(BaseModel):
  message: str

@app.post("/updateDate")
def send_message_to_python(date: DateModel):
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
