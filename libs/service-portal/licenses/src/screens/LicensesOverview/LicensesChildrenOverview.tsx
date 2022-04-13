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
import {
  Query,
  useDrivingLicense,
  NATIONAL_REGISTRY_CHILDREN,
} from '@island.is/service-portal/graphql'
import { m } from '../../lib/messages'
import { passportDetail, passportDetailChildren } from '../../mock/passport'
import { useQuery } from '@apollo/client'
import ChildrenLicenseCards from '../../components/LicenseCards/ChildrenLicenseCards'

export const LicensesChildrenOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const {
    data: drivingLicenseData,
    status,
    loading: drivingLicenseLoading,
    error: drivingLicenseError,
  } = useDrivingLicense()
  /* TODO: Set up passport resolver to fetch all children and passport for all children, if no passport then return empty passport object */
  const passportChildrenData = passportDetailChildren
  const passportData = passportDetail
  const passportLoading = false
  const passportError = false

  const childrensLicenensesData = {
    drivingLicenseData: drivingLicenseData,
    passportData: passportChildrenData,
  }
  return (
    <>
      <Box>
        <IntroHeader
          title={defineMessage(m.titleChildren)}
          intro={defineMessage(m.introChildren)}
        />
      </Box>
      {(drivingLicenseLoading || passportLoading) && <LicenseLoader />}
      {childrensLicenensesData &&
        drivingLicenseData &&
        !drivingLicenseLoading &&
        !passportLoading && (
          <ChildrenLicenseCards data={childrensLicenensesData} />
        )}
      {/* 
      {!drivingLicenseLoading &&
        !drivingLicenseError &&
        (status === 'Unknown' || status === 'NotAvailable') && (
          <Box marginTop={8}>
            <EmptyState title={m.errorNoData} />
          </Box>
        )} */}

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

export default LicensesChildrenOverview
