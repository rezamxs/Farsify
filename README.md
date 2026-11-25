# 🌍 Farsify — فارسی‌فای

افزونه‌ی مرورگر برای ترجمه‌ی خودکار صفحات وب به **فارسی** با فونت **وزیرمتن** — بدون تغییر در طراحی و چیدمان سایت.

> Browser extension that auto-translates any page into **Persian (Farsi)** with the **Vazirmatn** font — without breaking the page layout.

## ✨ ویژگی‌ها
- 🌐 ترجمه‌ی متن صفحات به فارسی (MyMemory API رایگان + fallback به Google Translate)
- ✒️ فونت وزیرمتن با ارتفاع خط مناسب فارسی
- 🧩 فقط متن ترجمه می‌شود؛ چیدمان، ستون‌بندی و طراحی سایت دست‌نخورده می‌ماند
- 🔀 کلید روشن/خاموش جدا برای هر تب — خاموش کنی، متن اصلی برمی‌گردد
- ⛔ کد، فرم‌ها و فیلدهای متنی ترجمه نمی‌شوند

## 📦 نصب

### Chrome / Brave / Edge / Opera
1. فایل `dist/chrome-farsify-*.zip` را دانلود و Extract کنید
2. به `chrome://extensions` (یا `brave://extensions` / `edge://extensions`) بروید
3. **Developer mode** را روشن کنید
4. **Load unpacked** → پوشه‌ی extract شده را انتخاب کنید

### Firefox
1. فایل `dist/firefox-farsify-*.zip` را دانلود کنید
2. به `about:debugging#/runtime/this-firefox` بروید
3. **Load Temporary Add-on** → فایل `manifest.json` داخل پوشه را انتخاب کنید
   (برای نصب دائمی باید از addons.mozilla.org منتشر شود)

## 🔨 بیلد از سورس
```bash
python3 build.py
```
دو فایل ZIP در پوشه‌ی `dist/` می‌سازد: نسخه‌ی کروم و نسخه‌ی فایرفاکس.

## 🧪 تست API ترجمه
```bash
node -e "fetch('https://api.mymemory.translated.net/get?q=Hello&langpair=en|fa').then(r=>r.json()).then(d=>console.log(d.responseData.translatedText))"
```

## 📄 لایسنس
MIT
