import { ScanResultCard } from '@ui'
import { BarCodeEvent, Constants } from 'expo-barcode-scanner'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { useNavigationButtonPress } from 'react-native-navigation-hooks/dist'
import { StackRegistry } from '../../utils/component-registry'
import { LicenseScanResult } from './scan-results/license-scan-result'

enum ScanResult {
  DRIVER_LICENCE = 'DriversLicense',
  FIREARM_LICENSE = 'FirearmLicense',
  ADR_LICENSE = 'AdrLicense',
  MACHINE_LICENSE = 'MachineLicense',
  DISABILITY_LICENSE = 'DisabilityLicense',
  UNKNOWN = 'Unknown',
}

const DriversLicenseTemplateIds = [
  'cd998d1b-3cfa-4753-9f1e-6dc5187c59f9',
  '3d2a9e02-24ef-446b-ab4a-f34b26850460',
]

const FirearmTemplateIds = [
  'dfb706c1-3a78-4518-bf25-cebbf0a93132',
  '61f74977-0e81-4786-94df-6b8470013f09',
]
const VVRTemplateIds = [
  '61012578-c2a0-489e-8dbd-3df5b3e538ea',
  'd63e4b27-9a0b-45b1-8fe4-a9be0011781f',
]
const ADRTemplaeIds = [
  '4e49febe-7ca9-49e3-a3be-3be70cb996c2',
  '62a105d5-ef8a-419e-8423-fbbbfb5f1b36',
]
const DisabilityTemplateIds = [
  'd0b1a6b6-3af3-4131-9b97-c6d7d2ed7e63',
  'c78364b6-33a8-4242-84ca-24de0854fe00',
]

export const LicenseScanDetailScreen: NavigationFunctionComponent<
  BarCodeEvent & { isExpired: boolean }
> = ({ data, type, isExpired }) => {
  const [loaded, setLoaded] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult>(ScanResult.UNKNOWN)
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
          setScanResult(ScanResult.DRIVER_LICENCE)
        }

        if (DriversLicenseTemplateIds.includes(parsed?.passTemplateId)) {
          setScanResult(ScanResult.DRIVER_LICENCE)
        }

        if (FirearmTemplateIds.includes(parsed?.passTemplateId)) {
          setScanResult(ScanResult.FIREARM_LICENSE)
        }

        if (ADRTemplaeIds.includes(parsed?.passTemplateId)) {
          setScanResult(ScanResult.ADR_LICENSE)
        }

        if (VVRTemplateIds.includes(parsed?.passTemplateId)) {
          setScanResult(ScanResult.MACHINE_LICENSE)
        }

        if (DisabilityTemplateIds.includes(parsed?.passTemplateId)) {
          setScanResult(ScanResult.DISABILITY_LICENSE)
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
  }, [data, type, isExpired])

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {isExpired === true ? (
        <ScanResultCard
          type={scanResult}
          loading={false}
          isExpired={isExpired}
          error={true}
          errorMessage={intl.formatMessage({
            id: 'licenseScanDetail.barcodeExpired',
          })}
        />
      ) : (
        <>
          <LicenseScanResult data={data} onLoad={setLoaded} type={scanResult} />

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
