// ECO MODE Calculator și UI
const ECO_CONSTANTS = {
  WATER_PER_MESSAGE: 0.5,    // litri per request (aproximare bazată pe studii AI)
  ENERGY_PER_MESSAGE: 4.6,   // Watt-ore per request
  CO2_PER_MESSAGE: 2.5,      // grame CO2 per request
};

const ECO_TIPS = [
  "Shorter prompts use less resources!",
  "Try to ask multiple questions at once!",
  "Specific questions get better answers faster!",
  "Review your message before sending!",
  "Consider if you really need AI for this task!",
];

function calculateEnvironmentalImpact(messageCount) {
  return {
    water: (messageCount * ECO_CONSTANTS.WATER_PER_MESSAGE).toFixed(1),
    energy: (messageCount * ECO_CONSTANTS.ENERGY_PER_MESSAGE).toFixed(1),
    carbon: (messageCount * ECO_CONSTANTS.CO2_PER_MESSAGE).toFixed(1)
  };
}

function getEquivalentDescription(messageCount) {
  const totalWater = messageCount * ECO_CONSTANTS.WATER_PER_MESSAGE;
  const totalEnergy = messageCount * ECO_CONSTANTS.ENERGY_PER_MESSAGE;
  
  if (messageCount === 0) return "-";
  if (messageCount < 5) return `${Math.round(totalWater * 2)} sips of water`;
  if (messageCount < 20) return `${Math.round(totalEnergy / 60)} minutes of LED light`;
  if (messageCount < 50) return `${Math.round(totalWater)} glasses of water`;
  if (messageCount < 100) return `${Math.round(totalEnergy / 1000)} hours of smartphone charging`;
  return `${Math.round(totalWater / 8)} liters - like a small water bottle!`;
}

function animateValueUpdate(elementId, newValue) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.add('updated');
    element.textContent = newValue;
    setTimeout(() => element.classList.remove('updated'), 600);
  }
}

function updateAllStats(messageCount) {
  const impact = calculateEnvironmentalImpact(messageCount);
  
  animateValueUpdate('messages', messageCount.toString());
  animateValueUpdate('water', `${impact.water} L`);
  animateValueUpdate('energy', `${impact.energy} Wh`);
  animateValueUpdate('carbon', `${impact.carbon} g`);
  
  // Update equivalent description
  const equivalent = getEquivalentDescription(messageCount);
  const equivalentEl = document.getElementById('equivalent');
  if (equivalentEl) {
    equivalentEl.textContent = equivalent;
  }
  
  // Update eco tip
  const randomTip = ECO_TIPS[Math.floor(Math.random() * ECO_TIPS.length)];
  const tipEl = document.getElementById('ecoTip');
  if (tipEl) {
    tipEl.textContent = randomTip;
  }
}

function updateCount() {
  chrome.storage.local.get(["messages"], (data) => {
    const messageCount = data.messages || 0;
    console.log("ECO Popup loaded, messages =", messageCount);
    updateAllStats(messageCount);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCount();

  // Reset button
  document.getElementById("reset").addEventListener("click", () => {
    chrome.storage.local.set({ messages: 0 }, () => {
      updateAllStats(0);
      console.log("ECO Counter reset");
    });
  });

  // Toggle ECO details
  document.getElementById("toggleEco").addEventListener("click", () => {
    const details = document.getElementById("ecoDetails");
    const button = document.getElementById("toggleEco");
    
    if (details.classList.contains("hidden")) {
      details.classList.remove("hidden");
      button.textContent = "🌿 Hide Details";
    } else {
      details.classList.add("hidden");
      button.textContent = "🌿 ECO Details";
    }
  });

  // Listen for storage changes and update UI immediately
  if (chrome.storage?.onChanged) {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (changes.messages && chrome.runtime?.id) {
        const newCount = changes.messages.newValue || 0;
        updateAllStats(newCount);
        console.log(`ECO stats updated: ${newCount} messages`);
      }
    });
  }
});