# Taragis Parking System - Restoration Guide

## Ang Original Files

Nabalik na natin yung original files:

1. **index.html** - Main page ng parking system
2. **style2.css** - Para sa design/styling
3. **script2.js** - Para sa functionality

## Mga Connections

### HTML at CSS Connection
Sa `index.html`, ganito nakakonekta yung CSS:
```html
<link rel="stylesheet" href="style2.css" />
```

### HTML at JavaScript Connection
Sa `index.html`, ganito nakakonekta yung JavaScript:
```html
<script src="script2.js"></script>
```

### JavaScript at HTML Elements Connection
Sa `script2.js`, ganito kinukuha ang mga elements:
```javascript
const form = document.getElementById("parkingForm");
const plateInput = document.getElementById("plate");
// at iba pa...
```

## Mga Ginawang Restoration

1. **Nirestore** ang original na `index.html` na may:
   - Role selector dropdown
   - Connection sa `style2.css` at `script2.js`

2. **Nirestore** ang original na `style2.css` na may:
   - Simple styling
   - Responsive design para sa iba't ibang screen sizes

3. **Nirestore** ang original na `script2.js` na may:
   - Role management sa dropdown
   - Parking functionality
   - Car list management

## Paano Gamitin

1. Buksan mo lang yung `index.html` sa browser
2. Pumili ka ng role (User o Manager)
3. Mag-park ng kotse sa floor at slot na gusto mo
4. Para sa managers, pwede ring makita at tanggalin ang mga nakapark na kotse

## Mga Pagkakaiba sa Mini Version

Nakalito kasi meron din palang ibang version (yung mini version):
- Separate `user.html` at `manager.html` files
- `mini.css` at `mini.js` na mas complex
- Role setting via localStorage

Pero nabalik na ngayon yung orig code mo! 🎉 