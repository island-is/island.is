import React from 'react'
import { defineMessage } from 'react-intl'

import { AlertBanner, Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  // EmptyState,
  IntroHeader,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import LicenseCards from '../../components/LicenseCards/LicenseCards'
import { LicenseLoader } from '../../components/LicenseLoader/LicenseLoader'
import { useDrivingLicense } from '@island.is/service-portal/graphql'
import { m } from '../../lib/messages'
import { passportDetail } from '../../mock/passport'
// import EmptyCard from '../../components/EmptyCard/EmptyCard'

export const LicensesOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const {
    data: drivingLicenseData,
    status,
    loading: drivingLicenseLoading,
    error: drivingLicenseError,
  } = useDrivingLicense()

  const passportData = passportDetail
  const passportLoading = false
  const passportError = false

  console.log('drivingLicenseData', drivingLicenseData)

  return (
    <>
      <Box marginBottom={[3, 4, 5]}>
        <IntroHeader
          title={defineMessage(m.title)}
          intro={defineMessage(m.intro)}
        />
      </Box>
      {(drivingLicenseLoading || passportLoading) && <LicenseLoader />}
      {(drivingLicenseData || passportData) && (
        <LicenseCards
          drivingLicenseData={drivingLicenseData}
          passportData={passportData}
        />
      )}

      {drivingLicenseError && (
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
