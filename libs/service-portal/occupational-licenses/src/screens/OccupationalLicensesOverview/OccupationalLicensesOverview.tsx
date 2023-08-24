import { useGetOccupationalLicensesQuery } from './OccupationalLicensesOverview.generated'
import { Box, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  ActionCard,
  EmptyState,
  CardLoader,
  IntroHeader,
  m,
} from '@island.is/service-portal/core'
import { Organization } from '@island.is/shared/types'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import { defineMessage } from 'react-intl'
import { OccupationalLicensesPaths } from '../../lib/paths'
import {
  OccupationalLicenseEducationalLicense,
  OccupationalLicenseHealthDirectorateLicense,
} from '@island.is/api/schema'

const EducationActionCard: React.FC<
  Omit<OccupationalLicenseEducationalLicense, 'url'> & { orgImage: string }
> = (props) => {
  const isValid = new Date(props.date) < new Date()
  const { formatDateFns } = useLocale()

  return (
    <ActionCard
      heading={props.school}
      text={`Útgáfudagur: ${formatDateFns(props.date, 'dd. MMMM yyyy')}`}
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
        url: OccupationalLicensesPaths.OccupationalLicensesEducationDetail.replace(
          ':id',
          props.id,
        ),
      }}
      image={{
        type: 'image',
        url: props.orgImage,
      }}
    />
  )
}

const HealthDirectorateActionCard: React.FC<
  OccupationalLicenseHealthDirectorateLicense & { orgImage: string }
> = (props) => {
  const today = new Date()
  const { formatDateFns } = useLocale()
  const validLicense =
    props.validTo === null
      ? new Date(props.validFrom) < today
      : new Date(props.validFrom) < today && new Date(props.validTo) > today
  if (!props.licenseNumber) return null
  return (
    <ActionCard
      heading={props.name ?? ''}
      text={`Útgáfudagur: ${formatDateFns(props.validFrom, 'dd. MMMM yyyy')}`}
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
        url: OccupationalLicensesPaths.OccupationalLicensesHealthDirectorateDetail.replace(
          ':id',
          props.licenseNumber,
        ),
      }}
      image={{
        type: 'image',
        url: props.orgImage,
      }}
    />
  )
}
const OccupationalLicensesOverview = () => {
  const { data, loading, error } = useGetOccupationalLicensesQuery({})
  const { formatMessage } = useLocale()

  const organizations =
    (data?.getOrganizations?.items as Array<Organization>) ?? []

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={m.occupationaLicenses}
        intro={formatMessage(m.occupationalLicensesDescription)}
      />
      <Box marginTop={6}>
        {loading && !error && <CardLoader />}
        {!loading &&
          !error &&
          data &&
          data?.occupationalLicenses &&
          data.occupationalLicenses.count === 0 && (
            <EmptyState
              title={defineMessage({
                id: 'sp.education-graduation:education-no-data',
                defaultMessage: 'Engin gögn fundust',
              })}
            />
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
