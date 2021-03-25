import React from 'react'
import { Container, Heading } from '@island.is/island-ui-native'
import { SafeAreaView } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'

export const DocumentDetailScreen: NavigationFunctionComponent = (props: any) => {

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Container>
        <Heading>Nánar um skjal nr:{props?.docId}</Heading>
      </Container>
    </SafeAreaView>
  )
}

DocumentDetailScreen.options = {
  topBar: {
    visible: true,
    title: {
      text: 'Document detail'
    },
    rightButtons: []
  },
}
