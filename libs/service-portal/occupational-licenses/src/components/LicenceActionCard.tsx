import { FormatMessage, useLocale } from '@island.is/localization'
import { ActionCard } from '@island.is/service-portal/core'
import { olMessage as ol } from '../lib/messages'
import { m } from '@island.is/service-portal/core'
import { OccupationalLicenseStatusV2 } from '@island.is/api/schema'
import { TagVariant } from '@island.is/island-ui/core'

type LicenseActionCardProps = {
  title?: string
  validFrom?: string | Date
  url?: string
  image?: string
  status: OccupationalLicenseStatusV2
}

const getTagProps = (
  status: OccupationalLicenseStatusV2,
  formatMessage: FormatMessage,
): { label: string; variant: TagVariant | undefined } => {
  switch (status) {
    case OccupationalLicenseStatusV2.VALID:
      return {
        label: formatMessage(ol.validLicense),
        variant: 'blue',
      }
    case OccupationalLicenseStatusV2.LIMITED:
      return {
        label: formatMessage(ol.validWithLimitationsLicense),
        variant: 'yellow',
      }
    case OccupationalLicenseStatusV2.IN_PROGRESS:
      return {
        label: formatMessage(ol.inProgressLicense),
        variant: 'yellow',
      }
    case OccupationalLicenseStatusV2.REVOKED:
      return {
        label: formatMessage(ol.revokedLicense),
        variant: 'red',
      }
    case OccupationalLicenseStatusV2.WAIVED:
      return {
        label: formatMessage(ol.waivedLicense),
        variant: 'red',
      }
    case OccupationalLicenseStatusV2.INVALID:
      return {
        label: formatMessage(ol.invalidLicense),
        variant: 'red',
      }
    default:
      return {
        label: formatMessage(ol.unknownLicense),
        variant: 'red',
      }
  }
}

export const LicenceActionCard: React.FC<LicenseActionCardProps> = ({
  title,
  validFrom,
  url,
  image,
  status,
}) => {
  const { formatMessage } = useLocale()

  const { label, variant } = getTagProps(status, formatMessage)
  return (
    <ActionCard
      capitalizeHeading={true}
      heading={title}
      text={`${formatMessage(ol.dayOfPublication)}: ${validFrom}`}
      tag={{
        label,
        variant,
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
