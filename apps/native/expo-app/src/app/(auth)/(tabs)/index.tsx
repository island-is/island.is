import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

import { useAuthStore } from '@/stores/_mock-auth';

export default function TabOneScreen() {
  const logout = useAuthStore((s) => s.logout);
  const lock = useAuthStore((s) => s.lock);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <View style={styles.button}>
        <Button
          title="Lock"
          onPress={() => {
            lock();
          }}
        />
        <Button
          title="Log out"
          color="#ff3b30"
          onPress={() => {
            logout();
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  button: {
    minWidth: 200,
  },
});
