import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { authStore } from '../../stores/auth-store'
import {
  ComponentRegistry,
  StackRegistry,
} from '../../utils/component-registry'
import {
  useNavigationButtonPress,
  useNavigationComponentDidAppear,
  useNavigationComponentDidDisappear,
} from 'react-native-navigation-hooks/dist'
import styled from 'styled-components/native'
import { dynamicColor, font } from '@island.is/island-ui-native'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { useIntl } from 'react-intl'
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options'

const Bubble = styled.View`
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 32px;
  padding-right: 32px;
  border-radius: 32px;
  background-color: ${dynamicColor('background')};
`

const BubbleText = styled.Text`
  ${font()}
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
  useNavigationOptions(componentId);
  const [hasPermission, setHasPermission] = useState<boolean>()
  const [active, setActive] = useState(false)
  const intl = useIntl();

  useEffect(() => {
    ;(async () => {
      authStore.setState({ noLockScreenUntilNextAppStateActive: true })
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      console.log('status', status)
      setHasPermission(status === 'granted')
      authStore.setState({ noLockScreenUntilNextAppStateActive: false })
    })()
  }, [])

  useNavigationComponentDidAppear(() => {
    setActive(true)
  })

  useNavigationComponentDidDisappear(() => {
    setActive(false)
  })

  useNavigationButtonPress(({ buttonId }) => {
    if (buttonId === 'LICENSE_SCANNER_DONE') {
      Navigation.dismissModal(StackRegistry.LicenseScannerStack)
    }
  })

  const handleBarCodeScanned = ({ type, data }: any) => {
    impactAsync(ImpactFeedbackStyle.Heavy);
    setActive(false)
    Navigation.push(StackRegistry.LicenseScannerStack, {
      component: {
        name: ComponentRegistry.LicenseScanDetailScreen,
        passProps: {
          data,
        },
      },
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {hasPermission === true && (
        <BarCodeScanner
          onBarCodeScanned={active ? handleBarCodeScanned : undefined}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <View
        style={{
          position: 'absolute',
          bottom: 64,
          left: 0,
          right: 0,
          alignItems: 'center',
        }}
      >
        <Bubble>
          <BubbleText>
            {typeof hasPermission === 'undefined'
              ? intl.formatMessage({ id: 'licenseScanner.awaitingPermission'})
              : hasPermission === false
              ? intl.formatMessage({ id: 'licenseScanner.noCameraAccess'})
              : intl.formatMessage({ id: 'licenseScanner.helperMessage'})
            }
          </BubbleText>
        </Bubble>
      </View>
    </View>
  )
}

LicenseScannerScreen.options = getNavigationOptions();
