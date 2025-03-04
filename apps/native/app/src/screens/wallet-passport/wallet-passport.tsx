import React from 'react'
import { useIntl } from 'react-intl'
import { ActivityIndicator, Platform, SafeAreaView, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'

import { Alert, dynamicColor, LicenseCard, theme } from '../../ui'
import {
  GenericLicenseType,
  GenericUserLicenseExpiryStatus,
  useGetLicenseQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useLocale } from '../../hooks/use-locale'
import { FieldRender } from '../wallet-pass/components/field-render'

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
const Spacer = styled.View`
  height: 150px;
`

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks(
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
      bottomTabs: {
        visible: false,
        drawBehind: true,
      },
    },
  )

export const WalletPassportScreen: NavigationFunctionComponent<{
  id: string
  cardHeight?: number
}> = ({ id, componentId, cardHeight = 96 }) => {
  useNavigationOptions(componentId)
  useConnectivityIndicator({ componentId })

  const intl = useIntl()

  const { data, loading } = useGetLicenseQuery({
    variables: {
      input: {
        licenseType: GenericLicenseType.Passport,
        licenseId: id,
      },
      locale: useLocale(),
    },
  })

  const item = data?.genericLicense
  const isInvalid = item?.payload?.metadata?.expired
  const expireDate = item?.payload?.metadata?.expireDate
  const expireWarning =
    item?.payload?.metadata?.expiryStatus ===
    GenericUserLicenseExpiryStatus.Expiring

  if (!item) return null

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: cardHeight }} />
      <Information contentInset={{ bottom: 162 }}>
        <SafeAreaView
          style={{ marginHorizontal: 0, paddingHorizontal: theme.spacing[2] }}
        >
          <View
            style={{
              paddingTop: theme.spacing[5],
            }}
          >
            <Alert
              title={intl.formatMessage({ id: 'walletPassport.infoTitle' })}
              message={intl.formatMessage({
                id: 'walletPassport.infoDescription',
              })}
              type="info"
              hasBorder
            />
          </View>

          {expireWarning ? (
            <View
              style={{
                paddingTop: theme.spacing[2],
                paddingBottom: 10,
              }}
            >
              <Alert
                title={intl.formatMessage({
                  id: 'walletPassport.warningTitle',
                })}
                message={intl.formatMessage({
                  id: 'walletPassport.warningDescription',
                })}
                type="warning"
                hasBorder
              />
            </View>
          ) : null}

          {!item?.payload?.data && loading ? (
            <ActivityIndicator
              size="large"
              color="#0061FF"
              style={{ marginTop: theme.spacing[4] }}
            />
          ) : item?.payload?.data ? (
            <FieldRender
              data={item?.payload?.data}
              licenseType={GenericLicenseType.Passport}
            />
          ) : null}
        </SafeAreaView>
        {Platform.OS === 'android' && <Spacer />}
      </Information>
      <SafeAreaView
        style={{
          marginTop: theme.spacing[2],
          marginHorizontal: theme.spacing[2],
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <LicenseCard
          nativeID={`license-${GenericLicenseType.Passport}_destination`}
          type={GenericLicenseType.Passport}
          date={expireDate ? new Date(expireDate) : undefined}
          title={item?.payload?.metadata?.name ?? undefined}
          status={isInvalid ? 'NOT_VALID' : 'VALID'}
        />
      </SafeAreaView>
    </View>
  )
}

WalletPassportScreen.options = getNavigationOptions
