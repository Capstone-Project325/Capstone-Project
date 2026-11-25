
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

export default function LoginScreen({ onSignUp, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password) {
      Alert.alert('Please enter your email and password.');
      return;
    }

    onLogin?.();
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
        <Text style={styles.title}>Welcome back</Text>

        <Text style={styles.subtitle}>
          Sign in to your account to continue.
        </Text>

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

        <View style={styles.passwordHeader}>
          <Text style={styles.label}>Password</Text>

          <TouchableOpacity
            onPress={() =>
              Alert.alert('Password reset will be connected later.')
            }
          >
            <Text style={styles.link}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.passwordBox}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your password"
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

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <View style={styles.signupRow}>
          <Text style={styles.accountText}>
            Don't have an account?
          </Text>

          <TouchableOpacity onPress={onSignUp}>
            <Text style={styles.link}> Sign up</Text>
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
    paddingTop: 100,
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
    marginBottom: 35,
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
    marginBottom: 22,
    fontSize: 16,
  },

  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  passwordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F6',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 52,
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
    marginTop: 28,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  accountText: {
    color: '#777777',
    fontSize: 13,
  },

  logo: {
    width: 230,
    height: 230,
    alignSelf: 'center',
    marginTop: 25,
  },
});
