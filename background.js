// ECO MODE Service Worker for ChatGPT Usage Tracker
console.log("🌱 ECO ChatGPT Tracker background script loaded");

const ECO_CONSTANTS = {
  WATER_PER_MESSAGE: 0.5,    // litri per request
  ENERGY_PER_MESSAGE: 4.6,   // Watt-ore per request
  CO2_PER_MESSAGE: 2.5,      // grame CO2 per request
};

function logEnvironmentalImpact(messageCount) {
  const impact = {
    water: (messageCount * ECO_CONSTANTS.WATER_PER_MESSAGE).toFixed(1),
    energy: (messageCount * ECO_CONSTANTS.ENERGY_PER_MESSAGE).toFixed(1),
    carbon: (messageCount * ECO_CONSTANTS.CO2_PER_MESSAGE).toFixed(1)
  };
  
  console.log(`🌍 Environmental Impact - Messages: ${messageCount}, Water: ${impact.water}L, Energy: ${impact.energy}Wh, CO₂: ${impact.carbon}g`);
  
  return impact;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "newMessage") {
    chrome.storage.local.get(["messages"], (data) => {
      const currentCount = data.messages || 0;
      const newCount = currentCount + 1;
      
      chrome.storage.local.set({ messages: newCount }, () => {
        const impact = logEnvironmentalImpact(newCount);
        
        console.log(`✅ ECO Message count updated: ${currentCount} → ${newCount}`);
        console.log(`💧 Total water usage: ${impact.water}L`);
        console.log(`⚡ Total energy usage: ${impact.energy}Wh`);
        console.log(`🌍 Total CO₂ footprint: ${impact.carbon}g`);
        
        sendResponse({ 
          success: true, 
          newCount: newCount,
          environmentalImpact: impact
        });
      });
    });
    
    return true; // Async response
  }
});

// Log milestones pentru awareness
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.messages && namespace === 'local') {
    const messageCount = changes.messages.newValue;
    
    // Log environmental milestones
    if (messageCount === 10) {
      console.log("🌱 ECO Milestone: You've used ~5L of water (like 2-3 glasses)");
    } else if (messageCount === 50) {
      console.log("🌱 ECO Milestone: You've used ~25L of water and 230Wh energy");
    } else if (messageCount === 100) {
      console.log("🌱 ECO Milestone: You've used ~50L of water (like 6 water bottles)");
    } else if (messageCount === 500) {
      console.log("🌱 ECO Milestone: You've used ~250L of water and 2.3kWh energy");
    } else if (messageCount === 1000) {
      console.log("🌱 ECO Milestone: 1000 messages! Consider your AI usage impact 🌍");
    }
  }
});

chrome.runtime.onStartup.addListener(() => {
  console.log("🔄 ECO ChatGPT Usage Tracker extension started");
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("📦 ECO ChatGPT Usage Tracker extension installed");
  
  // Initialize counter if it doesn't exist
  chrome.storage.local.get(["messages"], (data) => {
    if (data.messages === undefined) {
      chrome.storage.local.set({ messages: 0 });
      console.log("🔢 ECO Message counter initialized to 0");
    } else {
      logEnvironmentalImpact(data.messages);
    }
  });
});