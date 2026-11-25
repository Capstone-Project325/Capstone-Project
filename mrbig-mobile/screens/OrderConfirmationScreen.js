import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

const GREEN = '#008000';

export default function OrderConfirmationScreen({
  onNavigate,
  orderNumber,
}) {

  // Generate a temporary order number
  const [generatedNumber] = useState(() =>
    Math.floor(1000 + Math.random() * 9000)
  );

  const confirmationNumber =
    orderNumber ?? generatedNumber;

  return (

    <View style={styles.container}>

      {/* Mr. Big logo */}
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        contentFit="contain"
      />

      <View style={styles.content}>

        {/* Success checkmark */}
        <View style={styles.successCircle}>

          <Ionicons
            name="checkmark"
            size={75}
            color="#FFFFFF"
          />

        </View>

        {/* Confirmation message */}
        <Text style={styles.title}>
          Order Confirmed!
        </Text>

        <Text style={styles.subtitle}>
          Thank you for ordering from Mr. Big!
        </Text>

        <Text style={styles.description}>
          Your order has been placed successfully.
        </Text>

        {/* Order details */}
        <View style={styles.orderCard}>

          <View style={styles.detailRow}>

            <Text style={styles.detailLabel}>
              Order Number
            </Text>

            <Text style={styles.detailValue}>
              #{confirmationNumber}
            </Text>

          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>

            <Text style={styles.detailLabel}>
              Estimated Pickup
            </Text>

            <Text style={styles.detailValue}>
              15–20 min
            </Text>

          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>

            <Text style={styles.detailLabel}>
              Order Status
            </Text>

            <View style={styles.statusBadge}>

              <View style={styles.statusDot} />

              <Text style={styles.statusText}>
                Preparing
              </Text>

            </View>

          </View>

        </View>

        <Text style={styles.message}>
          Big Flavor. Big Satisfaction.
        </Text>

      </View>

      {/* Bottom button */}
      <View style={styles.footer}>

        <TouchableOpacity
          style={styles.homeButton}
          activeOpacity={0.8}
          onPress={() => onNavigate?.('home')}
        >

          <Ionicons
            name="home-outline"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.homeButtonText}>
            Back to Home
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
    paddingTop: 60,
    paddingHorizontal: 24,
  },

  logo: {
    width: 65,
    height: 65,
    alignSelf: 'center',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: GREEN,
    textAlign: 'center',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 21,
  },

  orderCard: {
    width: '100%',
    backgroundColor: '#F1F8F1',
    borderRadius: 16,
    padding: 20,
    marginTop: 30,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },

  detailLabel: {
    fontSize: 14,
    color: '#555555',
    fontWeight: '500',
  },

  detailValue: {
    fontSize: 15,
    color: GREEN,
    fontWeight: 'bold',
  },

  divider: {
    height: 1,
    backgroundColor: '#DCE8DC',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DDF0DD',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: GREEN,
  },

  statusText: {
    color: GREEN,
    fontSize: 12,
    fontWeight: '600',
  },

  message: {
    fontSize: 14,
    fontWeight: '600',
    color: GREEN,
    marginTop: 30,
    textAlign: 'center',
  },

  footer: {
    paddingTop: 15,
    paddingBottom: 40,
  },

  homeButton: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

});