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
    html[fa-trans="on"], html[fa-trans="on"] body,
    html[fa-trans="on"] p, html[fa-trans="on"] span, html[fa-trans="on"] li,
    html[fa-trans="on"] a, html[fa-trans="on"] td, html[fa-trans="on"] th,
    html[fa-trans="on"] div, html[fa-trans="on"] h1, html[fa-trans="on"] h2,
    html[fa-trans="on"] h3, html[fa-trans="on"] h4, html[fa-trans="on"] h5, html[fa-trans="on"] h6,
    html[fa-trans="on"] button, html[fa-trans="on"] label, html[fa-trans="on"] blockquote {
      font-family: 'VazirmatnExt', 'Vazirmatn', Tahoma, sans-serif !important;
      line-height: 1.9 !important;
    }
    /* فقط متن‌های تازه ترجمه‌شده راست‌چین می‌شوند، نه چیدمان صفحه */
    [fa-trans-applied] {
      direction: rtl !important;
      unicode-bidi: isolate !important;
      text-align: start !important;
    }
  `;
  document.head.appendChild(style);
})();
