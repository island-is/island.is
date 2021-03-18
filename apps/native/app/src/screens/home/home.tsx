import React from 'react'
import { SafeAreaView, StatusBar, Image } from 'react-native'
import { Button, Heading } from '@island.is/island-ui-native'
import { WebView } from 'react-native-webview'
import logo from '../../assets/logo-island.png';

export const Home = () => {
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
        <Heading isCenterAligned>Skráðu þig inn í appið með rafrænum skilríkjum</Heading>
        <Button title="Auðkenna" onPress={() => console.log('on press')} />
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
