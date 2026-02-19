import { useRouter } from 'expo-router'
import { Button, StyleSheet, Text, View } from 'react-native'

import { authStore, useAuthStore } from '@/stores/auth-store'

export default function HomeScreen() {
  const router = useRouter()
  const userInfo = useAuthStore((s) => s.userInfo)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      {userInfo && (
        <Text style={styles.subtitle}>Welcome, {userInfo.name}</Text>
      )}
      <View style={styles.button}>
        <Button
          title="Lock"
          onPress={() => {
            authStore.setState({
              lockScreenActivatedAt: Date.now() - 86400 * 1000,
            })
            router.push('/app-lock')
          }}
        />
        <Button
          title="Log out"
          color="#ff3b30"
          onPress={async () => {
            await authStore.getState().logout()
            router.replace('/login')
          }}
        />
      </View>
    </View>
  )
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  button: {
    minWidth: 200,
  },
})
