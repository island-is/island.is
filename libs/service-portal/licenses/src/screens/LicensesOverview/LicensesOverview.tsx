import React from 'react'
import { defineMessage } from 'react-intl'

import { AlertBanner, Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  IntroHeader,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import LicenseCards from '../../components/LicenseCards/LicenseCards'
import { LicenseLoader } from '../../components/LicenseLoader/LicenseLoader'
import { useDrivingLicense } from '@island.is/service-portal/graphql'
import { m } from '../../lib/messages'

export const LicensesOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const { data, status, loading, error } = useDrivingLicense()

  return (
    <>
      <Box marginBottom={[3, 4, 5]}>
        <IntroHeader
          title={defineMessage(m.title)}
          intro={defineMessage(m.intro)}
        />
      </Box>
      {loading && <LicenseLoader />}
      {data && <LicenseCards data={data} />}

      {!loading &&
        !error &&
        (status === 'Unknown' || status === 'NotAvailable') && (
          <Box marginTop={8}>
            <EmptyState title={m.errorNoData} />
          </Box>
        )}

      {error && (
        <Box>
          <AlertBanner
            description={formatMessage(m.errorFetch)}
            variant="error"
          />
        </Box>
      )}
    </>
  )
}

export default LicensesOverview
