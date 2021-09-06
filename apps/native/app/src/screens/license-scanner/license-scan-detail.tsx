import { BarCodeEvent, Constants } from 'expo-barcode-scanner'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { useNavigationButtonPress } from 'react-native-navigation-hooks/dist'
import { StackRegistry } from '../../utils/component-registry'
import { CovidCertificateScanResult } from './scan-results/covid-certificate-scan-result'
import { DriverLicenseScanResult } from './scan-results/driver-license-scan-result'

enum ScanResult {
  COVID_CERTIFICATE,
  DRIVER_LICENSE,
  UNKNOWN,
}

export const LicenseScanDetailScreen: NavigationFunctionComponent<BarCodeEvent> = ({
  data,
  type,
}) => {
  const [scanResult, setScanResult] = useState<ScanResult>()

  useNavigationButtonPress(({ buttonId }) => {
    if (buttonId === 'LICENSE_SCANNER_DONE') {
      Navigation.dismissModal(StackRegistry.LicenseScannerStack)
    }
  })

  useEffect(() => {
    try {
      if (type === Constants.BarCodeType.pdf417) {
        const parsed = JSON.parse(data)
        if (parsed?.TGLJZW) {
          setScanResult(ScanResult.DRIVER_LICENSE)
        }
      } else if (type === Constants.BarCodeType.qr) {
        if (data.startsWith('HC1')) {
          setScanResult(ScanResult.COVID_CERTIFICATE)
        }
      }
    } catch (err) {
      console.log('unable to decode barcode', err)
    }
  }, [data, type])

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {scanResult === ScanResult.DRIVER_LICENSE && (
        <DriverLicenseScanResult data={data} />
      )}
      {scanResult === ScanResult.COVID_CERTIFICATE && (
        <CovidCertificateScanResult data={data} />
      )}
    </View>
  )
}

LicenseScanDetailScreen.options = {
  topBar: {
    visible: true,
    title: {
      text: '',
    },
    rightButtons: [
      {
        id: 'LICENSE_SCANNER_DONE',
        systemItem: 'done',
      },
    ],
  },
}
