const toggle = document.getElementById("toggle");
const status = document.getElementById("status");

async function getTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

(async () => {
  const tab = await getTab();
  chrome.runtime.sendMessage({ type: "GET_STATE", tabId: tab.id }, (res) => {
    toggle.checked = !!(res && res.on);
  });
})();

let clearTimer = null;

toggle.addEventListener("change", async () => {
  const tab = await getTab();
  const on = toggle.checked;
  if (clearTimer) { clearTimeout(clearTimer); clearTimer = null; }
  status.textContent = on ? "در حال ترجمه…" : "";
  chrome.runtime.sendMessage({ type: "SET_STATE", tabId: tab.id, on }, (res) => {
    if (!on) return;
    if (toggle.checked !== on) return; // در این فاصله کاربر کلید را خاموش کرده
    const failed = chrome.runtime.lastError || !res || !res.ok;
    status.textContent = failed ? "خطا در ترجمه" : "✓ ترجمه انجام شد";
    if (!failed) clearTimer = setTimeout(() => { status.textContent = ""; }, 2500);
  });
});
