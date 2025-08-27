
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === "newMessage") {
//     chrome.storage.local.get(["messages"], (data) => {
//       let count = data.messages || 0;
//       count++;
//       console.log("✅ Background updated count:", count);
//       chrome.storage.local.set({ messages: count });
//     });
//   }
// });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "increment") {
//     chrome.storage.local.get("messages", (data) => {
//       let newCount = (data.messages || 0) + 1;
//       chrome.storage.local.set({ messages: newCount });
//     });
//   }
// });


// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "newMessage" || request.action === "increment") {
    chrome.storage.local.get(["messages"], (data) => {
      let count = (data.messages || 0) + 1;
      console.log("✅ Background updated count:", count);
      chrome.storage.local.set({ messages: count });
    });
  }
});
