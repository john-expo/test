## explanation paano na connect 

## Connections ng JS sa HTML

Ang JavaScript (script2.js) ay connected sa HTML (index.html) gamit ang:

```html
<script src="script2.js"></script>
```

Ito ung nasa dulo ng HTML file, bago magtapos ang `</body>` tag.

## Paano Kinukuha ng JS ang HTML Elements

Para makontrol ng JavaScript ang UI elements, kinukuha nito ang mga elements gamit ang IDs:

```javascript
const form = document.getElementById("parkingForm"); 
const plateInput = document.getElementById("plate"); 
const floorSelect = document.getElementById("floorSelect"); 
const slotSelect = document.getElementById("slotSelect"); 
const parkingLevels = document.getElementById("parkingLevels"); 
const parkingList = document.getElementById("parkingList"); 
const roleSelect = document.getElementById("role");
```

Kaya importante na lahat ng HTML elements ay may tamang IDs:

```html
<select id="role">
  <option value="user">User</option>
  <option value="manager">Manager</option>
</select>

<form id="parkingForm">
  <input id="plate" type="text" placeholder="Enter Plate Number" required />
  <!-- at iba pa -->
</form>

<div id="parkingLevels"></div>
<ul id="parkingList"></ul>
```

## Event Listeners

Naglalagay ang JS ng "listeners" para malaman kapag may user actions:

```javascript
// Kapag nagbago ang selected floor
floorSelect.addEventListener("change", () => {
  // Code para i-update ang slots
});

// Kapag nag-submit ng form (pag park ng kotse)
form.addEventListener("submit", (e) => {
  // Code para i-process ang parking
});

// Kapag nagpalit ng role (user/manager)
roleSelect.addEventListener("change", () => {
  // Code para i-update ang display
});
```

## Dynamic UI Generation

Ang JS ay gumagawa ng HTML elements on-the-fly para sa:

1. **Parking Grid**
```javascript
function renderParkingLevels() {
  // Creates divs for each level and slot
  // Adds classes (vacant/occupied)
}
```

2. **Car List**
```javascript
function renderParkingList() {
  // Creates list items for each parked car
  // Shows different info based on role
}
```

## Data Flow

1. User input → HTML forms → JS variables
2. JS processes data at saves sa localStorage
3. JS reads data from localStorage
4. JS updates UI based sa data (shows parked cars, etc.)

## Kung Ano Ginawa Natin sa Original Code

### 1. Ang Original Files at Restorations

Sa original codebase, meron tayong:
- **index.html**: Main HTML file na may form, role selector at containers
- **style2.css**: Para sa styling at layout ng UI
- **script2.js**: Para sa functionality at data processing

Ang ginawa natin ay ni-restore lang ang mga original files na ito, walang binago sa functionality nila. Ibig sabihin:

- Hindi binago ang ID ng mga HTML elements (para tamang ma-select sila ng JS)
- Hindi binago ang structure ng localStorage data
- Hindi binago ang paano gumana ang JavaScript core functions

### 2. Connections na Ginamit

Ang mga connections ng JS sa UI ay:

1. **Direct DOM Selection:**
```javascript
const form = document.getElementById("parkingForm");
// Gets the HTML form element directly from the document
```

2. **Event-Based DOM Updates:**
```javascript
// When a form is submitted, JS updates the UI
form.addEventListener("submit", (e) => {
  // Process data then render...
  renderParkingLevels();
  renderParkingList();
});
```

3. **Data-Driven UI Changes:**
```javascript
// When role changes, UI updates
roleSelect.addEventListener("change", () => {
  renderParkingList();
});
```

### 3. Ginagamit na UI Techniques

1. **Dynamic Element Creation:**
```javascript
// Create parking slots dynamically based on data
const slot = document.createElement("div");
slot.classList.add("slot");
```

2. **Class-Based Styling:**
```javascript
// Change appearance using CSS classes
if (car) { 
  slot.classList.add("occupied"); 
} else { 
  slot.classList.add("vacant"); 
}
```

3. **HTML Injection:**
```javascript
// Create content with HTML
li.innerHTML = ` 
  🚘 Plate: <strong>${plate}</strong><br> 
  📍 Level ${floor}, Slot ${slotNum} at ${parkedTime}
  <br><button onclick="removeVehicle(${index})">Remove</button> 
`;
```

### 4. Data Flow nung Ni-restore Natin

1. **User Interaction Flow:**
   - User selects a floor → `floorSelect.addEventListener("change", ...)`
   - JS shows available slots → `slotSelect.innerHTML = ...`
   - User enters plate number and clicks "Park" → `form.addEventListener("submit", ...)`
   - JS processes data → `data[slotIndex] = {...}`
   - JS updates the UI → `renderParkingLevels()` and `renderParkingList()`

2. **Data Persistence Flow:**
   - JS saves data → `saveParkingData(data)`
   - Data stored in browser → `localStorage.setItem(...)`
   - JS loads data on page load → `loadParkingData()`
   - UI reflects stored data → initial `renderParkingLevels()` and `renderParkingList()`

### 5. Mga Hindi Binago:

- Nag-stick tayo sa original implementation ng:
  - Role-based permissions (user vs. manager)
  - Slot selection mechanics
  - Parking grid visualization
  - Data structure (array with floor*SLOTS_PER_FLOOR + slot indexing)

## Optional Python Backend (wased.py)

Ang current system natin ay gumagamit ng localStorage para sa data storage. Kung gusto mo ng server-based storage, pwede mong gamitin ang wased.py bilang backend.

### Paano i-setup:

1. **Install Flask:**
```bash
pip install flask
```

2. **Run the Python server:**
```bash
python wased.py
```

3. **Access the system:**
Open browser at: http://localhost:5000/

### Paano i-modify ang JavaScript para gumamit ng backend:

Hindi mo na kailangang gumawa ng bagong file. Pwede mong i-modify ang existing script2.js para tumawag sa Python backend. Halimbawa:

1. **I-modify ang loadParkingData function:**

```javascript
// Original function
function loadParkingData() { 
  return JSON.parse(localStorage.getItem("parkingData") || "[]"); 
}

// Modified to use server
async function loadParkingData() { 
  try {
    const response = await fetch('http://localhost:5000/api/parking');
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Server error, using localStorage:", error);
  }
  // Fallback to localStorage
  return JSON.parse(localStorage.getItem("parkingData") || "[]"); 
}
```

2. **I-modify ang form submit handler para mag-save sa server:**

```javascript
// Sa loob ng form.addEventListener("submit", (e) => {...})

// Dagdagan ng code para i-save sa server
try {
  await fetch('http://localhost:5000/api/parking', {
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
} catch (error) {
  console.error("Could not save to server:", error);
}

// Original localStorage code (as fallback)
data[slotIndex] = { plate, time: new Date().toISOString(), role }; 
saveParkingData(data);
```

3. **I-modify ang removeVehicle function:**

```javascript
// Sa loob ng removeVehicle function

// Dagdagan ng code para i-delete sa server
try {
  await fetch(`http://localhost:5000/api/parking/${index}`, {
    method: 'DELETE'
  });
} catch (error) {
  console.error("Could not remove from server:", error);
}

// Original localStorage code (as fallback)
data[index] = null; 
saveParkingData(data);
```

### Note:

- Hindi mo kailangang i-modify ang code kung gusto mo lang local storage.
- Kung gusto mo lang simple na parking system, stick ka lang sa original code.
- Ang Python backend ay OPTIONAL lang para sa advanced functionality.

## Paano Gamitin

1. I-open ang `index.html` sa browser
2. Automatic na mag-load ang script2.js
3. Ready na gamitin ang system!

### Usage Steps

