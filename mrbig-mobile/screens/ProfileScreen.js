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

export default function ProfileScreen({
  user = {},
  onNavigate,
  onLogout,
}) {

  const details = [
    {
      label: 'Full name',
      value: user.fullName || 'Not provided',
    },
    {
      label: 'Email',
      value: user.email || 'Not provided',
    },
    {
      label: 'Phone number',
      value: user.phone || 'Not provided',
    },
    {
      label: 'Birthday',
      value: user.birthday || 'Not provided',
    },
  ];

  const handleLogout = () => {

    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: () => onLogout?.(),
        },
      ]
    );

  };

  const navButton = (
    icon,
    label,
    destination,
    active = false
  ) => (

    <TouchableOpacity
      style={styles.navButton}
      onPress={() => {
        if (!active) {
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

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate?.('home')}
        >

          <Ionicons
            name="chevron-back"
            size={21}
            color={GREEN}
          />

          <Text style={styles.backText}>
            Back to home
          </Text>

        </TouchableOpacity>

        <Text style={styles.title}>
          Profile
        </Text>

        <Text style={styles.subtitle}>
          Your account, all in one place.
        </Text>

      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Personal details heading */}
        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Personal details
          </Text>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() =>
              onNavigate?.('editProfile')
            }
          >

            <Text style={styles.outlineButtonText}>
              Edit
            </Text>

          </TouchableOpacity>

        </View>

        {/* Customer information */}
        <View style={styles.detailsCard}>

          {details.map((detail, index) => (

            <View
              key={detail.label}
              style={[
                styles.detailRow,
                index !== details.length - 1 &&
                  styles.detailBorder,
              ]}
            >

              <Text style={styles.detailLabel}>
                {detail.label}
              </Text>

              <Text style={styles.detailValue}>
                {detail.value}
              </Text>

            </View>

          ))}

        </View>

        <Text style={styles.optionalText}>
          Your birthday is optional.
        </Text>

        {/* Security section */}
        <Text style={styles.securityTitle}>
          Security
        </Text>

        <View style={styles.securityCard}>

          <View style={styles.passwordInfo}>

            <Text style={styles.detailLabel}>
              Password
            </Text>

            <Text style={styles.passwordDots}>
              ••••••••
            </Text>

            <Text style={styles.privacyText}>
              Your password stays private.
            </Text>

          </View>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() =>
              onNavigate?.('changePassword')
            }
          >

            <Text style={styles.outlineButtonText}>
              Change
            </Text>

          </TouchableOpacity>

        </View>

        {/* Log out button */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}
        >

          <Ionicons
            name="log-out-outline"
            size={22}
            color="#D32F2F"
          />

          <Text style={styles.logoutText}>
            Log out
          </Text>

        </TouchableOpacity>

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
          'rewards'
        )}

        {navButton(
          'person-outline',
          'Profile',
          'profile',
          true
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

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 25,
  },

  backText: {
    fontSize: 15,
    color: GREEN,
    fontWeight: '500',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: GREEN,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#777777',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: GREEN,
  },

  outlineButton: {
    borderWidth: 1,
    borderColor: '#DCE5DA',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },

  outlineButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: GREEN,
  },

  detailsCard: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },

  detailRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  detailBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },

  detailLabel: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 6,
  },

  detailValue: {
    fontSize: 16,
    color: GREEN,
    fontWeight: '500',
  },

  optionalText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 12,
    marginBottom: 25,
  },

  securityTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: GREEN,
    marginBottom: 14,
  },

  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 15,
    padding: 16,
    gap: 10,
  },

  passwordInfo: {
    flex: 1,
  },

  passwordDots: {
    fontSize: 18,
    color: GREEN,
    letterSpacing: 2,
    marginBottom: 5,
  },

  privacyText: {
    fontSize: 11,
    color: '#888888',
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#F0CCCC',
    backgroundColor: '#FFF7F7',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 25,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
  },

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