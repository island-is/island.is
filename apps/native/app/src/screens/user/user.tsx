import { Heading } from '@island.is/island-ui-native';
import React from 'react'
import { SafeAreaView, StatusBar, Text } from 'react-native'

export const User = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <Heading>User</Heading>
      </SafeAreaView>
    </>
  )
}

User.options = {
  topBar: {
    title: {
      text: 'User'
    }
  }
};
