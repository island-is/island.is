import { useGetOccupationalLicensesQuery } from './OccupationalLicensesOverview.generated'
import { AlertMessage, Box, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
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
import LicenceActionCard, { Validity } from '../../components/LicenceActionCard'
import { OccupationalLicensesPaths } from '../../lib/paths'

const OccupationalLicensesOverview = () => {
  const { data, loading, error } = useGetOccupationalLicensesQuery({})
  const { formatMessage, formatDateFns } = useLocale()
  useNamespaces('sp.occupational-licenses')
  const organizations =
    (data?.getOrganizations?.items as Array<Organization>) ?? []

  const generateUrl = (route: string, id: string, type: string) =>
    route
      .replace(':id', id)
      .replace(':type', type.charAt(0).toUpperCase() + type.slice(1))

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
          !data?.occupationalLicenses?.error.hasError &&
          data?.occupationalLicenses?.count === 0 && (
            <EmptyState title={m.noDataFound} />
          )}
        <Stack space={2}>
          {data?.occupationalLicenses?.items.map((license, index) => {
            return (
              <LicenceActionCard
                key={index}
                type={license.profession}
                validFrom={formatDateFns(license.validFrom, 'dd.MM.yyyy')}
                url={generateUrl(
                  license.__typename ===
                    'OccupationalLicensesEducationalLicense'
                    ? OccupationalLicensesPaths.OccupationalLicensesEducationDetail
                    : OccupationalLicensesPaths.OccupationalLicensesHealthDirectorateDetail,
                  license.id,
                  license.profession,
                )}
                image={getOrganizationLogoUrl(
                  license.type ?? '',
                  organizations,
                  120,
                )}
                isValid={license.isValid as Validity}
              />
            )
          })}
        </Stack>
      </Box>
    </Box>
  )
}

export default OccupationalLicensesOverview
