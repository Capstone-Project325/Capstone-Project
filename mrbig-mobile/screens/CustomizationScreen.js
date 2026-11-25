
import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

const GREEN = '#008000';

// High-resolution food images
const hdImages = {
  1: require('../assets/food_hd/Burger photo-1.png'),
  2: require('../assets/food_hd/Burger photo.png'),
  3: require('../assets/food_hd/Burger photo-3.png'),
  4: require('../assets/food_hd/Burger photo-2.png'),
  5: require('../assets/food_hd/Burger photo-5.png'),
  6: require('../assets/food_hd/Burger photo-4.png'),

  7: require('../assets/food_hd/Chicken photo-2.png'),
  8: require('../assets/food_hd/Chicken photo-1.png'),
  9: require('../assets/food_hd/Chicken photo.png'),

  10: require('../assets/food_hd/Product photo-3.png'),
  11: require('../assets/food_hd/Product photo-2.png'),
  12: require('../assets/food_hd/Product photo-1.png'),
  13: require('../assets/food_hd/Product photo.png'),

  14: require('../assets/food_hd/Side photo-1.png'),
  15: require('../assets/food_hd/Side photo-2.png'),
  16: require('../assets/food_hd/Side photo.png'),

  17: require('../assets/food_hd/Drink photo.png'),
  18: require('../assets/food_hd/Drink photo-1.png'),
  19: require('../assets/food_hd/Drink photo-2.png'),
  20: require('../assets/food_hd/Drink photo-3.png'),
  21: require('../assets/food_hd/Drink photo-4.png'),
};

// Default ingredients
const ingredients = {
  1: [
    'Beef patty',
    'Melted cheddar',
    'Lettuce',
    'Tomato',
    'Signature sauce',
  ],

  2: [
    'Two beef patties',
    'Crispy bacon',
    'Melted cheddar',
    'Caramelized onions',
  ],

  3: [
    'Beef patty',
    'Melted cheddar',
    'Lettuce',
    'Tomato',
    'Signature sauce',
  ],

  4: [
    'Two beef patties',
    'Melted cheddar',
    'Lettuce',
    'Tomato',
    'Signature sauce',
  ],

  5: [
    'Beef patty',
    'Lettuce',
    'Tomato',
    'Signature sauce',
  ],

  6: [
    'Two beef patties',
    'Lettuce',
    'Tomato',
    'Signature sauce',
  ],

  7: [
    'Crispy chicken',
    'Lettuce',
    'Pickles',
    'Creamy sauce',
  ],

  10: [
    'Veggie patty',
    'Lettuce',
    'Tomato',
    'Signature sauce',
  ],

  11: [
    'Two veggie patties',
    'Melted cheese',
    'Lettuce',
    'Tomato',
    'Signature sauce',
  ],

  12: [
    'Portobello mushroom',
    'Swiss cheese',
    'Garlic aioli',
  ],

  13: [
    'Roasted eggplant',
    'Marinara sauce',
    'Mozzarella',
    'Fresh basil',
  ],
};

// Extra toppings and prices
const commonToppings = [
  { name: 'Extra lettuce', price: 0 },
  { name: 'Extra onion', price: 0 },
  { name: 'Extra tomato', price: 0 },
  { name: 'Extra pickles', price: 0 },
  { name: 'Jalapeños', price: 0.50 },
  { name: 'Mushrooms', price: 0.75 },
  { name: 'Extra cheese', price: 0.75 },
];

const burgerToppings = [
  ...commonToppings,
  { name: 'Extra bacon', price: 1.50 },
  { name: 'Extra beef patty', price: 2.50 },
];

const veggieToppings = [
  ...commonToppings,
  { name: 'Extra veggie patty', price: 2.50 },
];

const chickenToppings = [
  ...commonToppings,
  { name: 'Extra bacon', price: 1.50 },
];

const sauces = [
  'No sauce',
  'Ketchup',
  'BBQ',
  'Honey mustard',
  'Ranch',
  'Buffalo',
  'Signature sauce',
  'Garlic aioli',
];

const additionalSauces = [
  'Ketchup',
  'BBQ',
  'Honey mustard',
  'Ranch',
  'Buffalo',
  'Signature sauce',
  'Garlic aioli',
];

// Default drink preferences
function getDefaultDrinkOptions(id) {
  switch (id) {
    case 17:
      return {
        Milk: 'No milk',
        Sugar: 'No sugar',
        Ice: 'Regular ice',
      };

    case 18:
    case 19:
      return {
        Milk: 'No milk',
        Sugar: 'No sugar',
      };

    case 20:
      return {
        'Whipped cream': 'Keep',
        Marshmallows: 'No marshmallows',
      };

    case 21:
      return {
        Ice: 'Regular ice',
        Lemon: 'No lemon',
      };

    default:
      return {};
  }
}

// Main customization screen
export default function CustomizationScreen({
  item,
  onBack,
  onAddToCart,
  isEditing = false,
}) {
  if (!item) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
          >
            <Ionicons
              name="chevron-back"
              size={25}
              color={GREEN}
            />

            <Text style={styles.backText}>
              {isEditing
                ? 'Back to cart'
                : 'Back to order'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <CustomizationContent
      key={`${item.cartId ?? item.id}-${isEditing}`}
      item={item}
      onBack={onBack}
      onAddToCart={onAddToCart}
      isEditing={isEditing}
    />
  );
}

function CustomizationContent({
  item,
  onBack,
  onAddToCart,
  isEditing = false,
}) {

  // Restore previous quantity
  const [quantity, setQuantity] = useState(
    Math.max(
      1,
      Math.min(99, Number(item.quantity) || 1)
    )
  );

  // Restore removed ingredients
  const [removedIngredients, setRemovedIngredients] =
    useState(
      Array.isArray(item.removedIngredients)
        ? item.removedIngredients
        : []
    );

  // Restore extra toppings
  const [extraToppings, setExtraToppings] =
    useState(
      Array.isArray(item.extraToppings)
        ? item.extraToppings
        : []
    );

  // Restore chicken portion
  const [portion, setPortion] = useState(
    item.portion || item.portions?.[0] || null
  );

  // Restore drink size
  const [size, setSize] = useState(
    item.size || 'Small'
  );

  // Restore dipping sauce
  const [dippingSauce, setDippingSauce] =
    useState(item.dippingSauce || 'No sauce');

  // Restore additional sauces
  const [extraSauces, setExtraSauces] =
    useState(
      Array.isArray(item.extraSauces)
        ? item.extraSauces
        : []
    );

  // Restore salt preference
  const [salt, setSalt] =
    useState(item.salt || 'Regular salt');

  // Restore special instructions
  const [specialRequest, setSpecialRequest] =
    useState(item.specialRequest || '');

  // Restore drink preferences
  const [drinkOptions, setDrinkOptions] =
    useState({
      ...getDefaultDrinkOptions(item.id),
      ...(item.drinkOptions || {}),
    });

  const category = item.category || '';

  const isBurger = category === 'Burger';
  const isVeggie = category === 'Veggie';
  const isChickenSandwich = item.id === 7;

  const isChickenPortion =
    item.id === 8 || item.id === 9;

  const isFries = category === 'Sides';
  const isDrink = category === 'Drinks';

  const hasToppings =
    isBurger || isVeggie || isChickenSandwich;

  const itemIngredients =
    ingredients[item.id] || [];

  const availableToppings = isBurger
    ? burgerToppings
    : isVeggie
      ? (
          item.id === 10 || item.id === 11
            ? veggieToppings
            : commonToppings
        )
      : chickenToppings;

  // Use original base price when editing.
  // Prevents charging for toppings twice.
  let basePrice =
    Number(item.basePrice ?? item.price) || 0;

  if (item.portionPrices && portion) {
    basePrice = Number(
      item.portionPrices[portion] ?? basePrice
    );
  }

  if (item.sizes && size) {
    basePrice = Number(
      item.sizes[size] ?? basePrice
    );
  }

  // Calculate extra topping prices
  const toppingsTotal = extraToppings.reduce(
    (total, topping) =>
      total + (Number(topping.price) || 0),
    0
  );

  // Calculate individual item price
  const unitPrice =
    Math.round(
      (basePrice + toppingsTotal) * 100
    ) / 100;

  // Calculate total based on quantity
  const totalPrice =
    Math.round(unitPrice * quantity * 100) / 100;

  // Keep an ingredient
  const keepIngredient = (ingredient) => {
    setRemovedIngredients((previous) =>
      previous.filter(
        (name) => name !== ingredient
      )
    );
  };

  // Remove an ingredient
  const removeIngredient = (ingredient) => {
    setRemovedIngredients((previous) => {
      if (previous.includes(ingredient)) {
        return previous;
      }

      return [...previous, ingredient];
    });
  };

  // Add or remove an extra topping
  const toggleTopping = (topping) => {
    setExtraToppings((previous) => {
      const exists = previous.some(
        (extra) => extra.name === topping.name
      );

      if (exists) {
        return previous.filter(
          (extra) => extra.name !== topping.name
        );
      }

      return [...previous, topping];
    });
  };

  // Add or remove additional sauce
  const toggleSauce = (sauce) => {
    setExtraSauces((previous) => {
      if (previous.includes(sauce)) {
        return previous.filter(
          (name) => name !== sauce
        );
      }

      return [...previous, sauce];
    });
  };

  // Change drink preference
  const changeDrinkOption = (name, value) => {
    setDrinkOptions((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Add item or save edited item
  const handleAddToOrder = () => {
    const customizedItem = {
      ...item,

      image: hdImages[item.id] || item.image,

      category,

      quantity,

      portion: isChickenPortion
        ? portion
        : null,

      size: isDrink
        ? size
        : null,

      removedIngredients,

      extraToppings,

      dippingSauce: isChickenPortion
        ? dippingSauce
        : null,

      extraSauces,

      salt: isFries
        ? salt
        : null,

      drinkOptions: isDrink
        ? drinkOptions
        : null,

      specialRequest: specialRequest.trim(),

      basePrice,

      unitPrice,

      price: unitPrice,

      totalPrice,
    };

    onAddToCart?.(customizedItem);
  };

  // Reusable option button
  const optionButton = (
    label,
    selected,
    onPress
  ) => (
    <TouchableOpacity
      key={label}
      style={[
        styles.optionButton,
        selected && styles.selectedOption,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.optionText,
          selected && styles.selectedOptionText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Reusable drink option section
  const renderDrinkOption = (
    title,
    options,
    defaultValue
  ) => {
    const selected =
      drinkOptions[title] || defaultValue;

    return (
      <View style={styles.drinkOptionSection}>
        <Text style={styles.optionHeading}>
          {title}
        </Text>

        <View style={styles.optionRow}>
          {options.map((option) =>
            optionButton(
              option,
              selected === option,
              () => changeDrinkOption(title, option)
            )
          )}
        </View>
      </View>
    );
  };

  // Customization section title
  const customizationTitle = isBurger
    ? 'Customize your burger'
    : isVeggie
      ? 'Customize your veggie'
      : isChickenSandwich || isChickenPortion
        ? 'Customize your chicken'
        : isFries
          ? 'Customize your fries'
          : 'Customize your drink';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >

      {/* Fixed back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <Ionicons
            name="chevron-back"
            size={26}
            color={GREEN}
          />

          <Text style={styles.backText}>
            {isEditing
              ? 'Back to cart'
              : `Back to ${category.toLowerCase() || 'order'}`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable customization content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >

        {/* High-resolution food image */}
        <Image
          source={hdImages[item.id] || item.image}
          style={styles.foodImage}
          contentFit="cover"
          transition={150}
          cachePolicy="memory-disk"
        />

        {/* Food name and price */}
        <View style={styles.titleRow}>
          <Text style={styles.foodName}>
            {item.name}
          </Text>

          <Text style={styles.foodPrice}>
            ${unitPrice.toFixed(2)}
          </Text>
        </View>

        <Text style={styles.description}>
          {item.description}
        </Text>

        {/* Ingredient customization */}
        {hasToppings && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {customizationTitle}
            </Text>

            <Text style={styles.sectionDescription}>
              Keep or remove your toppings.
            </Text>

            <View style={styles.customizationBox}>
              {itemIngredients.map(
                (ingredient, index) => {
                  const removed =
                    removedIngredients.includes(
                      ingredient
                    );

                  return (
                    <View
                      key={ingredient}
                      style={[
                        styles.ingredientRow,
                        index ===
                          itemIngredients.length - 1 &&
                          styles.lastRow,
                      ]}
                    >
                      <Text style={styles.ingredientName}>
                        {ingredient}
                      </Text>

                      {index === 0 ? (
                        <Text style={styles.includedText}>
                          Included
                        </Text>
                      ) : (
                        <View style={styles.keepRemoveRow}>
                          {optionButton(
                            'Keep',
                            !removed,
                            () => keepIngredient(ingredient)
                          )}

                          {optionButton(
                            'Remove',
                            removed,
                            () => removeIngredient(ingredient)
                          )}
                        </View>
                      )}
                    </View>
                  );
                }
              )}
            </View>
          </View>
        )}

        {/* Extra toppings */}
        {hasToppings && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Extra toppings
            </Text>

            <Text style={styles.sectionDescription}>
              Make it your own.
            </Text>

            <View style={styles.customizationBox}>
              {availableToppings.map(
                (topping, index) => {
                  const selected =
                    extraToppings.some(
                      (extra) =>
                        extra.name === topping.name
                    );

                  return (
                    <View
                      key={topping.name}
                      style={[
                        styles.ingredientRow,
                        index ===
                          availableToppings.length - 1 &&
                          styles.lastRow,
                      ]}
                    >
                      <View style={styles.toppingInfo}>
                        <Text style={styles.ingredientName}>
                          {topping.name}
                        </Text>

                        <Text style={styles.extraPrice}>
                          {topping.price === 0
                            ? 'Free'
                            : `+$${topping.price.toFixed(2)}`}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.extraButton,
                          selected &&
                            styles.selectedExtraButton,
                        ]}
                        onPress={() =>
                          toggleTopping(topping)
                        }
                      >
                        <Ionicons
                          name={
                            selected
                              ? 'checkmark'
                              : 'add'
                          }
                          size={18}
                          color={
                            selected
                              ? '#FFFFFF'
                              : GREEN
                          }
                        />

                        <Text
                          style={[
                            styles.extraButtonText,
                            selected &&
                              styles.selectedOptionText,
                          ]}
                        >
                          {selected ? 'Added' : 'Add'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                }
              )}
            </View>
          </View>
        )}

        {/* Chicken portion selection */}
        {isChickenPortion && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Choose your portion
            </Text>

            <Text style={styles.sectionDescription}>
              Select how many pieces you want.
            </Text>

            <View style={styles.customizationBox}>
              {item.portions?.map(
                (option, index) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.ingredientRow,
                      index ===
                        item.portions.length - 1 &&
                        styles.lastRow,
                    ]}
                    onPress={() => setPortion(option)}
                  >
                    <View style={styles.radioRow}>
                      <Ionicons
                        name={
                          portion === option
                            ? 'radio-button-on'
                            : 'radio-button-off'
                        }
                        size={23}
                        color={GREEN}
                      />

                      <Text style={styles.ingredientName}>
                        {option}
                      </Text>
                    </View>

                    <Text style={styles.extraPrice}>
                      ${Number(
                        item.portionPrices?.[option] ??
                        basePrice
                      ).toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
        )}

        {/* Chicken dipping sauces */}
        {isChickenPortion && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Choose your dipping sauce
            </Text>

            <View style={styles.customizationBox}>
              <View style={styles.optionRow}>
                {sauces.map((sauce) =>
                  optionButton(
                    sauce,
                    dippingSauce === sauce,
                    () => setDippingSauce(sauce)
                  )
                )}
              </View>
            </View>
          </View>
        )}

        {/* Fries salt customization */}
        {isFries && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Customize your fries
            </Text>

            <Text style={styles.sectionDescription}>
              Choose your salt preference.
            </Text>

            <View style={styles.customizationBox}>
              <View style={styles.optionRow}>
                {[
                  'Regular salt',
                  'Light salt',
                  'No salt',
                ].map((option) =>
                  optionButton(
                    option,
                    salt === option,
                    () => setSalt(option)
                  )
                )}
              </View>
            </View>
          </View>
        )}

        {/* Additional sauces */}
        {!isDrink && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Extra sauces
            </Text>

            <Text style={styles.sectionDescription}>
              Choose your favorite sauces.
            </Text>

            <View style={styles.customizationBox}>
              <View style={styles.optionRow}>
                {additionalSauces.map((sauce) =>
                  optionButton(
                    sauce,
                    extraSauces.includes(sauce),
                    () => toggleSauce(sauce)
                  )
                )}
              </View>
            </View>
          </View>
        )}

        {/* Drink size selection */}
        {isDrink && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Choose your size
            </Text>

            <View style={styles.customizationBox}>
              {Object.entries(
                item.sizes || {}
              ).map(
                ([drinkSize, price], index, array) => (
                  <TouchableOpacity
                    key={drinkSize}
                    style={[
                      styles.ingredientRow,
                      index === array.length - 1 &&
                        styles.lastRow,
                    ]}
                    onPress={() => setSize(drinkSize)}
                  >
                    <View style={styles.radioRow}>
                      <Ionicons
                        name={
                          size === drinkSize
                            ? 'radio-button-on'
                            : 'radio-button-off'
                        }
                        size={23}
                        color={GREEN}
                      />

                      <Text style={styles.ingredientName}>
                        {drinkSize}
                      </Text>
                    </View>

                    <Text style={styles.extraPrice}>
                      ${Number(price).toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
        )}

        {/* Drink customization */}
        {isDrink && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Customize your drink
            </Text>

            <View style={styles.customizationBox}>

              {/* Coffee and tea */}
              {[17, 18, 19].includes(item.id) && (
                <>
                  {renderDrinkOption(
                    'Milk',
                    [
                      'No milk',
                      'Whole milk',
                      'Oat milk',
                      'Almond milk',
                      'Cream',
                    ],
                    'No milk'
                  )}

                  {renderDrinkOption(
                    'Sugar',
                    [
                      'No sugar',
                      '1 sugar',
                      '2 sugars',
                      '3 sugars',
                    ],
                    'No sugar'
                  )}
                </>
              )}

              {/* Iced coffee and soda */}
              {[17, 21].includes(item.id) &&
                renderDrinkOption(
                  'Ice',
                  [
                    'Regular ice',
                    'Light ice',
                    'No ice',
                    'Extra ice',
                  ],
                  'Regular ice'
                )
              }

              {/* Hot chocolate */}
              {item.id === 20 && (
                <>
                  {renderDrinkOption(
                    'Whipped cream',
                    ['Keep', 'Remove'],
                    'Keep'
                  )}

                  {renderDrinkOption(
                    'Marshmallows',
                    ['Add', 'No marshmallows'],
                    'No marshmallows'
                  )}
                </>
              )}

              {/* Soda */}
              {item.id === 21 &&
                renderDrinkOption(
                  'Lemon',
                  ['Add lemon', 'No lemon'],
                  'No lemon'
                )
              }
            </View>
          </View>
        )}

        {/* Special requests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Special requests
          </Text>

          <Text style={styles.sectionDescription}>
            Anything else we should know?
          </Text>

          <TextInput
            style={styles.specialRequestInput}
            placeholder="Add your special instructions..."
            placeholderTextColor="#999999"
            value={specialRequest}
            onChangeText={setSpecialRequest}
            multiline
            maxLength={200}
            textAlignVertical="top"
          />

          <Text style={styles.characterCount}>
            {specialRequest.length}/200
          </Text>
        </View>
      </ScrollView>

      {/* Fixed bottom quantity and button */}
      <View style={styles.bottomContainer}>
        <View style={styles.quantityRow}>
          <Text style={styles.quantityTitle}>
            Quantity
          </Text>

          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                quantity === 1 &&
                  styles.disabledQuantityButton,
              ]}
              disabled={quantity === 1}
              onPress={() =>
                setQuantity((previous) =>
                  Math.max(1, previous - 1)
                )
              }
            >
              <Ionicons
                name="remove"
                size={26}
                color={
                  quantity === 1
                    ? '#9BC99B'
                    : GREEN
                }
              />
            </TouchableOpacity>

            <Text style={styles.quantityNumber}>
              {quantity}
            </Text>

            <TouchableOpacity
              style={[
                styles.quantityButton,
                quantity === 99 &&
                  styles.disabledQuantityButton,
              ]}
              disabled={quantity === 99}
              onPress={() =>
                setQuantity((previous) =>
                  Math.min(99, previous + 1)
                )
              }
            >
              <Ionicons
                name="add"
                size={26}
                color={GREEN}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Add to order or save changes */}
        <TouchableOpacity
          style={styles.addToOrderButton}
          onPress={handleAddToOrder}
          activeOpacity={0.85}
        >
          <Text style={styles.addToOrderText}>
            {isEditing
              ? 'Save changes'
              : 'Add to order'}
          </Text>

          <Text style={styles.addToOrderText}>
            ${totalPrice.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Screen styles
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 18,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
  },

  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: GREEN,
  },

  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },

  foodImage: {
    width: '100%',
    height: 210,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 18,
  },

  foodName: {
    flex: 1,
    fontSize: 25,
    fontWeight: 'bold',
    color: GREEN,
  },

  foodPrice: {
    fontSize: 23,
    fontWeight: 'bold',
    color: GREEN,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#777777',
    marginTop: 10,
  },

  section: {
    marginTop: 26,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GREEN,
    marginBottom: 6,
  },

  sectionDescription: {
    fontSize: 14,
    color: '#888888',
    lineHeight: 20,
    marginBottom: 12,
  },

  customizationBox: {
    backgroundColor: '#F0F6F0',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 8,
    marginTop: 4,
  },

  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#DFE9DF',
    gap: 8,
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  ingredientName: {
    flexShrink: 1,
    fontSize: 15,
    color: '#444444',
  },

  includedText: {
    fontSize: 14,
    color: GREEN,
    fontWeight: '500',
  },

  keepRemoveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 7,
  },

  optionButton: {
    backgroundColor: '#E3EEE3',
    borderRadius: 6,
    paddingHorizontal: 11,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedOption: {
    backgroundColor: GREEN,
  },

  optionText: {
    fontSize: 13,
    fontWeight: '500',
    color: GREEN,
  },

  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  toppingInfo: {
    flex: 1,
    gap: 4,
  },

  extraPrice: {
    fontSize: 13,
    fontWeight: '500',
    color: GREEN,
  },

  extraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3EEE3',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 3,
    minWidth: 75,
  },

  selectedExtraButton: {
    backgroundColor: GREEN,
  },

  extraButtonText: {
    fontSize: 13,
    color: GREEN,
    fontWeight: '600',
  },

  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  drinkOptionSection: {
    paddingVertical: 10,
  },

  optionHeading: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444444',
    marginBottom: 5,
  },

  specialRequestInput: {
    minHeight: 100,
    backgroundColor: '#F5F8F5',
    borderWidth: 1,
    borderColor: '#DCE8DC',
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: '#333333',
  },

  characterCount: {
    fontSize: 11,
    color: '#999999',
    textAlign: 'right',
    marginTop: 5,
  },

  bottomContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingHorizontal: 20,
    paddingTop: 13,
    paddingBottom: 32,
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  quantityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: GREEN,
  },

  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  quantityButton: {
    width: 43,
    height: 43,
    backgroundColor: '#E5F2E5',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledQuantityButton: {
    backgroundColor: '#F2F8F2',
  },

  quantityNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GREEN,
    minWidth: 18,
    textAlign: 'center',
  },

  addToOrderButton: {
    backgroundColor: GREEN,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  addToOrderText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
  },

});
