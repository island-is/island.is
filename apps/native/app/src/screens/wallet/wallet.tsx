import React from 'react'
import { SafeAreaView, StatusBar, Text, Button } from 'react-native'
import { authorize } from 'react-native-app-auth';
import Keychain from 'react-native-keychain';

export const Wallet = () => {

  const config = {
    issuer: 'https://identity-server.dev01.devland.is',
    clientId: '@island.is-app',
    redirectUrl: 'is.island.app-dev://oauth',
    scopes: ['openid', 'profile', 'offline_access'],
  };

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
          <Button title="Authenticate" onPress={async () => {
            const result = await authorize(config);
            if (result) {
              await Keychain.setGenericPassword('island.is', JSON.stringify(result));
            }
          }} />
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
