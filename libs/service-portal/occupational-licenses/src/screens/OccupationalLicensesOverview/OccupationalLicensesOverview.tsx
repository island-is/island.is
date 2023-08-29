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

import { olMessage as om } from '../../lib/messages'
import LicenceActionCard from '../../components/LicenceActionCard'
import { OccupationalLicensesPaths } from '../../lib/paths'
import { OccupationalLicense } from '@island.is/api/schema'

// const createLicenseUrl = (license: OccupationalLicense) => {
//   switch (license.__typename) {
//     case 'OccupationalLicensesEducationalLicense':
//       return OccupationalLicensesPaths.OccupationalLicensesEducationDetail.replace(
//         ':id',
//         license.id,
//       ).replace(
//         ':type',
//         license.profession.charAt(0).toUpperCase() +
//           license.profession.slice(1),
//       )
//     case 'OccupationalLicensesHealthDirectorateLicense':
//       if (!license.number || !license.profession) return undefined
//       return OccupationalLicensesPaths.OccupationalLicensesHealthDirectorateDetail.replace(
//         ':id',
//         license.number,
//       ).replace(':type', license.profession)
//     default:
//       return undefined
//   }
// }

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
          {data?.occupationalLicenses?.items.map((license, index) => {
            // const url = createLicenseUrl(license as OccupationalLicense)
            return (
              <LicenceActionCard
                key={index}
                type={license.type ?? undefined}
                validFrom={license.validFrom ?? undefined}
                // url={url}
                image={getOrganizationLogoUrl(
                  license.type ?? '',
                  organizations,
                  120,
                )}
                isValid={license.isValid}
              />
            )
          })}
        </Stack>
      </Box>
    </Box>
  )
}

export default OccupationalLicensesOverview
