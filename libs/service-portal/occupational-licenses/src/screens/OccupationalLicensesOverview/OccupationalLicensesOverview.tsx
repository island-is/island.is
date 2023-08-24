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
import { OccupationalLicensesPaths } from '../../lib/paths'
import {
  OccupationalLicenseEducationalLicense,
  OccupationalLicenseHealthDirectorateLicense,
} from '@island.is/api/schema'

import { olMessage as ol } from '../../lib/messages'

const EducationActionCard: React.FC<
  Omit<OccupationalLicenseEducationalLicense, 'url'> & { orgImage: string }
> = (props) => {
  const isValid = new Date(props.date) < new Date()
  const { formatDateFns, formatMessage } = useLocale()

  return (
    <ActionCard
      heading={props.school}
      text={`${formatMessage(ol.dayOfPublication)}: ${formatDateFns(
        props.date,
        'dd. MMMM yyyy',
      )}`}
      tag={{
        label: isValid
          ? formatMessage(ol.validLicense)
          : formatMessage(ol.invalidLicense),
        variant: isValid ? 'blue' : 'red',
        outlined: false,
      }}
      cta={{
        label: formatMessage(m.viewDetail),
        variant: 'text',
        url: OccupationalLicensesPaths.OccupationalLicensesEducationDetail.replace(
          ':id',
          props.id,
        ).replace(
          ':type',
          props.programme.charAt(0).toUpperCase() + props.programme.slice(1),
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
  const { formatDateFns, formatMessage } = useLocale()
  const isValid =
    props.validTo === null
      ? new Date(props.validFrom) < today
      : new Date(props.validFrom) < today && new Date(props.validTo) > today
  if (!props.licenseNumber) return null
  return (
    <ActionCard
      heading={props.name ?? ''}
      text={`${formatMessage(ol.dayOfPublication)}: ${formatDateFns(
        props.validFrom,
        'dd. MMMM yyyy',
      )}`}
      tag={{
        label: isValid
          ? formatMessage(ol.validLicense)
          : formatMessage(ol.invalidLicense),
        variant: isValid ? 'blue' : 'red',
        outlined: false,
      }}
      cta={{
        label: formatMessage(m.viewDetail),
        variant: 'text',
        url: OccupationalLicensesPaths.OccupationalLicensesHealthDirectorateDetail.replace(
          ':id',
          props.licenseNumber,
        ).replace(':type', props.license ?? ''),
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
