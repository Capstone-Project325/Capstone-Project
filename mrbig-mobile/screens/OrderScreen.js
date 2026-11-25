import React, { useState, useRef } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

const GREEN = '#008000';

const categories = [
  'Burger',
  'Chicken',
  'Veggie',
  'Sides',
  'Drinks',
];

// Complete Mr. Big menu
const menu = {

  // BURGERS
  Burger: [
    {
      id: 1,
      name: 'Mr. Big',
      price: 8.35,
      description:
        'Beef patty, melted cheddar, lettuce, tomato, and our signature sauce.',
      image: require('../assets/food/image-container-1.png'),
    },
    {
      id: 2,
      name: 'Double Mr. Big',
      price: 9.15,
      description:
        'Two beef patties, crispy bacon, melted cheddar, and caramelized onions.',
      image: require('../assets/food/image-container-2.png'),
    },
    {
      id: 3,
      name: 'Cheeseburger Single',
      price: 7.50,
      description:
        'Beef patty, melted cheddar, lettuce, tomato, and our signature sauce.',
      image: require('../assets/food/image-container-1.png'),
    },
    {
      id: 4,
      name: 'Cheeseburger Double',
      price: 8.95,
      description:
        'Two beef patties, melted cheddar, lettuce, tomato, and our signature sauce.',
      image: require('../assets/food/image-container-3.png'),
    },
    {
      id: 5,
      name: 'Hamburger Single',
      price: 6.75,
      description:
        'Beef patty, lettuce, tomato, and our signature sauce.',
      image: require('../assets/food/image-container-1.png'),
    },
    {
      id: 6,
      name: 'Hamburger Double',
      price: 8.10,
      description:
        'Two beef patties, lettuce, tomato, and our signature sauce.',
      image: require('../assets/food/image-container-8.png'),
    },
  ],

  // CHICKEN
  Chicken: [
    {
      id: 7,
      name: "Cluckin' Classic",
      price: 7.95,
      description:
        'Crispy hand-breaded chicken, fresh lettuce, tangy pickles, and creamy sauce.',
      image: require('../assets/food/image-container-5.png'),
    },
    {
      id: 8,
      name: 'Hand-Breaded Tenders',
      price: 4.74,
      description:
        'Tender, juicy chicken strips hand-breaded with our secret herbs and spices.',
      image: require('../assets/food/image-container-6.png'),

      portions: [
        '4 pc',
        '6 pc',
        '10 pc',
        '20 pc',
      ],

      portionPrices: {
        '4 pc': 4.74,
        '6 pc': 5.04,
        '10 pc': 7.14,
        '20 pc': 9.20,
      },
    },
    {
      id: 9,
      name: "Cluckin' Nuggets",
      price: 3.49,
      description:
        'Bite-sized nuggets of 100% chicken breast, cooked to a golden crisp.',
      image: require('../assets/food/image-container-7.png'),

      portions: [
        '4 pc',
        '6 pc',
        '10 pc',
        '20 pc',
      ],

      portionPrices: {
        '4 pc': 3.49,
        '6 pc': 3.79,
        '10 pc': 5.89,
        '20 pc': 7.95,
      },
    },
  ],

  // VEGGIE
  Veggie: [
    {
      id: 10,
      name: 'Veggie Single',
      price: 9.85,
      description:
        'Crispy veggie patty, lettuce, tomato, and signature sauce.',
      image: require('../assets/food/image-container-18.png'),
    },
    {
      id: 11,
      name: 'Veggie Double',
      price: 10.29,
      description:
        'Two veggie patties, melted cheese, lettuce, tomato, and signature sauce.',
      image: require('../assets/food/image-container-19.png'),
    },
    {
      id: 12,
      name: 'Mushroom Swiss',
      price: 11.99,
      description:
        'Grilled portobello mushroom, melted Swiss cheese, and garlic aioli.',
      image: require('../assets/food/image-container-20.png'),
    },
    {
      id: 13,
      name: 'Eggplant Parm',
      price: 11.49,
      description:
        'Roasted eggplant, marinara, melted mozzarella, and fresh basil.',
      image: require('../assets/food/image-container-21.png'),
    },
  ],

  // SIDES
  Sides: [
    {
      id: 14,
      name: 'Fries: Small',
      price: 2.59,
      description:
        'Crinkle-cut fries, golden brown, served hot.',
      image: require('../assets/food/image-container-10.png'),
    },
    {
      id: 15,
      name: 'Fries: Medium',
      price: 3.99,
      description:
        'Crinkle-cut fries, golden brown, served hot.',
      image: require('../assets/food/image-container-11.png'),
    },
    {
      id: 16,
      name: 'Fries: Large',
      price: 4.79,
      description:
        'Crinkle-cut fries, golden brown, served hot.',
      image: require('../assets/food/image-container-12.png'),
    },
  ],

  // DRINKS
  Drinks: [
    {
      id: 17,
      name: 'Iced Coffee',
      price: 2.79,
      description:
        'Refreshing iced coffee, served chilled.',
      image: require('../assets/food/image-container-13.png'),

      sizes: {
        Small: 2.79,
        Medium: 3.19,
        Large: 3.99,
      },
    },
    {
      id: 18,
      name: 'Hot Coffee',
      price: 2.19,
      description:
        'Freshly brewed hot coffee.',
      image: require('../assets/food/image-container-14.png'),

      sizes: {
        Small: 2.19,
        Medium: 2.69,
        Large: 2.99,
      },
    },
    {
      id: 19,
      name: 'Tea',
      price: 2.19,
      description:
        'A warm and refreshing cup of tea.',
      image: require('../assets/food/image-container-15.png'),

      sizes: {
        Small: 2.19,
        Medium: 2.69,
        Large: 2.99,
      },
    },
    {
      id: 20,
      name: 'Hot Chocolate',
      price: 2.19,
      description:
        'Rich and creamy hot chocolate.',
      image: require('../assets/food/image-container-16.png'),

      sizes: {
        Small: 2.19,
        Medium: 2.69,
        Large: 2.99,
      },
    },
    {
      id: 21,
      name: 'Soda',
      price: 1.69,
      description:
        'A refreshing carbonated soft drink.',
      image: require('../assets/food/image-container-17.png'),

      sizes: {
        Small: 1.69,
        Medium: 1.89,
        Large: 2.29,
      },
    },
  ],
};

export default function OrderScreen({
  onNavigate,
  onSelectItem,
  onCart,
  cartCount = 0,
  initialCategory = 'Burger',
  onCategoryChange,
}) {

  const [category, setCategory] = useState(
    categories.includes(initialCategory)
      ? initialCategory
      : 'Burger'
  );

  const [selectedPortions, setSelectedPortions] =
    useState({});

  const scrollRef = useRef(null);

  // Change food category
  const changeCategory = (name) => {

    setCategory(name);

    onCategoryChange?.(name);

    scrollRef.current?.scrollTo({
      y: 0,
      animated: false,
    });
  };

  // Get selected chicken portion
  const getPortion = (item) => {

    if (!item.portions) {
      return null;
    }

    return (
      selectedPortions[item.id] ||
      item.portions[0]
    );
  };

  // Get correct item price
  const getPrice = (item) => {

    if (item.portionPrices) {
      return (
        item.portionPrices[getPortion(item)] ??
        item.price
      );
    }

    return item.price;
  };

  // Update chicken portion
  const changePortion = (itemId, portion) => {

    setSelectedPortions((previous) => ({
      ...previous,
      [itemId]: portion,
    }));
  };

  // Open customization screen
  const selectItem = (item) => {

    const selectedItem = {
      ...item,
      category,
      portion: getPortion(item),
      price: getPrice(item),
    };

    if (onSelectItem) {
      onSelectItem(selectedItem);
    } else {
      Alert.alert(
        'Customize your order',
        item.name
      );
    }
  };

  // Reusable Add button
  const renderAddButton = (item) => (

    <TouchableOpacity
      style={styles.addButton}
      onPress={() => selectItem(item)}
      activeOpacity={0.8}
    >

      <Text style={styles.addButtonText}>
        Add
      </Text>

    </TouchableOpacity>

  );

  // Bottom navigation button
  const navButton = (
    icon,
    label,
    destination,
    active = false
  ) => (

    <TouchableOpacity
      style={styles.navButton}
      onPress={() => {

        if (destination === 'order') {
          changeCategory(category);
        } else {
          onNavigate?.(destination);
        }

      }}
    >

      <Ionicons
        name={icon}
        size={25}
        color={active ? GREEN : '#777777'}
      />

      <Text
        style={[
          styles.navText,
          active && styles.activeNavText,
        ]}
      >
        {label}
      </Text>

    </TouchableOpacity>

  );

  return (

    <View style={styles.container}>

      {/* Fixed top header */}
      <View style={styles.header}>

        <View style={styles.headerRow}>

          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => onNavigate?.('home')}
          >

            <Ionicons
              name="chevron-back"
              size={29}
              color={GREEN}
            />

          </TouchableOpacity>

          {/* Shopping cart */}
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => onCart?.()}
          >

            <Ionicons
              name="cart-outline"
              size={29}
              color={GREEN}
            />

            {/* Cart quantity counter */}
            {cartCount > 0 && (

              <View style={styles.cartBadge}>

                <Text style={styles.cartBadgeText}>
                  {cartCount > 99
                    ? '99+'
                    : cartCount}
                </Text>

              </View>

            )}

          </TouchableOpacity>

        </View>

        {/* Original Order title */}
        <Text style={styles.headerTitle}>
          Order
        </Text>

        {/* Fixed category tabs */}
        <View style={styles.categoryContainer}>

          {categories.map((name) => (

            <TouchableOpacity
              key={name}
              style={styles.categoryButton}
              onPress={() => changeCategory(name)}
            >

              <Text
                style={[
                  styles.categoryText,
                  category === name &&
                    styles.activeCategoryText,
                ]}
              >
                {name}
              </Text>

              <View
                style={[
                  styles.categoryIndicator,
                  category === name &&
                    styles.activeCategoryIndicator,
                ]}
              />

            </TouchableOpacity>

          ))}

        </View>

      </View>

      {/* Scrollable food menu */}
      <ScrollView
        ref={scrollRef}
        style={styles.menuScroll}
        contentContainerStyle={styles.menuContent}
        showsVerticalScrollIndicator={false}
      >

        {menu[category].map((item) => (

          <View
            key={item.id}
            style={styles.foodCard}
          >

            <View style={styles.foodRow}>

              {/* Food image */}
              <TouchableOpacity
                onPress={() => selectItem(item)}
                activeOpacity={0.8}
              >

                <Image
                  source={item.image}
                  style={styles.foodImage}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                />

              </TouchableOpacity>

              {/* Food information */}
              <View style={styles.foodInfo}>

                <Text style={styles.foodName}>
                  {item.name}
                </Text>

                <Text style={styles.foodDescription}>
                  {item.description}
                </Text>

                {/* Regular food price and Add button */}
                {!item.sizes && !item.portions && (

                  <View style={styles.addButtonRow}>

                    <Text style={styles.foodPrice}>
                      ${getPrice(item).toFixed(2)}
                    </Text>

                    {renderAddButton(item)}

                  </View>

                )}

                {/* Drink size prices */}
                {item.sizes && (

                  <>

                    <View style={styles.drinkPrices}>

                      {Object.entries(item.sizes).map(
                        ([size, price]) => (

                          <View
                            key={size}
                            style={styles.drinkPriceRow}
                          >

                            <Text style={styles.drinkSize}>
                              {size}
                            </Text>

                            <Text style={styles.drinkPrice}>
                              ${price.toFixed(2)}
                            </Text>

                          </View>

                        )
                      )}

                    </View>

                    <View style={styles.drinkAddRow}>

                      {renderAddButton(item)}

                    </View>

                  </>

                )}

              </View>

            </View>

            {/* Chicken portion options */}
            {item.portions && (

              <>

                <View style={styles.portionContainer}>

                  {item.portions.map((portion) => (

                    <TouchableOpacity
                      key={portion}
                      style={[
                        styles.portionButton,
                        getPortion(item) === portion &&
                          styles.activePortionButton,
                      ]}
                      onPress={() =>
                        changePortion(
                          item.id,
                          portion
                        )
                      }
                    >

                      <Text
                        style={[
                          styles.portionText,
                          getPortion(item) === portion &&
                            styles.activePortionText,
                        ]}
                      >
                        {portion}
                      </Text>

                    </TouchableOpacity>

                  ))}

                </View>

                {/* Chicken price and Add button */}
                <View style={styles.addButtonRow}>

                  <Text style={styles.foodPrice}>
                    ${getPrice(item).toFixed(2)}
                  </Text>

                  {renderAddButton(item)}

                </View>

              </>

            )}

          </View>

        ))}

      </ScrollView>

      {/* Fixed bottom navigation */}
      <View style={styles.bottomNav}>

        {navButton(
          'home-outline',
          'Home',
          'home'
        )}

        {navButton(
          'restaurant-outline',
          'Order',
          'order',
          true
        )}

        {/* Mr. Big AI Chatbot */}
        <TouchableOpacity
          style={styles.chatbotButton}
          onPress={() => onNavigate?.('chatbot')}
        >

          <View style={styles.chatbotCircle}>

            <Image
              source={require('../assets/logo.png')}
              style={styles.chatbotLogo}
              contentFit="contain"
            />

          </View>

          <Text style={styles.chatbotText}>
            AI Chat
          </Text>

        </TouchableOpacity>

        {navButton(
          'gift-outline',
          'Rewards',
          'rewards'
        )}

        {navButton(
          'person-outline',
          'Profile',
          'profile'
        )}

      </View>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Fixed header
  header: {
    paddingTop: 55,
    backgroundColor: '#FFFFFF',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: GREEN,
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 15,
  },

  // Shopping cart
  cartButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 10,
  },

  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Category tabs
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  categoryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },

  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#777777',
  },

  activeCategoryText: {
    color: GREEN,
    fontWeight: 'bold',
  },

  categoryIndicator: {
    width: 25,
    height: 3,
    borderRadius: 3,
    marginTop: 8,
    backgroundColor: 'transparent',
  },

  activeCategoryIndicator: {
    backgroundColor: GREEN,
  },

  // Scrollable menu
  menuScroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  menuContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 25,
  },

  // Original compact food cards
  foodCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
  },

  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  foodImage: {
    width: 85,
    height: 85,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },

  foodInfo: {
    flex: 1,
  },

  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GREEN,
    marginBottom: 5,
  },

  foodDescription: {
    fontSize: 12,
    color: '#777777',
    lineHeight: 17,
  },

  foodPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GREEN,
  },

  // Chicken portions
  portionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },

  portionButton: {
    flex: 1,
    minWidth: 50,
    backgroundColor: '#EAF5EA',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activePortionButton: {
    backgroundColor: GREEN,
  },

  portionText: {
    fontSize: 12,
    color: GREEN,
    fontWeight: '500',
  },

  activePortionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Drink prices
  drinkPrices: {
    marginTop: 8,
    gap: 4,
  },

  drinkPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  drinkSize: {
    fontSize: 12,
    color: '#555555',
  },

  drinkPrice: {
    fontSize: 12,
    color: GREEN,
    fontWeight: '600',
  },

  drinkAddRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },

  // Price and Add button on same row
  addButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GREEN,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },

  addButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Fixed bottom navigation
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 8,
    paddingBottom: 28,
    paddingHorizontal: 5,
  },

  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  navText: {
    fontSize: 10,
    color: '#777777',
  },

  activeNavText: {
    color: GREEN,
    fontWeight: 'bold',
  },

  // Mr. Big AI Chatbot
  chatbotButton: {
    flex: 1,
    alignItems: 'center',
    marginTop: -23,
  },

  chatbotCircle: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: '#EAF7EE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  chatbotLogo: {
    width: 48,
    height: 48,
  },

  chatbotText: {
    fontSize: 10,
    fontWeight: '600',
    color: GREEN,
    marginTop: 3,
  },

});