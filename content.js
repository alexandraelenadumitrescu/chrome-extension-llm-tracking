console.log("✅ ChatGPT Usage Tracker content script loaded");

let messageCount = 0;
let isTracking = false;

function incrementCounter() {
  chrome.runtime.sendMessage({ type: "newMessage" }, (response) => {
    if (chrome.runtime.lastError) {
      console.log("Error sending message:", chrome.runtime.lastError);
    } else {
      console.log("📤 Message sent to background script");
    }
  });
}

function startTracking() {
  if (isTracking) return;
  isTracking = true;

  // Method 1: Listen for Enter key on textarea
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      const textarea = document.querySelector('textarea[data-id="root"]') || 
                      document.querySelector('textarea') ||
                      e.target;
      
      if (textarea && textarea.tagName === "TEXTAREA" && textarea.value.trim() !== "") {
        console.log("🔤 Message detected via Enter key");
        incrementCounter();
      }
    }
  });

  // Method 2: Observe DOM changes for new messages
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          // Look for user messages (typically have specific classes or attributes)
          if (node.querySelector && (
            node.querySelector('[data-message-author-role="user"]') ||
            node.querySelector('.whitespace-pre-wrap') ||
            node.matches('[data-message-author-role="user"]')
          )) {
            console.log("👤 New user message detected via DOM observer");
            incrementCounter();
          }
        }
      });
    });
  });

  // Start observing the chat container
  const chatContainer = document.querySelector('main') || 
                       document.querySelector('[role="main"]') || 
                       document.body;
  
  if (chatContainer) {
    observer.observe(chatContainer, {
      childList: true,
      subtree: true
    });
    console.log("👁️ DOM observer started");
  }

  // Method 3: Click detection on send button
  document.addEventListener("click", (e) => {
    // ChatGPT send button selectors (may change over time)
    if (e.target.matches('button[data-testid="send-button"]') ||
        e.target.closest('button[data-testid="send-button"]') ||
        e.target.matches('button svg') ||
        (e.target.closest('button') && e.target.closest('button').querySelector('svg'))) {
      
      const textarea = document.querySelector('textarea[data-id="root"]') || 
                      document.querySelector('textarea');
      
      if (textarea && textarea.value.trim() !== "") {
        console.log("🖱️ Message detected via send button click");
        incrementCounter();
      }
    }
  });
}

// Start tracking when page loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startTracking);
} else {
  startTracking();
}

// Also start tracking after a short delay to ensure page is fully loaded
setTimeout(startTracking, 2000);