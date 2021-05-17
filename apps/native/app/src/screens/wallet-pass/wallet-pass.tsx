import React from 'react'
import { gql, useQuery } from '@apollo/client'
import {
  Field,
  FieldCard,
  FieldGroup,
  FieldLabel,
  FieldRow,
  LicenceCard,
} from '@island.is/island-ui-native'
import { Platform, SafeAreaView, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import PassKit, { AddPassButton } from 'react-native-passkit-wallet'
import styled from 'styled-components/native'
import agencyLogo from '../../assets/temp/agency-logo.png'
import { client } from '../../graphql/client'
import { createNavigationTitle } from '../../utils/create-navigation-title'

const Information = styled.ScrollView`
  flex: 1;
  background-color: ${(props) =>
    props.theme.isDark
      ? props.theme.shade.shade100
      : props.theme.color.blue100};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  margin-top: -70px;
  padding-top: 70px;
  z-index: 10;
`

// Create title options and hook to sync translated title message
const { title, useNavigationTitle } = createNavigationTitle(
  'wallet.screenTitle',
)

export const WalletPassScreen: NavigationFunctionComponent<{
  id: string
  item?: any
}> = ({ id, item, componentId }) => {
  useNavigationTitle(componentId)

  const res = useQuery(
    gql`
      query getLicense($id: ID!) {
        License(id: $id) @client {
          id
          title
          serviceProvider
          type
          status
          dateTime
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

  const data = res.data?.License ?? item

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 140 }} />
      <Information contentInset={{ bottom: 162 }}>
        <SafeAreaView style={{ marginHorizontal: 16 }}>
          <FieldGroup>
            <FieldRow>
              <Field
                compact
                size="large"
                label="2. Eiginnafn"
                value="Svanur"
                style={{ marginRight: 8 }}
              />
              <Field
                compact
                size="large"
                label="1. Kenninafn"
                value="Örn Svanberg"
              />
            </FieldRow>
            <Field label="4d. Kennitala" value="010171-3389" />
          </FieldGroup>
          <FieldGroup>
            <FieldRow>
              <Field label="4a. Útgáfudagur" value="12.03.1990" />
              <Field label="4b. Gildir til" value="01.01.2041" />
              <Field label="5. Númer" value="36001475" />
            </FieldRow>
          </FieldGroup>
          <View style={{ marginTop: 24, paddingBottom: 4 }}>
            <FieldLabel>9. Réttindaflokkar</FieldLabel>
            <FieldCard code="B" title="Fólksbíll">
              <FieldRow>
                <Field label="Útgáfudagur" value="12.03.1990" />
                <Field label="Gildir til" value="01.01.2041" />
              </FieldRow>
            </FieldCard>
            <FieldCard code="BE" title="Kerra">
              <FieldRow>
                <Field label="Útgáfudagur" value="12.03.1990" />
                <Field label="Gildir til" value="01.01.2041" />
              </FieldRow>
            </FieldCard>
          </View>
        </SafeAreaView>
        <View style={{ height: 60 }} />
      </Information>
      <SafeAreaView
        style={{
          marginTop: 16,
          marginHorizontal: 16,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <LicenceCard
          nativeID={`license-${id}_destination`}
          title={data?.title}
          type={data?.type}
          status={data?.status}
          date={data?.dateTime}
          agencyLogo={agencyLogo}
        />
      </SafeAreaView>
      {Platform.OS === 'ios' && (
        <SafeAreaView
          style={{
            position: 'absolute',
            bottom: 24,
            left: 0,
            right: 0,
            marginHorizontal: 16,
            zIndex: 100,
          }}
        >
          <AddPassButton
            style={{ height: 52 }}
            addPassButtonStyle={PassKit.AddPassButtonStyle.black}
            onPress={() => {
              alert('Not implemented yet')
            }}
          />
        </SafeAreaView>
      )}
    </View>
  )
}

WalletPassScreen.options = {
  topBar: {
    title,
    rightButtons: [],
  },
}
