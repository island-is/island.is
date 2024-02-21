import { useLocale } from '@island.is/localization'
import { ActionCard } from '@island.is/service-portal/core'
import { olMessage as ol } from '../lib/messages'
import { m } from '@island.is/service-portal/core'
import { OccupationalLicenseStatusV2 } from '@island.is/api/schema'

type LicenseActionCardProps = {
  title?: string
  validFrom?: string | Date
  url?: string
  image?: string
  status: OccupationalLicenseStatusV2
}

export const LicenceActionCard: React.FC<LicenseActionCardProps> = ({
  title,
  validFrom,
  url,
  image,
  status,
}) => {
  const { formatMessage } = useLocale()
  return (
    <ActionCard
      capitalizeHeading={true}
      heading={title}
      text={`${formatMessage(ol.dayOfPublication)}: ${validFrom}`}
      tag={{
        label:
          status === 'VALID'
            ? formatMessage(ol.validLicense)
            : status === 'LIMITED'
            ? formatMessage(ol.validWithLimitationsLicense)
            : formatMessage(ol.invalidLicense),
        variant:
          status === 'VALID' ? 'blue' : status === 'LIMITED' ? 'yellow' : 'red',
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
