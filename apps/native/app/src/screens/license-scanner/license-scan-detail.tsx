import { ScanResultCard, SupportedGenericLicenseTypes } from '@ui'
import { useIntl } from 'react-intl'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { useNavigationButtonPress } from 'react-native-navigation-hooks/dist'
import styled from 'styled-components/native'
import {
  VerifyLicenseBarcodeError,
  VerifyLicenseBarcodeMutation,
} from '../../graphql/types/schema'
import { StackRegistry } from '../../utils/component-registry'

const Host = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[2]}px;
`

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
    <Host>
      <ScanResultCard
        isExpired={isExpired}
        error={!!error}
        errorMessage={intl.formatMessage({
          id: isExpired
            ? 'licenseScanDetail.barcodeExpired'
            : 'licenseScanner.errorUnknown',
        })}
        {...data}
        hasNoData={!data?.nationalId}
        type={type ?? 'Unknown'}
      />
    </Host>
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
