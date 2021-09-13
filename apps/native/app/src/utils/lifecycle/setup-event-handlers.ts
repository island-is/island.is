import { Constants } from 'expo-barcode-scanner'
import {
  DeviceEventEmitter,
  Linking,
  Platform
} from 'react-native'
import DataWedgeIntents from 'react-native-datawedge-intents'
import { Navigation } from 'react-native-navigation'
import SpotlightSearch from 'react-native-spotlight-search'
import { evaluateUrl, navigateTo } from '../../lib/deep-linking'
import {
  ButtonRegistry,
  ComponentRegistry
} from '../component-registry'

export function setupEventHandlers() {
  // Listen for url events through iOS and Android's Linking library
  Linking.addEventListener('url', ({ url }) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        evaluateUrl(url)
      }
    })
  })

  if (Platform.OS === 'ios') {
    SpotlightSearch.searchItemTapped((url) => {
      navigateTo(url)
    })

    SpotlightSearch.getInitialSearchItem().then((url) => {
      navigateTo(url)
    })
  }

  // DataWedgeIntents.registerBroadcastReceiver({
  //   filterActions: [
  //       'com.zebra.reactnativedemo.ACTION',
  //       'com.symbol.datawedge.api.RESULT_ACTION'
  //   ],
  //   filterCategories: [
  //       'android.intent.category.DEFAULT'
  //   ]
  // });

  const onBarcodeScan = async ({ data, labelType }: any) => {
    const type =
      labelType === 'LABEL-TYPE-PDF417'
        ? Constants.BarCodeType.pdf417
        : labelType === 'LABEL-TYPE-QRCODE'
        ? Constants.BarCodeType.qr
        : labelType
    await Navigation.dismissAllModals();
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.LicenseScanDetailScreen,
              passProps: {
                type,
                data,
              },
            },
          },
        ],
      },
    })
  }

  DeviceEventEmitter.addListener('barcode_scan', onBarcodeScan)
  // DeviceEventEmitter.addListener('enumerated_scanners', (deviceEvent) => {
  //   console.log('deviceEvent', deviceEvent)
  // })
  DataWedgeIntents.registerReceiver('com.zebra.dwintents.ACTION', '')

  // Get initial url and pass to the opener
  Linking.getInitialURL()
    .then((url) => {
      if (url) {
        Linking.openURL(url)
      }
    })
    .catch((err) => console.error('An error occurred in getInitialURL: ', err))

  // Navigation.events().registerBottomTabSelectedListener((e) => {
  //   uiStore.setState({
  //     unselectedTab: e.unselectedTabIndex,
  //     selectedTab: e.selectedTabIndex,
  //   })
  // })

  // handle navigation topBar buttons
  Navigation.events().registerNavigationButtonPressedListener(
    ({ buttonId }) => {
      switch (buttonId) {
        case ButtonRegistry.UserButton:
          return navigateTo('/user')
        case ButtonRegistry.NotificationsButton:
          return navigateTo('/notifications')
        case ButtonRegistry.ScanLicenseButton:
          return navigateTo('/license-scanner')
      }
    },
  )

  // Handle quick actions
  // DeviceEventEmitter.addListener('quickActionShortcut', handleQuickAction)
}
