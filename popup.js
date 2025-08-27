// Afișează numărul de mesaje și permite resetarea lui
function updateCount() {
  chrome.storage.local.get(["messages"], (data) => {
    console.log("📊 Popup loaded, messages =", data.messages);
    document.getElementById("messages").textContent =
      "Messages: " + (data.messages || 0);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCount();

  // Reset button
  document.getElementById("reset").addEventListener("click", () => {
    chrome.storage.local.set({ messages: 0 }, updateCount);
  });

  // 🔥 Ascultă schimbările și actualizează imediat UI
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.messages) {
      document.getElementById("messages").textContent =
        "Messages: " + changes.messages.newValue;
    }
  });
});