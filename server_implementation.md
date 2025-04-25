# Taragis Parking System - Server Implementation Guide

## Paano i-implement ang Server Functionality

Ang original codebase ay gumagamit ng localStorage para sa data persistence. Sa guide na ito, ipapakita kung paano i-implement ang server-side storage habang pinapanatili ang original code.

### Mga Files na Kailangan

1. **Orig Files (hindi babaguhin):**
   - `index.html` - Original HTML file
   - `style2.css` - Original CSS file
   - `script2.js` - Original JavaScript file

2. **New Files (orig code weith changes):**
   - `modified_script2.js` - Modified version ng script2.js with server connectivity
   - `wased_modified.py` - Python Flask backend

### 1. Setup ng Python Backend

**Install Flask:**
```bash
pip install flask
```

**Run ang Server:**
```bash
python wased_modified.py
```

**Access sa Browser:**
http://localhost:5000

### 2. Paano Gamitin ang Modified Script with Original Code

**Sa HTML, include mo both files:**
```html
<!-- Sa dulo ng index.html, bago mag-close ang </body> -->
<script src="script2.js"></script>
<script src="modified_script2.js"></script>
```

Sa ganitong paraan:
1. Gagana pa rin ang original code
2. Pero ang `modified_script2.js` ay mag-o-override ng ilang functions para gamitin ang server

### 3. Kung Paano Gumagana ang Connection

Ang `modified_script2.js` ay:

1. Nag-o-override ng original functions:
   ```javascript
   // Mag-save ng reference sa original function
   const originalLoadParkingData = loadParkingData;
   
   // Replace with server-connected version
   loadParkingData = async function() {
     // Server code with localStorage fallback
   };
   ```

2. May fallbacks sa localStorage kung hindi available ang server:
   ```javascript
   try {
     // Try server first
     const response = await fetch(`${API_URL}/api/parking`);
     // Process server response
   } catch (error) {
     // Fallback to localStorage
     return JSON.parse(localStorage.getItem("parkingData") || "[]");
   }
   ```

3. May mga added features tulad ng statistics dashboard:
   ```javascript
   // Get stats from server API
   const stats = await getStatsFromServer();
   
   // Create and insert stats display for manager role
   if (roleSelect.value === "manager") {
     // Create stats UI elements
   }
   ```

### 4. Server-side Data Persistence

Ang data ay naka-save sa `parking_data.json` file na automatically created ng server:

```python
# Load data from file
def load_parking_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

# Save data to file
def save_parking_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f)
```

### 5. Mga Advantages ng Server Implementation

1. **Persistent Data:** Hindi mawawala ang data kahit i-clear ang browser cache
2. **Multi-device Access:** Pwedeng access sa iba't ibang devices
3. **Centralized Management:** May unified database para sa lahat ng users
4. **Enhanced Features:** May statistics at advanced monitoring features
5. **Better Security:** Protected ang data sa server-side storage

### 6. Pag Switch sa Original at Modified Code

Kung gusto mo ng pure local storage (original code):
- I-remove lang ang `<script src="modified_script2.js"></script>` sa HTML

Kung gusto mo ng server implementation:
- I-include pareho ang `script2.js` at `modified_script2.js`

### 7. Paano i-Test

1. Run the Python server:
   ```bash
   python wased_modified.py
   ```

2. Access sa browser:
   ```
   http://localhost:5000
   ```

3. Gumamit ng manager role para makita ang statistics dashboard
4. Mag-park at mag-remove ng sasakyan
5. I-refresh ang browser at makikita na hindi nawala ang data 