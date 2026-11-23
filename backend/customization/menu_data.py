
# Mr. Big Restaurant - Menu and Customization Prices
# Prices are stored in cents to avoid rounding errors.

from .menu_images import MENU_IMAGES, VEGGIE_IMAGES

MENU_ITEMS = {
    "the_mr_big": {
        "name": "The Mr. Big",
        "description": "Signature beef burger with a toasted bun and classic toppings.",
        "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=720&q=85",
        "prices": {
            "single": 835,
            "double": 915,
            "veggie_single": 985,
            "veggie_double": 1029,
        },
        "category": "burger",
    },
    "hamburger": {
        "name": "Hamburger",
        "prices": {
            "single": 259,
            "double": 319,
            "veggie_single": 399,
            "veggie_double": 469,
        },
        "category": "burger",
    },
    "cheeseburger": {
        "name": "Cheeseburger",
        "prices": {
            "single": 299,
            "double": 359,
            "veggie_single": 429,
            "veggie_double": 499,
        },
        "category": "burger",
    },
    "chicken_sandwich": {
        "name": "Chicken Sandwich",
        "prices": {"regular": 629},
        "category": "chicken",
    },
    "chicken_tenders": {
        "name": "Chicken Tenders",
        "prices": {"4_piece": 779},
        "category": "chicken",
    },
    "chicken_nuggets": {
        "name": "Chicken Nuggets",
        "prices": {
            "4_piece": 349,
            "6_piece": 379,
            "10_piece": 589,
            "20_piece": 795,
        },
        "category": "chicken",
    },
    "fries": {
        "name": "Fries",
        "prices": {
            "small": 259,
            "medium": 399,
            "large": 479,
        },
        "category": "side",
    },
    "iced_coffee": {
        "name": "Iced Coffee",
        "prices": {
            "small": 279,
            "medium": 319,
            "large": 399,
        },
        "category": "drink",
    },
    "hot_coffee": {
        "name": "Hot Coffee",
        "prices": {
            "small": 219,
            "medium": 269,
            "large": 299,
        },
        "category": "drink",
    },
    "hot_tea": {
        "name": "Hot Tea",
        "prices": {
            "small": 219,
            "medium": 269,
            "large": 299,
        },
        "category": "drink",
    },
    "hot_chocolate": {
        "name": "Hot Chocolate",
        "prices": {
            "small": 219,
            "medium": 269,
            "large": 299,
        },
        "category": "drink",
    },
    "soft_drink": {
        "name": "Soft Drink",
        "prices": {
            "small": 169,
            "medium": 189,
            "large": 229,
        },
        "category": "drink",
    },
}

# Proposed extra topping prices (not yet approved)
EXTRA_TOPPINGS = {
    "extra_cheese": 75,
    "bacon": 150,
    "extra_beef_patty": 200,
    "extra_veggie_patty": 250,
    "extra_lettuce": 25,
    "extra_tomato": 35,
    "extra_pickles": 25,
    "extra_onions": 25,
    "extra_sauce": 50,
}

# Removing ingredients is free.
REMOVABLE_INGREDIENTS = [
    "cheese",
    "lettuce",
    "tomato",
    "pickles",
    "onions",
    "sauce",
]

# Official combo upgrade prices
COMBO_PRICES = {
    "none": 0,
    "small": 415,
    "medium": 485,
    "large": 585,
}

# Loyalty points
POINTS_PER_DOLLAR = 10
POINTS_FOR_ONE_DOLLAR_REWARD = 100

# Allowed customizations for each food category

CUSTOMIZATION_RULES = {
    "burger": {
        "extras": [
            "extra_cheese",
            "bacon",
            "extra_beef_patty",
            "extra_veggie_patty",
            "extra_lettuce",
            "extra_tomato",
            "extra_pickles",
            "extra_onions",
            "extra_sauce",
        ],
        "removals": [
            "cheese",
            "lettuce",
            "tomato",
            "pickles",
            "onions",
            "sauce",
        ],
    },

    "chicken": {
        "extras": [
            "extra_cheese",
            "bacon",
            "extra_lettuce",
            "extra_tomato",
            "extra_pickles",
            "extra_sauce",
        ],
        "removals": [
            "lettuce",
            "tomato",
            "pickles",
            "sauce",
        ],
    },

    "side": {
        "extras": [
            "extra_cheese",
            "bacon",
            "extra_sauce",
        ],
        "removals": [],
    },

    "drink": {
        "extras": [],
        "removals": [],
    },
}

# Attach menu images and descriptions to each menu item.
for item_id, item in MENU_ITEMS.items():
    image_data = MENU_IMAGES.get(item_id, {})

    if image_data:
        item["description"] = image_data.get(
            "description", item.get("description", "")
        )
        item["image"] = image_data.get("image", "")

        if "variant_images" in image_data:
            item["variant_images"] = image_data["variant_images"]

    # Add veggie burger images for veggie variants.
    if item["category"] == "burger":
        item.setdefault("variant_images", {})
        item["variant_images"]["veggie_single"] = VEGGIE_IMAGES["single"]
        item["variant_images"]["veggie_double"] = VEGGIE_IMAGES["double"]

