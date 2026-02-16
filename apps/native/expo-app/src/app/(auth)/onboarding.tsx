import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

import { useAuthStore } from '@/stores/_mock-auth';

export default function OnboardingScreen() {
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome aboard!</Text>
      <Text style={styles.subtitle}>Let's get you set up</Text>
      <View style={styles.button}>
        <Button
          title="Continue"
          onPress={() => {
            completeOnboarding();
            router.replace('/(auth)/(tabs)');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  button: {
    minWidth: 200,
  },
});
