import { useGetOccupationalLicensesQuery } from './OccupationalLicensesOverview.generated'
import { AlertMessage, Box, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  EmptyState,
  CardLoader,
  IntroHeader,
  m,
  ErrorScreen,
} from '@island.is/service-portal/core'
import { Organization } from '@island.is/shared/types'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'

import { EducationActionCard } from '../../components/EducationActionCard'
import { HealthDirectorateActionCard } from '../../components/HealthDirectorateActionCard'
import { olMessage as om } from '../../lib/messages'

const OccupationalLicensesOverview = () => {
  const { data, loading, error } = useGetOccupationalLicensesQuery({})
  const { formatMessage } = useLocale()

  const organizations =
    (data?.getOrganizations?.items as Array<Organization>) ?? []

  if (error)
    return (
      <ErrorScreen
        title={formatMessage(m.errorFetch)}
        tag={formatMessage(m.errorTitle)}
      />
    )

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={m.occupationaLicenses}
        intro={formatMessage(m.occupationalLicensesDescription)}
      />
      {data?.occupationalLicenses?.error.hasError && (
        <Box marginTop={6}>
          <AlertMessage
            type="warning"
            title={formatMessage(m.errorFetch)}
            message={formatMessage(om.fetchOverviewErrorMessage)}
          />
        </Box>
      )}
      <Box marginTop={6}>
        {loading && !error && <CardLoader />}
        {!loading &&
          !error &&
          data &&
          data?.occupationalLicenses &&
          data.occupationalLicenses.count === 0 && (
            <EmptyState title={m.noDataFound} />
          )}
        <Stack space={2}>
          {data?.occupationalLicenses?.items.map((license, index) =>
            license.__typename === 'OccupationalLicenseEducationalLicense' ? (
              <EducationActionCard
                {...license}
                key={index}
                orgImage={getOrganizationLogoUrl(
                  license.school,
                  organizations,
                  120,
                )}
              />
            ) : license.__typename ===
              'OccupationalLicenseHealthDirectorateLicense' ? (
              <HealthDirectorateActionCard
                key={index}
                {...license}
                orgImage={getOrganizationLogoUrl(
                  license.name ?? '',
                  organizations,
                  120,
                )}
              />
            ) : null,
          )}
        </Stack>
      </Box>
    </Box>
  )
}

export default OccupationalLicensesOverview
