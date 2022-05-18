import React from 'react'
import { defineMessage } from 'react-intl'

import { ActionCard, AlertBanner, Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroHeader,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import LicenseCards from '../../components/LicenseCards/LicenseCards'
import { LicenseLoader } from '../../components/LicenseLoader/LicenseLoader'
import { m } from '../../lib/messages'
import { useHistory } from 'react-router-dom'
import { useLicenses } from '@island.is/service-portal/graphql'

export const LicensesOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const { data, loading, error } = useLicenses()

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

            const text = 'skírteinisnúmer'
            const tag = 'Placeholder'

            let title

            switch (item.license.type) {
              case 'DriversLicense':
                title = m.drivingLicense.defaultMessage
                break
              case 'AdrLicense':
                title = m.adrLicense.defaultMessage
                break
              case 'MachineLicense':
                title = m.machineLicense.defaultMessage
                break
            }

            return (
              <ActionCard
                key={i}
                heading={title}
                text={`${m.licenseNumber.defaultMessage} - ${text}`}
                tag={{ label: tag }}
                cta={{
                  label: 'click me',
                  onClick: () => console.log('clicked'),
                }}
              />
            )
          })}
        </LicenseCards>
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
