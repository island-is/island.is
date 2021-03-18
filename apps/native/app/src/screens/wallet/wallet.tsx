import React from 'react'
import { SafeAreaView, StatusBar, Text } from 'react-native'

export const Wallet = () => {
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
        <Text>Wallet</Text>
      </SafeAreaView>
    </>
  )
}

Wallet.options = {
  topBar: {
    title: {
      text: 'Wallet'
    }
  }
};
