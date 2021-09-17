import { Bubble } from '@island.is/island-ui-native'
import { BarCodeEvent, BarCodeScanner } from 'expo-barcode-scanner'
import { Camera } from 'expo-camera'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useIntl } from 'react-intl'
import {
  Alert,
  LayoutRectangle,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import {
  useNavigationButtonPress,
  useNavigationComponentDidAppear,
  useNavigationComponentDidDisappear,
} from 'react-native-navigation-hooks/dist'
import styled from 'styled-components/native'
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options'
import { authStore } from '../../stores/auth-store'
import flashligth from '../../assets/icons/flashlight.png'
import {
  ComponentRegistry,
  StackRegistry,
} from '../../utils/component-registry'

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

const {
  useNavigationOptions,
  getNavigationOptions,
} = useThemedNavigationOptions(
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

  const invalidTimeout = useRef<NodeJS.Timeout>()
  const intl = useIntl()

  useEffect(() => {
    Camera.requestPermissionsAsync().then(({ status }) => {
      setHasPermission(status === 'granted')
    })
  }, [])

  const onFlashlightPress = useCallback(() => {
    setTorch((v) => !v)
  }, [])

  const onBarCodeScanned = useCallback(({ type, data }: BarCodeEvent) => {
    let isExpired;
    if (invalidTimeout.current) {
      clearTimeout(invalidTimeout.current)
    }

    if (!data.includes('TGLJZW')) {
      invalidTimeout.current = setTimeout(() => {
        setInvalid(false)
      }, 2000)
      return setInvalid(true)
    }

    if (data.includes('expires')) {
      try {
        const { expires } = JSON.parse(data)
        const startDate = new Date(expires)
        const seconds = (Date.now() - startDate.getTime()) / 1000
        isExpired = seconds > 0

      } catch (error) {
        // noop
      }
    }

    impactAsync(ImpactFeedbackStyle.Heavy)
    setInvalid(false)
    setActive(false)
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.LicenseScanDetailScreen,
              passProps: { type, data, isExpired },
              options: {
                topBar: {
                  visible: true,
                  title: {
                    text: 'Niðurstöður',
                  },
                },
              },
            },
          },
        ],
      },
    }).then((modalComponentId) => {
      const modal = Navigation.events().registerModalDismissedListener(
        (evt) => {
          if (evt.componentId === modalComponentId) {
            setActive(true)
            modal.remove()
          }
        },
      )
    })
  }, [])

  const prepareRatio = async () => {
    if (Platform.OS === 'android') {
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
          flashMode={
            torch
              ? Camera.Constants.FlashMode.torch
              : Camera.Constants.FlashMode.off
          }
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
      <View
        style={{
          position: 'absolute',
          top: 64,
          left: 0,
          right: 0,
          alignItems: 'center',
        }}
      >
        <Bubble>
          {typeof hasPermission === 'undefined' || hasPermission === null
            ? intl.formatMessage({ id: 'licenseScanner.awaitingPermission' })
            : hasPermission === false
            ? intl.formatMessage({ id: 'licenseScanner.noCameraAccess' })
            : invalid
            ? 'Ógilt strikamerki'
            : intl.formatMessage({ id: 'licenseScanner.helperMessage' })}
        </Bubble>
      </View>
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
