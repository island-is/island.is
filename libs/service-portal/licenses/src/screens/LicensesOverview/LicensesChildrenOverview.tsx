import React from 'react'
import { defineMessage } from 'react-intl'

import { AlertBanner, Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  IntroHeader,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { LicenseLoader } from '../../components/LicenseLoader/LicenseLoader'
import { useDrivingLicense } from '@island.is/service-portal/graphql'
import { m } from '../../lib/messages'
import { passportDetail, passportDetailChildren } from '../../mock/passport'
import ChildrenLicenseCards from '../../components/LicenseCards/ChildrenLicenseCards'

export const LicensesChildrenOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()

  /* TODO: Set up passport resolver to fetch all children and passport for all children, if no passport then return null */
  const passportChildrenData = passportDetailChildren
  const passportLoading = false
  const passportError = false

  const childrensLicenensesData = { passportData: passportChildrenData }
  return (
    <>
      <Box>
        <IntroHeader
          title={defineMessage(m.titleChildren)}
          intro={defineMessage(m.introChildren)}
        />
      </Box>
      {passportLoading && <LicenseLoader />}
      {childrensLicenensesData && !passportLoading && (
        <ChildrenLicenseCards data={childrensLicenensesData} />
      )}

      {passportError && (
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

export default LicensesChildrenOverview
