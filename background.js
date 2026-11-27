// ترجمه با MyMemory (اصلی) و Google (جایگزین)
async function myMemory(text) {
  const q = encodeURIComponent(text.slice(0, 480));
  const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=en|fa`;
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

// ---- کش ترجمه: Map در حافظه + chrome.storage.local (حداکثر ~۲۰۰۰ مورد) ----
const CACHE_KEY = "translation_cache";
const CACHE_MAX = 2000;
const cache = new Map(); // متن اصلی → ترجمه (ترتیب درج = قدیمی‌ترین اول)
let cacheLoaded = null;
let persistTimer = null;

function loadCache() {
  if (!cacheLoaded) {
    cacheLoaded = chrome.storage.local.get(CACHE_KEY).then((st) => {
      const saved = st[CACHE_KEY];
      if (saved && typeof saved === "object") {
        for (const [k, v] of Object.entries(saved)) {
          if (!cache.has(k)) cache.set(k, v);
        }
        trimCache();
      }
    }).catch(() => {});
  }
  return cacheLoaded;
}

function trimCache() {
  while (cache.size > CACHE_MAX) {
    cache.delete(cache.keys().next().value);
  }
}

function persistCache() {
  if (persistTimer) return;
  persistTimer = setTimeout(() => {
    persistTimer = null;
    chrome.storage.local.set({ [CACHE_KEY]: Object.fromEntries(cache) }).catch(() => {});
  }, 2000);
}

function cacheGet(text) {
  if (!cache.has(text)) return undefined;
  const v = cache.get(text);
  cache.delete(text); // جابه‌جایی به انتهای صف (LRU ساده)
  cache.set(text, v);
  return v;
}

function cacheSet(text, translated) {
  cache.delete(text);
  cache.set(text, translated);
  trimCache();
  persistCache();
}

// خروجی null یعنی هر دو سرویس شکست خوردند
async function translateOne(text) {
  await loadCache();
  const hit = cacheGet(text);
  if (hit !== undefined) return hit;
  let t = null;
  try { t = await myMemory(text); } catch (e) {}
  if (t == null) {
    try { t = await google(text); } catch (e) {}
  }
  if (t != null) cacheSet(text, t);
  return t;
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
