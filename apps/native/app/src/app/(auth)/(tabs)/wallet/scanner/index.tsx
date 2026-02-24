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
  Camera,
  CameraProps,
  Frame,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera'
import { CodeScanner, CodeType } from 'react-native-vision-camera'
import styled from 'styled-components/native'
import * as Device from 'expo-device'
import { router, Stack, useFocusEffect } from 'expo-router'

import { Bubble, Button, theme } from '@/ui'
import flashligth from '@/assets/icons/flashlight.png'
import {
  useVerifyLicenseBarcodeMutation,
  VerifyLicenseBarcodeError,
} from '@/graphql/types/schema'
import { isIos } from '@/utils/devices'
import { isJWT } from '@/utils/token'
import { authStore } from '@/stores/auth-store'
import { setScanResult } from '../../../../../stores/scan-result-store'

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

const isSimulator = isIos && Device.isDevice === false

export default function LicenseScannerScreen() {
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
        scanningRef.current = ScanningStatus.FINISHED

        setInvalid(false)
        setActive(false)

        setScanResult(data.verifyLicenseBarcode)
        router.push({
          pathname: '/(auth)/(tabs)/wallet/scanner/[id]',
          params: { id: 'result' },
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
    void requestPermission()
    if (!isIos) {
      authStore.setState({
        noLockScreenUntilNextAppStateActive: true,
      })
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      setActive(true)
      return () => {
        setActive(false)
        reset()
        scanningRef.current = ScanningStatus.INITIAL
      }
    }, []),
  )

  const onFlashlightPress = useCallback(() => {
    setTorch((v) => !v)
  }, [])

  useEffect(() => {
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
      <>
        <Stack.Screen
          options={{
            title: intl.formatMessage({ id: 'licenseScanner.title' }),
          }}
        />
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
      </>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: intl.formatMessage({ id: 'licenseScanner.title' }),
        }}
      />
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
    </>
  )
}
