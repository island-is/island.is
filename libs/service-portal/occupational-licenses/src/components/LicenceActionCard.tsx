import { useLocale } from '@island.is/localization'
import { ActionCard } from '@island.is/service-portal/core'
import { olMessage as ol } from '../lib/messages'
import { m } from '@island.is/service-portal/core'
import { OccupationalLicenseStatus } from '@island.is/api/schema'

type LicenseActionCardProps = {
  type?: string
  validFrom?: string | Date
  url?: string
  image?: string
  status: OccupationalLicenseStatus
}

export const LicenceActionCard: React.FC<LicenseActionCardProps> = ({
  type,
  validFrom,
  url,
  image,
  status,
}) => {
  const { formatMessage } = useLocale()
  return (
    <ActionCard
      capitalizeHeading={true}
      heading={type}
      text={`${formatMessage(ol.dayOfPublication)}: ${validFrom}`}
      tag={{
        label:
          status === 'valid'
            ? formatMessage(ol.validLicense)
            : status === 'limited'
            ? formatMessage(ol.validWithLimitationsLicense)
            : formatMessage(ol.invalidLicense),
        variant:
          status === 'valid' ? 'blue' : status === 'limited' ? 'yellow' : 'red',
        outlined: false,
      }}
      cta={{
        label: formatMessage(m.view),
        variant: 'text',
        url: url,
      }}
      image={{
        type: 'image',
        url: image,
      }}
    />
  )
}

export default LicenceActionCard
