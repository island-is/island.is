import React from 'react'
import { defineMessage } from 'react-intl'

import { ActionCard, AlertBanner, Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroHeader,
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import LicenseCards from '../../components/LicenseCards/LicenseCards'
import { LicenseLoader } from '../../components/LicenseLoader/LicenseLoader'
<<<<<<< HEAD
=======
import { useLicenses } from '@island.is/service-portal/graphql'
>>>>>>> 932a196f8 (wip: ADR license integration)
import { m } from '../../lib/messages'
import { useHistory } from 'react-router-dom'
import {
  GenericLicenseType,
  GenericUserLicenseFetchStatus,
  useLicenses,
} from '@island.is/service-portal/graphql'

export const LicensesOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const { data, loading, error } = useLicenses()
<<<<<<< HEAD
  const history = useHistory()

  const isError = data?.every(
    (item) => item.fetch.status === GenericUserLicenseFetchStatus.Error,
  )
=======

  console.log('data')
  console.log(data)
>>>>>>> 932a196f8 (wip: ADR license integration)

  return (
    <>
      <Box marginBottom={[3, 4, 5]}>
        <IntroHeader
          title={defineMessage(m.title)}
          intro={defineMessage(m.intro)}
        />
      </Box>
      {loading && <LicenseLoader />}
      {data && (
        <LicenseCards>
          {data.map((item, i) => {
            if (item.license.status !== 'HasLicense') {
              return null
            }

<<<<<<< HEAD
            const text = 'skírteinisnúmer'
            const tag = 'Placeholder'
            let title

            switch (item.license.type) {
              case 'DriversLicense':
                title = m.drivingLicense.defaultMessage
                break
              default:
                title = 'Generic License Title'
                break
            }

            let servicePortalPath: ServicePortalPath

            switch (item.license.type) {
              case GenericLicenseType.DriversLicense:
                servicePortalPath = ServicePortalPath.LicensesDrivingDetail
                break
            }

            return (
              <ActionCard
                key={i}
                heading={title}
                text={`${m.licenseNumber.defaultMessage} - ${text}`}
                tag={{ label: tag }}
                cta={{
                  label: 'Skoða nánar',
                  onClick: () => history.push(servicePortalPath),
                }}
              />
            )
          })}
        </LicenseCards>
      )}

      {(error || isError) && (
=======
      {error && (
>>>>>>> 932a196f8 (wip: ADR license integration)
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
