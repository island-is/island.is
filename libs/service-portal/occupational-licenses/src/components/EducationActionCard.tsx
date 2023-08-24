import { OccupationalLicenseEducationalLicense } from '@island.is/api/schema'
import { ActionCard } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { OccupationalLicensesPaths } from '../lib/paths'
import { olMessage as ol } from '../lib/messages'

export const EducationActionCard: React.FC<
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
        label: formatMessage(m.view),
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
