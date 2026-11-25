import React, { useEffect, useState } from 'react';

import {
  StyleSheet,
  View,
  Alert,
} from 'react-native';

import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useVideoPlayer } from 'expo-video';

// Import all screens
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import ChatbotScreen from './screens/ChatbotScreen';
import OrderScreen from './screens/OrderScreen';
import CustomizationScreen from './screens/CustomizationScreen';
import CartScreen from './screens/CartScreen';
import OrderConfirmationScreen from './screens/OrderConfirmationScreen';
import RewardsScreen from './screens/RewardsScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';

// Temporary rewards earning rate
const POINTS_PER_DOLLAR = 10;

// Empty customer information
const EMPTY_USER = {
  fullName: '',
  email: '',
  phone: '',
  birthday: '',
};

export default function App() {

  // Screen navigation
  const [screen, setScreen] = useState('splash');

  // Customer account information
  const [user, setUser] = useState({
    ...EMPTY_USER,
  });

  // Selected food item
  const [selectedItem, setSelectedItem] =
    useState(null);

  // Remember menu category
  const [selectedCategory, setSelectedCategory] =
    useState('Burger');

  // Shopping cart
  const [cart, setCart] = useState([]);

  // Editing existing cart item
  const [editingCartId, setEditingCartId] =
    useState(null);

  // Confirmed order
  const [confirmedOrder, setConfirmedOrder] =
    useState(null);

  // Customer rewards points
  const [rewardPoints, setRewardPoints] =
    useState(0);

  // Calculate cart quantity
  const cartCount = cart.reduce(
    (sum, item) =>
      sum + (Number(item.quantity) || 1),
    0
  );

  // Home background video
  const player = useVideoPlayer(
    require('./assets/home_h264.mov'),
    (player) => {
      player.loop = true;
      player.muted = true;
    }
  );

  // Startup splash animation
  useEffect(() => {

    if (screen !== 'splash') {
      return;
    }

    const timer = setTimeout(() => {
      setScreen('login');
    }, 3500);

    return () => clearTimeout(timer);

  }, [screen]);

  // Checkout splash animation
  useEffect(() => {

    if (screen !== 'checkoutSplash') {
      return;
    }

    const timer = setTimeout(() => {
      setScreen('confirmation');
    }, 3500);

    return () => clearTimeout(timer);

  }, [screen]);

  // Control home video
  useEffect(() => {

    if (screen === 'home') {
      player.play();
    } else {
      player.pause();
    }

  }, [screen, player]);

  // Handle customer login
  const handleLogin = (account) => {

    // Only store non-sensitive account details
    if (account && typeof account === 'object') {

      setUser({
        fullName: account.fullName || '',
        email: account.email || '',
        phone: account.phone || '',
        birthday: account.birthday || '',
      });

    }

    setScreen('home');

  };

  // Handle customer sign-up
  const handleSignUp = () => {

    Alert.alert(
      'Account created!',
      'You can now sign in.'
    );

    setScreen('login');

  };

  // Save updated profile information
  const saveProfile = (updatedUser) => {

    setUser({
      fullName: updatedUser.fullName || '',
      email: updatedUser.email || '',
      phone: updatedUser.phone || '',
      birthday: updatedUser.birthday || '',
    });

    setScreen('profile');

    Alert.alert(
      'Profile updated',
      'Your profile has been updated for this session.'
    );

  };

  // Temporary password update demonstration
  const handleUpdatePassword = async () => {

    Alert.alert(
      'Validation successful',
      'Your password meets the requirements. Actual password changes require backend integration.'
    );

    setScreen('profile');

  };

  // Log out and clear customer session
  const handleLogout = () => {

    setUser({ ...EMPTY_USER });

    setCart([]);

    setRewardPoints(0);

    setConfirmedOrder(null);

    setSelectedItem(null);

    setEditingCartId(null);

    setSelectedCategory('Burger');

    setScreen('login');

  };

  // Open shopping cart
  const openCart = () => {

    setSelectedItem(null);
    setEditingCartId(null);
    setScreen('cart');

  };

  // Main navigation
  const navigate = (destination) => {

    switch (destination) {

      case 'home':
        setSelectedItem(null);
        setEditingCartId(null);
        setScreen('home');
        break;

      case 'order':
        setSelectedItem(null);
        setEditingCartId(null);
        setScreen('order');
        break;

      case 'chatbot':
        setScreen('chatbot');
        break;

      case 'cart':
      case 'checkout':
        openCart();
        break;

      case 'confirmation':
        if (confirmedOrder) {
          setScreen('confirmation');
        }
        break;

      case 'rewards':
        setScreen('rewards');
        break;

      case 'profile':
        setScreen('profile');
        break;

      case 'editProfile':
        setScreen('editProfile');
        break;

      case 'changePassword':
        setScreen('changePassword');
        break;

      case 'logout':
      case 'login':
        handleLogout();
        break;

      default:
        Alert.alert('Coming soon!');

    }

  };

  // Open customization screen
  const selectFood = (item) => {

    if (item.category) {
      setSelectedCategory(item.category);
    }

    setEditingCartId(null);
    setSelectedItem(item);
    setScreen('customization');

  };

  // Return from customization
  const returnFromCustomization = () => {

    if (editingCartId !== null) {
      setScreen('cart');
    } else {
      setScreen('order');
    }

    setSelectedItem(null);
    setEditingCartId(null);

  };

  // Add customized item to cart
  const addToCart = (item) => {

    const quantity =
      Number(item.quantity) || 1;

    const totalPrice = Number(
      item.totalPrice ??
      item.total ??
      (Number(item.unitPrice ?? item.price) * quantity)
    );

    const unitPrice =
      totalPrice / quantity;

    const normalizedItem = {
      ...item,
      quantity,
      unitPrice,
      totalPrice,
    };

    // Update existing cart item
    if (editingCartId !== null) {

      setCart((previousCart) =>
        previousCart.map((cartItem) =>
          cartItem.cartId === editingCartId
            ? {
                ...normalizedItem,
                cartId: editingCartId,
              }
            : cartItem
        )
      );

      setEditingCartId(null);
      setSelectedItem(null);
      setScreen('cart');

      return;

    }

    // Create new cart item
    const newCartItem = {

      ...normalizedItem,

      cartId:
        Date.now().toString() +
        Math.random().toString(36).slice(2),

    };

    setCart((previousCart) => [
      ...previousCart,
      newCartItem,
    ]);

    if (item.category) {
      setSelectedCategory(item.category);
    }

    setSelectedItem(null);
    setEditingCartId(null);
    setScreen('order');

  };

  // Return to menu
  const returnToMenu = () => {

    setSelectedItem(null);
    setEditingCartId(null);
    setScreen('order');

  };

  // Edit existing cart item
  const editCartItem = (item) => {

    // Prevent editing free reward items
    if (item.isReward) {

      Alert.alert(
        'Reward Item',
        'Redeemed rewards come with their standard ingredients and size.'
      );

      return;

    }

    setEditingCartId(item.cartId);

    setSelectedItem({
      ...item,
      price: item.basePrice ?? item.price,
    });

    setScreen('customization');

  };

  // Remove item from cart
  const removeCartItem = (cartId) => {

    const removedItem = cart.find(
      (item) => item.cartId === cartId
    );

    // Refund redeemed reward points
    if (removedItem?.isReward) {

      setRewardPoints((previousPoints) =>
        previousPoints +
        (removedItem.rewardCost || 0)
      );

    }

    setCart((previousCart) =>
      previousCart.filter(
        (item) => item.cartId !== cartId
      )
    );

  };

  // Redeem reward
  const redeemReward = (reward) => {

    if (rewardPoints < reward.points) {

      Alert.alert(
        'Not Enough Points',
        'Keep ordering to unlock this reward!'
      );

      return;

    }

    // Create free reward item
    const rewardItem = {

      ...reward,

      name: reward.name,

      price: 0,

      basePrice: 0,

      unitPrice: 0,

      totalPrice: 0,

      quantity: 1,

      isReward: true,

      rewardCost: reward.points,

      description: 'Free Mr. Big reward',

      removedIngredients: [],

      extraToppings: [],

      extraSauces: [],

      specialRequest: '',

      cartId:
        'reward-' +
        Date.now().toString() +
        Math.random().toString(36).slice(2),

    };

    // Deduct points
    setRewardPoints((previousPoints) =>
      previousPoints - reward.points
    );

    // Add reward to cart
    setCart((previousCart) => [
      ...previousCart,
      rewardItem,
    ]);

    Alert.alert(
      'Reward Redeemed!',
      `${reward.name} has been added to your cart for free.`,
      [
        {
          text: 'Continue',
          style: 'cancel',
        },
        {
          text: 'View Cart',
          onPress: openCart,
        },
      ]
    );

  };

  // Generate order number
  const generateOrderNumber = () => {

    let number;

    do {

      number = Math.floor(
        1000 + Math.random() * 9000
      );

    } while (
      number === confirmedOrder?.orderNumber
    );

    return number;

  };

  // Place order
  const handleCheckout = (order) => {

    if (cart.length === 0) {

      Alert.alert(
        'Empty Cart',
        'Please add an item before placing your order.'
      );

      return;

    }

    const orderNumber = generateOrderNumber();

    // Calculate points from paid items only
    const paidSubtotal = cart.reduce(
      (sum, item) =>
        sum +
        (item.isReward
          ? 0
          : Number(item.totalPrice ?? 0)),
      0
    );

    const earnedPoints = Math.max(
      0,
      Math.floor(
        paidSubtotal * POINTS_PER_DOLLAR + 0.000001
      )
    );

    // Confirm order
    const newOrder = {

      orderNumber,

      items: [...cart],

      subtotal: order.subtotal,

      tax: order.tax,

      total: order.total,

      quantity: cartCount,

      pointsEarned: earnedPoints,

      status: 'Preparing',

      estimatedPickup: '15–20 min',

      createdAt: new Date().toISOString(),

      simulated: true,

    };

    setConfirmedOrder(newOrder);

    // Add earned points
    setRewardPoints((previousPoints) =>
      previousPoints + earnedPoints
    );

    // Clear cart
    setCart([]);

    setSelectedItem(null);

    setEditingCartId(null);

    setSelectedCategory('Burger');

    // Checkout animation
    setScreen('checkoutSplash');

  };

  // Startup splash screen
  if (screen === 'splash') {

    return (

      <View style={styles.container}>

        <StatusBar hidden />

        <Image
          key="startup-splash"
          source={require('./assets/splash.gif')}
          style={styles.splash}
          contentFit="contain"
          autoplay
        />

      </View>

    );

  }

  // Checkout splash screen
  if (screen === 'checkoutSplash') {

    return (

      <View style={styles.container}>

        <StatusBar hidden />

        <Image
          key="checkout-splash"
          source={require('./assets/splash.gif')}
          style={styles.splash}
          contentFit="contain"
          autoplay
        />

      </View>

    );

  }

  return (

    <View style={styles.container}>

      <StatusBar style="dark" />

      {/* Login screen */}
      {screen === 'login' && (

        <LoginScreen
          onSignUp={() => setScreen('signup')}
          onLogin={handleLogin}
        />

      )}

      {/* Sign-up screen */}
      {screen === 'signup' && (

        <SignUpScreen
          onSignIn={() => setScreen('login')}
          onSignUp={handleSignUp}
        />

      )}

      {/* Home screen */}
      {screen === 'home' && (

        <HomeScreen
          player={player}
          onNavigate={navigate}
        />

      )}

      {/* AI Chatbot */}
      {screen === 'chatbot' && (

        <ChatbotScreen
          onBack={() => setScreen('home')}
          onNavigate={navigate}
        />

      )}

      {/* Order screen */}
      {(
        screen === 'order' ||
        screen === 'customization' ||
        screen === 'cart'
      ) && (

        <View
          style={[
            styles.screenContainer,
            screen !== 'order' &&
              styles.hiddenScreen,
          ]}
          pointerEvents={
            screen === 'order'
              ? 'auto'
              : 'none'
          }
        >

          <OrderScreen
            onNavigate={navigate}
            onSelectItem={selectFood}
            onCart={openCart}
            cartCount={cartCount}
            initialCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

        </View>

      )}

      {/* Food customization */}
      {screen === 'customization' &&
        selectedItem && (

        <View style={styles.screenContainer}>

          <CustomizationScreen
            key={
              editingCartId ??
              selectedItem.id
            }
            item={selectedItem}
            onBack={returnFromCustomization}
            onAddToCart={addToCart}
            isEditing={editingCartId !== null}
          />

        </View>

      )}

      {/* Shopping cart */}
      {screen === 'cart' && (

        <View style={styles.screenContainer}>

          <CartScreen
            cart={cart}
            onBack={returnToMenu}
            onEdit={editCartItem}
            onRemove={removeCartItem}
            onCheckout={handleCheckout}
          />

        </View>

      )}

      {/* Order confirmation */}
      {screen === 'confirmation' &&
        confirmedOrder && (

        <View style={styles.screenContainer}>

          <OrderConfirmationScreen
            onNavigate={navigate}
            orderNumber={confirmedOrder.orderNumber}
            order={confirmedOrder}
          />

        </View>

      )}

      {/* Rewards screen */}
      {screen === 'rewards' && (

        <View style={styles.screenContainer}>

          <RewardsScreen
            onNavigate={navigate}
            points={rewardPoints}
            onRedeem={redeemReward}
          />

        </View>

      )}

      {/* Profile screen */}
      {screen === 'profile' && (

        <View style={styles.screenContainer}>

          <ProfileScreen
            user={user}
            onNavigate={navigate}
            onLogout={handleLogout}
          />

        </View>

      )}

      {/* Edit Profile screen */}
      {screen === 'editProfile' && (

        <View style={styles.screenContainer}>

          <EditProfileScreen
            user={user}
            onSave={saveProfile}
            onBack={() => setScreen('profile')}
          />

        </View>

      )}

      {/* Change Password screen */}
      {screen === 'changePassword' && (

        <View style={styles.screenContainer}>

          <ChangePasswordScreen
            onBack={() => setScreen('profile')}
            onUpdatePassword={handleUpdatePassword}
          />

        </View>

      )}

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  splash: {
    width: '100%',
    height: '100%',
  },

  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  hiddenScreen: {
    display: 'none',
  },

});