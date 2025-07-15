
# KasbAI - API Starter

این نسخه اولیه‌ی API پروژه‌ی KasbAI است برای تحلیل کسب‌وکارهای کوچک با GPT-4o

## اجرا در محیط محلی

1. نصب پیش‌نیازها:
```
pip install -r requirements.txt
```

2. ایجاد فایل `.env` و قرار دادن کلید:
```
OPENAI_API_KEY=کلید واقعی خود را اینجا بگذارید
```

3. اجرای سرور:
```
uvicorn main:app --reload
```

سپس به http://127.0.0.1:8000/docs بروید و مسیر `/api/analyze` را تست کنید.

## تست نمونه

از فایل `sample_input.json` برای تست ورودی استفاده کنید.
