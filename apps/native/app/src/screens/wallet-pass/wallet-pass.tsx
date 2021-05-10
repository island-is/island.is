import React from 'react'
import { Container } from '@island.is/island-ui-native'
import { SafeAreaView, Text, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { gql, useQuery } from '@apollo/client'
import { client } from '../../graphql/client'
import { useScreenOptions } from '../../contexts/theme-provider'

export const WalletPassScreen: NavigationFunctionComponent<{ id: string }> = ({
  id,
}) => {
  const res = useQuery(
    gql`
      query getLicense($id: ID!) {
        License(id: $id) @client {
          id
          title
          serviceProvider
          type
        }
      }
    `,
    {
      client,
      variables: {
        id,
      },
    },
  )

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <Container>
          <Text>{res.data?.License?.title}</Text>
          <Text>Útgefandi: {res.data.License?.serviceProvider}</Text>
        </Container>
      </SafeAreaView>
      <SafeAreaView
        style={{
          width: '100%',
          height: 130,
          position: 'absolute',
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: 'white',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            paddingHorizontal: 32,
            paddingTop: 32,
            paddingBottom: 16,
          }}
        >
          <Text>Í gildi</Text>
          <View style={{ flex: 1 }} />
          <Text>14.2.2021 kl. 15:33</Text>
        </View>
        <View
          style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 32 }}
        >
          <Text>kóði</Text>
          <View style={{ flex: 1 }} />
          <View
            style={{
              borderColor: 'blue',
              borderWidth: 1,
              borderRadius: 4,
              padding: 4,
            }}
          >
            <Text>Uppfæra</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}

WalletPassScreen.options = {
  topBar: {
    visible: false,
  },
}
