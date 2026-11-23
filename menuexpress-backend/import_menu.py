import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from menu.models import MenuItem

managed_categories = ["Burgers", "Chicken", "Veggie", "Sides", "Drinks"]

menu_items = [
    (
        "Mr. Big",
        "Signature beef burger with a toasted bun and classic toppings.",
        "Burgers",
        "8.35",
        "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=720&q=85",
        ["beef patty", "bun", "lettuce", "tomato", "pickles", "onion", "mayonnaise", "ketchup", "mustard"],
        ["wheat", "eggs",],
    ),
    (
        "Double Mr. Big",
        "Two signature beef patties with a toasted bun and classic toppings.",
        "Burgers",
        "9.15",
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=720&q=85",
        ["two beef patties", "sesame seed bun", "lettuce", "tomato", "pickles", "onion", "mayonnaise", "ketchup", "mustard"],
        ["wheat", "eggs", "sesame"],
    ),
    (
        "Cheeseburger Single",
        "A beef patty with melted cheese on a toasted bun.",
        "Burgers",
        "7.50",
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=720&q=85",
        ["beef patty", "American cheese", "sesame seed bun", "lettuce", "tomato", "pickles", "onion", "mayonnaise", "ketchup", "mustard"],
        ["wheat", "milk", "eggs", "sesame"],
    ),
    (
        "Cheeseburger Double",
        "Two beef patties with melted cheese on a toasted bun.",
        "Burgers",
        "8.95",
        "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=720&q=85",
        ["two beef patties", "American cheese", "sesame seed bun", "lettuce", "tomato", "pickles", "onion", "mayonnaise", "ketchup", "mustard"],
        ["wheat", "milk", "eggs", "sesame"],
    ),
    (
        "Cluckin' Classic",
        "Crispy chicken fillet with fresh toppings on a toasted bun.",
        "Chicken",
        "7.95",
        "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=720&q=85",
        ["breaded chicken fillet","wheat flour", "breadcrumbs", "eggs", "milk", "bun", "lettuce", "tomato", "pickles", "mayonnaise-based chicken sauce"],
        ["wheat", "milk", "eggs",],
    ),
    (
        "Cluckin' Tenders",
        "Four hand-breaded chicken tenders, fried until golden.",
        "Chicken",
        "8.99",
        "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=720&q=85",
        ["chicken breast", "wheat flour", "breadcrumbs", "eggs", "seasoning", "frying oil"],
        ["wheat", "eggs",],
    ),
    (
        "Cluckin' Nuggets",
        "Four crisp, golden chicken nuggets.",
        "Chicken",
        "6.99",
        "https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=720&q=85",
        ["chicken", "wheat flour", "breadcrumbs", "eggs", "seasoning", "frying oil"],
        ["wheat", "eggs",],
    ),
    (
        "Veggie Single",
        "A veggie patty with fresh toppings on a toasted bun.",
        "Veggie",
        "9.85",
        "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=720&q=85",
        ["black beans", "vegetables", "soy protein", "wheat breadcrumbs", "eggs", "bun", "lettuce", "tomato", "pickles", "onion", "mayonnaise", "ketchup", "mustard"],
        ["wheat", "soy", "eggs",],
    ),
    (
        "Veggie Double",
        "Two veggie patties with fresh toppings on a toasted bun.",
        "Veggie",
        "10.29",
        "https://vanillaandbean.com/wp-content/uploads/2025/07/BlackBeanVeggieBurger-1-680x453.jpg",
        ["black beans", "vegetables", "soy protein", "wheat breadcrumbs", "eggs", "sesame seed bun", "lettuce", "tomato", "pickles", "onion", "mayonnaise", "ketchup", "mustard"],
        ["wheat", "soy", "eggs", "sesame"],
    ),
    (
        "Mushroom Swiss",
        "Sauteed mushrooms and Swiss cheese on a veggie burger.",
        "Veggie",
        "11.99",
        "https://images.unsplash.com/photo-1683882330182-eb8f64d7231c?auto=format&fit=crop&w=720&q=85",
        ["black beans", "vegetables", "soy protein", "wheat breadcrumbs", "eggs", "bun", "sauteed mushrooms", "Swiss cheese", "lettuce", "tomato"],
        ["wheat", "soy", "milk", "eggs",],
    ),
    (
        "Eggplant Parm",
        "Breaded eggplant with tomato sauce and melted cheese.",
        "Veggie",
        "11.49",
        "https://themodernnonna.com/wp-content/uploads/2026/05/IMG_4766-scaled.jpg",
        ["eggplant", "wheat flour", "breadcrumbs", "eggs", "tomato sauce", "mozzarella cheese", "Parmesan cheese", "Italian herbs"],
        ["wheat", "milk", "eggs",],
    ),
    (
        "Fries: Small",
        "A small serving of crisp, golden fries.",
        "Sides",
        "2.59",
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=720&q=85",
        ["potatoes", "frying oil", "salt"],
        [],
    ),
    (
        "Fries: Medium",
        "A medium serving of crisp, golden fries.",
        "Sides",
        "3.99",
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=720&q=85",
        ["potatoes", "frying oil", "salt"],
        [],
    ),
    (
        "Fries: Large",
        "A large serving of crisp, golden fries.",
        "Sides",
        "4.79",
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=720&q=85",
        ["potatoes", "frying oil", "salt"],
        [],
    ),
    (
        "Iced Coffee",
        "Chilled coffee served over ice.",
        "Drinks",
        "2.79",
        "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=720&q=85",
        ["coffee", "water", "ice", "milk", "sugar"],
        ["milk"],
    ),
    (
        "Hot Coffee",
        "Freshly brewed hot coffee.",
        "Drinks",
        "2.19",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=720&q=85",
        ["coffee", "water", "milk", "sugar"],
        ["milk"],
    ),
    (
        "Tea",
        "A freshly brewed cup of hot tea.",
        "Drinks",
        "2.19",
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=720&q=85",
        ["tea leaves", "water", "milk", "sugar"],
        ["milk"],
    ),
    (
        "Hot Chocolate",
        "Warm, rich hot chocolate.",
        "Drinks",
        "2.19",
        "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?auto=format&fit=crop&w=720&q=85",
        ["milk", "cocoa", "sugar", "chocolate"],
        ["milk"],
    ),
    (
        "Soda",
        "A refreshing cold soda.",
        "Drinks",
        "1.69",
        "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=720&q=85",
        ["carbonated water", "sweetener", "natural flavoring", "caffeine"],
        [],
    ),
]

for name, description, category, price, image, ingredients, allergens in menu_items:
    item = MenuItem.objects.filter(name=name).first()

    if item is None:
        item = MenuItem(name=name)

    item.description = description
    item.category = category
    item.price = price
    item.image = image
    item.ingredients = ingredients
    item.allergens = allergens
    item.save()

missing_items = [
    name
    for name, description, category, price, image, ingredients, allergens in menu_items
    if not MenuItem.objects.filter(name=name).exists()
]

if missing_items:
    print("Missing items:", missing_items)
else:
    print(f"Successfully inserted or updated {len(menu_items)} menu items.")
    print("No existing records were deleted.")