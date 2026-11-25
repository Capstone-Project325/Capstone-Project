import React, { useState, useRef } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

// Python backend URL
const API_URL =
  process.env.EXPO_PUBLIC_API_URL || '';

const FALLBACK_MESSAGE =
  "I'm having trouble connecting right now. You can still browse our full menu and place an order using the Order tab.";

const WELCOME_MESSAGE =
  "Hey! I'm Mr. Big, your personal food assistant. 🍔 What are you craving today?";

export default function ChatbotScreen({
  onBack,
  onNavigate,
}) {

  const [input, setInput] = useState('');

  const [isLoading, setIsLoading] =
    useState(false);

  const scrollRef = useRef(null);

  const sendingRef = useRef(false);

  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: WELCOME_MESSAGE,
    },
  ]);

  // Suggested customer questions
  const suggestions = [
    'Recommend a burger',
    'Vegetarian options',
    'Best meal under $10',
    'What drinks do you have?',
    'How do rewards work?',
    'Cheapest burger',
    'Recommend a chicken meal',
  ];

  // Reusable Mr. Big avatar
  const renderAvatar = () => (

    <View style={styles.avatarCircle}>

      <Image
        source={require('../assets/logo.png')}
        style={styles.botAvatar}
        contentFit="contain"
      />

    </View>

  );

  // Connect to Python AI backend
  const getAIResponse = async (
    message,
    history
  ) => {

    if (!API_URL) {
      throw new Error('Backend not configured');
    }

    const controller = new AbortController();

    // Request timeout: 20 seconds
    const timeout = setTimeout(() => {
      controller.abort();
    }, 20000);

    try {

      const response = await fetch(
        `${API_URL.replace(/\/$/, '')}/chat`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            message,
            history,
          }),

          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error('AI request failed');
      }

      const data = await response.json();

      // Validate AI response
      if (
        typeof data.reply !== 'string' ||
        !data.reply.trim()
      ) {
        throw new Error('Invalid AI response');
      }

      return {
        text: data.reply.trim(),
        fallback: data.fallback === true,
      };

    } finally {

      clearTimeout(timeout);

    }

  };

  // Send customer message
  const sendMessage = async (message) => {

    const text = message.trim();

    if (!text || sendingRef.current) {
      return;
    }

    sendingRef.current = true;

    // Keep recent conversation history
    const history = messages
      .filter(
        (item) =>
          !item.fallback &&
          item.text !== WELCOME_MESSAGE
      )
      .slice(-10)
      .map((item) => ({
        role:
          item.role === 'bot'
            ? 'assistant'
            : 'user',

        content: item.text,
      }));

    // Display customer message
    setMessages((previous) => [
      ...previous,
      {
        role: 'user',
        text,
      },
    ]);

    setInput('');
    setIsLoading(true);

    try {

      const result = await getAIResponse(
        text,
        history
      );

      // Display AI response
      setMessages((previous) => [
        ...previous,
        {
          role: 'bot',
          text: result.text,
          fallback: result.fallback,
        },
      ]);

    } catch (error) {

      // Safe fallback response
      setMessages((previous) => [
        ...previous,
        {
          role: 'bot',
          text: FALLBACK_MESSAGE,
          fallback: true,
        },
      ]);

    } finally {

      setIsLoading(false);
      sendingRef.current = false;

    }

  };

  // Clear conversation
  const clearChat = () => {

    if (sendingRef.current) {
      return;
    }

    setMessages([
      {
        role: 'bot',
        text: WELCOME_MESSAGE,
      },
    ]);

    setInput('');

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
          onPress={onBack}
          accessibilityLabel="Back to home"
        >

          <Ionicons
            name="chevron-back"
            size={28}
            color="#008000"
          />

        </TouchableOpacity>

        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          contentFit="contain"
        />

        <View style={styles.headerText}>

          <Text style={styles.title}>
            Mr. Big AI
          </Text>

          <Text style={styles.subtitle}>
            Your personal food assistant
          </Text>

        </View>

        {/* Clear chat button */}
        <TouchableOpacity
          style={[
            styles.clearButton,
            isLoading && styles.disabledButton,
          ]}
          onPress={clearChat}
          disabled={isLoading}
          accessibilityLabel="Clear conversation"
        >

          <Ionicons
            name="refresh-outline"
            size={24}
            color="#008000"
          />

        </TouchableOpacity>

      </View>

      {/* Scrollable chat messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.chat}
        contentContainerStyle={styles.chatContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({
            animated: true,
          })
        }
      >

        {messages.map((message, index) => (

          <View
            key={index}
            style={[
              styles.messageRow,
              message.role === 'user'
                ? styles.userRow
                : styles.botRow,
            ]}
          >

            {/* Mr. Big logo beside bot messages */}
            {message.role === 'bot' &&
              renderAvatar()}

            {/* Message bubble */}
            <View
              style={[
                styles.bubble,
                message.role === 'user'
                  ? styles.userBubble
                  : styles.botBubble,
              ]}
            >

              <Text
                style={[
                  styles.messageText,
                  message.role === 'user'
                    ? styles.userText
                    : styles.botText,
                ]}
              >

                {message.text}

              </Text>

              {/* Fallback menu button */}
              {message.fallback && (

                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() =>
                    onNavigate?.('order')
                  }
                >

                  <Ionicons
                    name="restaurant-outline"
                    size={17}
                    color="#FFFFFF"
                  />

                  <Text style={styles.menuButtonText}>
                    Browse menu
                  </Text>

                </TouchableOpacity>

              )}

            </View>

          </View>

        ))}

        {/* AI thinking indicator */}
        {isLoading && (

          <View style={styles.messageRow}>

            {/* Mr. Big logo while thinking */}
            {renderAvatar()}

            <View
              style={[
                styles.bubble,
                styles.botBubble,
                styles.typingBubble,
              ]}
            >

              <ActivityIndicator
                size="small"
                color="#008000"
              />

              <Text style={styles.typingText}>
                Mr. Big is thinking...
              </Text>

            </View>

          </View>

        )}

      </ScrollView>

      {/* Fixed bottom section */}
      <View style={styles.bottomSection}>

        <Text style={styles.suggestionTitle}>
          Suggested questions
        </Text>

        {/* Horizontal suggested questions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={styles.suggestions}
        >

          {suggestions.map((question) => (

            <TouchableOpacity
              key={question}
              style={[
                styles.suggestionButton,
                isLoading &&
                  styles.disabledButton,
              ]}
              disabled={isLoading}
              onPress={() =>
                sendMessage(question)
              }
            >

              <Text style={styles.suggestionText}>
                {question}
              </Text>

            </TouchableOpacity>

          ))}

        </ScrollView>

        {/* Message input */}
        <View style={styles.inputContainer}>

          <TextInput
            style={styles.input}
            placeholder="Ask Mr. Big anything..."
            placeholderTextColor="#999999"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() =>
              sendMessage(input)
            }
            returnKeyType="send"
            maxLength={1000}
          />

          {/* Send button */}
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!input.trim() || isLoading) &&
                styles.disabledButton,
            ]}
            onPress={() =>
              sendMessage(input)
            }
            disabled={
              !input.trim() || isLoading
            }
            accessibilityLabel="Send message"
          >

            <Ionicons
              name="send"
              size={20}
              color="#FFFFFF"
            />

          </TouchableOpacity>

        </View>

        {/* AI disclaimer */}
        <Text style={styles.disclaimer}>
          AI responses may contain mistakes.
          Check the menu for current prices and ingredients.
        </Text>

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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 65,
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },

  logo: {
    width: 55,
    height: 55,
    marginHorizontal: 8,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#008000',
  },

  subtitle: {
    fontSize: 12,
    color: '#3CB371',
    marginTop: 3,
  },

  clearButton: {
    padding: 8,
  },

  // Chat area
  chat: {
    flex: 1,
  },

  chatContent: {
    padding: 18,
    gap: 15,
  },

  // Message alignment
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },

  botRow: {
    justifyContent: 'flex-start',
  },

  userRow: {
    justifyContent: 'flex-end',
  },

  // Mr. Big chatbot avatar
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EAF7EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  botAvatar: {
    width: 32,
    height: 32,
  },

  // Message bubbles
  bubble: {
    maxWidth: '85%',
    flexShrink: 1,
    padding: 14,
    borderRadius: 18,
  },

  botBubble: {
    backgroundColor: '#EAF7EE',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },

  userBubble: {
    backgroundColor: '#3CB371',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },

  botText: {
    color: '#225C35',
  },

  userText: {
    color: '#FFFFFF',
  },

  // Thinking indicator
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  typingText: {
    fontSize: 13,
    color: '#008000',
  },

  // Fallback menu button
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#008000',
    borderRadius: 9,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 12,
    gap: 8,
  },

  menuButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  // Bottom section
  bottomSection: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 35,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },

  suggestionTitle: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 10,
  },

  suggestions: {
    marginBottom: 15,
  },

  suggestionButton: {
    borderWidth: 1,
    borderColor: '#3CB371',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginRight: 8,
  },

  suggestionText: {
    color: '#008000',
    fontSize: 12,
    fontWeight: '500',
  },

  // Message input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F6',
    borderRadius: 30,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
  },

  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
    color: '#222222',
  },

  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#3CB371',
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.5,
  },

  disclaimer: {
    fontSize: 10,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 14,
    marginTop: 10,
  },

});