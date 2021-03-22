import { Heading } from '@island.is/island-ui-native';
import React from 'react'
import { Button, SafeAreaView, StatusBar } from 'react-native'
import { Navigation } from 'react-native-navigation';
import { useNavigation, showModal } from 'react-native-navigation-hooks';

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
        <Button title="Storybook" onPress={() => {
          showModal('is.island.StorybookScreen')
        }} />
      </SafeAreaView>
    </>
  )
}
