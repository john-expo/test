# Taragis Parking System - Paano Gumagana

## Koneksyon ng mga Files

Eto ang simple explanation kung paano magkakakonekta yung mga files sa parking system natin:

### HTML at CSS

1. Sa `user.html`, ganito nakakonekta yung CSS:
   ```html
   <link rel="stylesheet" href="mini.css" />
   ```

2. Sa `manager.html` din, parehas lang:
   ```html
   <link rel="stylesheet" href="mini.css" />
   ```


### HTML at JavaScript

1. Sa `user.html`, ganito nakakonekta yung JavaScript:
   ```html
   <script>
     // Para sa user mode
     localStorage.setItem('parkingRole', 'user');
   </script>
   <script src="mini.js"></script>
   ```

2. Sa `manager.html` naman:
   ```html
   <script>
     // Para sa manager mode
     localStorage.setItem('parkingRole', 'manager');
   </script>
   <script src="mini.js"></script>
   ```

May maliit na script muna na nagseset kung user ka ba o manager, tapos tsaka load yung main na `mini.js`.

### JavaScript at HTML Elements

Ganito kinukuha ng JavaScript yung mga elements mula sa HTML:

```javascript
const form = document.getElementById("parkingForm"); 
const plateInput = document.getElementById("plate"); 
const floorSelect = document.getElementById("floorSelect"); 
const slotSelect = document.getElementById("slotSelect"); 
// at iba pa
```

Kailangan match yung mga ID sa HTML para makuha ng JS:

```html
<form id="parkingForm">
  <input type="text" id="plate" placeholder="Enter Plate Number" required />
  <!-- at iba pa -->
</form>
```

## hwo it works 

1. **User:** Pag pinindot mo button o nag-input ka
2. **JavaScript:** Nakikinig siya sa mga actions mo at may gagawin
3. **Data:** Naka-save sa localStorage para hindi mawala kahit i-refresh
4. **UI:** Automatic nagbabago yung display base sa ginagawa mo

