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
  isValid: OccupationalLicenseStatus
}

export const LicenceActionCard: React.FC<LicenseActionCardProps> = ({
  type,
  validFrom,
  url,
  image,
  isValid,
}) => {
  const { formatMessage } = useLocale()
  return (
    <ActionCard
      capitalizeHeading={true}
      heading={type}
      text={`${formatMessage(ol.dayOfPublication)}: ${validFrom}`}
      tag={{
        label:
          isValid === 'valid'
            ? formatMessage(ol.validLicense)
            : isValid === 'limited'
            ? formatMessage(ol.validWithLimitationsLicense)
            : formatMessage(ol.invalidLicense),
        variant:
          isValid === 'valid'
            ? 'blue'
            : isValid === 'limited'
            ? 'yellow'
            : 'rose',
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
