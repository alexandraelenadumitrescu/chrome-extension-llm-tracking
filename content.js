console.log("✅ content.js loaded on ChatGPT page");

function updateCount() {
  chrome.storage.local.get(["messages"], (data) => {
    console.log("Popup loaded, messages =", data.messages); // <--- DEBUG
    document.getElementById("messages").textContent =
      "Messages: " + (data.messages || 0);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCount();

  document.getElementById("reset").addEventListener("click", () => {
    chrome.storage.local.set({ messages: 0 }, updateCount);
  });

  document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    let msgBox = document.querySelector("textarea");
    if (msgBox && msgBox.value.trim() !== "") {
      console.log("📤 Sending message to background...");
      chrome.runtime.sendMessage({ type: "newMessage" });
    }
  }
});


  // Adaugă event pentru incrementarea mesajelor
  document.getElementById("sendMessage")?.addEventListener("click", () => {
    chrome.storage.local.get(["messages"], (data) => {
      const current = data.messages || 0;
      chrome.storage.local.set({ messages: current + 1 }, updateCount);
    });
  });
});

// Ori de câte ori detectezi un mesaj trimis/recepționat:
chrome.runtime.sendMessage({ action: "increment" });

