
## Paano i-implement o na-implement ang Server Functionality

Yung original codebase nyo gumagamit ng localStorage para sa data persistence.
Ito na yung guide, paano i-implement ang server-side storage while retaining the original code.

## Project Files

1. **Orig Files (unmodified):**
   - `index.html` - Original HTML file
   - `style2.css` - Original CSS file
   - `script2.js` - Original JavaScript file

2. **New Files (orig code with changes I just added "modified prefix in file naming):** 
   - `modified_script2.js` - Modified version ng script2.js with server connectivity
   - `wased_modified.py` - Python Flask backend

## Installation at Setup

### 1. Install Dependencies

I-install ang mga dependencies gamit ang requirements.txt:

```bash
pip install -r requirements.txt
```

ito ung mga requirements na may dependencies:
- Flask==2.0.1
- Werkzeug==2.0.1
- Jinja2==3.0.1
- itsdangerous==2.0.1
- click==8.0.1
- MarkupSafe==2.0.1
- python-dotenv==0.19.0

### 2. Run ang Python Backend

```bash
python wased_modified.py
```

### 3. Access sa Browser

```
http://localhost:5000
```

## File Configuration

### 1. HTML File Setup

Sa HTML, i-include mo both JS files sa tamang order:

```html
<!-- Sa dulo ng index.html, bago mag-close ang </body> -->
<script src="script2.js"></script>
<script src="modified_script2.js"></script>
```

Sa ganitong paraan:
1. Gagana pa rin ang original code
2. Pero ang `modified_script2.js` ay mag-o-override ng ilang functions para gamitin ang server

### 2. Kung Paano Gumagana ang Connection

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

## Server Features

### 1. Server-side Data Persistence

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

### 2. Logging

Ang server ay automatic na gumagawa ng `parking_server.log` file para sa debugging at monitoring. Para sa detailed logging information, i-check ang file na ito.

### 3. API Endpoints

Ang server ay may mga sumusunod na endpoints:
- `GET /api/parking` - Para kunin ang lahat ng parking data
- `POST /api/parking` - Para mag-add ng sasakyan
- `DELETE /api/parking/<index>` - Para mag-remove ng sasakyan
- `GET /stats` - Para kunin ang statistics

## Configuration Options

### 1. Pag Switch sa Original at Modified Code

Kung gusto nyo ng pure local storage (original code):
- I-remove lang ang `<script src="modified_script2.js"></script>` sa HTML

Kung gusto nyo ng server implementation:
- I-include pareho ang `script2.js` at `modified_script2.js`

### 2. Git Configuration

I added `.gitignore` file na nag-e-exclude ng mga files na hindi kailangang i-track:
- Python cache files
- Log files
- Data files (parking_data.json)
- IDE files
- Environment files

## Testing

1. Run the Python server:
   ```bash
   python wased_modified.py
   ```

2. Access sa browser:
   ```
   http://localhost:5000
   ```


