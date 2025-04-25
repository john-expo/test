# Taragis Parking Management System - File Connections

## How the Files are Connected

The Taragis Parking Management System consists of several interconnected files that work together to provide the parking management functionality. Here's an explanation of how they are connected:

### HTML and CSS Connection

1. In `user.html`, the CSS is connected through the link tag in the head section:
   ```html
   <link rel="stylesheet" href="mini.css" />
   ```

2. In `manager.html`, the CSS is connected the same way:
   ```html
   <link rel="stylesheet" href="mini.css" />
   ```

The `mini.css` file provides all the styling for both the user and manager interfaces, including:
- Layout and container styling
- Form elements
- Parking grid visualization
- Vehicle list display
- Responsive design for different screen sizes

### HTML and JavaScript Connection

1. In `user.html`, the JavaScript is connected at the bottom of the body section:
   ```html
   <script>
     // Force user role
     localStorage.setItem('parkingRole', 'user');
   </script>
   <script src="mini.js"></script>
   ```

2. In `manager.html`, the JavaScript is connected similarly:
   ```html
   <script>
     // Force manager role
     localStorage.setItem('parkingRole', 'manager');
   </script>
   <script src="mini.js"></script>
   ```

The inline script before loading `mini.js` sets the user's role in localStorage, which determines what functionality is available to them.

### JavaScript and HTML Element Connections

The `mini.js` file connects to HTML elements through JavaScript selectors:

```javascript
const form = document.getElementById("parkingForm"); 
const plateInput = document.getElementById("plate"); 
const floorSelect = document.getElementById("floorSelect"); 
const slotSelect = document.getElementById("slotSelect"); 
const parkingLevels = document.getElementById("parkingLevels"); 
const parkingList = document.getElementById("parkingList"); 
const refreshBtn = document.getElementById("refreshBtn");
```

These selectors match the IDs of elements in both HTML files:

```html
<form id="parkingForm">
  <input type="text" id="plate" placeholder="Enter Plate Number" required />
  <select id="floorSelect">
    <!-- options -->
  </select>
  <select id="slotSelect">
    <!-- options -->
  </select>
  <button type="submit">Park</button>
</form>

<div id="parkingLevels"></div>
<ul id="parkingList"></ul>
```

### Data Flow Between Files

1. **User Interaction**: User interacts with HTML elements (forms, buttons)
2. **JavaScript Handling**: Event listeners in `mini.js` respond to these interactions
3. **Data Storage**: Data is stored in localStorage for persistence
4. **UI Updates**: JavaScript updates the HTML elements dynamically
5. **Styling Application**: CSS styles are applied to all elements, including dynamically created ones

## No Modifications Needed

The files are already properly connected in their original state:

1. HTML files (`user.html` and `manager.html`) correctly link to the CSS and JS files
2. JavaScript (`mini.js`) correctly references the HTML elements by ID
3. CSS (`mini.css`) correctly styles all the elements used in the HTML

No changes are needed to restore these connections as they are working as designed in their original form.

## Using the System

To use the system with these original files:

1. Open either `user.html` (for basic user interface) or `manager.html` (for admin interface)
2. The browser will automatically load the connected CSS and JavaScript files
3. The system will function as designed with the original code 