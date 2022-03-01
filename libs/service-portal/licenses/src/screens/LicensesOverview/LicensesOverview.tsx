import React from 'react'
import { defineMessage } from 'react-intl'

import { AlertBanner, Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  IntroHeader,
  m,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import LicenseCards from '../../components/LicenseCards/LicenseCards'
import { LicenseLoader } from '../../components/LicenseLoader/LicenseLoader'
import { useDrivingLicense } from '@island.is/service-portal/graphql'

export const LicensesOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.licenses')
  const { formatMessage } = useLocale()
  const { data, status, loading, error } = useDrivingLicense()

  const errorFetchText = defineMessage({
    id: 'sp.licenses:error-fetch',
    defaultMessage: 'Ekki tókst að sækja gögn',
  })

  const noDataFoundText = defineMessage({
    id: 'sp.licenses:no-data-found',
    defaultMessage: 'Engin gögn fundust',
  })
  return (
    <>
      <Box marginBottom={[3, 4, 5]}>
        <IntroHeader
          title={defineMessage({
            id: 'sp.licenses:title',
            defaultMessage: 'Þín skírteini',
          })}
          intro={defineMessage({
            id: 'sp.licenses:intro',
            defaultMessage:
              'Hér gefur að líta á núverandi skírteini og réttindi þín. Til að byrja með geturu fundið ökuréttindi þín og kannað stöðu stöðu þeirra. Unnið er að því að bæta við fleiri skírteinum og réttindum eins og bólusetningarskírteini og vegabréfi.',
          })}
        />
      </Box>
      {loading && <LicenseLoader />}
      {data && <LicenseCards data={data} />}

      {!loading &&
        !error &&
        (status === 'Unknown' || status === 'NotAvailable') && (
          <Box marginTop={8}>
            <EmptyState title={noDataFoundText} />
          </Box>
        )}

      {error && (
        <Box>
          <AlertBanner
            description={formatMessage(errorFetchText)}
            variant="error"
          />
        </Box>
      )}
    </>
  )
}

export default LicensesOverview
