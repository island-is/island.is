import React, { useEffect } from 'react'
import { SafeAreaView, StatusBar, Image } from 'react-native'
import { Button, Heading } from '@island.is/island-ui-native'
import logo from '../../assets/logo-island.png';
import {  useNavigation } from 'react-native-navigation-hooks'

export const Home = () => {
  const { push } = useNavigation()

  return (
    <>
      <StatusBar barStyle="dark-content" />
      {/* <StorybookUIRoot /> */}
      <SafeAreaView
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Image source={logo} resizeMode="contain" style={{ width: 45, height: 45, marginBottom: 20 }} />
        <Heading isCenterAligned>Velkomin!</Heading>
        <Button title="Wallet" onPress={() => {push('is.island.WalletScreen')}} style={{ marginBottom: 15}} />
        <Button title="Inbox" onPress={() => {push('is.island.InboxScreen')}} />
        {/* <WebView
          source={{ uri: 'https://island.is/' }}
          style={{ width: 400, height: 200 }}
        /> */}
      </SafeAreaView>
    </>
  )
}

Home.options = {
  topBar: {
    title: {
      text: 'Home'
    }
  }
};
