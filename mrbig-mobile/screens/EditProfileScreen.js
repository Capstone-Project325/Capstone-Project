import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const GREEN = '#008000';

export default function EditProfileScreen({
  user = {},
  onSave,
  onBack,
}) {

  // Existing customer information
  const [fullName, setFullName] = useState(
    user.fullName || ''
  );

  const [email, setEmail] = useState(
    user.email || ''
  );

  const [phone, setPhone] = useState(
    user.phone || ''
  );

  const [birthday, setBirthday] = useState(
    user.birthday || ''
  );

  // Validate and save customer information
  const handleSave = () => {

    if (!fullName.trim()) {

      Alert.alert(
        'Full name required',
        'Please enter your full name.'
      );

      return;

    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {

      Alert.alert(
        'Invalid email',
        'Please enter a valid email address.'
      );

      return;

    }

    if (
      phone.trim() &&
      phone.replace(/\D/g, '').length < 10
    ) {

      Alert.alert(
        'Invalid phone number',
        'Please enter a valid phone number.'
      );

      return;

    }

    // Updated customer information
    const updatedUser = {

      ...user,

      fullName: fullName.trim(),

      email: email.trim(),

      phone: phone.trim(),

      birthday: birthday.trim(),

    };

    // Send updated information to App.js
    if (onSave) {

      onSave(updatedUser);

    } else {

      Alert.alert(
        'Profile',
        'Profile saving is not connected yet.'
      );

    }

  };

  return (

    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >

      {/* Fixed header */}
      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >

          <Ionicons
            name="chevron-back"
            size={21}
            color={GREEN}
          />

          <Text style={styles.backText}>
            Back to profile
          </Text>

        </TouchableOpacity>

        <Text style={styles.title}>
          Edit profile
        </Text>

        <Text style={styles.subtitle}>
          Keep your personal details up to date.
        </Text>

      </View>

      {/* Scrollable form */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Full name */}
        <View style={styles.inputGroup}>

          <Text style={styles.label}>
            Full name
          </Text>

          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            placeholderTextColor="#AAAAAA"
            autoCapitalize="words"
            autoComplete="name"
          />

        </View>

        {/* Email */}
        <View style={styles.inputGroup}>

          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#AAAAAA"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
          />

          <Text style={styles.helperText}>
            Use the email you sign in with.
          </Text>

        </View>

        {/* Phone number */}
        <View style={styles.inputGroup}>

          <Text style={styles.label}>
            Phone number
          </Text>

          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="(555) 000-0000"
            placeholderTextColor="#AAAAAA"
            keyboardType="phone-pad"
            autoComplete="tel"
          />

        </View>

        {/* Birthday */}
        <View style={styles.inputGroup}>

          <Text style={styles.label}>
            Birthday (optional)
          </Text>

          <TextInput
            style={styles.input}
            value={birthday}
            onChangeText={setBirthday}
            placeholder="Month, day, year"
            placeholderTextColor="#AAAAAA"
            autoCapitalize="words"
          />

          <Text style={styles.helperText}>
            Use month, day, and year.
          </Text>

        </View>

      </ScrollView>

      {/* Fixed bottom buttons */}
      <View style={styles.footer}>

        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleSave}
        >

          <Text style={styles.saveButtonText}>
            Save changes
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onBack}
        >

          <Text style={styles.cancelText}>
            Cancel
          </Text>

        </TouchableOpacity>

      </View>

    </KeyboardAvoidingView>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 28,
    backgroundColor: '#FFFFFF',
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 28,
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
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: '#777777',
  },

  // Scrollable form
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },

  inputGroup: {
    marginBottom: 22,
  },

  label: {
    fontSize: 15,
    color: GREEN,
    fontWeight: '500',
    marginBottom: 9,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E0E5DF',
    borderRadius: 9,
    backgroundColor: '#FAFCFA',
    paddingHorizontal: 15,
    fontSize: 16,
    color: GREEN,
  },

  helperText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 9,
  },

  // Fixed footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },

  saveButton: {
    backgroundColor: GREEN,
    borderRadius: 9,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  cancelButton: {
    alignItems: 'center',
    paddingTop: 17,
    paddingBottom: 5,
  },

  cancelText: {
    fontSize: 16,
    color: GREEN,
    fontWeight: '500',
  },

});