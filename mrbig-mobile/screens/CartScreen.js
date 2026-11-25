
import React from 'react';

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
const TAX_RATE = 0.08;

const money = (amount) =>
  `$${Number(amount).toFixed(2)}`;

export default function CartScreen({
  cart = [],
  onBack,
  onEdit,
  onRemove,
  onCheckout,
}) {

  // Calculate item quantity
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Calculate subtotal
  const subtotal = Math.round(
    cart.reduce(
      (total, item) =>
        total + item.totalPrice,
      0
    ) * 100
  ) / 100;

  // Calculate estimated tax
  const tax =
    Math.round(subtotal * TAX_RATE * 100)
    / 100;

  // Calculate final total
  const total =
    Math.round((subtotal + tax) * 100)
    / 100;

  // Remove item confirmation
  const confirmRemove = (item) => {

    Alert.alert(
      'Remove item?',
      `Remove ${item.name} from your order?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () =>
            onRemove?.(item.cartId),
        },
      ]
    );
  };

  // Display customization details
  const getCustomizations = (item) => {

    const details = [];

    // Chicken portions
    if (item.portion) {
      details.push(
        `Portion: ${item.portion}`
      );
    }

    // Drink sizes
    if (item.size) {
      details.push(
        `Size: ${item.size}`
      );
    }

    // Removed ingredients
    if (item.removedIngredients?.length) {
      details.push(
        `Remove: ${item.removedIngredients.join(', ')}`
      );
    }

    // Extra toppings
    if (item.extraToppings?.length) {

      item.extraToppings.forEach(
        (topping) => {

          details.push(
            topping.price > 0
              ? `${topping.name} (+${money(topping.price)})`
              : `${topping.name} (Free)`
          );

        }
      );
    }

    // Dipping sauce
    if (item.dippingSauce) {
      details.push(
        `Dipping sauce: ${item.dippingSauce}`
      );
    }

    // Additional sauces
    if (item.extraSauces?.length) {
      details.push(
        `Extra sauces: ${item.extraSauces.join(', ')}`
      );
    }

    // Fries salt preference
    if (item.salt) {
      details.push(
        `Salt: ${item.salt}`
      );
    }

    // Drink customization defaults
    let drinkDefaults = {};

    if ([17, 18, 19].includes(item.id)) {
      drinkDefaults = {
        Milk: 'No milk',
        Sugar: 'No sugar',
      };
    }

    if ([17, 21].includes(item.id)) {
      drinkDefaults.Ice = 'Regular ice';
    }

    if (item.id === 20) {
      drinkDefaults = {
        'Whipped cream': 'Keep',
        Marshmallows: 'No marshmallows',
      };
    }

    if (item.id === 21) {
      drinkDefaults.Lemon = 'No lemon';
    }

    const drinkOptions = {
      ...drinkDefaults,
      ...(item.drinkOptions || {}),
    };

    Object.entries(drinkOptions).forEach(
      ([name, value]) => {
        details.push(`${name}: ${value}`);
      }
    );

    // Special requests
    if (item.specialRequest) {
      details.push(
        `Special request: ${item.specialRequest}`
      );
    }

    return details;
  };

  // Proceed to checkout
  const handleCheckout = () => {

    if (cart.length === 0) {
      return;
    }

    if (onCheckout) {

      onCheckout({
        items: cart,
        subtotal,
        tax,
        total,
      });

    } else {

      Alert.alert(
        'Order summary',
        `Total: ${money(total)}\nPayment is not connected yet.`
      );

    }
  };

  return (

    <View style={styles.container}>

      {/* Fixed back button */}
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
            Back to menu
          </Text>

        </TouchableOpacity>

      </View>

      {/* Scrollable checkout content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
      >

        <Text style={styles.title}>
          Checkout
        </Text>

        <Text style={styles.itemCount}>
          {cartCount}{' '}
          {cartCount === 1 ? 'item' : 'items'}
          {' '}in your cart
        </Text>

        {/* Add more items button */}
        <TouchableOpacity
          style={styles.addMoreButton}
          onPress={onBack}
        >

          <Text style={styles.addMoreText}>
            Add more items
          </Text>

        </TouchableOpacity>

        {/* Empty shopping cart */}
        {cart.length === 0 && (

          <View style={styles.emptyContainer}>

            <Ionicons
              name="cart-outline"
              size={85}
              color="#A5CDA5"
            />

            <Text style={styles.emptyTitle}>
              Your cart is empty
            </Text>

            <Text style={styles.emptyDescription}>
              Add something delicious to your order!
            </Text>

            <TouchableOpacity
              style={styles.browseButton}
              onPress={onBack}
            >

              <Text style={styles.browseText}>
                Browse menu
              </Text>

            </TouchableOpacity>

          </View>

        )}

        {/* Shopping cart items */}
        {cart.map((item, index) => {

          const customizations =
            getCustomizations(item);

          const unitPrice =
            item.unitPrice ??
            item.totalPrice / item.quantity;

          return (

            <View
              key={item.cartId}
              style={styles.itemCard}
            >

              {/* Item heading and controls */}
              <View style={styles.cardHeader}>

                <Text style={styles.itemLabel}>
                  Item {index + 1}
                </Text>

                <View style={styles.actionButtons}>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      onEdit?.(item)
                    }
                  >

                    <Text style={styles.actionText}>
                      Edit
                    </Text>

                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      confirmRemove(item)
                    }
                  >

                    <Text style={styles.actionText}>
                      Remove
                    </Text>

                  </TouchableOpacity>

                </View>

              </View>

              {/* Food image and details */}
              <View style={styles.foodRow}>

                <Image
                  source={item.image}
                  style={styles.foodImage}
                  contentFit="cover"
                />

                <View style={styles.foodInfo}>

                  <Text style={styles.foodName}>
                    {item.name}
                  </Text>

                  <Text style={styles.foodDetail}>
                    Qty: {item.quantity}
                  </Text>

                  <Text style={styles.foodDetail}>
                    Each{' '}
                    <Text style={styles.priceText}>
                      {money(unitPrice)}
                    </Text>
                  </Text>

                </View>

              </View>

              {/* Customization details */}
              <View style={styles.customizationSection}>

                <Text style={styles.customizationTitle}>
                  Customizations
                </Text>

                {customizations.length === 0 ? (

                  <Text style={styles.customizationText}>
                    No customizations
                  </Text>

                ) : (

                  customizations.map(
                    (detail, detailIndex) => (

                      <Text
                        key={detailIndex}
                        style={
                          styles.customizationText
                        }
                      >
                        {detail}
                      </Text>

                    )
                  )

                )}

              </View>

              {/* Individual item total */}
              <View style={styles.itemTotalRow}>

                <Text style={styles.itemTotalLabel}>
                  Item total
                </Text>

                <Text style={styles.itemTotalPrice}>
                  {money(item.totalPrice)}
                </Text>

              </View>

            </View>

          );

        })}

        {/* Price details */}
        {cart.length > 0 && (

          <View style={styles.priceSection}>

            <Text style={styles.priceHeading}>
              Price details
            </Text>

            <View style={styles.priceRow}>

              <Text style={styles.priceLabel}>
                Subtotal
              </Text>

              <Text style={styles.priceValue}>
                {money(subtotal)}
              </Text>

            </View>

            <View style={styles.priceRow}>

              <Text style={styles.priceLabel}>
                Estimated tax (8%)
              </Text>

              <Text style={styles.priceValue}>
                {money(tax)}
              </Text>

            </View>

            <Text style={styles.taxNote}>
              Tax is estimated and may vary at payment.
            </Text>

          </View>

        )}

      </ScrollView>

      {/* Fixed bottom total button */}
      <View style={styles.bottomContainer}>

        <TouchableOpacity
          style={[
            styles.totalButton,
            cart.length === 0 &&
              styles.disabledButton,
          ]}
          disabled={cart.length === 0}
          onPress={handleCheckout}
          activeOpacity={0.85}
        >

          <Text style={styles.totalText}>
            Total
          </Text>

          <Text style={styles.totalText}>
            {money(total)}
          </Text>

        </TouchableOpacity>

      </View>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
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

  // Scrollable content
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: GREEN,
    marginBottom: 12,
  },

  itemCount: {
    fontSize: 15,
    color: '#888888',
    marginBottom: 15,
  },

  // Add more items
  addMoreButton: {
    borderWidth: 1,
    borderColor: GREEN,
    borderRadius: 9,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  addMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: GREEN,
  },

  // Shopping cart item
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE7DC',
    borderRadius: 15,
    padding: 16,
    marginBottom: 18,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  itemLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: GREEN,
  },

  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  actionButton: {
    borderWidth: 1,
    borderColor: '#DCE7DC',
    borderRadius: 7,
    paddingVertical: 8,
    paddingHorizontal: 13,
  },

  actionText: {
    fontSize: 13,
    fontWeight: '500',
    color: GREEN,
  },

  // Food information
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },

  foodImage: {
    width: 95,
    height: 95,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
  },

  foodInfo: {
    flex: 1,
    gap: 5,
  },

  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: GREEN,
  },

  foodDetail: {
    fontSize: 14,
    color: '#777777',
  },

  priceText: {
    fontWeight: '600',
    color: GREEN,
  },

  // Customizations
  customizationSection: {
    marginTop: 18,
  },

  customizationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: GREEN,
    marginBottom: 7,
  },

  customizationText: {
    fontSize: 14,
    color: '#777777',
    lineHeight: 21,
  },

  // Individual item total
  itemTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EDF1ED',
    marginTop: 20,
    paddingTop: 14,
  },

  itemTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: GREEN,
  },

  itemTotalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GREEN,
  },

  // Price details
  priceSection: {
    marginTop: 8,
    paddingHorizontal: 3,
  },

  priceHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GREEN,
    marginBottom: 18,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  priceLabel: {
    fontSize: 15,
    color: '#777777',
  },

  priceValue: {
    fontSize: 15,
    fontWeight: '600',
    color: GREEN,
  },

  taxNote: {
    fontSize: 12,
    color: '#999999',
    lineHeight: 18,
    marginTop: 3,
  },

  // Empty cart
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 55,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: GREEN,
    marginTop: 18,
  },

  emptyDescription: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },

  browseButton: {
    backgroundColor: GREEN,
    borderRadius: 8,
    paddingHorizontal: 25,
    paddingVertical: 13,
    marginTop: 22,
  },

  browseText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Fixed bottom section
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 32,
  },

  totalButton: {
    backgroundColor: GREEN,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  disabledButton: {
    backgroundColor: '#A5CDA5',
  },

});
