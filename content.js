console.log("🌱 ECO ChatGPT Usage Tracker content script loaded");

let messageCount = 0;
let isTracking = false;
let ecoNotificationShown = false;

const ECO_CONSTANTS = {
  WATER_PER_MESSAGE: 0.5,
  ENERGY_PER_MESSAGE: 4.6,
  CO2_PER_MESSAGE: 2.5,
};

// Create eco notification element
function createEcoNotification(impact) {
  const notification = document.createElement('div');
  notification.id = 'eco-notification';
  notification.innerHTML = `
    <div style="
      position: fixed; 
      top: 20px; 
      right: 20px; 
      background: linear-gradient(135deg, #10b981, #059669); 
      color: white; 
      padding: 12px 16px; 
      border-radius: 10px; 
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
      z-index: 10000; 
      font-family: 'Segoe UI', sans-serif; 
      font-size: 13px;
      max-width: 280px;
      animation: ecoSlideIn 0.5s ease;
    ">
      <div style="display: flex; align-items: center; margin-bottom: 6px;">
        <span style="margin-right: 8px;">🌱</span>
        <strong>Environmental Impact</strong>
        <button id="eco-close" style="
          background: none; 
          border: none; 
          color: white; 
          font-size: 16px; 
          margin-left: auto; 
          cursor: pointer;
          opacity: 0.7;
        ">×</button>
      </div>
      <div style="font-size: 11px; line-height: 1.4; opacity: 0.9;">
        💧 Water: +${ECO_CONSTANTS.WATER_PER_MESSAGE}L | ⚡ Energy: +${ECO_CONSTANTS.ENERGY_PER_MESSAGE}Wh<br>
        🌍 Total CO₂: ${impact.carbon}g
      </div>
    </div>
    <style>
      @keyframes ecoSlideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    </style>
  `;

  document.body.appendChild(notification);

  // Auto-hide after 4 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'ecoSlideIn 0.3s reverse';
      setTimeout(() => notification.remove(), 300);
    }
  }, 4000);

  // Close button
  notification.querySelector('#eco-close').addEventListener('click', () => {
    notification.remove();
  });
}

function incrementCounter() {
  chrome.runtime.sendMessage({ type: "newMessage" }, (response) => {
    if (chrome.runtime.lastError) {
      console.log("❌ Error sending message:", chrome.runtime.lastError);
    } else if (response && response.success) {
      console.log("📤 ECO Message sent to background script");
      
      // Show eco notification every 10 messages or on first message
      if (response.newCount === 1 || response.newCount % 10 === 0) {
        if (response.environmentalImpact) {
          createEcoNotification(response.environmentalImpact);
        }
      }
      
      // Console eco-tips at milestones
      if (response.newCount === 5) {
        console.log("🌱 ECO TIP: Try asking multiple questions in one message to reduce resource usage!");
      } else if (response.newCount === 25) {
        console.log("🌱 ECO TIP: You've used ~12.5L of water so far. Consider the environment! 💧");
      } else if (response.newCount === 100) {
        console.log("🌱 ECO MILESTONE: 100 messages! That's ~50L water & 460Wh energy. Every AI query has an environmental cost. 🌍");
      }
    }
  });
}

function startTracking() {
  if (isTracking) return;
  isTracking = true;

  console.log("🌱 ECO tracking started");

  // Method 1: Listen for Enter key on textarea
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      const textarea = document.querySelector('textarea[data-id="root"]') || 
                      document.querySelector('textarea') ||
                      e.target;
      
      if (textarea && textarea.tagName === "TEXTAREA" && textarea.value.trim() !== "") {
        console.log("ECO: Message detected via Enter key");
        setTimeout(incrementCounter, 500); // Small delay to ensure message is sent
      }
    }
  });

  // Method 2: Observe DOM changes for new messages
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // Look for user messages
          if (node.querySelector && (
            node.querySelector('[data-message-author-role="user"]') ||
            node.querySelector('.whitespace-pre-wrap') ||
            node.matches('[data-message-author-role="user"]')
          )) {
            console.log("ECO: New user message detected via DOM observer");
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
    console.log("ECO DOM observer started");
  }

  // Method 3: Click detection on send button
  document.addEventListener("click", (e) => {
    if (e.target.matches('button[data-testid="send-button"]') ||
        e.target.closest('button[data-testid="send-button"]') ||
        e.target.matches('button svg') ||
        (e.target.closest('button') && e.target.closest('button').querySelector('svg'))) {
      
      const textarea = document.querySelector('textarea[data-id="root"]') || 
                      document.querySelector('textarea');
      
      if (textarea && textarea.value.trim() !== "") {
        console.log("ECO: Message detected via send button click");
        setTimeout(incrementCounter, 500);
      }
    }
  });

  // Show initial eco-awareness message
  if (!ecoNotificationShown) {
    setTimeout(() => {
      console.log("🌱 ECO MODE ACTIVE: Tracking environmental impact of your AI usage");
      ecoNotificationShown = true;
    }, 3000);
  }
}

// Start tracking when page loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startTracking);
} else {
  startTracking();
}

// Also start tracking after a delay to ensure page is fully loaded
setTimeout(startTracking, 2000);