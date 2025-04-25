"""
WASED_MODIFIED.PY

Modified version ng wased.py na may mas maraming features at documentation.
Hindi binago ang original wased.py para ma-preserve ang original functionality.

Ito ay nagsisilbing server-side backend para sa wased_modified.js.

FEATURES:
- Flask-based API server
- Persistent data sa JSON file
- API endpoints para sa parking operations
- Stats API para sa dashboard

SETUP:
1. Install Flask: pip install flask
2. Run server: python wased_modified.py
3. Access sa browser: http://localhost:5000/

CONNECTIONS:
- Gumagana with wased_modified.js 
- Compatible with original HTML/CSS files

IMPROVEMENT FROM ORIGINAL:
- Persistent data storage sa file (hindi lang in-memory)
- More complete APIs for parking operations
- Better error handling at logging
- Statistics API para sa dashboard
"""

from flask import Flask, request, jsonify, render_template, send_from_directory
import os
import json
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("parking_server.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("wased_modified")

# Initialize Flask app
app = Flask(__name__, static_folder=".", static_url_path="")
logger.info("Starting Parking Management Server...")

# Storage file for persistence
DATA_FILE = "parking_data.json"

# CORS support
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

# ------  Data Management Functions ------ #

def load_parking_data():
    """
    Load parking data from JSON file or return empty array if file doesn't exist
    """
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as f:
                logger.info(f"Loading data from {DATA_FILE}")
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading data from {DATA_FILE}: {e}")
            return []
    logger.info(f"No data file found at {DATA_FILE}, starting with empty data")
    return []

def save_parking_data(data):
    """
    Save parking data to JSON file
    """
    try:
        with open(DATA_FILE, 'w') as f:
            logger.info(f"Saving data to {DATA_FILE}")
            json.dump(data, f)
        return True
    except Exception as e:
        logger.error(f"Error saving data to {DATA_FILE}: {e}")
        return False

# Initialize data
parking_data = load_parking_data()
logger.info(f"Initialized with {len([x for x in parking_data if x is not None])} parked cars")

# ------ API Endpoints ------ #

@app.route('/')
def home():
    """
    Serve the main HTML file
    """
    logger.info("Serving homepage")
    return app.send_static_file('index.html')

@app.route('/api/parking', methods=['GET'])
def get_parking():
    """
    Get all parking data
    """
    logger.info("API: Fetching all parking data")
    return jsonify(parking_data)

@app.route('/api/parking/all', methods=['POST'])
def set_all_parking():
    """
    Replace all parking data (for bulk update)
    """
    global parking_data
    
    if not request.json:
        logger.error("API: Invalid request data for set_all_parking")
        return jsonify({"error": "Invalid data"}), 400
    
    try:
        logger.info("API: Replacing all parking data")
        parking_data = request.json
        save_parking_data(parking_data)
        return jsonify({"success": True})
    except Exception as e:
        logger.error(f"API: Error in set_all_parking: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/parking', methods=['POST'])
def add_car():
    """
    Add a car to a parking slot
    """
    if not request.json:
        logger.error("API: Invalid request data for add_car")
        return jsonify({"error": "Invalid data"}), 400
    
    try:
        car = request.json
        logger.info(f"API: Adding car with plate {car.get('plate')} to parking")
        
        # Calculate slot index
        floor = int(car.get('floor', 0))
        slot = int(car.get('slot', 0))
        index = floor * 13 + slot  # 13 slots per floor as in the JS
        
        # Ensure array is big enough
        global parking_data
        while len(parking_data) <= index:
            parking_data.append(None)
        
        # Add car to data
        parking_data[index] = {
            'plate': car.get('plate', ''),
            'time': car.get('time', datetime.now().isoformat()),
            'role': car.get('role', 'user')
        }
        
        # Save to file
        save_parking_data(parking_data)
        
        return jsonify({"success": True})
    except Exception as e:
        logger.error(f"API: Error in add_car: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/parking/<int:index>', methods=['DELETE'])
def remove_car(index):
    """
    Remove a car from a parking slot
    """
    try:
        logger.info(f"API: Removing car at index {index}")
        global parking_data
        
        if index < len(parking_data):
            if parking_data[index] is None:
                logger.warning(f"API: No car found at index {index}")
            else:
                plate = parking_data[index].get('plate', 'unknown')
                logger.info(f"API: Removing car with plate {plate} from index {index}")
                parking_data[index] = None
                save_parking_data(parking_data)
            
        return jsonify({"success": True})
    except Exception as e:
        logger.error(f"API: Error in remove_car: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/stats', methods=['GET'])
def get_stats():
    """
    Get parking statistics
    """
    try:
        logger.info("API: Calculating parking statistics")
        
        # Filter out None values
        valid_cars = [car for car in parking_data if car is not None]
        occupied = len(valid_cars)
        
        # Constants matching the JS file
        total = 4 * 13  # FLOORS * SLOTS_PER_FLOOR
        available = total - occupied
        utilization = round((occupied / total) * 100, 1) if total > 0 else 0
        
        stats = {
            "total": total,
            "occupied": occupied,
            "available": available,
            "utilization": utilization,
            # Additional stats
            "latest_car": valid_cars[-1] if valid_cars else None,
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"API: Stats calculated - {occupied}/{total} spaces occupied ({utilization}%)")
        return jsonify(stats)
    except Exception as e:
        logger.error(f"API: Error in get_stats: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint for monitoring
    """
    return jsonify({
        "status": "ok",
        "version": "1.0",
        "timestamp": datetime.now().isoformat(),
        "server": "Taragis Parking Backend"
    })

# ------ Error Handlers ------ #

@app.errorhandler(404)
def not_found(e):
    logger.warning(f"404 error: {request.path}")
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def server_error(e):
    logger.error(f"500 error: {str(e)}")
    return jsonify({"error": "Server error"}), 500

# ------ Main Function ------ #

if __name__ == '__main__':
    logger.info("Starting server on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
    logger.info("Server stopped") 