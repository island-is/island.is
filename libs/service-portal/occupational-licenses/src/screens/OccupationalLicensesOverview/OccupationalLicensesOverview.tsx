import { useGetHealthDirectorateOccupationaLicensesQuery } from './OccupationalLicensesOverview.generated'
import { Box, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  ActionCard,
  EmptyState,
  CardLoader,
  ServicePortalPath,
  formatDate,
  IntroHeader,
  m,
} from '@island.is/service-portal/core'
import { Organization } from '@island.is/shared/types'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import { defineMessage } from 'react-intl'
import { OccupationalLicensesPaths } from '../../lib/paths'

const OccupationalLicensesOverview = () => {
  const {
    data,
    loading,
    error,
  } = useGetHealthDirectorateOccupationaLicensesQuery({})

  const { formatDateFns, formatMessage } = useLocale()

  const otherLicenses = [
    {
      legalEntityId: '1111111111',
      nationalId: '1111111111',
      name: 'Starfsleyfi prófara',
      profession: 'Prófari',
      license: 'Prófaraskírteini',
      licenseNumber: '0110',
      validFrom: new Date(1, 11, 11),
      validTo: new Date(2999, 12, 12),
    },
    {
      legalEntityId: '23456789',
      nationalId: '0123456789',
      name: 'Prófarapróf',
      profession: 'Prófarapróf',
      license: 'Prófaraskírteini',
      licenseNumber: '45678',
      validFrom: new Date(2000, 1, 1),
      validTo: new Date(2000, 2, 2),
    },
  ]

  const organizations =
    (data?.getOrganizations?.items as Array<Organization>) ?? []

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={m.occupationaLicenses}
        intro={formatMessage(m.occupationalLicensesDescription)}
      />
      {loading && !error && <CardLoader />}
      {!loading && !error && otherLicenses?.length === 0 && (
        <Box marginTop={8}>
          <EmptyState
            title={defineMessage({
              id: 'sp.education-graduation:education-no-data',
              defaultMessage: 'Engin gögn fundust',
            })}
          />
        </Box>
      )}
      <Stack space={2}>
        {!loading &&
          (otherLicenses?.length ?? 0) > 0 &&
          otherLicenses?.map((item, index) => {
            const today = new Date()
            const validLicense =
              item?.validFrom &&
              item?.validTo &&
              item?.validFrom < today &&
              item.validTo > today
            return (
              <ActionCard
                key={`occupational-license-${index}`}
                heading={item.name ?? ''}
                text={`Útgáfudagur: ${
                  item.validFrom
                    ? formatDateFns(item.validFrom, 'dd. MMMM yyyy')
                    : ''
                }`}
                tag={{
                  label: validLicense ? 'Í gildi' : 'Útrunnið',
                  variant: validLicense ? 'blue' : 'red',
                  outlined: false,
                }}
                cta={{
                  label: defineMessage({
                    id: 'sp.education-graduation:details',
                    defaultMessage: 'Skoða nánar',
                  }).defaultMessage,
                  variant: 'text',
                  url: OccupationalLicensesPaths.OccupationalLicensesDetail.replace(
                    ':id',
                    item.licenseNumber,
                  ),
                }}
                image={{
                  type: 'image',
                  url: getOrganizationLogoUrl(
                    'just some default',
                    organizations,
                    120,
                  ),
                }}
              />
            )
          })}
        {data?.educationLicense?.map((item, index) => {
          const today = new Date()
          const isValid = item.date && new Date(item.date) < today
          return (
            <ActionCard
              key={`educational-licence-${index}`}
              heading={item.school}
              text={`Útgáfudagur: ${formatDateFns(item.date, 'dd. MMMM yyyy')}`}
              tag={{
                label: isValid ? 'Í gildi' : 'Útrunnið',
                variant: isValid ? 'blue' : 'red',
                outlined: false,
              }}
              cta={{
                label: defineMessage({
                  id: 'sp.education-graduation:details',
                  defaultMessage: 'Skoða nánar',
                }).defaultMessage,
                variant: 'text',
                url: OccupationalLicensesPaths.OccupationalLicensesDetail.replace(
                  ':id',
                  item.id,
                ),
              }}
              image={{
                type: 'image',
                url: getOrganizationLogoUrl(item.school, organizations, 120),
              }}
            />
          )
        })}
      </Stack>
    </Box>
  )
}

export default OccupationalLicensesOverview
