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

export default function ChangePasswordScreen({
  onBack,
  onUpdatePassword,
}) {

  // Password fields
  const [currentPassword, setCurrentPassword] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  // Password visibility
  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [isUpdating, setIsUpdating] =
    useState(false);

  // Validate password information
  const handleUpdate = async () => {

    if (isUpdating) {
      return;
    }

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {

      Alert.alert(
        'Missing information',
        'Please complete all password fields.'
      );

      return;

    }

    if (newPassword.length < 8) {

      Alert.alert(
        'Password too short',
        'Your new password must contain at least 8 characters.'
      );

      return;

    }

    if (newPassword === currentPassword) {

      Alert.alert(
        'Choose a different password',
        'Your new password must be different from your current password.'
      );

      return;

    }

    if (newPassword !== confirmPassword) {

      Alert.alert(
        'Passwords do not match',
        'Please confirm your new password correctly.'
      );

      return;

    }

    // Send password request to backend
    if (!onUpdatePassword) {

      Alert.alert(
        'Password update',
        'Validation passed. Password updating requires backend integration.'
      );

      return;

    }

    try {

      setIsUpdating(true);

      await onUpdatePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error) {

      Alert.alert(
        'Unable to update password',
        'Please check your current password and try again.'
      );

    } finally {

      setIsUpdating(false);

    }

  };

  // Reusable password input
  const passwordField = (
    label,
    value,
    onChange,
    visible,
    setVisible,
    placeholder,
    isCurrent = false
  ) => (

    <View style={styles.inputGroup}>

      <Text style={styles.label}>
        {label}
      </Text>

      <View style={styles.inputContainer}>

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#AAAAAA"
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={
            isCurrent
              ? 'current-password'
              : 'new-password'
          }
          editable={!isUpdating}
        />

        <TouchableOpacity
          style={styles.eyeButton}
          accessibilityLabel={
            visible
              ? `Hide ${label}`
              : `Show ${label}`
          }
          onPress={() => setVisible(!visible)}
        >

          <Ionicons
            name={
              visible
                ? 'eye-off-outline'
                : 'eye-outline'
            }
            size={22}
            color="#777777"
          />

        </TouchableOpacity>

      </View>

    </View>

  );

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
          disabled={isUpdating}
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
          Change password
        </Text>

        <Text style={styles.subtitle}>
          Keep your account secure.
        </Text>

      </View>

      {/* Scrollable password form */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Current password */}
        {passwordField(
          'Current password',
          currentPassword,
          setCurrentPassword,
          showCurrent,
          setShowCurrent,
          'Enter current password',
          true
        )}

        {/* New password */}
        {passwordField(
          'New password',
          newPassword,
          setNewPassword,
          showNew,
          setShowNew,
          'Enter new password'
        )}

        {/* Confirm password */}
        {passwordField(
          'Confirm new password',
          confirmPassword,
          setConfirmPassword,
          showConfirm,
          setShowConfirm,
          'Re-enter new password'
        )}

        {/* Password security information */}
        <View style={styles.securityCard}>

          <Text style={styles.securityTitle}>
            Choose a strong, unique password.
          </Text>

          <Text style={styles.securityText}>
            Your password stays masked for privacy
            unless you choose to reveal it.
          </Text>

          <Text style={styles.securityText}>
            Use at least 8 characters.
          </Text>

        </View>

      </ScrollView>

      {/* Fixed bottom buttons */}
      <View style={styles.footer}>

        <TouchableOpacity
          style={[
            styles.updateButton,
            isUpdating && styles.disabledButton,
          ]}
          activeOpacity={0.8}
          onPress={handleUpdate}
          disabled={isUpdating}
        >

          <Text style={styles.updateButtonText}>
            {isUpdating
              ? 'Updating...'
              : 'Update password'}
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onBack}
          disabled={isUpdating}
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

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: '#E0E5DF',
    borderRadius: 9,
    backgroundColor: '#FAFCFA',
  },

  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
    fontSize: 16,
    color: GREEN,
  },

  eyeButton: {
    paddingHorizontal: 14,
    height: '100%',
    justifyContent: 'center',
  },

  // Security information
  securityCard: {
    backgroundColor: '#F0F7EE',
    borderRadius: 10,
    padding: 16,
    marginTop: 2,
  },

  securityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: GREEN,
    marginBottom: 8,
  },

  securityText: {
    fontSize: 13,
    color: '#777777',
    lineHeight: 20,
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

  updateButton: {
    backgroundColor: GREEN,
    borderRadius: 9,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  updateButtonText: {
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