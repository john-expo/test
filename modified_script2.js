/**
 * MODIFIED_SCRIPT2.JS
 * 
 * Ito ay ang modified version ng script2.js na may connection sa Python backend (wased_modified.py).
 * Hindi binago ang original script2.js file para ma-preserve ang original functionality.
 * Sa file na ito, ginagamit ang server-side storage kasama ang localStorage bilang fallback.
 * 
 * CONNECTIONS:
 * - Ang file na ito ay dapat i-include after script2.js sa index.html:
 *   <script src="script2.js"></script>
 *   <script src="modified_script2.js"></script>
 * 
 * - Tumutuloy ito sa wased_modified.py Flask server na gumagana sa http://localhost:5000
 * 
 * IMPROVEMENTS:
 * - Server-side data persistence (di mawawala data kahit i-clear ang browser cache)
 * - Synchronization across multiple tabs/browsers
 * - Stats API para sa advanced analytics
 */

// API URL (change if your server runs on a different port/address)
const API_URL = "http://localhost:5000";

/**
 * MODIFIED FUNCTIONS
 * Ang mga sumusunod ay modified versions ng mga functions sa script2.js
 * na may connection sa server
 */

// Modified loadParkingData function
// Kumukuha muna ng data sa server, tapos fallback sa localStorage
async function loadParkingDataFromServer() {
  try {
    console.log("Fetching data from server...");
    const response = await fetch(`${API_URL}/api/parking`);
    
    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }
    
    const data = await response.json();
    console.log("Data loaded from server successfully");
    
    // Update localStorage for backup
    localStorage.setItem("parkingData", JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.error("Could not load from server, using localStorage:", error);
    // Fallback to original function
    return JSON.parse(localStorage.getItem("parkingData") || "[]");
  }
}

// Modified saveParkingData function
// Saves to both server and localStorage
async function saveParkingDataToServer(data) {
  // Save to localStorage as backup
  localStorage.setItem("parkingData", JSON.stringify(data));
  
  try {
    console.log("Saving all data to server...");
    const response = await fetch(`${API_URL}/api/parking/all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }
    
    console.log("All data saved to server successfully");
    return true;
  } catch (error) {
    console.error("Could not save to server, but saved to localStorage:", error);
    return false;
  }
}

// Modified park car function
// Parks car on server, then updates localStorage
async function parkCarOnServer(plate, floor, slot, role) {
  try {
    console.log(`Parking car ${plate} on server...`);
    const response = await fetch(`${API_URL}/api/parking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        plate: plate,
        floor: floor,
        slot: slot,
        role: role,
        time: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }
    
    console.log(`Car ${plate} parked on server successfully`);
    return true;
  } catch (error) {
    console.error("Could not park car on server:", error);
    return false;
  }
}

// Modified remove car function
// Removes car from server, then updates localStorage
async function removeCarFromServer(index) {
  try {
    console.log(`Removing car at index ${index} from server...`);
    const response = await fetch(`${API_URL}/api/parking/${index}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }
    
    console.log("Car removed from server successfully");
    return true;
  } catch (error) {
    console.error("Could not remove car from server:", error);
    return false;
  }
}

// New function to get stats from server
async function getStatsFromServer() {
  try {
    const response = await fetch(`${API_URL}/stats`);
    
    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }
    
    const stats = await response.json();
    console.log("Stats loaded from server:", stats);
    return stats;
  } catch (error) {
    console.error("Could not get stats from server:", error);
    
    // Calculate stats locally as fallback
    const data = JSON.parse(localStorage.getItem("parkingData") || "[]");
    const occupied = data.filter(car => car !== null && car !== undefined).length;
    const total = FLOORS * SLOTS_PER_FLOOR;
    
    return {
      total: total,
      occupied: occupied,
      available: total - occupied,
      utilization: Math.round((occupied / total) * 100 * 10) / 10
    };
  }
}

/**
 * OVERRIDE ORIGINAL FUNCTIONS
 * Ang sumusunod ay code para i-override ang mga original functions sa script2.js
 * IMPORTANT: I-comment out kung gusto mong gamitin ang original functions
 */

// Override original loadParkingData
const originalLoadParkingData = loadParkingData;
loadParkingData = async function() {
  const data = await loadParkingDataFromServer();
  return data;
};

// Modified renderParkingLevels to handle async
const originalRenderParkingLevels = renderParkingLevels;
renderParkingLevels = async function() {
  const data = await loadParkingData();
  parkingLevels.innerHTML = "";
  
  for (let floor = 0; floor < FLOORS; floor++) {
    const levelDiv = document.createElement("div");
    levelDiv.classList.add("level");
    
    const levelTitle = document.createElement("h3");
    levelTitle.textContent = `Level ${floor + 1}`;
    levelDiv.appendChild(levelTitle);
    
    const floorGrid = document.createElement("div");
    floorGrid.classList.add("floor-grid");
    
    for (let i = 0; i < SLOTS_PER_FLOOR; i++) {
      const slotIndex = floor * SLOTS_PER_FLOOR + i;
      const car = data[slotIndex];
      const slot = document.createElement("div");
      slot.classList.add("slot");
      
      if (car) {
        slot.classList.add("occupied");
      } else {
        slot.classList.add("vacant");
      }
      
      slot.textContent = slotIndex + 1;
      floorGrid.appendChild(slot);
    }
    
    levelDiv.appendChild(floorGrid);
    parkingLevels.appendChild(levelDiv);
  }
  
  // If we have access to the server, show stats
  try {
    const stats = await getStatsFromServer();
    
    // Only add stats display for manager role
    if (roleSelect.value === "manager") {
      const statsDiv = document.createElement("div");
      statsDiv.classList.add("stats-container");
      statsDiv.innerHTML = `
        <h3>Parking Statistics</h3>
        <div class="stats-grid">
          <div class="stat-box">
            <p class="stat-label">Total Spaces</p>
            <p class="stat-value">${stats.total}</p>
          </div>
          <div class="stat-box">
            <p class="stat-label">Occupied</p>
            <p class="stat-value">${stats.occupied}</p>
          </div>
          <div class="stat-box">
            <p class="stat-label">Available</p>
            <p class="stat-value">${stats.available}</p>
          </div>
          <div class="stat-box">
            <p class="stat-label">Utilization</p>
            <p class="stat-value">${stats.utilization}%</p>
          </div>
        </div>
      `;
      
      // Insert stats at the top of parking levels
      parkingLevels.insertBefore(statsDiv, parkingLevels.firstChild);
    }
  } catch (error) {
    console.error("Could not show stats:", error);
  }
};

// Override original renderParkingList to handle async
const originalRenderParkingList = renderParkingList;
renderParkingList = async function() {
  const data = await loadParkingData();
  parkingList.innerHTML = "";
  
  if (roleSelect.value !== "manager") {
    parkingList.innerHTML = "<li>Only managers can view parked car details.</li>";
    return;
  }
  
  const sorted = data
    .map((car, index) => ({ ...car, index }))
    .filter(c => c.plate)
    .sort((a, b) => new Date(a.time) - new Date(b.time));
  
  if (sorted.length === 0) {
    parkingList.innerHTML = "<li>No cars currently parked.</li>";
    return;
  }
  
  const total = document.createElement("p");
  total.textContent = `🚗 Total Cars Parked: ${sorted.length}`;
  parkingList.appendChild(total);
  
  sorted.forEach(({ plate, time, index }) => {
    const li = document.createElement("li");
    const floor = Math.floor(index / SLOTS_PER_FLOOR) + 1;
    const slotNum = (index % SLOTS_PER_FLOOR) + 1;
    const parkedTime = new Date(time).toLocaleTimeString();
    
    li.innerHTML = `
      🚘 Plate: <strong>${plate}</strong><br>
      📍 Level ${floor}, Slot ${slotNum} at ${parkedTime}
      <br><button onclick="removeVehicleServer(${index})">Remove</button>
    `;
    parkingList.appendChild(li);
  });
};

// New function to remove vehicle with server connection
async function removeVehicleServer(index) {
  if (roleSelect.value !== "manager") {
    alert("Only managers can remove vehicles.");
    return;
  }
  
  // Try to remove from server first
  const serverSuccess = await removeCarFromServer(index);
  
  // Also update localStorage
  const data = await loadParkingData();
  data[index] = null;
  localStorage.setItem("parkingData", JSON.stringify(data));
  
  // Refresh UI
  await renderParkingLevels();
  await renderParkingList();
}

// Override original removeVehicle function
const originalRemoveVehicle = removeVehicle;
removeVehicle = function(index) {
  removeVehicleServer(index);
};

// Override floorSelect change event to handle async
floorSelect.removeEventListener("change", floorSelect._changeHandler);
floorSelect._changeHandler = async function() {
  const floor = parseInt(floorSelect.value);
  slotSelect.innerHTML = '<option value="">Select Slot</option>';
  if (isNaN(floor)) return;
  
  const data = await loadParkingData();
  for (let i = 0; i < SLOTS_PER_FLOOR; i++) {
    const slotIndex = floor * SLOTS_PER_FLOOR + i;
    const car = data[slotIndex];
    const isOccupied = car !== null && car !== undefined;
    if (roleSelect.value === "user" && isOccupied) continue;
    
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `Slot ${i + 1}${isOccupied ? " (Occupied)" : ""}`;
    slotSelect.appendChild(option);
  }
};
floorSelect.addEventListener("change", floorSelect._changeHandler);

// Override form submit handler to handle async
form.removeEventListener("submit", form._submitHandler);
form._submitHandler = async function(e) {
  e.preventDefault();
  
  const plate = plateInput.value.trim();
  const floor = parseInt(floorSelect.value);
  const slot = parseInt(slotSelect.value);
  const role = roleSelect.value;
  
  if (!plate || isNaN(floor) || isNaN(slot)) {
    alert("Please complete all fields.");
    return;
  }
  
  const data = await loadParkingData();
  const slotIndex = floor * SLOTS_PER_FLOOR + slot;
  const existingCar = data[slotIndex];
  
  if (existingCar && role !== "manager") {
    alert("This slot is already occupied.");
    return;
  }
  
  // Try to park on server first
  const serverSuccess = await parkCarOnServer(plate, floor, slot, role);
  
  // Update local data too
  data[slotIndex] = { plate, time: new Date().toISOString(), role };
  localStorage.setItem("parkingData", JSON.stringify(data));
  
  // Reset form
  plateInput.value = "";
  floorSelect.value = "";
  slotSelect.innerHTML = '<option value="">Select Slot</option>';
  
  // Update UI
  await renderParkingLevels();
  await renderParkingList();
};
form.addEventListener("submit", form._submitHandler);

// Override role change event to handle async
roleSelect.removeEventListener("change", roleSelect._changeHandler);
roleSelect._changeHandler = async function() {
  await renderParkingList();
  await renderParkingLevels(); // Also refresh levels to show/hide stats
};
roleSelect.addEventListener("change", roleSelect._changeHandler);

// Add styles for stats display
const style = document.createElement('style');
style.textContent = `
  .stats-container {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
  }
  
  .stats-container h3 {
    margin-top: 0;
    text-align: center;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  
  .stat-box {
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    text-align: center;
  }
  
  .stat-label {
    margin: 0;
    font-size: 0.8em;
    color: #666;
  }
  
  .stat-value {
    margin: 5px 0 0;
    font-size: 1.5em;
    font-weight: bold;
    color: #2c3e50;
  }
  
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;
document.head.appendChild(style);

// Initialize with server data
(async function() {
  console.log("Initializing with server data...");
  await renderParkingLevels();
  await renderParkingList();
})(); 