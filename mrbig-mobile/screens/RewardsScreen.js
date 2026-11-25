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

// Rewards from Figma design
const rewards = [
  {
    id: 17,
    name: 'Iced Coffee: Large',
    points: 200,
    category: 'Drinks',
    size: 'Large',
    image: require('../assets/food/image-container-13.png'),
  },
  {
    id: 16,
    name: 'Fries: Large',
    points: 300,
    category: 'Sides',
    image: require('../assets/food/image-container-12.png'),
  },
  {
    id: 1,
    name: 'Mr. Big',
    points: 500,
    category: 'Burger',
    image: require('../assets/food/image-container-1.png'),
  },
  {
    id: 2,
    name: 'Double Mr. Big',
    points: 700,
    category: 'Burger',
    image: require('../assets/food/image-container-2.png'),
  },
  {
    id: 12,
    name: 'Mushroom Swiss',
    points: 900,
    category: 'Veggie',
    image: require('../assets/food/image-container-20.png'),
  },
  {
    id: 7,
    name: "Cluckin' Classic",
    points: 1200,
    category: 'Chicken',
    image: require('../assets/food/image-container-5.png'),
  },
];

export default function RewardsScreen({
  onNavigate,
  points = 0,
  onRedeem,
}) {

  // Find the next available reward
  const nextReward = rewards.find(
    (reward) => reward.points > points
  );

  const targetPoints =
    nextReward?.points ?? 1200;

  const remainingPoints = Math.max(
    0,
    targetPoints - points
  );

  // Calculate progress bar percentage
  const progress = Math.min(
    100,
    Math.max(0, (points / targetPoints) * 100)
  );

  // Redeem reward
  const redeemReward = (reward) => {

    if (points < reward.points) {
      return;
    }

    Alert.alert(
      'Redeem Reward',
      `Redeem ${reward.name} for ${reward.points} points?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Redeem',
          onPress: () => {

            if (onRedeem) {
              onRedeem(reward);
            } else {
              Alert.alert(
                'Rewards',
                'Redemption is not connected yet.'
              );
            }

          },
        },
      ]
    );

  };

  // Bottom navigation
  const navButton = (
    icon,
    label,
    destination,
    active = false
  ) => (

    <TouchableOpacity
      style={styles.navButton}
      onPress={() => {

        if (destination !== 'rewards') {
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

      {/* Fixed header */}
      <View style={styles.header}>

        <Text style={styles.headerTitle}>
          Rewards
        </Text>

      </View>

      {/* Scrollable rewards content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Points balance card */}
        <View style={styles.balanceCard}>

          <View style={styles.balanceHeader}>

            <Text style={styles.balanceLabel}>
              Your points balance
            </Text>

            <Text style={styles.brandName}>
              MR. BIG
            </Text>

          </View>

          {/* Current points */}
          <View style={styles.pointsRow}>

            <Text style={styles.pointsNumber}>
              {points.toLocaleString()}
            </Text>

            <Text style={styles.pointsUnit}>
              pts
            </Text>

          </View>

          {/* Progress information */}
          <View style={styles.progressHeader}>

            <Text style={styles.remainingPoints}>
              {nextReward
                ? `${remainingPoints.toLocaleString()} pts to your next reward`
                : 'All rewards unlocked!'}
            </Text>

            <Text style={styles.progressNumbers}>
              {points.toLocaleString()} /{' '}
              {targetPoints.toLocaleString()}
            </Text>

          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>

            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                },
              ]}
            />

          </View>

          {/* Next reward */}
          <Text style={styles.nextReward}>
            {nextReward
              ? `Next up: ${nextReward.name}`
              : 'Enjoy your rewards!'}
          </Text>

        </View>

        {/* Rewards section heading */}
        <Text style={styles.sectionTitle}>
          Your next big bite
        </Text>

        <Text style={styles.sectionSubtitle}>
          Turn your points into your favourites.
        </Text>

        {/* All six rewards */}
        {rewards.map((reward) => {

          const unlocked =
            points >= reward.points;

          const pointsNeeded = Math.max(
            0,
            reward.points - points
          );

          return (

            <View
              key={reward.id}
              style={styles.rewardCard}
            >

              {/* Reward image */}
              <Image
                source={reward.image}
                style={styles.rewardImage}
                contentFit="cover"
                cachePolicy="memory-disk"
              />

              {/* Reward information */}
              <View style={styles.rewardInfo}>

                <Text style={styles.rewardName}>
                  {reward.name}
                </Text>

                <Text style={styles.rewardPoints}>
                  {reward.points.toLocaleString()} points
                </Text>

                <View style={styles.rewardBottomRow}>

                  <Text style={styles.rewardStatus}>
                    {unlocked
                      ? 'Ready to enjoy'
                      : `${pointsNeeded.toLocaleString()} pts to go`}
                  </Text>

                  {/* Redeem or Locked button */}
                  <TouchableOpacity
                    disabled={!unlocked}
                    activeOpacity={0.8}
                    style={[
                      styles.redeemButton,
                      !unlocked &&
                        styles.lockedButton,
                    ]}
                    onPress={() =>
                      redeemReward(reward)
                    }
                  >

                    <Text
                      style={[
                        styles.redeemButtonText,
                        !unlocked &&
                          styles.lockedButtonText,
                      ]}
                    >

                      {unlocked
                        ? 'Redeem'
                        : 'Locked'}

                    </Text>

                  </TouchableOpacity>

                </View>

              </View>

            </View>

          );

        })}

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
          'order'
        )}

        {/* Mr. Big AI Chatbot */}
        <TouchableOpacity
          style={styles.chatbotButton}
          onPress={() =>
            onNavigate?.('chatbot')
          }
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
          'rewards',
          true
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: GREEN,
  },

  // Scrollable content
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  // Points balance card
  balanceCard: {
    backgroundColor: '#F0F7EE',
    borderRadius: 16,
    padding: 18,
    marginBottom: 26,
  },

  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  balanceLabel: {
    fontSize: 14,
    color: '#777777',
  },

  brandName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: GREEN,
  },

  pointsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 10,
    marginBottom: 12,
    gap: 8,
  },

  pointsNumber: {
    fontSize: 40,
    fontWeight: 'bold',
    color: GREEN,
  },

  pointsUnit: {
    fontSize: 17,
    color: '#777777',
  },

  // Progress bar
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },

  remainingPoints: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: GREEN,
  },

  progressNumbers: {
    fontSize: 12,
    color: '#777777',
  },

  progressTrack: {
    height: 8,
    borderRadius: 5,
    backgroundColor: '#DCE8D8',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: GREEN,
    borderRadius: 5,
  },

  nextReward: {
    fontSize: 13,
    color: '#777777',
    marginTop: 12,
  },

  // Section heading
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: GREEN,
    marginBottom: 6,
  },

  sectionSubtitle: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 16,
  },

  // Reward cards
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },

  rewardImage: {
    width: 85,
    height: 85,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },

  rewardInfo: {
    flex: 1,
  },

  rewardName: {
    fontSize: 16,
    fontWeight: '600',
    color: GREEN,
    marginBottom: 5,
  },

  rewardPoints: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 8,
  },

  rewardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },

  rewardStatus: {
    flex: 1,
    fontSize: 11,
    color: '#888888',
  },

  // Redeem button
  redeemButton: {
    backgroundColor: GREEN,
    borderRadius: 8,
    paddingHorizontal: 13,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  redeemButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Locked rewards
  lockedButton: {
    backgroundColor: '#EDF3EA',
  },

  lockedButtonText: {
    color: '#82977D',
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