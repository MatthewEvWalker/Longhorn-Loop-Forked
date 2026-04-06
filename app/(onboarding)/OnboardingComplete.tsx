import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OnboardingComplete() {
  const router = useRouter();

  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(24)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslate = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(checkScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
        Animated.timing(checkOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(textTranslate, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(buttonOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(buttonTranslate, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.checkCircle,
            { opacity: checkOpacity, transform: [{ scale: checkScale }] },
          ]}
        >
          <Text style={styles.checkmark}>✓</Text>
        </Animated.View>

        <Animated.Text
          style={[
            styles.title,
            { opacity: textOpacity, transform: [{ translateY: textTranslate }] },
          ]}
        >
          You have completed onboarding and are ready to explore all events!
        </Animated.Text>

        <Animated.Text
          style={[
            styles.subtitle,
            { opacity: textOpacity, transform: [{ translateY: textTranslate }] },
          ]}
        >
          Welcome to Longhorn Loop 🤘
        </Animated.Text>

        <Animated.View
          style={[
            styles.buttonWrapper,
            { opacity: buttonOpacity, transform: [{ translateY: buttonTranslate }] },
          ]}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/(tabs)/home')}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>GO TO HOME PAGE</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    gap: 20,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  checkmark: {
    fontSize: 48,
    color: '#1f2937',
    lineHeight: 56,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#BF5700',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 1,
  },
});
