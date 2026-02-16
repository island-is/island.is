import { Stack, useRouter } from 'expo-router'
import { Button, StyleSheet, Text, View } from 'react-native'

import { useAuthStore } from '@/stores/_mock-auth'

export default function TabOneScreen() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

  return (
    <>
      <Stack.SearchBar
        placement="automatic"
        placeholder="Search"
        onChangeText={() => {}}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Home</Text>

        <View style={styles.button}>
          <Button
            title="Doc"
            onPress={() => {
              router.push('/inbox/123')
            }}
          />
          <Button
            title="Filter"
            onPress={() => {
              router.push('/inbox/filter')
            }}
          />
        </View>
      </View>
    </>
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
    marginBottom: 24,
  },
  button: {
    minWidth: 200,
  },
})
