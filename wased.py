from flask import Flask, request
from datetime import datetime

app = Flask(__name__)

parked_cars = []

users = [{"username": "admin", "password": "admin123", "role": "admin"}]

def park_car():
    data = request.json
    for car in parked_cars:
        if car['floor'] == data['floor'] and car['slot'] == data['slot'] and car['bay'] == data['bay']:
            return {"message": "This slot is already taken."}, 400
    
    car_info = {
        "plate": data['plate'],
        "floor": data['floor'],
        "slot": data['slot'],
        "bay": data['bay'],
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    parked_cars.append(car_info)
    return {"message": "Car parked successfully!"}, 200

def unpark_car():
    data = request.json
    for car in parked_cars:
        if car['plate'] == data['plate']:
            parked_cars.remove(car)
            return {"message": "Car removed."}, 200
    return {"message": "Car not found."}, 404

def view_cars():
    return {"parked_cars": parked_cars}

def login():
    data = request.json
    for user in users:
        if user['username'] == data['username'] and user['password'] == data['password']:
            return {"message": "Login successful", "role": user['role']}, 200
    return {"message": "Invalid username or password"}, 401

def add_user():
    data = request.json
    for user in users:
        if user['username'] == data['username']:
            return {"message": "User already exists"}, 400
    new_user = {
        "username": data['username'],
        "password": data['password'],
        "role": data.get('role', 'employee')
    }
    users.append(new_user)
    return {"message": "User added successfully"}, 200

def handle_request(path, method):
    if path == '/park' and method == 'POST':
        return park_car()
    elif path == '/unpark' and method == 'POST':
        return unpark_car()
    elif path == '/cars' and method == 'GET':
        return view_cars()
    elif path == '/login' and method == 'POST':
        return login()
    elif path == '/add_user' and method == 'POST':
        return add_user()
    else:
        return {"message": "Not found"}, 404

@app.route('/', methods=['GET', 'POST', 'PUT', 'DELETE'])
def main():
    path = request.path
    method = request.method
    response, status_code = handle_request(path, method)
    return response, status_code

if __name__ == '__main__':
    app.run(debug=True)
