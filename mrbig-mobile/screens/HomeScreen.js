
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ onNavigate, player }) {
 

  const navigate = (screen) => {
    if (onNavigate) {
      onNavigate(screen);
    } else {
      Alert.alert(screen + ' coming soon');
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.videoContainer}>

        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
        />

        <View style={styles.overlay} />

        <View style={styles.header}>
          <Text style={styles.title}>MR. BIG</Text>

          <Text style={styles.subtitle}>
            BIG FLAVOR. BIG SATISFACTION.
          </Text>
        </View>


      </View>

      <View style={styles.bottomNav}>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons
            name="home"
            size={24}
            color="#008000"
          />
          <Text style={styles.activeLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigate('order')}
        >
          <Ionicons
            name="restaurant-outline"
            size={24}
            color="#3CB371"
          />
          <Text style={styles.navLabel}>Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.chatItem}
          onPress={() => navigate('chatbot')}
        >
          <View style={styles.logoCircle}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.chatLogo}
              contentFit="contain"
            />
          </View>

          <Text style={styles.chatLabel}>AI Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigate('rewards')}
        >
          <Ionicons
            name="gift-outline"
            size={24}
            color="#3CB371"
          />
          <Text style={styles.navLabel}>Rewards</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigate('profile')}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color="#3CB371"
          />
          <Text style={styles.navLabel}>Profile</Text>
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

  videoContainer: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },

  video: {
    width: '100%',
    height: '100%',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },

  header: {
    position: 'absolute',
    top: 75,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#008000',
    letterSpacing: 2,
  },

  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#008000',
    marginTop: 5,
  },

  orderButton: {
    position: 'absolute',
    bottom: 35,
    left: 30,
    right: 30,
    backgroundColor: '#008000',
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  orderText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  bottomNav: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5,
  },

  navLabel: {
    fontSize: 11,
    color: '#3CB371',
    marginTop: 5,
  },

  activeLabel: {
    fontSize: 11,
    color: '#008000',
    fontWeight: 'bold',
    marginTop: 5,
  },

  chatItem: {
    flex: 1.2,
    alignItems: 'center',
  },

  logoCircle: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: '#EAF7EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  chatLogo: {
    width: 57,
    height: 57,
  },

  chatLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#008000',
    marginTop: 3,
    marginBottom: 5,
  },
});
