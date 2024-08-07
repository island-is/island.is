import {
  Alert as InfoAlert,
  dynamicColor,
  LICENSE_CARD_ROW_GAP,
  LicenseCard,
} from '@ui'
import * as FileSystem from 'expo-file-system'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  ActivityIndicator,
  Alert,
  Animated,
  Button,
  Easing,
  Linking,
  NativeModules,
  Platform,
  SafeAreaView,
  View,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import PassKit, { AddPassButton } from 'react-native-passkit-wallet'
import styled, { useTheme } from 'styled-components/native'
import { useFeatureFlag } from '../../contexts/feature-flag-provider'
import {
  GenericLicenseType,
  GenericUserLicense,
  GenericUserLicensePkPassStatus,
  useGeneratePkPassMutation,
  useGetLicenseQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { isAndroid, isIos } from '../../utils/devices'
import { screenWidth } from '../../utils/dimensions'
import { FieldRender } from './components/field-render'

const INFORMATION_BASE_TOP_SPACING = 70

const getImageFromRawData = (rawData: string) => {
  try {
    const parsedData: { photo?: { image?: string } } = JSON.parse(rawData)

    return parsedData?.photo?.image
  } catch (e) {
    return undefined
  }
}

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

export const WalletPassScreen: NavigationFunctionComponent<{
  id: string
  item?: GenericUserLicense
  cardHeight?: number
}> = ({ id, item, componentId, cardHeight = 140 }) => {
  useNavigationOptions(componentId)
  useConnectivityIndicator({ componentId })
  const theme = useTheme()
  const intl = useIntl()
  const [addingToWallet, setAddingToWallet] = useState(false)
  const isBarcodeEnabled = useFeatureFlag('isBarcodeEnabled', false)
  const fadeInAnim = useRef(new Animated.Value(0)).current

  const [generatePkPass] = useGeneratePkPassMutation()
  const res = useGetLicenseQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        licenseType: item?.license.type ?? id,
      },
    },
  })

  const data = res.data?.genericLicense ?? item
  const fields = data?.payload?.data ?? []
  const pkPassAllowed =
    data?.license?.pkpass &&
    data?.license?.pkpassStatus === GenericUserLicensePkPassStatus.Available
  const allowLicenseBarcode =
    isBarcodeEnabled && pkPassAllowed && !data?.payload?.metadata?.expired
  const licenseType = data?.license?.type
  const barcodeWidth =
    screenWidth - theme.spacing[4] * 2 - theme.spacing.smallGutter * 2
  const barcodeHeight = barcodeWidth / 3
  const updated = data?.fetch?.updated

  const fadeIn = () => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      delay: 300,
      easing: Easing.in(Easing.ease),
    }).start()
  }

  useEffect(() => {
    if (pkPassAllowed && !isBarcodeEnabled) {
      fadeIn()
    }
  }, [pkPassAllowed, isBarcodeEnabled])

  const onAddPkPass = async () => {
    const { canAddPasses, addPass } = Platform.select({
      ios: PassKit,
      android: NativeModules.IslandModule,
    })

    const canAddPass = await canAddPasses()

    if (canAddPass || isAndroid) {
      try {
        setAddingToWallet(true)
        const { data } = await generatePkPass({
          variables: {
            input: {
              licenseType: item?.license?.type ?? '',
            },
          },
        })
        if (!data?.generatePkPass.pkpassUrl) {
          throw Error('Failed to generate pkpass')
        }
        if (isAndroid) {
          const pkPassUri =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            FileSystem.documentDirectory! + Date.now() + '.pkpass'

          await FileSystem.downloadAsync(
            data.generatePkPass.pkpassUrl,
            pkPassUri,
            {
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1',
              },
            },
          )
          const pkPassContentUri = await FileSystem.getContentUriAsync(
            pkPassUri,
          )

          addPass(pkPassContentUri, 'com.snjallveskid').catch(() => {
            if (!canAddPass) {
              Alert.alert(
                'Villa',
                'You cannot add passes. Please make sure you have Smartwallet installed on your device.',
              )
            } else {
              Alert.alert('Villa', 'Failed to fetch or add pass')
            }
          })
          setAddingToWallet(false)
          return
        }
        const res = await fetch(data.generatePkPass.pkpassUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1',
          },
        })
        const blob = await res.blob()
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
          const passData = reader.result?.toString()
          if (passData) {
            if (passData.includes('text/html')) {
              throw new Error('Pass has expired')
            }
            addPass(passData.substring(41), 'com.snjallveskid')
          }
          setAddingToWallet(false)
        }
      } catch (err) {
        if (!canAddPass) {
          Alert.alert(
            'You cannot add passes. Please make sure you have Smartwallet installed on your device.',
          )
        } else {
          Alert.alert(
            intl.formatMessage({
              id: 'walletPass.errorTitle',
            }),
            item?.license?.type === 'DriversLicense'
              ? intl.formatMessage({
                  id: 'walletPass.errorNotPossibleToAddDriverLicense',
                })
              : 'Failed to fetch or add pass',
            item?.license?.type === 'DriversLicense'
              ? [
                  {
                    text: intl.formatMessage({
                      id: 'walletPass.moreInfo',
                    }),
                    onPress: () =>
                      Linking.openURL('https://island.is/okuskirteini'),
                  },

                  {
                    text: intl.formatMessage({
                      id: 'walletPass.alertClose',
                    }),
                    style: 'cancel',
                  },
                ]
              : [],
          )
        }
        setAddingToWallet(false)
        console.error(err)
      }
    } else {
      Alert.alert('You cannot add passes on this device')
    }
  }

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

  const { loading } = res

  const informationTopSpacing =
    allowLicenseBarcode && ((loading && !data?.barcode) || data?.barcode)
      ? barcodeHeight + LICENSE_CARD_ROW_GAP
      : 0

  const renderButtons = () => {
    if (isIos) {
      return (
        <AddPassButton
          style={{ height: 52 }}
          addPassButtonStyle={
            theme.isDark
              ? PassKit.AddPassButtonStyle.blackOutline
              : PassKit.AddPassButtonStyle.black
          }
          onPress={onAddPkPass}
        />
      )
    }

    return (
      <Button title="Add to Wallet" onPress={onAddPkPass} color="#111111" />
    )
  }

  // If we don't have an item we want to return a loading spinner for the whole screen to prevent showing the wrong license while fetching
  if (loading && !item) {
    return (
      <ActivityIndicator
        size="large"
        color="#0061FF"
        style={{ marginTop: theme.spacing[4] }}
      />
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: cardHeight }} />
      <LicenseCardWrapper>
        <LicenseCard
          nativeID={`license-${licenseType}_destination`}
          type={licenseType}
          logo={
            isBarcodeEnabled &&
            data?.license?.type === GenericLicenseType.DriversLicense
              ? getImageFromRawData(data?.payload?.rawData)
              : undefined
          }
          date={updated ? new Date(Number(updated)) : undefined}
          status={!data?.payload?.metadata?.expired ? 'VALID' : 'NOT_VALID'}
          {...(allowLicenseBarcode && {
            barcode: {
              value: data?.barcode?.token,
              loading: loading && !data?.barcode,
              expirationTimeCallback,
              expirationTime: getExpirationTime(),
              width: barcodeWidth,
              height: barcodeHeight,
            },
          })}
        />
      </LicenseCardWrapper>
      <Information
        contentInset={{ bottom: 162 }}
        topSpacing={informationTopSpacing}
      >
        <SafeAreaView style={{ marginHorizontal: theme.spacing[2] }}>
          {/* Show info alert if PCard or Ehic */}
          {(licenseType === GenericLicenseType.PCard ||
            licenseType === GenericLicenseType.Ehic) && (
            <View
              style={{
                paddingTop: theme.spacing[3],
              }}
            >
              <InfoAlert
                title={intl.formatMessage({
                  id:
                    licenseType === GenericLicenseType.PCard
                      ? 'licenseDetail.pcard.alert.title'
                      : 'licenseDetail.ehic.alert.title',
                })}
                message={intl.formatMessage({
                  id:
                    licenseType === GenericLicenseType.PCard
                      ? 'licenseDetail.pcard.alert.description'
                      : 'licenseDetail.ehic.alert.description',
                })}
                type="info"
                hasBorder
              />
            </View>
          )}
          {!data?.payload?.data && loading ? (
            <ActivityIndicator
              size="large"
              color="#0061FF"
              style={{ marginTop: theme.spacing[4] }}
            />
          ) : (
            <FieldRender data={fields} licenseType={licenseType} />
          )}
        </SafeAreaView>

        {pkPassAllowed && isBarcodeEnabled && (
          <ButtonWrapper>{renderButtons()}</ButtonWrapper>
        )}
        {isAndroid && <Spacer />}
      </Information>
      {/*
          Remove once isBarcodeEnabled will be removed. This is only temporary.
          The reason for the animation is to avoid rendering flicker.
          The component will on first render the isBarcodeEnabled flag to be false and then set it to true after Configcat has fetched the flag.
       */}
      {pkPassAllowed && !isBarcodeEnabled && (
        <ButtonWrapper floating>
          <Animated.View style={{ opacity: fadeInAnim }}>
            {renderButtons()}
          </Animated.View>
        </ButtonWrapper>
      )}

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
  )
}

WalletPassScreen.options = getNavigationOptions
