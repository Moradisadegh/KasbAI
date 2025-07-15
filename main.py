 HEAD
from fastapi import FastAPI, HTTPException from pydantic import BaseModel from openai import OpenAI import os from dotenv import load_dotenv

Load environment variables

load_dotenv()

Initialize FastAPI and OpenAI client

app = FastAPI(title="KasbAi Business Analyzer") client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

Define input data model

class BusinessData(BaseModel): business_type: str monthly_income: float monthly_expense: float number_of_customers: int description: str

Define route for analysis

@app.post("/api/analyze") async def analyze(data: BusinessData): try: prompt = ( f"کسب‌وکار از نوع {data.business_type} با درآمد ماهیانه {data.monthly_income} و " f"هزینه ماهیانه {data.monthly_expense} است. تعداد مشتریان {data.number_of_customers} نفر و توضیح اضافه: {data.description}. " "یک تحلیل کامل برای بهبود این کسب‌وکار بده شامل نقاط ضعف، فرصت‌ها، ایده‌های افزایش درآمد و کاهش هزینه." )

completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )

    result = completion.choices[0].message.content.strip()
    return {"analysis": result}

except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class BusinessData(BaseModel):
    business_type: str
    monthly_income: int
    monthly_expense: int
    number_of_customers: int
    description: str

@app.post("/api/analyze")
def analyze(data: BusinessData):
    try:
        prompt = (
            f"کسب‌وکار از نوع {data.business_type} با درآمد ماهیانه {data.monthly_income} و "
            f"هزینه ماهیانه {data.monthly_expense} است. تعداد مشتریان {data.number_of_customers} نفر و توضیح اضافه: {data.description}. "
            "یک تحلیل کامل برای بهبود کسب‌وکار بده شامل نقاط ضعف، فرصت‌ها، ایده‌های افزایش درآمد و کاهش هزینه."
        )

        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}]
        )

        result = completion.choices[0].message.content.strip()
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
         d8eed32 (local change before pulling form remote)
