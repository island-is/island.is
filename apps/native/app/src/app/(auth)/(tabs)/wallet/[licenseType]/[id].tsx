import {
  BARCODE_MAX_WIDTH,
  INFORMATION_BASE_TOP_SPACING,
  SHOW_INFO_ALERT_TYPES,
} from '@/constants/wallet.constants'
import {
  GenericLicenseType,
  GenericUserLicense,
  GenericUserLicenseExpiryStatus,
  GenericUserLicenseFragmentFragmentDoc,
  GenericUserLicensePkPassStatus,
  useGetLicenseQuery,
} from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'
import { useOfflineStore } from '@/stores/offline-store'
import { usePreferencesStore } from '@/stores/preferences-store'
import {
  dynamicColor,
  Alert as InfoAlert,
  LICENSE_CARD_ROW_GAP,
  LicenseCard,
} from '@/ui'
import { isAndroid, isIosLiquidGlassEnabled } from '@/utils/devices'
import { screenWidth } from '@/utils/dimensions'
import { useFragment_experimental } from '@apollo/client/react/hooks'
import { useLocalSearchParams } from 'expo-router'
import { StackScreen } from '@/components/stack-screen'
import React, { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { ActivityIndicator, SafeAreaView, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { LicenseFieldRender } from '@/components/license-field-render'
import { testIDs } from '@/utils/test-ids'

const CARD_HEIGHT = 96

const Information = styled.ScrollView<{ topSpacing?: number }>`
  flex: 1;
  background-color: ${dynamicColor(({ theme }) => ({
    dark: theme.shades.dark.shade100,
    light: theme.color.blue100,
  }))};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  margin-top: -${INFORMATION_BASE_TOP_SPACING}px;
  padding-top: ${({ topSpacing = 0 }) =>
    topSpacing + INFORMATION_BASE_TOP_SPACING}px;
  z-index: 10;
`

const LicenseCardWrapper = styled(SafeAreaView)`
  margin-top: ${({ theme }) => theme.spacing[2]}px;
  margin-left: ${({ theme }) => theme.spacing[2]}px;
  margin-right: ${({ theme }) => theme.spacing[2]}px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  elevation: 100;
`

const ButtonWrapper = styled(SafeAreaView)<{ floating?: boolean }>`
  margin-left: ${({ theme }) => theme.spacing[2]}px;
  margin-right: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme, floating }) =>
    floating ? 0 : theme.spacing[6]}px;

  ${({ floating, theme }) =>
    floating &&
    `
    position: absolute;
    bottom: ${theme.spacing[2]}px;
    left: 0;
    right: 0;
    z-index: 100;
    `}
`

const LoadingOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;

  background-color: #000;
  opacity: ${({ theme }) => (theme.isDark ? 0.6 : 0.4)};
  width: 100%;
  height: 100%;
`

const Spacer = styled.View`
  height: 150px;
`

const getInfoAlertMessageIds = (
  licenseType: GenericLicenseType,
  licenseNumber?: string,
) => {
  const isTravelIdentityDocument =
    licenseType === GenericLicenseType.IdentityDocument &&
    licenseNumber?.startsWith('ID')
  switch (licenseType) {
    case GenericLicenseType.DriversLicense:
      return {
        title: 'licenseDetail.driversLicense.alert.title',
        description: 'licenseDetail.driversLicense.alert.description',
        dismissible: true,
      }
    case GenericLicenseType.PCard:
      return {
        title: 'licenseDetail.pcard.alert.title',
        description: 'licenseDetail.pcard.alert.description',
      }
    case GenericLicenseType.Ehic:
      return {
        title: 'licenseDetail.ehic.alert.title',
        description: 'licenseDetail.ehic.alert.description',
      }
    case GenericLicenseType.IdentityDocument:
      return {
        title: isTravelIdentityDocument
          ? 'licenseDetail.identityTravelDocument.alert.title'
          : 'licenseDetail.identityDocument.alert.title',
        description: isTravelIdentityDocument
          ? 'licenseDetail.identityTravelDocument.alert.description'
          : 'licenseDetail.identityDocument.alert.description',
      }
    case GenericLicenseType.Passport:
      return {
        title: 'licenseDetail.passport.alert.title',
        description: 'licenseDetail.passport.alert.description',
      }
  }
}

export default function WalletPassScreen() {
  const { licenseType: type, id } = useLocalSearchParams<{
    licenseType: string
    id: string
  }>()

  const theme = useTheme()
  const intl = useIntl()
  const [addingToWallet, setAddingToWallet] = useState(false)
  const walletPassDismissedInfoAlerts = usePreferencesStore(
    (state) => state.walletPassDismissedInfoAlerts,
  )
  const setWalletPassInfoAlertDismissed = usePreferencesStore(
    (state) => state.setWalletPassInfoAlertDismissed,
  )
  const isConnected = useOfflineStore(({ isConnected }) => isConnected)

  const res = useGetLicenseQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        licenseType: type as GenericLicenseType,
        licenseId: id,
      },
      locale: useLocale(),
    },
  })
  // useFragment will get the license by license type and license id from license list cache
  const licenseFromCache = useFragment_experimental<GenericUserLicense>({
    fragment: GenericUserLicenseFragmentFragmentDoc,
    fragmentName: 'GenericUserLicenseFragment',
    from: {
      __typename: 'GenericUserLicense',
      license: {
        type,
      },
      payload: {
        metadata: {
          licenseId: id,
        },
      },
    },
    returnPartialData: true,
  })

  const data = res.data?.genericLicense ?? licenseFromCache?.data
  const isExpired = data?.payload?.metadata?.expired
  const expireDate = data?.payload?.metadata?.expireDate
  const expireWarning =
    data?.payload?.metadata?.expiryStatus ===
    GenericUserLicenseExpiryStatus.Expiring
  const fields = data?.payload?.data ?? []
  const isTablet = screenWidth > 760
  const pkPassAllowed =
    data?.license?.pkpass &&
    data?.license?.pkpassStatus === GenericUserLicensePkPassStatus.Available
  const allowLicenseBarcode = pkPassAllowed && !isExpired
  const licenseType = data?.license?.type
  const barcodeWidth = isTablet
    ? BARCODE_MAX_WIDTH // For tablets - make sure barcode is not huge
    : screenWidth - theme.spacing[4] * 2 - theme.spacing.smallGutter * 2
  const barcodeHeight = barcodeWidth / 3
  const updated = data?.fetch?.updated
  const markInfoAlertAsDismissed = useCallback(async () => {
    setWalletPassInfoAlertDismissed(type)
  }, [type, setWalletPassInfoAlertDismissed])

  const shouldShowExpireDate = !!(
    (licenseType === GenericLicenseType.IdentityDocument ||
      licenseType === GenericLicenseType.Passport) &&
    expireDate
  )

  const showInfoAlert =
    licenseType && SHOW_INFO_ALERT_TYPES.includes(licenseType)

  const alertMessageIds = showInfoAlert
    ? getInfoAlertMessageIds(
        licenseType,
        data?.payload?.metadata?.licenseNumber ?? undefined,
      )
    : undefined

  const isInfoAlertDismissed = useCallback(
    (alertType?: string) => {
      if (!alertMessageIds?.dismissible || !alertType) {
        return false
      }

      return walletPassDismissedInfoAlerts?.[alertType] ? true : false
    },
    [walletPassDismissedInfoAlerts, alertMessageIds?.dismissible],
  )

  const { loading } = res

  const informationTopSpacing =
    (allowLicenseBarcode && ((loading && !data?.barcode) || data?.barcode)) ||
    ((!isConnected || res.error) && allowLicenseBarcode)
      ? barcodeHeight + LICENSE_CARD_ROW_GAP + theme.spacing[4]
      : theme.spacing[2]

  // Calculate bottom inset based on the content
  const bottomInset =
    informationTopSpacing || !isConnected
      ? isTablet
        ? 340
        : !allowLicenseBarcode
        ? 80 // less spacing needed if no barcode available (expired or not available)
        : 192 // Extra spacing needed at bottom if no button is shown
      : 0

  const expirationTimeCallback = useCallback(() => {
    void res.refetch()
  }, [])

  const getExpirationTime = () => {
    const expiresIn = data?.barcode?.expiresIn

    if (expiresIn) {
      const expDt = new Date()
      // We subtract 7 seconds from the expiry time to make sure the barcode is still valid when switching to a new barcode
      // The default expiration time is 60 seconds from the server
      expDt.setSeconds(expDt.getSeconds() + expiresIn - 7)

      return expDt
    }
  }

  // If we don't have cache data we want to return a loading spinner for the whole screen to prevent showing the wrong license while fetching
  if (loading && !licenseFromCache?.data) {
    return (
      <ActivityIndicator
        size="large"
        color="#0061FF"
        style={{ marginTop: theme.spacing[4] }}
      />
    )
  }

  return (
    <>
      <StackScreen
        networkStatus={res.networkStatus}
        options={{
          title: intl.formatMessage({ id: 'walletPass.screenTitle' }),
          headerShown: true,
          headerShadowVisible: false,
        }}
      />
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: isIosLiquidGlassEnabled ? 2 * CARD_HEIGHT : CARD_HEIGHT,
          }}
        />
        <LicenseCardWrapper>
          <LicenseCard
            nativeID={`license-${licenseType}_destination`}
            type={licenseType ?? (type as GenericLicenseType)}
            title={
              data?.payload?.metadata?.title ??
              data?.payload?.metadata?.name ??
              undefined
            }
            loading={res.loading}
            error={res.error}
            logo={data?.payload?.metadata.photo ?? undefined}
            date={
              shouldShowExpireDate
                ? new Date(expireDate)
                : updated
                ? new Date(Number(updated))
                : undefined
            }
            status={!isExpired ? 'VALID' : 'NOT_VALID'}
            {...(allowLicenseBarcode
              ? {
                  barcode: {
                    value: data?.barcode?.token,
                    loading: loading && !data?.barcode,
                    expirationTimeCallback,
                    expirationTime: getExpirationTime(),
                    width: barcodeWidth,
                    height: barcodeHeight,
                  },
                }
              : {})}
            showBarcodeOfflineMessage={!isConnected}
            allowLicenseBarcode={allowLicenseBarcode}
          />
        </LicenseCardWrapper>
        <Information
          contentInset={{
            bottom: bottomInset,
          }}
          topSpacing={informationTopSpacing}
        >
          <SafeAreaView
            style={{
              marginHorizontal: theme.spacing[2],
              marginBottom: theme.spacing[2],
            }}
          >
            {/* Show info alert if PCard, Ehic, Passport or IdentityDocument */}
            {showInfoAlert && !isInfoAlertDismissed(licenseType) && (
              <View
                style={{
                  paddingTop: theme.spacing[3],
                }}
              >
                <InfoAlert
                  title={intl.formatMessage({
                    id: alertMessageIds?.title,
                  })}
                  message={intl.formatMessage({
                    id: alertMessageIds?.description,
                  })}
                  {...(alertMessageIds?.dismissible && {
                    onClose: () => {
                      markInfoAlertAsDismissed()
                    },
                  })}
                  type="info"
                  hasBorder
                />
              </View>
            )}
            {/* Show expire warning if license is Passport or IdentityDocument and it is about to expire */}
            {expireWarning &&
            (licenseType === GenericLicenseType.Passport ||
              licenseType === GenericLicenseType.IdentityDocument) ? (
              <View
                style={{
                  paddingTop: theme.spacing[2],
                  paddingBottom: 10,
                }}
              >
                <InfoAlert
                  title={intl.formatMessage({
                    id: 'licenseDetail.warning.title',
                  })}
                  message={intl.formatMessage({
                    id:
                      licenseType === GenericLicenseType.Passport
                        ? 'licenseDetail.passport.warning.description'
                        : 'licenseDetail.identityDocument.warning.description',
                  })}
                  type="warning"
                  hasBorder
                />
              </View>
            ) : null}
            {!data?.payload?.data && loading ? (
              <ActivityIndicator
                size="large"
                color="#0061FF"
                style={{ marginTop: theme.spacing[4] }}
              />
            ) : (
              <View testID={testIDs.LICENSE_FIELDS}>
                <LicenseFieldRender data={fields} licenseType={licenseType} />
              </View>
            )}
          </SafeAreaView>

          {isAndroid && <Spacer />}
        </Information>
        {addingToWallet && (
          <LoadingOverlay>
            <ActivityIndicator
              size="large"
              color={theme.color.white}
              style={{ marginTop: theme.spacing[4] }}
            />
          </LoadingOverlay>
        )}
      </View>
    </>
  )
}
