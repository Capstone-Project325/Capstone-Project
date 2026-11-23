
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .menu_data import (
    MENU_ITEMS,
    EXTRA_TOPPINGS,
    REMOVABLE_INGREDIENTS,
    COMBO_PRICES,
    CUSTOMIZATION_RULES,
)


@api_view(["GET", "POST"])
def customize_item(request):
    # GET returns the menu and available customization options.
    if request.method == "GET":
        return Response({
            "restaurant": "Mr. Big",
            "menu": MENU_ITEMS,
            "extra_toppings": EXTRA_TOPPINGS,
            "removable_ingredients": REMOVABLE_INGREDIENTS,
            "combo_prices": COMBO_PRICES,
            "currency": "USD",
            "price_unit": "cents",
        })

    # POST calculates a customized order.
    data = request.data

    item_id = data.get("item")
    variant = data.get("variant", "regular")
    extras = data.get("extras", [])
    removals = data.get("remove_ingredients", [])
    combo = data.get("combo", "none")

    if item_id not in MENU_ITEMS:
        return Response(
            {"error": "Invalid menu item."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    item = MENU_ITEMS[item_id]

    if variant not in item["prices"]:
        return Response(
            {"error": "Invalid size or variant for this item."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not isinstance(extras, list) or not isinstance(removals, list):
        return Response(
            {"error": "Extras and removals must be lists."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if any(not isinstance(x, str) for x in extras + removals):
        return Response(
            {"error": "Customization options must be text."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(extras) != len(set(extras)):
        return Response(
            {"error": "Duplicate extras are not allowed."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(removals) != len(set(removals)):
        return Response(
            {"error": "Duplicate removals are not allowed."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    invalid_extras = [x for x in extras if x not in EXTRA_TOPPINGS]
    invalid_removals = [
        x for x in removals if x not in REMOVABLE_INGREDIENTS
    ]

    # Check customization rules for this food category.
    category = item["category"]
    rules = CUSTOMIZATION_RULES.get(category, {
        "extras": [],
        "removals": [],
    })

    allowed_extras = rules["extras"]
    allowed_removals = rules["removals"]

    # Reject toppings that are not allowed for this item.
    for extra in extras:
        if extra not in allowed_extras:
            return Response(
                {
                    "error": f"{extra} is not allowed for {item['name']}."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    # Reject ingredient removals that are not allowed.
    for ingredient in removals:
        if ingredient not in allowed_removals:
            return Response(
                {
                    "error": f"Cannot remove {ingredient} from {item['name']}."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    if invalid_extras or invalid_removals:
        return Response(
            {"error": "One or more customization options are invalid."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    
    # Check which customizations are allowed for this item.
    category = item["category"]
    rules = CUSTOMIZATION_RULES[category]

    invalid_category_extras = [
        x for x in extras if x not in rules["extras"]
    ]

    invalid_category_removals = [
        x for x in removals if x not in rules["removals"]
    ]

    if invalid_category_extras or invalid_category_removals:
        return Response(
            {
                "error": "Customization not allowed for this item.",
                "invalid_extras": invalid_category_extras,
                "invalid_removals": invalid_category_removals,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


    if combo not in COMBO_PRICES:
        return Response(
            {"error": "Invalid combo size."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Calculate all prices in cents.
    base_cents = item["prices"][variant]
    extras_cents = sum(EXTRA_TOPPINGS[x] for x in extras)
    combo_cents = COMBO_PRICES[combo]

    total_cents = base_cents + extras_cents + combo_cents

    return Response({
        "restaurant": "Mr. Big",
        "item": item["name"],
        "item_id": item_id,
        "variant": variant,
        "extras": extras,
        "removed_ingredients": removals,
        "combo": combo,
        "base_price": base_cents / 100,
        "extras_price": extras_cents / 100,
        "combo_price": combo_cents / 100,
        "total_price": total_cents / 100,
    })
