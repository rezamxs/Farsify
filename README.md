# 🌍 Farsify

[![CI](https://github.com/rezamxs/Farsify/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/rezamxs/Farsify/actions/workflows/ci.yml?query=branch%3Amain)
[![Release](https://img.shields.io/github/v/release/rezamxs/Farsify?sort=semver)](https://github.com/rezamxs/Farsify/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[English](#english) | [فارسی](#فارسی)

<a name="english"></a>
## English

A browser extension that auto-translates any web page into **Persian (Farsi)** using the **Vazirmatn** font — without breaking the page layout.

- 🌐 Translates page text to Persian (free MyMemory API, Google Translate fallback)
- ✒️ Vazirmatn font with proper Persian line-height
- 🧩 Translates text only — page layout and design stay untouched
- 🔀 Per-tab on/off toggle — turn it off and the original text is restored
- ⛔ Skips code blocks and form fields so pages don't break

### Download

Get the latest `chrome-farsify-*.zip` or `firefox-farsify-*.zip` from the [Releases page](https://github.com/rezamxs/Farsify/releases), or [build it from source](#build-from-source).

### Install (Chrome / Brave / Edge / Opera)

1. Download `chrome-farsify-*.zip` from [Releases](https://github.com/rezamxs/Farsify/releases) and extract it
2. Open `chrome://extensions` (or `brave://extensions`, `edge://extensions`)
3. Enable **Developer mode**
4. Click **Load unpacked** and select the extracted folder

### Install (Firefox)

1. Download `firefox-farsify-*.zip` from [Releases](https://github.com/rezamxs/Farsify/releases) and extract it
2. Open `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on** and select the `manifest.json` inside

### Build from source

```bash
python3 build.py
```

Builds two ZIPs into `dist/`: one for Chromium browsers, one for Firefox. Install them the same way as above.

### Privacy

When translation is on, the text of the page is sent to the **MyMemory** translation API (and to **Google Translate** as a fallback) to be translated. Don't turn it on for pages with private or sensitive content. Translations are cached locally in your browser; nothing else is collected.

### License

[MIT](LICENSE)

<a name="فارسی"></a>
## فارسی

افزونه‌ی مرورگر برای ترجمه‌ی خودکار صفحات وب به فارسی با فونت وزیرمتن، بدون تغییر در طراحی و چیدمان سایت.

- ترجمه‌ی متن صفحات به فارسی (API رایگان MyMemory + جایگزین گوگل‌ترنسلیت)
- فونت وزیرمتن با ارتفاع خط مناسب فارسی
- فقط متن ترجمه می‌شود؛ چیدمان و طراحی سایت دست‌نخورده می‌ماند
- کلید روشن/خاموش جدا برای هر تب — خاموش کنی، متن اصلی برمی‌گردد
- کد و فرم‌ها ترجمه نمی‌شوند تا صفحه خراب نشود

### دانلود

آخرین نسخه‌ی `chrome-farsify-*.zip` یا `firefox-farsify-*.zip` را از [صفحه‌ی Releases](https://github.com/rezamxs/Farsify/releases) دانلود کنید، یا خودتان از سورس بیلد بگیرید (پایین‌تر).

### نصب در کروم / بریو / اج

1. فایل `chrome-farsify-*.zip` را از [Releases](https://github.com/rezamxs/Farsify/releases) دانلود و Extract کنید
2. به `chrome://extensions` بروید
3. Developer mode را روشن کنید
4. Load unpacked را بزنید و پوشه‌ی extract شده را انتخاب کنید

### نصب در فایرفاکس

1. فایل `firefox-farsify-*.zip` را از [Releases](https://github.com/rezamxs/Farsify/releases) دانلود و Extract کنید
2. به `about:debugging#/runtime/this-firefox` بروید
3. Load Temporary Add-on را بزنید و فایل `manifest.json` داخل پوشه را انتخاب کنید

### بیلد از سورس

```bash
python3 build.py
```

دو فایل ZIP در پوشه‌ی `dist/` ساخته می‌شود: یکی برای مرورگرهای کرومیومی و یکی برای فایرفاکس.

### حریم خصوصی

وقتی ترجمه روشن است، متن صفحه برای ترجمه به سرویس **MyMemory** (و در صورت خطا به **Google Translate**) فرستاده می‌شود. برای صفحه‌هایی با اطلاعات خصوصی یا حساس ترجمه را روشن نکنید. ترجمه‌ها فقط به صورت محلی در مرورگر شما کش می‌شوند و اطلاعات دیگری جمع‌آوری نمی‌شود.

### لایسنس

[MIT](LICENSE)
