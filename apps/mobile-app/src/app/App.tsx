import React from 'react'
import {
  SafeAreaView,
  StatusBar,
} from 'react-native'
import { Button } from '@island.is/island-ui-native'
import { WebView } from 'react-native-webview';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <Button>Prufu takki</Button>
        <WebView source={{ uri: 'https://island.is/' }} style={{ width: 400, height: 200 }} />
      </SafeAreaView>
    </>
  )
}

export default App
