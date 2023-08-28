import { OccupationalLicensesHealthDirectorateLicense } from '@island.is/api/schema'
import { ActionCard } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { OccupationalLicensesPaths } from '../lib/paths'
import { olMessage as ol } from '../lib/messages'

export const HealthDirectorateActionCard: React.FC<
  OccupationalLicensesHealthDirectorateLicense & { orgImage: string }
> = (props) => {
  const { formatDateFns, formatMessage } = useLocale()
  if (!props.licenseNumber) return null
  return (
    <ActionCard
      heading={props.name ?? ''}
      text={`${formatMessage(ol.dayOfPublication)}: ${formatDateFns(
        props.validFrom,
        'dd. MMMM yyyy',
      )}`}
      tag={{
        label: props.isValid
          ? formatMessage(ol.validLicense)
          : formatMessage(ol.invalidLicense),
        variant: props.isValid ? 'blue' : 'red',
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
