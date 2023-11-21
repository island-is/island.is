import { useGetOccupationalLicensesQuery } from './OccupationalLicensesOverview.generated'
import { AlertMessage, Box, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroHeader,
  FootNote,
  m,
  ErrorScreen,
  ISLAND_SYSLUMENN_SLUG,
} from '@island.is/service-portal/core'
import { Organization } from '@island.is/shared/types'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'

import { olMessage as om } from '../../lib/messages'
import { LicenceActionCard } from '../../components/LicenceActionCard'
import { OccupationalLicensesPaths } from '../../lib/paths'
import {
  OccupationalLicenseType,
  OccupationalLicensesError,
  OccupationalLicensesErrorStatus,
} from '@island.is/api/schema'
import { OrganizationSlugType } from '@island.is/shared/constants'

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

  const formatErrorMessage = (error: OccupationalLicensesError) => {
    const institution =
      error.institution === OccupationalLicenseType.HEALTH
        ? formatMessage(om.theDirectorateOfHealth)
        : formatMessage(om.theDirectorateOfEducation)
    switch (error.status) {
      case OccupationalLicensesErrorStatus.INTERNAL_SERVER_ERROR:
        return {
          title: formatMessage(om.fetchServerErrorTitle, {
            institution,
          }),
          message: formatMessage(om.fetchServerErrorMessage, { institution }),
        }
      case OccupationalLicensesErrorStatus.NOT_FOUND:
        return {
          title: formatMessage(om.fetchNoDataTitle, {
            institution,
          }),
          message: formatMessage(om.fetchNoDataMessage, {
            institution,
          }),
        }
      default:
        return {
          title: formatMessage(om.fetchServerErrorTitle, {
            institution,
          }),
          message: formatMessage(om.fetchServerErrorMessage),
        }
    }
  }

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
        serviceProviderSlug={ISLAND_SYSLUMENN_SLUG as OrganizationSlugType}
        serviceProviderTooltip={formatMessage(m.occupationalLicenseTooltip)}
      />
      {data?.occupationalLicenses?.errors.map((err) => {
        const message = formatErrorMessage(err)
        return (
          <Box marginTop={6}>
            <AlertMessage type="warning" {...message} />
          </Box>
        )
      })}

      <Box marginTop={6}>
        {loading && !error && <CardLoader />}
        <Stack space={2}>
          {data?.occupationalLicenses?.count === 0 ? (
            <AlertMessage type="info" message={formatMessage(om.noLicenses)} />
          ) : (
            data?.occupationalLicenses?.items.map((license, index) => {
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
                  status={license.status}
                />
              )
            })
          )}
        </Stack>
      </Box>
      <FootNote
        serviceProviderSlug={ISLAND_SYSLUMENN_SLUG as OrganizationSlugType}
      />
    </Box>
  )
}

export default OccupationalLicensesOverview
