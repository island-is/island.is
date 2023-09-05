import { useLocale, useNamespaces } from '@island.is/localization'
import { ActionCard } from '@island.is/service-portal/core'
import { olMessage as ol } from '../lib/messages'
import { m } from '@island.is/service-portal/core'

type LicenseActionCardProps = {
  type?: string
  validFrom?: string | Date
  url?: string
  image?: string
  isValid: boolean
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
        label: isValid
          ? formatMessage(ol.validLicense)
          : formatMessage(ol.invalidLicense),
        variant: isValid ? 'blue' : 'red',
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
