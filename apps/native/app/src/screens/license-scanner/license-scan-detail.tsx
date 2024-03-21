import { ScanResultCard, SupportedGenericLicenseTypes } from '@ui'
import React from 'react'
import { useIntl } from 'react-intl'
import { View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { useNavigationButtonPress } from 'react-native-navigation-hooks/dist'
import {
  VerifyLicenseBarcodeError,
  VerifyLicenseBarcodeMutation,
} from '../../graphql/types/schema'
import { StackRegistry } from '../../utils/component-registry'
import { LicenseScanResult } from './scan-results/license-scan-result'

interface LicenseScanDetailScreenProps {
  verifyLicenseBarcode: VerifyLicenseBarcodeMutation['verifyLicenseBarcode']
}

export const LicenseScanDetailScreen: NavigationFunctionComponent<
  LicenseScanDetailScreenProps
> = ({ verifyLicenseBarcode: { licenseType, data, error } }) => {
  const intl = useIntl()

  // We need to cast licenseType to SupportedGenericLicenseTypes because not all GenericLicenseTypes are supported
  const type = licenseType as unknown as SupportedGenericLicenseTypes
  const isExpired = error === VerifyLicenseBarcodeError.Expired

  useNavigationButtonPress(({ buttonId }) => {
    if (buttonId === 'LICENSE_SCANNER_DONE') {
      Navigation.dismissModal(StackRegistry.LicenseScannerStack)
    }
  })

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {error ? (
        <ScanResultCard
          type={type ?? SupportedGenericLicenseTypes.Unknown}
          isExpired={isExpired}
          error={!!error}
          errorMessage={intl.formatMessage({
            id: isExpired
              ? 'licenseScanDetail.barcodeExpired'
              : 'licenseScanDetail.errorUnknown',
          })}
        />
      ) : (
        <LicenseScanResult data={data} type={type} />
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
