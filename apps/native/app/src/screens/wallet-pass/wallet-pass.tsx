import React from 'react'
import { Container, Heading } from '@island.is/island-ui-native'
import { SafeAreaView } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'

export const WalletPassScreen: NavigationFunctionComponent = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Container>
        <Heading>Pass detail</Heading>
      </Container>
    </SafeAreaView>
  )
}

WalletPassScreen.options = {
  topBar: {
    visible: true,
    title: {
      text: 'Wallet pass'
    },
    rightButtons: []
  },
}
