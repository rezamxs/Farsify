# 🌍 Farsify

[![CI](https://github.com/rezamxs/Farsify/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/rezamxs/Farsify/actions/workflows/ci.yml?query=branch%3Amain)
[![Release](https://img.shields.io/github/v/release/rezamxs/Farsify?sort=semver)](https://github.com/rezamxs/Farsify/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[English](#english) | [فارسی](#فارسی)

<a name="english"></a>
## English

A browser extension that translates web pages into **Persian (Farsi)** with one click and renders them in the **Vazirmatn** font, without breaking the page layout.

- 🌐 Translates page text to Persian: free MyMemory API (English → Persian) first, Google Translate (auto-detected source language) as fallback
- ✒️ Vazirmatn font with proper Persian line-height
- 🧩 Translates text only — page layout and design stay untouched
- 🔀 Per-tab on/off toggle in the toolbar popup. Turn it off and the original text is restored
- 🔄 Keeps translating content that loads later, and re-applies after a reload or navigation within the same site (on a different site, turn it on again from the popup)
- ⛔ Skips code blocks, form fields, editable areas, and anything marked `translate="no"` / `.notranslate`
- 💾 Caches up to ~2,000 translations locally to save requests

### Download

Latest release: **[v1.2.0](https://github.com/rezamxs/Farsify/releases/tag/v1.2.0)**: `chrome-farsify-v1.2.0.zip` (Chrome, Brave, Edge, Opera) and `firefox-farsify-v1.2.0.zip` (Firefox). All versions are on the [Releases page](https://github.com/rezamxs/Farsify/releases), or [build it from source](#build-from-source).

The release ZIPs are installed manually (developer mode / temporary add-on), as shown below.

### Install (Chrome / Brave / Edge / Opera)

1. Download `chrome-farsify-*.zip` from [Releases](https://github.com/rezamxs/Farsify/releases) and extract it
2. Open `chrome://extensions` (or `brave://extensions`, `edge://extensions`, `opera://extensions`)
3. Enable **Developer mode**
4. Click **Load unpacked** and select the extracted folder

### Install (Firefox)

1. Download `firefox-farsify-*.zip` from [Releases](https://github.com/rezamxs/Farsify/releases) and extract it
2. Open `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on** and select the `manifest.json` inside

Requires Firefox 115 or later. Firefox removes temporary add-ons when it restarts, so you need to load it again after each restart.

### Usage

Open a page, click the Farsify icon in the toolbar, and switch on **ترجمه‌ی این صفحه** ("translate this page"). Switch it off to restore the original text.

### Build from source

Needs only Python 3 (standard library, no dependencies):

```bash
git clone https://github.com/rezamxs/Farsify.git
cd Farsify
python3 build.py
```

Builds two ZIPs into `dist/`: one for Chromium browsers, one for Firefox. Install them the same way as above.

### Privacy

When translation is on, the text of the page is sent to the **MyMemory** translation API (and to **Google Translate** as a fallback) to be translated. Don't turn it on for pages with private or sensitive content. The Vazirmatn font files are loaded from the **jsDelivr** CDN, so that CDN sees a request from the page. Translations are cached locally in your browser; the extension collects nothing else and has no analytics.

### License

[MIT](LICENSE)

<a name="فارسی"></a>
## فارسی

افزونه‌ی مرورگر برای ترجمه‌ی صفحات وب به فارسی با یک کلیک و نمایش آن‌ها با فونت وزیرمتن، بدون تغییر در طراحی و چیدمان سایت.

- ترجمه‌ی متن صفحات به فارسی: اول با API رایگان MyMemory (انگلیسی به فارسی)، و در صورت خطا با گوگل‌ترنسلیت (تشخیص خودکار زبان مبدأ)
- فونت وزیرمتن با ارتفاع خط مناسب فارسی
- فقط متن ترجمه می‌شود؛ چیدمان و طراحی سایت دست‌نخورده می‌ماند
- کلید روشن/خاموش جدا برای هر تب در پنجره‌ی افزونه؛ با خاموش کردن، متن اصلی برمی‌گردد
- محتوایی که بعداً به صفحه اضافه می‌شود هم ترجمه می‌شود، و بعد از رفرش یا رفتن به صفحه‌ی دیگری از همان سایت، ترجمه دوباره اعمال می‌شود (در سایت دیگر، دوباره از پنجره‌ی افزونه روشنش کنید)
- کد، فرم‌ها، بخش‌های قابل ویرایش و هر چیزی که با `translate="no"` یا `.notranslate` علامت خورده ترجمه نمی‌شود تا صفحه خراب نشود
- تا حدود ۲۰۰۰ ترجمه به‌صورت محلی کش می‌شود تا درخواست‌ها کمتر شوند

### دانلود

آخرین نسخه: **[v1.2.0](https://github.com/rezamxs/Farsify/releases/tag/v1.2.0)**، شامل `chrome-farsify-v1.2.0.zip` (کروم، بریو، اج، اپرا) و `firefox-farsify-v1.2.0.zip` (فایرفاکس). همه‌ی نسخه‌ها در [صفحه‌ی Releases](https://github.com/rezamxs/Farsify/releases) هستند، یا خودتان از سورس بیلد بگیرید (پایین‌تر).

فایل‌های ZIP نسخه‌ها طبق مراحل زیر به‌صورت دستی نصب می‌شوند (Developer mode در کروم، افزونه‌ی موقت در فایرفاکس).

### نصب در کروم / بریو / اج / اپرا

1. فایل `chrome-farsify-*.zip` را از [Releases](https://github.com/rezamxs/Farsify/releases) دانلود و Extract کنید
2. به `chrome://extensions` بروید (یا `brave://extensions`، `edge://extensions`، `opera://extensions`)
3. Developer mode را روشن کنید
4. Load unpacked را بزنید و پوشه‌ی extract شده را انتخاب کنید

### نصب در فایرفاکس

1. فایل `firefox-farsify-*.zip` را از [Releases](https://github.com/rezamxs/Farsify/releases) دانلود و Extract کنید
2. به `about:debugging#/runtime/this-firefox` بروید
3. Load Temporary Add-on را بزنید و فایل `manifest.json` داخل پوشه را انتخاب کنید

به فایرفاکس ۱۱۵ یا جدیدتر نیاز دارد. فایرفاکس افزونه‌های موقت را با بسته شدن مرورگر حذف می‌کند، پس بعد از هر بار اجرای دوباره‌ی فایرفاکس باید دوباره آن را بارگذاری کنید.

### استفاده

صفحه را باز کنید، روی آیکن Farsify در نوار ابزار بزنید و کلید **ترجمه‌ی این صفحه** را روشن کنید. با خاموش کردن کلید، متن اصلی برمی‌گردد.

### بیلد از سورس

فقط به Python 3 نیاز دارد (بدون وابستگی اضافه):

```bash
git clone https://github.com/rezamxs/Farsify.git
cd Farsify
python3 build.py
```

دو فایل ZIP در پوشه‌ی `dist/` ساخته می‌شود: یکی برای مرورگرهای کرومیومی و یکی برای فایرفاکس.

### حریم خصوصی

وقتی ترجمه روشن است، متن صفحه برای ترجمه به سرویس **MyMemory** (و در صورت خطا به **Google Translate**) فرستاده می‌شود. برای صفحه‌هایی با اطلاعات خصوصی یا حساس ترجمه را روشن نکنید. فایل‌های فونت وزیرمتن از CDN سرویس **jsDelivr** بارگذاری می‌شوند، پس آن CDN یک درخواست از صفحه دریافت می‌کند. ترجمه‌ها فقط به صورت محلی در مرورگر شما کش می‌شوند؛ افزونه اطلاعات دیگری جمع‌آوری نمی‌کند و هیچ ابزار آماری ندارد.

### لایسنس

[MIT](LICENSE)
