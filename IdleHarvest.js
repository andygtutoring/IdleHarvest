// IdleHarvest.js
let coins = 100;
let landCount = 0;
let wheatSeedCount = 0;
let carrotSeedCount = 0;
let potatoSeedCount = 0;
let wheatHarvestCount = 0;
let carrotHarvestCount = 0;
let potatoHarvestCount = 0;
let plantedSeeds = {};
let landSelect = document.getElementById('land-select');
let seedSelect = document.getElementById('seed-select');
let coinsDisplay = document.getElementById('coins');
let landCountDisplay = document.getElementById('land-count');
let wheatSeedCountDisplay = document.getElementById('wheat-seed-count');
let carrotSeedCountDisplay = document.getElementById('carrot-seed-count');
let potatoSeedCountDisplay = document.getElementById('potato-seed-count');
let wheatHarvestCountDisplay = document.getElementById('wheat-harvest-count');
let carrotHarvestCountDisplay = document.getElementById('carrot-harvest-count');
let potatoHarvestCountDisplay = document.getElementById('potato-harvest-count');

// Clear previous intervals
let growthIntervalId;
let updateIntervalId;

// Buy 1 land plot
document.getElementById('buy-land').addEventListener('click', () => {
  if (coins >= 10) {
    coins -= 10;
    landCount++;
    updateLandOptions();
    updateDisplays();
  }
});

// Buy 1 seed
document.getElementById('buy-wheat-seed').addEventListener('click', () => {
  if (coins >= 5) {
    coins -= 5;
    wheatSeedCount++;
    updateDisplays();
  }
});
document.getElementById('buy-carrot-seed').addEventListener('click', () => {
  if (coins >= 10) {
    coins -= 10;
    carrotSeedCount++;
    updateDisplays();
  }
});
document.getElementById('buy-potato-seed').addEventListener('click', () => {
  if (coins >= 20) {
    coins -= 20;
    potatoSeedCount++;
    updateDisplays();
  }
});

// Plant 1 seed
document.getElementById('plant-seed').addEventListener('click', () => {
  let landIndex = parseInt(landSelect.value);
  let seedType = seedSelect.value;
  if (landIndex >= 0 && seedType !== 'none') {
    if (seedType === 'wheat' && wheatSeedCount > 0) {
      // Wheat takes 10 seconds.
      plantedSeeds[landIndex] = {
        type: 'wheat',
        startDate: Date.now(),
        endDate: Date.now() + (10 * 1000),
      };
      wheatSeedCount--;
    }
    else if (seedType === 'carrot' && carrotSeedCount > 0) {
      // Carrots take 10 seconds.
      plantedSeeds[landIndex] = {
        type: 'carrot',
        startDate: Date.now(),
        endDate: Date.now() + (20 * 1000),
      };
      carrotSeedCount--;
    }
    else if (seedType === 'potato' && potatoSeedCount > 0) {
      // Potatoes take 30 seconds.
      plantedSeeds[landIndex] = {
        type: 'potato',
        startDate: Date.now(),
        endDate: Date.now() + (30 * 1000),
      };
      potatoSeedCount--;
    }
    updateDisplays();
    startGrowth(landIndex);
  }
});

// Harvest 1 plant
document.getElementById('harvest-plant').addEventListener('click', () => {
  let landIndex = parseInt(landSelect.value);
  const now = Date.now();
  let timeRemaining; // initialize it.
  if (plantedSeeds[landIndex]) {
    timeRemaining = plantedSeeds[landIndex].endDate - now;
  }
  if (timeRemaining <= 0) {
    let seedType = plantedSeeds[landIndex].type;
    if (seedType === 'wheat') {
      wheatHarvestCount++;
    }
    else if (seedType === 'carrot') {
      carrotHarvestCount++;
    }
    else if (seedType === 'potato') {
      potatoHarvestCount++;
    }
    delete plantedSeeds[landIndex];
    updateDisplays();
  }
});

// Sell 1 harvested plant
document.getElementById('sell-wheat').addEventListener('click', () => {
  if (wheatHarvestCount > 0) {
    coins += 10;
    wheatHarvestCount--;
    updateDisplays();
  }
});
document.getElementById('sell-carrot').addEventListener('click', () => {
  if (carrotHarvestCount > 0) {
    coins += 20;
    carrotHarvestCount--;
    updateDisplays();
  }
});
document.getElementById('sell-potato').addEventListener('click', () => {
  if (potatoHarvestCount > 0) {
    coins += 50;
    potatoHarvestCount--;
    updateDisplays();
  }
});

// Update displays
function updateDisplays() {
  coinsDisplay.textContent = coins;
  landCountDisplay.textContent = landCount;
  wheatSeedCountDisplay.textContent = wheatSeedCount;
  carrotSeedCountDisplay.textContent = carrotSeedCount;
  potatoSeedCountDisplay.textContent = potatoSeedCount;
  wheatHarvestCountDisplay.textContent = wheatHarvestCount;
  carrotHarvestCountDisplay.textContent = carrotHarvestCount;
  potatoHarvestCountDisplay.textContent = potatoHarvestCount;
}

// Start growth timer
function startGrowth(landIndex) {
  growthIntervalId = setInterval(() => {
    updateLandOptions();
  }, 1000); // 1 second interval
}

// Update land select options
function updateLandOptions() {
  landSelect.innerHTML = '';
  for (let i = 0; i < landCount; i++) {
    let option = document.createElement('option');
    option.id = "land-plot-" + i;
    option.value = i;
    if (!plantedSeeds[i]) {
      option.text = `Land Plot ${i + 1}`;
    }
    else {
      const now = Date.now();
      const timeRemaining = plantedSeeds[i].endDate - now;
      option.textContent = `Land Plot ${i + 1} (Planted: ${plantedSeeds[i].type}, Time left: ${Math.ceil(timeRemaining / 1000)} sec)`;

      // Check if growth is complete
      if (timeRemaining <= 0) {
        option.textContent = `Land Plot ${i + 1} (Planted: ${plantedSeeds[i].type}, Time left: 0 sec`;
      }
    }
    landSelect.appendChild(option);
  }
}

// Save game state to local storage
function saveGameState() {
  localStorage.setItem('gameState', JSON.stringify({
    coins,
    landCount,
    wheatSeedCount,
    carrotSeedCount,
    potatoSeedCount,
    wheatHarvestCount,
    carrotHarvestCount,
    potatoHarvestCount,
    plantedSeeds,
    timestamp: Date.now() // store current timestamp
  }));
}

// Load game state from local storage
function loadGameState() {
  const storedState = localStorage.getItem('gameState');
  if (storedState) {
    const gameState = JSON.parse(storedState);
    coins = gameState.coins;
    landCount = gameState.landCount;
    wheatSeedCount = gameState.wheatSeedCount;
    carrotSeedCount = gameState.carrotSeedCount;
    potatoSeedCount = gameState.potatoSeedCount;
    wheatHarvestCount = gameState.wheatHarvestCount;
    carrotHarvestCount = gameState.carrotHarvestCount;
    potatoHarvestCount = gameState.potatoHarvestCount;
    plantedSeeds = gameState.plantedSeeds;

    // Restart setInterval for updating land options and displays
    setInterval(() => {
      updateDisplays();
    }, 1000);
  }
}

// Clear intervals before restarting
clearInterval(growthIntervalId);
clearInterval(updateIntervalId);

// Call loadGameState on page load.
loadGameState();

// Update land select options every second
// Update land options and displays
updateIntervalId = setInterval(() => {
  updateLandOptions();
  updateDisplays();
}, 1000);

// Call saveGameState every 5 seconds.
setInterval(saveGameState, 5000);



