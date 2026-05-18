import os
import django

# Setup Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "restaurant_qr.settings")
django.setup()

from qrapp.models import MenuItem

menu_data = [
    {"name": "Margherita Pizza", "cost": 810},
    {"name": "Pepperoni Pizza", "cost": 990},
    {"name": "Veggie Burger", "cost": 675},
    {"name": "Cheeseburger", "cost": 765},
    {"name": "Caesar Salad", "cost": 630},
    {"name": "French Fries", "cost": 315},
    {"name": "Spaghetti Bolognese", "cost": 900},
    {"name": "Chicken Wings", "cost": 720},
    {"name": "Chocolate Cake", "cost": 495},
    {"name": "Coffee", "cost": 270},
    {"name": "Cappuccino", "cost": 320},
    {"name": "Cold Coffee", "cost": 350},
    {"name": "Lemonade", "cost": 180},
    {"name": "Iced Tea", "cost": 200},
    {"name": "Paneer Tikka", "cost": 550},
    {"name": "Butter Naan", "cost": 80},
    {"name": "Dal Makhani", "cost": 450},
    {"name": "Chicken Curry", "cost": 850},
    {"name": "Fish Fry", "cost": 700},
    {"name": "Veg Fried Rice", "cost": 400},
    {"name": "Chicken Biryani", "cost": 900},
    {"name": "Gulab Jamun", "cost": 250},
    {"name": "Ice Cream Sundae", "cost": 300},
    {"name": "Garlic Bread", "cost": 220},
    {"name": "Veg Sandwich", "cost": 350},
]

for item in menu_data:
    MenuItem.objects.create(name=item["name"], price=item["cost"])

print("Expanded menu items added successfully!")