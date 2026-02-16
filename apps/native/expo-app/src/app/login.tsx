import { Redirect } from 'expo-router'
import { Button, StyleSheet, Text, View } from 'react-native'

import { useAuthStore } from '@/stores/_mock-auth'
import { Badge } from '@/ui/lib/badge/badge'
import { Typography } from '../ui/lib/typography/typography'

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) {
    return <Redirect href="/(auth)/(tabs)" />
  }

  return (
    <View
      style={[
        styles.container,
      ]}
    >
      <Typography variant="heading1">
        Login
      </Typography>
      <Badge title="Hello world" variant="blue" />
      <Text style={styles.subtitle}>Please log in to continue</Text>
      <View style={styles.button}>
        <Button
          title="Log in"
          onPress={() => {
            login()
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
