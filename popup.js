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

toggle.addEventListener("change", async () => {
  const tab = await getTab();
  status.textContent = toggle.checked ? "در حال ترجمه…" : "";
  chrome.runtime.sendMessage(
    { type: "SET_STATE", tabId: tab.id, on: toggle.checked },
    () => {
      if (toggle.checked) {
        setTimeout(() => { status.textContent = "✓ ترجمه انجام شد"; }, 1500);
        setTimeout(() => { status.textContent = ""; }, 3500);
      }
    }
  );
});
