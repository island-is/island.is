import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import Reanimated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'
import {
  Navigation,
  NavigationFunctionComponent,
  OptionsTopBarButton,
} from 'react-native-navigation'
import {
  useNavigationComponentDidAppear,
  useNavigationComponentDidDisappear,
} from 'react-native-navigation-hooks'
import {
  Camera,
  CameraProps,
  Frame,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera'
import { CodeScanner, CodeType } from 'react-native-vision-camera'
import styled from 'styled-components/native'
import * as Device from 'expo-device';

import { Bubble, Button, theme } from '../../ui'
import flashligth from '../../assets/icons/flashlight.png'
import { LICENSE_SCANNER_DONE } from '../../constants/navigation-buttons'
import {
  useVerifyLicenseBarcodeMutation,
  VerifyLicenseBarcodeError,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { ComponentRegistry } from '../../utils/component-registry'
import { isIos } from '../../utils/devices'
import { isJWT } from '../../utils/token'
import { authStore } from '../../stores/auth-store'

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

const RIGHT_BUTTONS: OptionsTopBarButton[] = [
  {
    id: LICENSE_SCANNER_DONE,
    systemItem: 'done',
  },
]

const PDF_417: CodeType = 'pdf-417'

enum ScanningStatus {
  INITIAL = 'INITIAL',
  LOADING = 'LOADING',
  FINISHED = 'FINISHED',
}

Reanimated.addWhitelistedNativeProps({
  zoom: true,
})
const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks(
    (_theme, intl) => ({
      topBar: {
        title: {
          text: intl.formatMessage({ id: 'licenseScanner.title' }),
        },
      },
    }),
    {
      topBar: {
        visible: true,
        rightButtons: RIGHT_BUTTONS,
      },
    },
  )



const isSimulator = isIos && Device.isDevice === false

export const LicenseScannerScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  useConnectivityIndicator({ componentId, rightButtons: RIGHT_BUTTONS })
  const intl = useIntl()

  const [active, setActive] = useState(true)
  const [invalid, setInvalid] = useState(false)
  const [torch, setTorch] = useState(false)

  const scanningRef = useRef<ScanningStatus>(ScanningStatus.INITIAL)
  const { hasPermission, requestPermission } = useCameraPermission()
  const device = useCameraDevice('back')
  const zoom = useSharedValue(device?.neutralZoom || 1)
  const zoomOffset = useSharedValue(0)

  const gesture = Gesture.Pinch()
    .onBegin(() => {
      zoomOffset.value = zoom.value
    })
    .onUpdate((event) => {
      const z = zoomOffset.value * event.scale
      zoom.value = interpolate(
        z,
        [1, 10],
        [device?.minZoom ?? 1, 12],
        Extrapolation.CLAMP,
      )
    })

  const animatedZoom = useAnimatedProps<CameraProps>(
    () => ({ zoom: zoom.value }),
    [zoom],
  )

  const onCodeScanned: CodeScanner['onCodeScanned'] = (codes) => {
    const { type, value } = codes[0]

    if (!type || !value || scanningRef.current !== ScanningStatus.INITIAL) {
      return
    }

    setInvalid(false)

    if (type === PDF_417 && !isJWT(value)) {
      if (!value.includes('TGLJZW') && !value.includes('passTemplateId')) {
        setInvalid(true)
        scanningRef.current = ScanningStatus.INITIAL

        return
      }
    }

    // Scanning is in progress
    scanningRef.current = ScanningStatus.LOADING

    void impactAsync(ImpactFeedbackStyle.Heavy)
    void verifyLicenseBarcode({
      variables: {
        input: {
          data: value,
        },
      },
    }).then(({ data }) => {
      if (data) {
        // Network request is finished and we can navigate to the detail screen
        scanningRef.current = ScanningStatus.FINISHED

        setInvalid(false)
        setActive(false)

        void Navigation.push(componentId, {
          component: {
            name: ComponentRegistry.LicenseScanDetailScreen,
            passProps: {
              verifyLicenseBarcode: data?.verifyLicenseBarcode,
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
    })
  }

  const codeScanner = useCodeScanner({
    codeTypes: ['pdf-417'],
    onCodeScanned,
  })

  const [verifyLicenseBarcode, { data, error, reset }] =
    useVerifyLicenseBarcodeMutation()

  useEffect(() => {
    // Request camera permission on mount
    void requestPermission()
    if (!isIos) {
      // Opening camera on android triggers the lock screen, so we need to prevent the lock screen from showing
      authStore.setState({
        noLockScreenUntilNextAppStateActive: true,
      })
    }
  }, [])

  useEffect(() => {
    Navigation.events().registerNavigationButtonPressedListener((e) => {
      if (e.buttonId === LICENSE_SCANNER_DONE) {
        void Navigation.dismissModal(componentId)
      }
    })
  }, [])

  useNavigationComponentDidDisappear(() => {
    // The Camera's isActive property can be used to pause the session (isActive={false}) while still keeping the session "warm".
    // This is more desirable than completely unmounting the camera, since resuming the session (isActive={true}) will be much faster than re-mounting the camera view.
    setActive(false)
    // We need to reset the state mutation state when the detail screen is stacked on top of the scanner screen, so if
    // the navigator goes back to the scanner screen, the state is not stuck in an error state for example
    reset()
    scanningRef.current = ScanningStatus.INITIAL
  })

  useNavigationComponentDidAppear(() => {
    setActive(true)
  })

  const onFlashlightPress = useCallback(() => {
    setTorch((v) => !v)
  }, [])

  useEffect(() => {
    // Reset the scanning status when the component is unmounted
    return () => {
      if (scanningRef.current === ScanningStatus.FINISHED) {
        scanningRef.current = ScanningStatus.INITIAL
      }
    }
  }, [])

  const getBubbleMessage = () => {
    if (Camera.getCameraPermissionStatus() === 'not-determined') {
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

              void onCodeScanned(
                [
                  {
                    type: PDF_417,
                    value: text,
                  },
                ],
                {} as Frame,
              )
            })
          }}
        />
        {renderBubble()}
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        {hasPermission && device && (
          <GestureDetector gesture={gesture}>
            <ReanimatedCamera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={active}
              torch={torch ? 'on' : 'off'}
              codeScanner={codeScanner}
              animatedProps={animatedZoom}
            />
          </GestureDetector>
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
    </GestureHandlerRootView>
  )
}

LicenseScannerScreen.options = getNavigationOptions()
