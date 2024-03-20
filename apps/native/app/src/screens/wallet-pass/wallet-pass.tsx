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

  const pkPassAllowed = hasPkpass // TODO should we check for valid pk pass as well
  const extraBarcodeSpacing = pkPassAllowed
    ? BARCODE_HEIGHT + LICENSE_CARD_ROW_GAP
    : 0

  const expirationTimeCallback = useCallback(() => {
    void res.refetch()
  }, [])

  const expirationTime = useMemo(() => {
    // TODO this should be calculated from the expiration time of the barcode
    // update when backend returns expiration time and remember to subtract 5 seconds
    const dt = new Date()
    dt.setSeconds(dt.getSeconds() + 55)

    return dt
  }, [data?.barcode])

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: cardHeight }} />
      <LicenseCardWrapper>
        <LicenseCard
          nativeID={`license-${data?.license?.type}_destination`}
          type={data?.license?.type}
          date={new Date(Number(data?.fetch?.updated))}
          status={!data?.payload?.metadata?.expired ? 'VALID' : 'NOT_VALID'}
          {...(pkPassAllowed && {
            barcode: {
              value: data?.barcode,
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
          {data?.license?.type === GenericLicenseType.PCard && (
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
            <FieldRender data={fields} licenseType={data?.license?.type} />
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
