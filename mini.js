const form = document.getElementById("parkingForm"); 
const plateInput = document.getElementById("plate"); 
const floorSelect = document.getElementById("floorSelect"); 
const slotSelect = document.getElementById("slotSelect"); 
const parkingLevels = document.getElementById("parkingLevels"); 
const parkingList = document.getElementById("parkingList"); 
const roleSelect = document.getElementById("role") || {value: localStorage.getItem("parkingRole") || "user"}; 
const refreshBtn = document.getElementById("refreshBtn");

// Constants
const FLOORS = 4; 
const SLOTS_PER_FLOOR = 13; 
const API_URL = window.location.protocol + '//' + window.location.host;

// Get current role
function getRole() {
  return roleSelect.value || "user";
}

// Load parking data from localStorage
function loadParkingData() { 
  return JSON.parse(localStorage.getItem("parkingData") || "[]"); 
} 

// Save parking data to localStorage
function saveParkingData(data) { 
  localStorage.setItem("parkingData", JSON.stringify(data)); 
} 

// Update stats (for manager view)
function updateStats() {
  if (getRole() !== "manager") return;
  
  const data = loadParkingData();
  const occupied = data.filter(car => car !== null).length;
  const total = FLOORS * SLOTS_PER_FLOOR;
  const available = total - occupied;
  
  const totalElement = document.getElementById("totalSpaces");
  const occupiedElement = document.getElementById("occupiedSpaces");
  const availableElement = document.getElementById("availableSpaces");
  const totalVehiclesElement = document.getElementById("totalVehicles");
  
  if (totalElement) totalElement.textContent = total;
  if (occupiedElement) occupiedElement.textContent = occupied;
  if (availableElement) availableElement.textContent = available;
  if (totalVehiclesElement) totalVehiclesElement.textContent = `🚗 Total Cars Parked: ${occupied}`;
}

// Fetch parking data from server
async function fetchParkingData() {
  try {
    const response = await fetch(`${API_URL}/api/parking`);
    if (!response.ok) {
      console.error("Failed to fetch parking data");
      return loadParkingData();
    }
    const data = await response.json();
    saveParkingData(data); // Save to localStorage as backup
    return data;
  } catch (error) {
    console.error("Error fetching parking data:", error);
    return loadParkingData(); // Fallback to localStorage
  }
}

// Render parking levels
async function renderParkingLevels() { 
  let data = loadParkingData();
  
  // Try to fetch from server first
  try {
    data = await fetchParkingData();
  } catch (error) {
    console.warn("Using local data instead of server data:", error);
  }
  
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
 
      slot.textContent = i + 1; // Slot number (1-based)
      
      // Add click event for manager to manage occupied slots
      if (getRole() === "manager" && car) {
        slot.title = `${car.plate} - Click to remove`;
        slot.style.cursor = "pointer";
        slot.addEventListener("click", () => {
          if (confirm(`Remove vehicle ${car.plate} from Level ${floor + 1}, Slot ${i + 1}?`)) {
            removeVehicle(slotIndex);
          }
        });
      }
      
      floorGrid.appendChild(slot); 
    } 
 
    levelDiv.appendChild(floorGrid); 
    parkingLevels.appendChild(levelDiv); 
  } 
  
  updateStats();
} 

// Render list of parked vehicles
function renderParkingList() { 
  const data = loadParkingData(); 
  parkingList.innerHTML = ""; 
 
  // If user role, show limited information
  if (getRole() !== "manager") { 
    parkingList.innerHTML = "<li>Only managers can view parked car details.</li>"; 
    return; 
  } 
 
  const sorted = data 
    .map((car, index) => ({ ...car, index })) 
    .filter(c => c !== null) 
    .sort((a, b) => new Date(a.time) - new Date(b.time)); 
 
  if (sorted.length === 0) { 
    parkingList.innerHTML = "<li>No cars currently parked.</li>"; 
    return; 
  } 
 
  sorted.forEach(({ plate, time, index }) => { 
    const li = document.createElement("li"); 
    const floor = Math.floor(index / SLOTS_PER_FLOOR) + 1; 
    const slotNum = (index % SLOTS_PER_FLOOR) + 1; 
    const parkedTime = new Date(time).toLocaleString(); 
 
    li.innerHTML = ` 
      <div class="vehicle-info">
        <div>🚘 Plate: <strong>${plate}</strong></div>
        <div>📍 Level ${floor}, Slot ${slotNum}</div>
        <div>⏱️ Parked at: ${parkedTime}</div>
        <button class="remove-btn" onclick="removeVehicle(${index})">Remove Vehicle</button>
      </div>
    `; 
    parkingList.appendChild(li); 
  }); 
  
  updateStats();
} 

// Remove vehicle function
async function removeVehicle(index) { 
  if (getRole() !== "manager") { 
    alert("Only managers can remove vehicles."); 
    return; 
  } 
 
  const data = loadParkingData(); 

  try {
    // Try to remove on server first
    const response = await fetch(`${API_URL}/api/parking/${index}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error("Failed to remove vehicle from server");
    }
    
    console.log("Vehicle removed from server successfully");
  } catch (error) {
    console.error("Error removing vehicle from server:", error);
    // Continue with local removal anyway
  }
  
  // Also update locally
  data[index] = null; 
  saveParkingData(data); 
  renderParkingLevels(); 
  renderParkingList(); 
} 

// Listen for floor selection to update available slots
floorSelect.addEventListener("change", () => { 
  const floor = parseInt(floorSelect.value); 
  slotSelect.innerHTML = '<option value="">Select Slot</option>'; 
  if (isNaN(floor)) return; 
 
  const data = loadParkingData(); 
  for (let i = 0; i < SLOTS_PER_FLOOR; i++) { 
    const slotIndex = floor * SLOTS_PER_FLOOR + i; 
    const car = data[slotIndex]; 
    const isOccupied = car !== null && car !== undefined; 
    
    // Skip occupied slots for regular users
    if (getRole() === "user" && isOccupied) continue; 
 
    const option = document.createElement("option"); 
    option.value = i; 
    option.textContent = `Slot ${i + 1}${isOccupied ? " (Occupied)" : ""}`; 
    slotSelect.appendChild(option); 
  } 
}); 

// Form submission for parking a car
form.addEventListener("submit", async (e) => { 
  e.preventDefault(); 
 
  const plate = plateInput.value.trim(); 
  const floor = parseInt(floorSelect.value); 
  const slot = parseInt(slotSelect.value); 
  const role = getRole();
 
  if (!plate || isNaN(floor) || isNaN(slot)) { 
    alert("Please complete all fields."); 
    return; 
  } 
 
  const data = loadParkingData(); 
  const slotIndex = floor * SLOTS_PER_FLOOR + slot; 
  const existingCar = data[slotIndex]; 
 
  if (existingCar && role !== "manager") { 
    alert("This slot is already occupied."); 
    return; 
  } 
  
  // Check if array needs to be expanded
  if (data.length <= slotIndex) {
    data.length = FLOORS * SLOTS_PER_FLOOR;
  }

  try {
    // Try to park on server first
    const response = await fetch(`${API_URL}/api/parking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        plate,
        floor,
        slot,
        role
      })
    });
    
    if (!response.ok) {
      throw new Error("Failed to park car on server");
    }
    
    console.log("Car parked on server successfully");
    
  } catch (error) {
    console.error("Error parking car on server:", error);
    // Continue with local parking anyway
  }
  
  // Also update locally  
  data[slotIndex] = { plate, time: new Date().toISOString(), role }; 
  saveParkingData(data); 
 
  // Reset form
  plateInput.value = ""; 
  floorSelect.value = ""; 
  slotSelect.innerHTML = '<option value="">Select Slot</option>'; 
 
  // Update UI
  renderParkingLevels(); 
  renderParkingList(); 
}); 

// Refresh button (for manager view)
if (refreshBtn) {
  refreshBtn.addEventListener("click", () => {
    renderParkingLevels();
    renderParkingList();
    alert("Data refreshed!");
  });
}

// Create a simple Flask backend
async function setupBackend() {
  try {
    // Just check if the backend is available
    const response = await fetch(`${API_URL}/api/parking`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log("Successfully connected to backend server");
    }
  } catch (error) {
    console.warn("Backend server not available. Using localStorage only:", error);
  }
}

// Initialize
window.addEventListener('DOMContentLoaded', async () => {
  await setupBackend();
  await renderParkingLevels();
  renderParkingList();
});

// Also render on load
renderParkingLevels(); 
renderParkingList();