import { useLocale } from '@island.is/localization'
import { ActionCard } from '@island.is/service-portal/core'
import { olMessage as ol } from '../lib/messages'
import { m } from '@island.is/service-portal/core'

type LicenseActionCardProps = {
  title: string
  date: string
  url: string
  image: string
  isValid: boolean
}

export const LicenceActionCard: React.FC<LicenseActionCardProps> = ({
  title,
  date,
  url,
  image,
  isValid,
}) => {
  const { formatMessage } = useLocale()
  return (
    <ActionCard
      heading={title}
      text={`${formatMessage(ol.dayOfPublication)}: ${date}`}
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
