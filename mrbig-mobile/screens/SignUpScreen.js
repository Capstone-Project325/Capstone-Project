
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';

export default function SignUpScreen({ onSignIn, onSignUp }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Please complete all fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match.');
      return;
    }

    onSignUp?.();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create an account</Text>

        <Text style={styles.subtitle}>
          Join Mr. Big and enjoy delicious rewards.
        </Text>

        <Text style={styles.label}>Full name</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Email</Text>

        <TextInput
          style={styles.input}
          placeholder="name@example.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Password</Text>

        <View style={styles.passwordBox}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Create a password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.link}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm password</Text>

        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonText}>Create account</Text>
        </TouchableOpacity>

        <View style={styles.signinRow}>
          <Text style={styles.accountText}>
            Already have an account?
          </Text>

          <TouchableOpacity onPress={onSignIn}>
            <Text style={styles.link}> Sign in</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          contentFit="contain"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 85,
    paddingBottom: 30,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#008000',
  },

  subtitle: {
    fontSize: 14,
    color: '#63936B',
    marginTop: 8,
    marginBottom: 30,
  },

  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#448B55',
    marginBottom: 8,
  },

  input: {
    height: 52,
    backgroundColor: '#F5F7F6',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 18,
    fontSize: 16,
  },

  passwordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F6',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 52,
    marginBottom: 18,
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
  },

  link: {
    color: '#3CB371',
    fontWeight: '600',
    fontSize: 13,
  },

  button: {
    backgroundColor: '#3CB371',
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  signinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  accountText: {
    color: '#777777',
    fontSize: 13,
  },

  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 15,
  },
});
