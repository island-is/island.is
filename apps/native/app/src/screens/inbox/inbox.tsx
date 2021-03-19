import React from 'react'
import { SafeAreaView, StatusBar, Text } from 'react-native'
import { useAuthStore } from '../../auth/auth'

export const Inbox = () => {
  const { authorizeResult } = useAuthStore();

  console.log({authorizeResult});

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text>Inbox</Text>
      </SafeAreaView>
    </>
  )
}

Inbox.options = {
  topBar: {
    title: {
      text: 'Inbox'
    }
  }
};
