import { Container, Heading } from '@island.is/island-ui-native';
import React from 'react'
import { Button, SafeAreaView, StatusBar, Text } from 'react-native'
import { Navigation } from 'react-native-navigation';
import { useNavigation, showModal } from 'react-native-navigation-hooks';
import { useAuthStore } from '../../auth/auth';

export const User = () => {
  const authStore = useAuthStore();
  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Container>
        <Heading>{authStore.userInfo?.name}</Heading>
        <Text>Kt. {authStore.userInfo?.nationalId}</Text>
      </Container>
    </SafeAreaView>
  )
}
