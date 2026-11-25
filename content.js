// ترجمه‌ی محتوای صفحه
(function () {
  if (window.__faTranslatorLoaded) return;
  window.__faTranslatorLoaded = true;

  const SKIP_TAGS = new Set([
    "SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA",
    "INPUT", "SVG", "CANVAS", "IFRAME", "TEMPLATE"
  ]);
  const BATCH_NODES = 12;
  const BATCH_CHARS = 1200;

  const originalTexts = new Map(); // node -> original text (Map قوی تا نودها بازیابی شوند)

  function collectNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest('[contenteditable="true"]')) return NodeFilter.FILTER_REJECT;
        const t = node.nodeValue.trim();
        if (!t || !/[A-Za-z\u00C0-\u024F]/.test(t)) return NodeFilter.FILTER_REJECT; // فقط متن دارای حروف لاتین
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    return nodes;
  }

  async function translateAll() {
    const nodes = collectNodes(document.body);
    let batch = [];
    let batchChars = 0;

    const flush = async () => {
      if (!batch.length) return;
      const texts = batch.map(n => n.nodeValue.trim());
      const resp = await chrome.runtime.sendMessage({ type: "TRANSLATE_BATCH", texts });
      (resp.translations || []).forEach((t, i) => {
        const node = batch[i];
        if (!t || !node) return;
        if (!originalTexts.has(node)) originalTexts.set(node, node.nodeValue);
        node.nodeValue = " " + t + " ";
        const p = node.parentElement;
        if (p) p.setAttribute("fa-trans-applied", "");
      });
      batch = [];
      batchChars = 0;
    };

    for (const node of nodes) {
      batch.push(node);
      batchChars += node.nodeValue.length;
      if (batch.length >= BATCH_NODES || batchChars >= BATCH_CHARS) await flush();
    }
    await flush();
  }

  function restoreAll() {
    for (const [node, text] of originalTexts) {
      if (node.isConnected) {
        node.nodeValue = text;
        const p = node.parentElement;
        if (p) p.removeAttribute("fa-trans-applied");
      }
    }
    originalTexts.clear();
    document.documentElement.removeAttribute("fa-trans");
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "TRANSLATE_ON") {
      document.documentElement.setAttribute("fa-trans", "on");
      translateAll().catch(console.error);
    } else if (msg.type === "TRANSLATE_OFF") {
      restoreAll();
    }
  });
})();
