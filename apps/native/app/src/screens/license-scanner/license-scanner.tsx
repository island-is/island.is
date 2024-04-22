import { Bubble, Button, theme } from '@ui'
import { BarCodeEvent, Constants } from 'expo-barcode-scanner'
import { Camera, FlashMode } from 'expo-camera'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Alert,
  LayoutRectangle,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import DeviceInfo from 'react-native-device-info'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import styled from 'styled-components/native'
import flashligth from '../../assets/icons/flashlight.png'
import {
  useVerifyLicenseBarcodeMutation,
  VerifyLicenseBarcodeError,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { ComponentRegistry } from '../../utils/component-registry'
import { isAndroid, isIos } from '../../utils/devices'
import { isDefined } from '../../utils/is-defined'
import { isJWT } from '../../utils/token'

const BottomRight = styled.View`
  position: absolute;
  right: 32px;
  bottom: 32px;
`

const FlashLight = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 64px;
  height: 64px;
  width: 64px;
  background: #000;
`

const FlashImg = styled.Image`
  height: 32px;
  width: 32px;
`

const BubbleWrapper = styled.View`
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  align-items: center;
`

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks(
    (theme, intl, initialized) => ({
      topBar: {
        title: {
          text: intl.formatMessage({ id: 'licenseScanner.title' }),
        },
      },
    }),
    {
      topBar: {
        visible: true,
        rightButtons: [
          {
            id: 'LICENSE_SCANNER_DONE',
            systemItem: 'done',
          },
        ],
      },
    },
  )

const isSimulator = isIos && DeviceInfo.isEmulatorSync()

export const LicenseScannerScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const [hasPermission, setHasPermission] = useState<boolean>()
  const [active, setActive] = useState(true)
  const [invalid, setInvalid] = useState<boolean>(false)
  const [torch, setTorch] = useState<boolean>(false)

  const camera = useRef<Camera>()
  const [layout, setLayout] = useState<LayoutRectangle>()
  const [ratio, setRatio] = useState<string>()
  const [padding, setPadding] = useState(0)

  const invalidTimeout = useRef<ReturnType<typeof setTimeout>>()
  const intl = useIntl()

  const [verifyLicenseBarcode, { data, error, loading }] =
    useVerifyLicenseBarcodeMutation()

  useEffect(() => {
    Camera.requestCameraPermissionsAsync().then(({ status }) => {
      setHasPermission(status === 'granted')
    })
  }, [])

  useEffect(() => {
    Navigation.events().registerNavigationButtonPressedListener((e) => {
      if (e.buttonId === 'LICENSE_SCANNER_DONE') {
        Navigation.dismissModal(componentId)
      }
    })
    Navigation.events().registerComponentWillAppearListener((e) => {
      if (e.componentId === componentId) {
        setActive(true)
      }
    })
  }, [])

  const onFlashlightPress = useCallback(() => {
    setTorch((v) => !v)
  }, [])

  const onBarCodeScanned = useCallback(({ type, data }: BarCodeEvent) => {
    if (invalidTimeout.current) {
      clearTimeout(invalidTimeout.current)
    }

    const isPDF417 = type === Constants.BarCodeType.pdf417

    if (isPDF417 && !isJWT(data)) {
      if (!data.includes('TGLJZW') && !data.includes('passTemplateId')) {
        invalidTimeout.current = setTimeout(() => {
          setInvalid(false)
        }, 2000)

        return setInvalid(true)
      }
    }

    void impactAsync(ImpactFeedbackStyle.Heavy)
    void verifyLicenseBarcode({
      variables: {
        input: {
          data,
        },
      },
    })
  }, [])

  useEffect(() => {
    if (data?.verifyLicenseBarcode) {
      setInvalid(false)
      setActive(false)

      Navigation.push(componentId, {
        component: {
          name: ComponentRegistry.LicenseScanDetailScreen,
          passProps: {
            verifyLicenseBarcode: data.verifyLicenseBarcode,
          },
          options: {
            topBar: {
              visible: true,
              title: {
                text: intl.formatMessage({ id: 'licenseScanner.title' }),
              },
            },
          },
        },
      })
    }
  }, [data, error, loading])

  const prepareRatio = async () => {
    if (isAndroid) {
      const screenRatio = layout!.height / layout!.width
      const ratios = await camera.current!.getSupportedRatiosAsync()
      // find ratio closest to screen ratio
      const closest = ratios
        .map((aspect) => {
          const [h, w] = aspect.split(':').map(parseFloat)
          return { ratio: h / w, aspect }
        })
        .sort((a, b) => {
          return Math.abs(a.ratio - screenRatio) >
            Math.abs(b.ratio - screenRatio)
            ? 1
            : -1
        })
        .shift()
      const cameraRatio = closest!.ratio
      const overlap =
        layout!.width - (screenRatio / cameraRatio) * layout!.width
      setPadding(overlap / 2)
      setRatio(closest!.aspect)
    }
  }

  const onCameraReady = () => {
    prepareRatio()
  }

  const getBubbleMessage = () => {
    if (!isDefined(hasPermission)) {
      return 'licenseScanner.awaitingPermission'
    } else if (!hasPermission) {
      return 'licenseScanner.noCameraAccess'
    } else if (error) {
      return 'licenseScanner.errorNetwork'
    } else if (
      data?.verifyLicenseBarcode?.error === VerifyLicenseBarcodeError.Error
    ) {
      return 'licenseScanner.errorUnknown'
    } else if (invalid) {
      return 'licenseScanner.invalidBarcode'
    }

    return 'licenseScanner.helperMessage'
  }

  const renderBubble = () => (
    <BubbleWrapper>
      <Bubble>{intl.formatMessage({ id: getBubbleMessage() })}</Bubble>
    </BubbleWrapper>
  )

  if (isSimulator) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.color.blue200,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button
          title="Paste barcode"
          onPress={() => {
            Alert.prompt('Paste barcode', '', (text) => {
              console.log('oki', text)
              void onBarCodeScanned({
                type: Constants.BarCodeType.pdf417,
                data: text,
              } as any)
            })
          }}
        />
        {renderBubble()}
      </View>
    )
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: '#000' }}
      onLayout={(e) => setLayout(e.nativeEvent.layout)}
    >
      {hasPermission === true && active && (
        <Camera
          onBarCodeScanned={active ? onBarCodeScanned : undefined}
          onMountError={() => {
            Alert.alert('Camera error', 'Could not start camera preview')
          }}
          flashMode={torch ? FlashMode.torch : FlashMode.off}
          ref={(ref) => {
            if (ref) {
              camera.current = ref
            }
          }}
          ratio={ratio}
          onCameraReady={onCameraReady}
          style={[StyleSheet.absoluteFillObject, { marginHorizontal: padding }]}
        />
      )}
      {renderBubble()}
      <BottomRight>
        <TouchableOpacity onPress={onFlashlightPress}>
          <FlashLight>
            <FlashImg source={flashligth} resizeMode="contain" />
          </FlashLight>
        </TouchableOpacity>
      </BottomRight>
    </View>
  )
}

LicenseScannerScreen.options = getNavigationOptions()
