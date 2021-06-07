import { gql, useQuery } from '@apollo/client'
import {
  dynamicColor,
  Field,
  FieldCard,
  FieldGroup,
  FieldLabel,
  FieldRow,
  LicenceCard,
} from '@island.is/island-ui-native'
import React from 'react'
import { Platform, SafeAreaView, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import PassKit, { AddPassButton } from 'react-native-passkit-wallet'
import styled, { useTheme } from 'styled-components/native'
import agencyLogo from '../../assets/temp/agency-logo.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { client } from '../../graphql/client'
import { ILicenseDataField } from '../../graphql/fragments/license.fragment'
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options'
import { FormattedDate } from 'react-intl'

const Information = styled.ScrollView`
  flex: 1;
  background-color: ${dynamicColor(({ theme }) => ({
    dark: theme.shades.dark.shade100,
    light: theme.color.blue100,
  }))};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  margin-top: -70px;
  padding-top: 70px;
  z-index: 10;
`
const {
  useNavigationOptions,
  getNavigationOptions,
} = useThemedNavigationOptions(
  (theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'walletPass.screenTitle' }),
      },
      noBorder: true,
    },
  }),
  {
    topBar: {
      rightButtons: [],
    },
  },
)

const FieldRender = ({ data, level = 1 }: any) => {
  return (
    <>
      {(data || []).map(
        (
          { type, name, label, value, fields }: ILicenseDataField,
          i: number,
        ) => {
          const key = `field-${type}-${i}`

          switch (type) {
            case 'Value':
              if (level === 1) {
                return (
                  <FieldGroup key={key}>
                    <FieldRow>
                      <Field label={label} value={value} />
                    </FieldRow>
                  </FieldGroup>
                )
              } else {
                return <Field key={key} label={label} value={value} />
              }

            case 'Group':
              if (label) {
                return (
                  <View key={key} style={{ marginTop: 24, paddingBottom: 4 }}>
                    <FieldLabel>{label}</FieldLabel>
                    {FieldRender({ data: fields, level: 2 })}
                  </View>
                )
              }
              return (
                <FieldGroup key={key}>
                  <FieldRow>{FieldRender({ data: fields, level: 2 })}</FieldRow>
                </FieldGroup>
              )

            case 'Category':
              return (
                <FieldCard key={key} code={name} title={label}>
                  <FieldRow>{FieldRender({ data: fields, level: 3 })}</FieldRow>
                </FieldCard>
              )

            default:
              return <Field key={key} label={label} value={value} />
          }
        },
      )}
    </>
  )
}

export const WalletPassScreen: NavigationFunctionComponent<{
  id: string
  item?: any
}> = ({ id, item, componentId }) => {
  useNavigationOptions(componentId)
  const theme = useTheme()

  const res = useQuery(
    gql`
      query getLicense($id: ID!) {
        License(id: $id) @client {
          nationalId
          license {
            type
            provider {
              id
            }
            pkpass
            timeout
            status
          }
          fetch {
            status
            updated
          }
          payload {
            data {
              type
              name
              label
              value
              fields {
                type
                name
                label
                value
                fields {
                  type
                  name
                  label
                  value
                }
              }
            }
            rawData
          }
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
      <BottomTabsIndicator index={2} total={3} />
      <View style={{ height: 140 }} />
      <Information contentInset={{ bottom: 162 }}>
        <SafeAreaView style={{ marginHorizontal: 16 }}>

          <FieldRender data={data?.payload.data} />

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
          nativeID={`license-${data?.license.type}_destination`}
          title={data?.license.type}
          type={data?.license.type}
          date={data?.fetch.updated}
          status={data?.license.status}
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
            addPassButtonStyle={
              theme.isDark
                ? PassKit.AddPassButtonStyle.blackOutline
                : PassKit.AddPassButtonStyle.black
            }
            onPress={() => {
              alert('Not implemented yet')
            }}
          />
        </SafeAreaView>
      )}
    </View>
  )
}

WalletPassScreen.options = getNavigationOptions
