import { Button, Heading } from '@island.is/island-ui-native';
import React from 'react'
import { SafeAreaView, Image } from 'react-native'
import { Navigation } from 'react-native-navigation';
import logo from '../../assets/logo-island.png';
import { mainRoot } from '../../main';

export const Login = () => {
  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Image source={logo} resizeMode="contain" style={{ width: 45, height: 45, marginBottom: 20 }} />
      <Heading isCenterAligned>Skráðu þig inn í appið með rafrænum skilríkjum</Heading>
      <Button title="Auðkenna" onPress={() => Navigation.setRoot(mainRoot)} />
    </SafeAreaView>
  )
}

Login.options = {
  topBar: {
    title: {
      text: 'Login'
    }
  }
};
