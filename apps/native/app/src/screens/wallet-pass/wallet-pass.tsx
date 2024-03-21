import {
  Alert as InfoAlert,
  dynamicColor,
  LicenseCard,
  LICENSE_CARD_ROW_GAP,
} from '@ui'
import { BARCODE_HEIGHT } from '@ui/lib/barcode/barcode'
import * as FileSystem from 'expo-file-system'
import React, { useCallback, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  ActivityIndicator,
  Alert,
  Button,
  Linking,
  NativeModules,
  Platform,
  SafeAreaView,
  View,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import PassKit, { AddPassButton } from 'react-native-passkit-wallet'
import styled, { useTheme } from 'styled-components/native'
import {
  GenericLicenseType,
  GenericUserLicense,
  GenericUserLicensePkPassStatus,
  useGeneratePkPassMutation,
  useGetLicenseQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { isAndroid, isIos } from '../../utils/devices'
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
`

const ButtonWrapper = styled(SafeAreaView)`
  margin-left: ${({ theme }) => theme.spacing[2]}px;
  margin-right: ${({ theme }) => theme.spacing[2]}px;
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
  opacity: 0.25;
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
  const theme = useTheme()
  const intl = useIntl()
  const [addingToWallet, setAddingToWallet] = useState(false)

  const [generatePkPass] = useGeneratePkPassMutation()
  const res = useGetLicenseQuery({
    variables: {
      input: {
        licenseType: item?.license.type ?? '',
      },
    },
  })

  const data = res.data?.genericLicense ?? item

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
        if (Platform.OS === 'android') {
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

  const fields = data?.payload?.data ?? []
  const hasPkpass = data?.license?.pkpass
  const hasValidPkpass =
    data?.license?.pkpassStatus === GenericUserLicensePkPassStatus.Available

  const pkPassAllowed = hasPkpass && hasValidPkpass
  const extraBarcodeSpacing =
    pkPassAllowed && data?.barcode?.token
      ? BARCODE_HEIGHT + LICENSE_CARD_ROW_GAP
      : 0

  const expirationTimeCallback = useCallback(() => {
    void res.refetch()
  }, [])

  const expirationTime = useMemo(() => {
    const exp = data?.barcode?.exp

    if (exp) {
      const expirationTime = new Date(exp)
      // We subtract 5 seconds to make sure the barcode is still valid when switching to a new barcode
      expirationTime.setSeconds(expirationTime.getSeconds() - 5)

      return expirationTime
    }
  }, [data?.barcode?.exp])

  const licenseType = data?.license?.type
  const rawDataImageStr = getImageFromRawData(data?.payload?.rawData)
  // TODO use rawDataImageStr to display the image in the license card
  const fakeRawDataImageStr =
    'data:image/png;base64,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'

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: cardHeight }} />
      <LicenseCardWrapper>
        <LicenseCard
          nativeID={`license-${licenseType}_destination`}
          type={licenseType}
          {...(fakeRawDataImageStr && { logo: fakeRawDataImageStr })}
          date={new Date(Number(data?.fetch?.updated))}
          status={!data?.payload?.metadata?.expired ? 'VALID' : 'NOT_VALID'}
          {...(pkPassAllowed &&
            expirationTime && {
              barcode: {
                value: data?.barcode?.token,
                loading: res.loading && !data?.barcode,
                expirationTimeCallback,
                expirationTime,
              },
            })}
        />
      </LicenseCardWrapper>
      <Information
        contentInset={{ bottom: 162 }}
        topSpacing={extraBarcodeSpacing}
      >
        <SafeAreaView style={{ marginHorizontal: theme.spacing[2] }}>
          {/* Show info alert if PCard */}
          {licenseType === GenericLicenseType.PCard && (
            <View
              style={{
                paddingTop: theme.spacing[3] + extraBarcodeSpacing,
              }}
            >
              <InfoAlert
                title={intl.formatMessage({
                  id: 'licenseDetail.pcard.alert.title',
                })}
                message={intl.formatMessage({
                  id: 'licenseDetail.pcard.alert.description',
                })}
                type="info"
                hasBorder
              />
            </View>
          )}
          {!data?.payload?.data && res.loading ? (
            <ActivityIndicator
              size="large"
              color="#0061FF"
              style={{ marginTop: theme.spacing[4] }}
            />
          ) : (
            <FieldRender data={fields} licenseType={licenseType} />
          )}
        </SafeAreaView>
        {isAndroid && <Spacer />}
        {hasPkpass && hasValidPkpass && (
          <ButtonWrapper>
            {isIos ? (
              <AddPassButton
                style={{ height: 52 }}
                addPassButtonStyle={
                  theme.isDark
                    ? PassKit.AddPassButtonStyle.blackOutline
                    : PassKit.AddPassButtonStyle.black
                }
                onPress={onAddPkPass}
              />
            ) : (
              <Button
                title="Add to Wallet"
                onPress={onAddPkPass}
                color="#111111"
              />
            )}
          </ButtonWrapper>
        )}
      </Information>

      {addingToWallet && (
        <LoadingOverlay>
          <ActivityIndicator
            size="large"
            color="#0061FF"
            style={{ marginTop: 32 }}
          />
        </LoadingOverlay>
      )}
    </View>
  )
}

WalletPassScreen.options = getNavigationOptions
