from datetime import datetime

parked_cars = []

users = [{"username": "admin", "password": "admin123", "role": "admin"}]

def park_car():
    plate = input("Enter car plate number: ")
    floor = int(input("Enter floor number: "))
    slot = int(input("Enter slot number: "))
    bay = int(input("Enter bay number: "))
    
    for car in parked_cars:
        if car['floor'] == floor and car['slot'] == slot and car['bay'] == bay:
            print("This slot is already taken.")
            return
    
    car_info = {
        "plate": plate,
        "floor": floor,
        "slot": slot,
        "bay": bay,
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    parked_cars.append(car_info)
    print("Car parked successfully!")

def unpark_car():
    plate = input("Enter car plate number to remove: ")
    

    for car in parked_cars:
        if car['plate'] == plate:
            parked_cars.remove(car)
            print("Car removed.")
            return
    
    print("Car not found.")

def view_cars():
    if not parked_cars:
        print("No cars are parked.")
        return
    for car in parked_cars:
        print(f"Plate: {car['plate']}, Floor: {car['floor']}, Slot: {car['slot']}, Bay: {car['bay']}, Time: {car['time']}")

def login():
    username = input("Enter username: ")
    password = input("Enter password: ")
    
    for user in users:
        if user['username'] == username and user['password'] == password:
            print(f"Login successful. Welcome {user['role']}.")
            return user['role']
    
    print("Invalid username or password.")
    return None

def add_user():
    role = input("Enter your role (admin/employee): ")
    if role != "admin":
        print("Only admins can add users.")
        return
    
    username = input("Enter new username: ")
    password = input("Enter new password: ")
    
    for user in users:
        if user['username'] == username:
            print("User already exists.")
            return
    
    users.append({"username": username, "password": password, "role": "employee"})
    print("User added successfully.")

def main():
    role = None
    
    while role is None:
        print("Please log in:")
        role = login()
    
    while True:
        if role == "admin":
            print("\nAdmin Menu:")
            print("1. Park a car")
            print("2. Unpark a car")
            print("3. View all parked cars")
            print("4. Add new user (employee)")
            print("5. Exit")
            choice = input("Enter your choice: ")
            
            if choice == "1":
                park_car()
            elif choice == "2":
                unpark_car()
            elif choice == "3":
                view_cars()
            elif choice == "4":
                add_user()
            elif choice == "5":
                print("Exiting the system.")
                break
            else:
                print("Invalid choice.")
        
        elif role == "employee":
            print("\nEmployee Menu:")
            print("1. Park a car")
            print("2. Unpark a car")
            print("3. View all parked cars")
            print("4. Exit")
            choice = input("Enter your choice: ")
            
            if choice == "1":
                park_car()
            elif choice == "2":
                unpark_car()
            elif choice == "3":
                view_cars()
            elif choice == "4":
                print("Exiting the system.")
                break
            else:
                print("Invalid choice.")

if __name__ == '__main__':
    main()
