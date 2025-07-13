
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import os

app = FastAPI()

openai.api_key = os.getenv("OPENAI_API_KEY")

class BusinessData(BaseModel):
    business_type: str
    monthly_income: float
    monthly_expense: float
    number_of_customers: int
    description: str

@app.post("/api/analyze")
async def analyze(data: BusinessData):
    try:
        prompt = f"""
        نوع کسب‌وکار: {data.business_type}
        درآمد ماهانه: {data.monthly_income}
        هزینه ماهانه: {data.monthly_expense}
        تعداد مشتری ماهانه: {data.number_of_customers}
        توضیحات: {data.description}

        لطفاً با استفاده از داده‌های بالا، تحلیل کوتاهی از وضعیت کسب‌وکار ارائه بده و ۳ پیشنهاد برای بهبود فروش بده.
        """
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}]
        )
        return {"analysis": response.choices[0].message.content.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
