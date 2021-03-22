import { Container, Heading } from '@island.is/island-ui-native';
import React from 'react'
import { SafeAreaView } from 'react-native'

export const User = () => {
  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Container>
        <Heading>User</Heading>
      </Container>
    </SafeAreaView>
  )
}

User.options = {
  topBar: {
    title: {
      text: 'User'
    }
  }
};
