// Service worker for ChatGPT Usage Tracker
console.log("🚀 Background script loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "newMessage") {
    chrome.storage.local.get(["messages"], (data) => {
      const currentCount = data.messages || 0;
      const newCount = currentCount + 1;
      
      chrome.storage.local.set({ messages: newCount }, () => {
        console.log(`✅ Message count updated: ${currentCount} → ${newCount}`);
        sendResponse({ success: true, newCount: newCount });
      });
    });
    
    // Return true to indicate we'll send a response asynchronously
    return true;
  }
});

// Optional: Log when extension starts
chrome.runtime.onStartup.addListener(() => {
  console.log("🔄 ChatGPT Usage Tracker extension started");
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("📦 ChatGPT Usage Tracker extension installed");
  
  // Initialize counter if it doesn't exist
  chrome.storage.local.get(["messages"], (data) => {
    if (data.messages === undefined) {
      chrome.storage.local.set({ messages: 0 });
      console.log("🔢 Message counter initialized to 0");
    }
  });
});