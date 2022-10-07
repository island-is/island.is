import React from 'react'
import { defineMessage } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  ErrorScreen,
  IntroHeader,
  ServicePortalModuleComponent,
  m as coreMessage,
} from '@island.is/service-portal/core'
import LicenseCards from '../../components/LicenseCards/LicenseCards'
import { LicenseLoader } from '../../components/LicenseLoader/LicenseLoader'
import { m } from '../../lib/messages'
import { useDrivingLicense } from '@island.is/service-portal/graphql'
import { usePassport } from '@island.is/service-portal/graphql'

export const LicensesOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.license')
  const { data, status, loading, error } = useDrivingLicense()
  const {
    data: passportData,
    loading: passportLoading,
    error: passportError,
  } = usePassport()

  const isLoading = loading || passportLoading
  const hasError = error && passportError
  const hasData = !!(data || passportData)
  const { formatMessage } = useLocale()

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag="500"
        title={formatMessage(coreMessage.somethingWrong)}
        children={formatMessage(coreMessage.errorFetchModule, {
          module: formatMessage(coreMessage.licenses).toLowerCase(),
        })}
      />
    )
  }
  return (
    <>
      <Box marginBottom={[3, 4, 5]}>
        <IntroHeader
          title={defineMessage(m.title)}
          intro={defineMessage(m.intro)}
        />
      </Box>
      {isLoading && (
        <Box marginBottom={1}>
          <LicenseLoader />
        </Box>
      )}
      {hasData && (
        <LicenseCards
          drivingLicenseData={data}
          passportData={passportData || undefined}
        />
      )}

      {!isLoading &&
        !hasError &&
        (status === 'Unknown' || status === 'NotAvailable') && (
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        )}
      {hasError && (
        <Box>
          <EmptyState description={m.errorFetch} />
        </Box>
      )}
    </>
  )
}

export default LicensesOverview
