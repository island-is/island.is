import { OccupationalLicenseHealthDirectorateLicense } from '@island.is/api/schema'
import { ActionCard } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { OccupationalLicensesPaths } from '../lib/paths'
import { olMessage as ol } from '../lib/messages'

export const HealthDirectorateActionCard: React.FC<
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
