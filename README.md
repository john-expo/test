## Paano Nakakonekta ang JavaScript sa UI

## Connections ng JS sa HTML

Ang JavaScript (script2.js) ay nakakonekta sa HTML (index.html) gamit ang:

```html
<script src="script2.js"></script>
```

Ito ay nasa dulo ng HTML file, bago magtapos ang `</body>` tag.

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

