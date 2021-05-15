import { gql, useQuery } from '@apollo/client'
import { LicenceCard } from '@island.is/island-ui-native'
import React from 'react'
import { Platform, SafeAreaView, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import PassKit, { AddPassButton } from 'react-native-passkit-wallet'
import styled from 'styled-components/native'
import agencyLogo from '../../assets/temp/agency-logo.png'
import { Skeleton } from '../../components/skeleton/skeleton'
import { client } from '../../graphql/client'
import { createNavigationTitle } from '../../utils/create-navigation-title'

const FieldHost = styled.View<{ compact?: boolean }>`
  ${(props) => (props.compact ? '' : 'flex: 1;')}
`

const FieldContent = styled.View`
  padding-bottom: 20px;
`

const FieldLabel = styled.Text`
  font-family: 'IBMPlexSans';
  font-size: 13px;
  line-height: 17px;
  color: ${(props) => props.theme.shade.foreground};
  margin-bottom: 8px;
`

const FieldValue = styled.Text<{ size?: 'large' | 'small' }>`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: ${(props) => (props.size === 'large' ? 20 : 16)}px;
  line-height: ${(props) => (props.size === 'large' ? 26 : 20)}px;
  color: ${(props) => props.theme.shade.foreground};
`

const FieldRow = styled.View<{ alignLeft?: boolean }>`
  flex-direction: row;
  /* justify-content: flex-start;
  align-items: flex-start; */
`

const FieldGroup = styled.View`
  margin-top: 24px;
  padding-bottom: 4px;
  border-bottom-color: ${(props) =>
    props.theme.isDark
      ? props.theme.shade.shade500
      : props.theme.color.blue200};
  border-bottom-width: 1px;
`

interface FieldCardProps {
  code?: string
  title: string
  children: React.ReactNode
}

const FieldCardHost = styled.View`
  border-width: 1px;
  border-color: ${(props) =>
    props.theme.isDark
      ? props.theme.shade.shade500
      : props.theme.color.blue200};
  border-radius: 16px;
  margin-top: 8px;
  margin-bottom: 8px;
`

const FieldCardHeader = styled.View`
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) =>
    props.theme.isDark
      ? props.theme.shade.shade500
      : props.theme.color.blue200};
  padding: 16px;
`

const FieldCardHeaderText = styled.Text`
  font-family: 'IBMPlexSans';
  font-size: 16px;
  line-height: 20px;
  color: ${(props) => props.theme.shade.foreground};
  padding-right: 4px;
`

function FieldCard(props: FieldCardProps) {
  return (
    <FieldCardHost>
      <FieldCardHeader>
        <FieldCardHeaderText style={{ fontFamily: 'IBMPlexSans-Bold' }}>
          {props.code}
        </FieldCardHeaderText>
        <FieldCardHeaderText>{props.title}</FieldCardHeaderText>
      </FieldCardHeader>
      <View style={{ padding: 16, paddingBottom: 0 }}>{props.children}</View>
    </FieldCardHost>
  )
}

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

function Field({
  label,
  value,
  loading,
  compact,
  size = 'small',
  style,
}: {
  label: string
  value?: string
  loading?: boolean
  compact?: boolean
  size?: 'large' | 'small'
  style?: any
}) {
  return (
    <FieldHost compact={compact} style={style}>
      <FieldContent>
        <FieldLabel>{label}</FieldLabel>
        {loading ? (
          <Skeleton active />
        ) : (
          <FieldValue size={size}>{value ?? ''}</FieldValue>
        )}
      </FieldContent>
    </FieldHost>
  )
}

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
              console.log('onPress')
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
