import React from 'react'
import { SafeAreaView, StatusBar, Image } from 'react-native'
import { Button, Heading } from '@island.is/island-ui-native'
import logo from '../../assets/logo-island.png';
import {  useNavigation } from 'react-native-navigation-hooks'
import { useAuthStore } from '../../auth/auth';

export const Home = () => {
  const { push } = useNavigation()
  const authStore = useAuthStore();
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
        <Heading isCenterAligned>Velkomin {authStore.userInfo?.name}!</Heading>
        <Button title="Wallet" onPress={() => {push('is.island.WalletScreen')}} style={{ marginBottom: 15}} />
        <Button title="Inbox" onPress={() => {push('is.island.InboxScreen')}} style={{ marginBottom: 15}}  />
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
