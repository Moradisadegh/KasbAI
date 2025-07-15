from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

# بارگذاری متغیرهای محیطی از فایل .env
load_dotenv()

# اتصال به API گپ جی‌پی‌تی
client = OpenAI(
    base_url="https://api.gapgpt.app/v1",
    api_key=os.getenv("OPENAI_API_KEY")
)

# تعریف اپلیکیشن FastAPI
app = FastAPI()

# فعال‌سازی CORS برای همه‌ی درخواست‌ها
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], # شامل OPTIONS, GET, POST, ...
    allow_headers=["*"],
)

# تعریف مدل ورودی داده‌ها
class BusinessInput(BaseModel):
    business_type: str
    monthly_income: int
    monthly_expenses: int
    number_of_customers: int
    description: str

# API برای تحلیل کسب‌وکار
@app.post("/api/analyze")
def analyze_business(data: BusinessInput):
    try:
        prompt = (
            f"نوع کسب‌وکار: {data.business_type}\n"
            f"درآمد ماهانه: {data.monthly_income}\n"
            f"هزینه ماهانه: {data.monthly_expenses}\n"
            f"تعداد مشتریان ماهانه: {data.number_of_customers}\n"
            f"توضیحات: {data.description}\n"
            f"بر اساس اطلاعات بالا، تحلیل اقتصادی کامل ارائه بده."
        )

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}]
        )

        return {"result": response.choices[0].message.content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
