const form = document.getElementById("parkingForm"); 
const plateInput = document.getElementById("plate"); 
const floorSelect = document.getElementById("floorSelect"); 
const slotSelect = document.getElementById("slotSelect"); 
const parkingLevels = document.getElementById("parkingLevels"); 
const parkingList = document.getElementById("parkingList"); 
const roleSelect = document.getElementById("role"); 
 
const FLOORS = 4; 
const SLOTS_PER_FLOOR = 13; 
 
function loadParkingData() { 
  return JSON.parse(localStorage.getItem("parkingData") || "[]"); 
} 
 
function saveParkingData(data) { 
  localStorage.setItem("parkingData", JSON.stringify(data)); 
} 
 
function renderParkingLevels() { 
  const data = loadParkingData(); 
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
      const car = loadParkingData()[slotIndex]; 
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
} 
 
function renderParkingList() { 
  const data = loadParkingData(); 
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
      <br><button onclick="removeVehicle(${index})">Remove</button> 
    `; 
    parkingList.appendChild(li); 
  }); 
} 
 
function removeVehicle(index) { 
  if (roleSelect.value !== "manager") { 
    alert("Only managers can remove vehicles."); 
    return; 
  } 
 
  const data = loadParkingData(); 
  data[index] = null; 
  saveParkingData(data); 
  renderParkingLevels(); 
  renderParkingList(); 
} 
 
floorSelect.addEventListener("change", () => { 
  const floor = parseInt(floorSelect.value); 
  slotSelect.innerHTML = '<option value="">Select Slot</option>'; 
  if (isNaN(floor)) return; 
 
  const data = loadParkingData(); 
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
}); 
 
form.addEventListener("submit", (e) => { 
  e.preventDefault(); 
 
  const plate = plateInput.value.trim(); 
  const floor = parseInt(floorSelect.value); 
  const slot = parseInt(slotSelect.value); 
  const role = roleSelect.value; 
 
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
 
  data[slotIndex] = { plate, time: new Date().toISOString(), role }; 
  saveParkingData(data); 
 
  plateInput.value = ""; 
  floorSelect.value = ""; 
  slotSelect.innerHTML = '<option value="">Select Slot</option>'; 
 
  renderParkingLevels(); 
  renderParkingList(); 
}); 
 
roleSelect.addEventListener("change", () => { 
renderParkingList(); 
}); 
renderParkingLevels(); 
renderParkingList(); 