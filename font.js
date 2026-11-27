// فونت وزیرمتن + استایل فارسی
(function () {
  if (document.getElementById("fa-trans-font-style")) return;
  const style = document.createElement("style");
  style.id = "fa-trans-font-style";
  style.textContent = `
    @font-face {
      font-family: 'VazirmatnExt';
      src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Regular.woff2') format('woff2');
      font-weight: 400;
      font-display: swap;
    }
    @font-face {
      font-family: 'VazirmatnExt';
      src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Bold.woff2') format('woff2');
      font-weight: 700;
      font-display: swap;
    }
    /* فونت و ارتفاع خط فقط روی عناصری که متنشان ترجمه شده اعمال می‌شود
       تا فونت‌های آیکون (Font Awesome، Material Icons) و چیدمان صفحه خراب نشوند */
    html[fa-trans="on"] [fa-trans-applied] {
      font-family: 'VazirmatnExt', 'Vazirmatn', Tahoma, sans-serif !important;
      line-height: 1.9 !important;
    }
    /* فقط متن‌های تازه ترجمه‌شده راست‌چین می‌شوند، نه چیدمان صفحه */
    html[fa-trans="on"] [fa-trans-applied] {
      direction: rtl !important;
      unicode-bidi: isolate !important;
      text-align: start !important;
    }
  `;
  document.head.appendChild(style);
})();
