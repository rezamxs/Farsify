// ترجمه‌ی محتوای صفحه
(function () {
  if (window.__faTranslatorLoaded) return;
  window.__faTranslatorLoaded = true;

  const SKIP_TAGS = new Set([
    "SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA",
    "INPUT", "SVG", "CANVAS", "IFRAME", "TEMPLATE"
  ]);
  // عناصری که نباید ترجمه شوند: notranslate و آیکون‌های لیگاتوری (Material Icons)
  const SKIP_SELECTOR = [
    '[contenteditable="true"]', '[translate="no"]', ".notranslate",
    ".material-icons", ".material-icons-outlined", ".material-icons-round",
    ".material-icons-sharp", ".material-icons-two-tone", '[class*="material-symbols"]'
  ].join(",");
  const BATCH_NODES = 12;
  const BATCH_CHARS = 1200;
  const OBSERVE_DEBOUNCE_MS = 600;

  const originalTexts = new Map();     // node -> متن اصلی (Map قوی تا نودها بازیابی شوند)
  const translatedValue = new WeakMap(); // node -> مقداری که خودمان نوشتیم
  const inFlight = new WeakSet();       // نودهایی که درخواست ترجمه‌شان در جریان است

  let active = false;
  let generation = 0; // با هر خاموش/روشن شدن زیاد می‌شود تا پاسخ‌های قدیمی اعمال نشوند
  let observer = null;
  let debounceTimer = null;
  const pendingRoots = new Set();

  function isAlreadyTranslated(node) {
    return translatedValue.has(node) && translatedValue.get(node) === node.nodeValue;
  }

  function acceptTextNode(node) {
    const parent = node.parentElement;
    if (!parent) return false;
    if (SKIP_TAGS.has(parent.tagName)) return false;
    if (parent.closest(SKIP_SELECTOR)) return false;
    if (inFlight.has(node) || isAlreadyTranslated(node)) return false;
    const t = node.nodeValue.trim();
    if (!t || !/[A-Za-z\u00C0-\u024F]/.test(t)) return false; // فقط متن دارای حروف لاتین
    return true;
  }

  function collectNodes(root) {
    if (!root) return [];
    if (root.nodeType === Node.TEXT_NODE) return acceptTextNode(root) ? [root] : [];
    if (root.nodeType !== Node.ELEMENT_NODE) return [];
    if (SKIP_TAGS.has(root.tagName)) return [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return acceptTextNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    return nodes;
  }

  // ترجمه‌ی نودهای داده‌شده؛ خروجی: { total, translated, failed }
  async function translateNodes(nodes) {
    const gen = generation;
    const stats = { total: 0, translated: 0, failed: 0 };
    let batch = [];
    let batchChars = 0;

    const flush = async () => {
      if (!batch.length) return;
      const current = batch;
      const texts = current.map(n => n.nodeValue.trim());
      batch = [];
      batchChars = 0;
      let resp;
      try {
        resp = await chrome.runtime.sendMessage({ type: "TRANSLATE_BATCH", texts });
      } finally {
        current.forEach(n => inFlight.delete(n));
      }
      if (gen !== generation || !active) return; // در این فاصله خاموش شده
      const translations = (resp && resp.translations) || [];
      current.forEach((node, i) => {
        stats.total++;
        const t = translations[i];
        // اگر صفحه در این فاصله متن نود را عوض کرده، دست نمی‌زنیم
        if (!t || !node.isConnected || node.nodeValue.trim() !== texts[i]) {
          if (!t) stats.failed++;
          return;
        }
        if (!originalTexts.has(node)) originalTexts.set(node, node.nodeValue);
        const value = " " + t + " ";
        translatedValue.set(node, value);
        node.nodeValue = value;
        const p = node.parentElement;
        if (p) p.setAttribute("fa-trans-applied", "");
        stats.translated++;
      });
    };

    for (const node of nodes) {
      if (gen !== generation || !active) break;
      if (inFlight.has(node) || isAlreadyTranslated(node)) continue;
      inFlight.add(node);
      batch.push(node);
      batchChars += node.nodeValue.length;
      if (batch.length >= BATCH_NODES || batchChars >= BATCH_CHARS) await flush();
    }
    if (gen === generation && active) {
      await flush();
    } else {
      batch.forEach(n => inFlight.delete(n));
    }
    return stats;
  }

  function translateAll() {
    return translateNodes(collectNodes(document.body));
  }

  // ---- ترجمه‌ی محتوای تازه (SPA، اسکرول بی‌نهایت و ...) ----
  function processPending() {
    debounceTimer = null;
    if (!active) { pendingRoots.clear(); return; }
    const nodes = [];
    for (const root of pendingRoots) {
      if (root.isConnected) nodes.push(...collectNodes(root));
    }
    pendingRoots.clear();
    if (nodes.length) translateNodes([...new Set(nodes)]).catch(console.error);
  }

  function startObserver() {
    if (observer || !document.body) return;
    observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach(n => pendingRoots.add(n));
        } else if (m.type === "characterData") {
          // تغییرات خودمان (نوشتن ترجمه) نادیده گرفته می‌شوند
          if (!isAlreadyTranslated(m.target)) pendingRoots.add(m.target);
        }
      }
      if (pendingRoots.size && !debounceTimer) {
        debounceTimer = setTimeout(processPending, OBSERVE_DEBOUNCE_MS);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function stopObserver() {
    if (observer) observer.disconnect();
    observer = null;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = null;
    pendingRoots.clear();
  }

  function restoreAll() {
    for (const [node, text] of originalTexts) {
      // فقط نودهایی که هنوز ترجمه‌ی ما را دارند برمی‌گردند
      if (node.isConnected && isAlreadyTranslated(node)) {
        node.nodeValue = text;
        translatedValue.delete(node);
        const p = node.parentElement;
        if (p) p.removeAttribute("fa-trans-applied");
      }
    }
    originalTexts.clear();
    document.querySelectorAll("[fa-trans-applied]").forEach(el => el.removeAttribute("fa-trans-applied"));
    document.documentElement.removeAttribute("fa-trans");
  }

  function turnOn() {
    if (!active) {
      active = true;
      generation++;
    }
    document.documentElement.setAttribute("fa-trans", "on");
    startObserver();
    return translateAll();
  }

  function turnOff() {
    active = false;
    generation++;
    stopObserver();
    restoreAll();
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "TRANSLATE_ON") {
      turnOn().catch(console.error);
    } else if (msg.type === "TRANSLATE_OFF") {
      turnOff();
    }
  });
})();
