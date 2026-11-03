import { useIntl } from 'react-intl'
import { router, Stack } from 'expo-router'
import styled from 'styled-components/native'

import { ScanResultCard, SupportedGenericLicenseTypes } from '@/ui'
import { VerifyLicenseBarcodeError } from '@/graphql/types/schema'
import { getScanResult } from '../../../../../stores/scan-result-store'

const Host = styled.ScrollView`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[2]}px;
`

export default function LicenseScanDetailScreen() {
  const intl = useIntl()
  const scanResult = getScanResult()

  if (!scanResult) {
    return null
  }

  const { licenseType, data, error } = scanResult
  const type = (licenseType as unknown) as SupportedGenericLicenseTypes
  const isExpired = error === VerifyLicenseBarcodeError.Expired

  return (
    <>
      <Stack.Screen
        options={{
          title: intl.formatMessage({ id: 'licenseScanner.title' }),
        }}
      />
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
          // No `details`: `verifyLicenseBarcode` returns identity only, so
          // there are no entitlements to show. ScanResultCard draws the
          // section only when they are supplied, which is what the API change
          // on feat/scan-first-licences adds.
          hasNoData={!data?.nationalId}
          type={type ?? 'Unknown'}
        />
      </Host>
    </>
  )
}
