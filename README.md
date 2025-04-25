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

## Python Backend (wased.py)

Kung gusto mo ng persistent data storage sa server at hindi lang sa browser, pwede mong gamitin ang Python backend.

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

### Paano gumagana ang backend:

1. **Serving static files:**
```python
@app.route('/')
def home():
    return app.send_static_file('index.html')
```

2. **API Endpoints:**
   - GET `/api/parking` - Kunin lahat ng parking data
   - POST `/api/parking` - Mag-park ng kotse
   - DELETE `/api/parking/<index>` - Tanggalin ang kotse
   - GET `/stats` - Kumuha ng parking statistics

3. **Data Persistence:**
```python
# Save to JSON file
def save_parking_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f)
```

### Paano i-connect ang JS sa Python backend:

```javascript
// Dagdagan sa script2.js
async function saveToServer(data) {
  try {
    const response = await fetch('/api/parking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to save to server:", error);
    return false;
  }
}

// Sa submit handler
form.addEventListener("submit", async (e) => {
  // existing code...
  
  const carData = { 
    plate, 
    floor, 
    slot, 
    role, 
    time: new Date().toISOString() 
  };
  
  // Try to save to server first, then fallback to localStorage
  const serverSuccess = await saveToServer(carData);
  if (!serverSuccess) {
    console.log("Using localStorage as fallback");
    // Continue with localStorage save
  }
});
```

## Paano Gamitin

1. I-open ang `index.html` sa browser
2. Automatic na mag-load ang script2.js
3. Ready na gamitin ang system!

### Usage Steps

