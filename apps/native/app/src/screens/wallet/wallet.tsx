import { Heading } from '@island.is/island-ui-native';
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
        }}
      >
        <Heading>Wallet</Heading>
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
