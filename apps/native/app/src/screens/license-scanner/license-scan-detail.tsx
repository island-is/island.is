import { BarCodeEvent, Constants } from 'expo-barcode-scanner'
import React, { useEffect, useState, useRef } from 'react'
import { View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { ScanResultCard } from '@island.is/island-ui-native'
import { useNavigationButtonPress } from 'react-native-navigation-hooks/dist'
import { StackRegistry } from '../../utils/component-registry'
import { CovidCertificateScanResult } from './scan-results/covid-certificate-scan-result'
import { DriverLicenseScanResult } from './scan-results/driver-license-scan-result'
import { useIntl } from 'react-intl'

enum ScanResult {
  COVID_CERTIFICATE,
  DRIVER_LICENSE,
  FIREARM_LICENSE,
  UNKNOWN,
}

const FirearmTemplateIds = ['dfb706c1-3a78-4518-bf25-cebbf0a93132','61f74977-0e81-4786-94df-6b8470013f09'];

export const LicenseScanDetailScreen: NavigationFunctionComponent<
  BarCodeEvent & { isExpired: boolean }
> = ({ data, type, isExpired }) => {
  const [loaded, setLoaded] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult>()
  const intl = useIntl()

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
        if (FirearmTemplateIds.includes(parsed?.passTemplateId)) {
          setScanResult(ScanResult.FIREARM_LICENSE)
        }
      }
      // else if (type === Constants.BarCodeType.qr) {
      //   if (data.startsWith('HC1')) {
      //     setScanResult(ScanResult.COVID_CERTIFICATE)
      //   }
      // }
    } catch (err) {
      console.log('unable to decode barcode', err)
    }
  }, [data, type])

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {isExpired === true ? (
        <ScanResultCard
          title={intl.formatMessage({ id: 'licenseScannerResult.driverLicenseTitle'})}
          loading={false}
          isExpired={isExpired}
          error={true}
          errorMessage={intl.formatMessage({
            id: 'licenseScanDetail.barcodeExpired',
          })}
        />
      ) : (
        <>
          {scanResult === ScanResult.DRIVER_LICENSE && (
            <DriverLicenseScanResult data={data} onLoad={setLoaded} title={intl.formatMessage({ id: 'licenseScannerResult.driverLicenseTitle'})} />
          )}
          {scanResult === ScanResult.FIREARM_LICENSE && (
            <DriverLicenseScanResult
              data={data}
              onLoad={setLoaded}
              backgroundColor="blue"
              title={intl.formatMessage({ id: 'licenseScannerResult.firarmsLicenseTitle'})}
              hasNoData={true}
            />
          )}
          {/* {scanResult === ScanResult.COVID_CERTIFICATE && (
            <CovidCertificateScanResult data={data} onLoad={setLoaded} />
          )} */}
        </>
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
