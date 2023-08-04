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

const OccupationalLicensesOverview = () => {
  const {
    data,
    loading,
    error,
  } = useGetHealthDirectorateOccupationaLicensesQuery({})

  const { formatDateFns, formatMessage } = useLocale()

  const licenses = data?.healthDirectorateOccupationalLicenses ?? [
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
      {!loading && !error && licenses?.length === 0 && (
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
        {(licenses?.length ?? 0) > 0 &&
          licenses?.map((item, index) => {
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
                  url: '',
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
      </Stack>
    </Box>
  )
}

export default OccupationalLicensesOverview
