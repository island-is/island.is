import React from 'react'
import { SafeAreaView, StatusBar, Image } from 'react-native'
import { Button } from '@island.is/island-ui-native'
import { WebView } from 'react-native-webview'
import logo from './logo.png';
import { Platform } from 'react-native';
import { getStorybookUI, configure, addDecorator } from '@storybook/react-native';


// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({
  host: Platform.OS === 'android' ? '10.0.2.2' : '0.0.0.0',
  asyncStorage: require('@react-native-community/async-storage').default
});

configure(() => {
  require('../../../island-ui/src/lib/Button/Button.stories');
}, module);


const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      {/* <StorybookUIRoot /> */}
      <SafeAreaView
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button>Prufu takki</Button>
        <Image source={logo} resizeMode="contain" style={{ width: 200, height: 200 }} />
        <WebView
          source={{ uri: 'https://island.is/' }}
          style={{ width: 400, height: 200 }}
        />
      </SafeAreaView>
    </>
  )
}

export default App
