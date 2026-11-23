# Capstone-Project

# Member Name: Robert Schementi
# Member Name: Patrick Cortez
# Member Name: Koby Gryciuk
# Member Name: Johann Johnson
# Member Name: Daniel Pineda
# Member Name: Gurjot Ghotra

# Capstone Project

* MenuExpress Kiosk: It would be an in-store kiosk where people would browse through the menu and can customize their meal. They can pay with their card or with their phone.


## Prototype

The MenuExpress Kiosk app prototype was designed using Figma. It includes an opening screen, login screen, home screen, and ordering menu.

Figma Public Link: https://www.figma.com/design/LqC3kiaKIfZnWszWDx9Czf/Capstone-project-prototype?node-id=0-1&t=HBw6y6CMUdaugPFm-1 

### User Personas

Persona 1: Alex – Primary User (Customer)

Alex is a 22-year-old college student who wants to order food quickly between classes. He prefers using a digital menu instead of waiting in line.

* Goal: Browse the menu, customize his burger, and pay quickly.
* Frustration: Long lines and complicated ordering systems.
* Needs: A simple interface with clear prices, pictures, and customization options.

Persona 2: Sarah – Secondary User (Restaurant Employee)

Sarah is a 28-year-old restaurant employee responsible for preparing customer orders.

* Goal: Receive accurate orders and prepare food efficiently.
* Frustration: Incorrect orders and unclear customization requests.
* Needs: An organized system that clearly displays customer selections and special instructions.

### Context Diagram

```mermaid
graph TD
    A[Customer] -->|Browses menu and places order| B[MenuExpress Kiosk]
    B -->|Displays menu and order confirmation| A
    B -->|Sends payment request| C[Payment System]
    C -->|Returns payment status| B
    B -->|Sends order details| D[Restaurant Employee]
    D -->|Updates order status| B
```
### UX Workflow – Customer Ordering Food

The primary user is a customer who wants to order food quickly using the MenuExpress Kiosk.

1. The customer opens the application and sees the welcome screen.
2. The customer signs in to their account.
3. The customer arrives at the home screen.
4. The customer selects the ordering menu.
5. The customer browses burgers, chicken, sides, drinks, and combos.
6. The customer selects a food item and customizes the order.
7. The customer adds the item to the cart and reviews the order.
8. The customer pays using a card or mobile payment.
9. The system confirms the order and sends it to the restaurant staff.

User Goal: Make ordering food faster, easier, and more convenient.

## Architecture

MenuExpress Kiosk is a proposed food-ordering application designed to make ordering meals faster and easier.

### Frontend

The user interface will allow customers to sign in, browse menu items, customize orders, and complete checkout. The interface is currently being designed and prototyped using Figma.

### Backend

The backend will handle customer accounts, menu information, order processing, and communication between the application and the database. Node.js and Express.js are proposed for backend development.

### Database

MongoDB is planned to store customer account information, menu items, orders, and order history.

## Test Plan

The MenuExpress Kiosk application will be tested to make sure it works correctly and provides a smooth ordering experience.

1. Unit Testing

Unit testing will check individual functions of the application to make sure they work correctly.

Examples:

* Verify that the quantity increases when a customer presses the plus button.
* Check that the total price is calculated correctly.
* Verify that menu items display the correct prices.

2. Integration Testing

Integration testing will check whether different parts of the application work together correctly.

Examples:

* Verify that items selected from the menu appear correctly in the shopping cart.
* Check that customer order information is sent to the backend.
* Verify that orders are stored correctly in MongoDB.

Testing Goal

The goal is to identify errors, ensure accurate orders, and provide customers with a reliable ordering experience.

## CI/CD Pipeline

## AI Meal Recommendation

The Django backend provides a Gemini-powered meal recommendation endpoint using the versioned prompt at `menuexpress-backend/prompts/meal_recommendation_v1.txt`. The model defaults to `gemini-3.8-flash`; set `GEMINI_MODEL` to select another supported Gemini generateContent model.

Send a non-empty preference of at most 500 characters:

```http
POST /api/menu/ai-recommendation/
Content-Type: application/json

{"preference": "I want a beef burger"}
```

The response includes `item_names`, `recommendation`, and a `fallback` boolean. Recommendations are checked against currently available database items. When the API key is missing, Gemini is unavailable, or its response is invalid, the backend returns a deterministic database-based fallback. Allergen information may be incomplete or unverified; the feature never treats a recommendation as allergy-safe.

For local use, add the following to the ignored `menuexpress-backend/.env` file and keep the real key private:

```dotenv
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.8-flash
```

Add a repository Actions secret named `GEMINI_API_KEY` under **Settings > Secrets and variables > Actions**. The pull-request Eval job reads this secret; it fails when the key is unavailable, real-model calls fall back, or evaluation thresholds are missed.

From `menuexpress-backend/`, run the mocked unit tests and Django checks with:

```bash
python manage.py test menu.tests --verbosity 2
python manage.py check
```

The isolated golden-dataset suite contains 15 customer preferences and makes real Gemini calls against the available database menu. With a configured MongoDB database populated with menu items and `GEMINI_API_KEY` set, run it with:

```bash
python evaluations/run_eval.py
```

The evaluation uses temperature zero, requires a 100% exact available-item-name pass rate and at least 80% preference consistency, and exits nonzero when thresholds are missed or the API falls back. Prompt version changes should use a new versioned prompt file and update the service/tests deliberately. Prompt injection remains a risk to address in Sprint 4; current prompt instructions and output validation are defense-in-depth, not a complete injection defense.
