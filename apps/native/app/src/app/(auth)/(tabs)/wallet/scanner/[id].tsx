import { useIntl } from 'react-intl'
import { Stack } from 'expo-router'
import { ScrollView } from 'react-native'
import { useTheme } from 'styled-components/native'

import { ScanResultCard, SupportedGenericLicenseTypes } from '@/ui'
import { VerifyLicenseBarcodeError } from '@/graphql/types/schema'
import { getScanResult } from '../../../../../stores/scan-result-store'

export default function LicenseScanDetailScreen() {
  const intl = useIntl()
  const theme = useTheme()
  const scanResult = getScanResult()

  if (!scanResult) {
    return null
  }

  const { licenseType, data, error } = scanResult
  const type = licenseType as unknown as SupportedGenericLicenseTypes
  const isExpired = error === VerifyLicenseBarcodeError.Expired

  return (
    <>
      <Stack.Screen
        options={{
          title: intl.formatMessage({ id: 'licenseScanner.title' }),
        }}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: theme.spacing[2],
          paddingTop: theme.spacing[1],
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
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
      </ScrollView>
    </>
  )
}
