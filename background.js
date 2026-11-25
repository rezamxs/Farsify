// ترجمه با MyMemory (اصلی) و Google (جایگزین)
async function myMemory(text) {
  const q = encodeURIComponent(text.slice(0, 480));
  const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=en|fa&de=user@example.com`;
  const res = await fetch(url);
  const data = await res.json();
  const t = data && data.responseData && data.responseData.translatedText;
  if (!t || /MYMEMORY WARNING|INVALID/i.test(t)) throw new Error("bad");
  return t;
}

async function google(text) {
  const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=fa&dt=t&q=" +
    encodeURIComponent(text.slice(0, 4800));
  const res = await fetch(url);
  const data = await res.json();
  const joined = (data[0] || []).map(s => s[0]).join("");
  if (!joined) throw new Error("bad");
  return joined;
}

async function translateOne(text) {
  try { return await myMemory(text); } catch (e) {}
  try { return await google(text); } catch (e) {}
  return text; // خطا → متن اصلی
}

// اجرای محدودیت‌دار موازی برای سرعت
async function translateBatch(texts) {
  const out = new Array(texts.length);
  const CONC = 6;
  let idx = 0;
  async function worker() {
    while (idx < texts.length) {
      const i = idx++;
      out[i] = await translateOne(texts[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONC, texts.length) }, worker));
  return out;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    if (msg.type === "GET_STATE") {
      const key = `tab_${msg.tabId}`;
      const st = await chrome.storage.session.get(key);
      sendResponse({ on: !!st[key] });
    } else if (msg.type === "SET_STATE") {
      const key = `tab_${msg.tabId}`;
      if (msg.on) {
        await chrome.storage.session.set({ [key]: true });
        try {
          await chrome.tabs.sendMessage(msg.tabId, { type: "TRANSLATE_ON" });
        } catch (e) {
          // صفحه هنوز اسکریپت تزریق نشده — تزریق دستی
          try {
            await chrome.scripting.executeScript({
              target: { tabId: msg.tabId },
              files: ["font.js", "content.js"]
            });
            await chrome.tabs.sendMessage(msg.tabId, { type: "TRANSLATE_ON" });
          } catch (e2) {}
        }
      } else {
        await chrome.storage.session.remove(key);
        try { await chrome.tabs.sendMessage(msg.tabId, { type: "TRANSLATE_OFF" }); } catch (e) {}
      }
      sendResponse({ ok: true });
    } else if (msg.type === "TRANSLATE_BATCH") {
      sendResponse({ translations: await translateBatch(msg.texts) });
    }
  })();
  return true; // پاسخ async
});
