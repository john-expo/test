## Paano i-implement o na-implement ang Server Functionality

Yung  original codebase nyo gumagamit ng localStorage para sa data persistence.
ito na yung guide,  paano i-implement ang server-side storage while retaining the original code.


1. **Orig Files (unmodified):**
   - `index.html` - Original HTML file
   - `style2.css` - Original CSS file
   - `script2.js` - Original JavaScript file

2. **New Files (orig code with changes I just added "modified prefix in file naming):** 
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

### 6. Pag Switch sa Original at Modified Code

Kung gusto nyo ng pure local storage (original code):
- I-remove lang ang `<script src="modified_script2.js"></script>` sa HTML

Kung gusto nyo ng server implementation:
- I-include pareho ang `script2.js` at `modified_script2.js`

### 7. Paano i-Test

1. Run the Python server:
   ```bash
   python wased_modified.py
   ```

2. Access sa browser:
   ```
   http://localhost:5000
   ``

