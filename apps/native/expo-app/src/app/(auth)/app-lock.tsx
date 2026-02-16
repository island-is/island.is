import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

import { useAuthStore } from '@/stores/_mock-auth';

export default function AppLockScreen() {
  const unlock = useAuthStore((s) => s.unlock);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔒</Text>
      <Text style={styles.title}>App Locked</Text>
      <Text style={styles.subtitle}>The app was moved to the background</Text>
      <View style={styles.button}>
        <Button
          title="Dismiss"
          onPress={() => {
            unlock();
            router.back();
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
  icon: {
    fontSize: 64,
    marginBottom: 16,
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
