import { FormatMessage, useLocale } from '@island.is/localization'
import { ActionCard } from '@island.is/service-portal/core'
import { olMessage as ol } from '../lib/messages'
import { m } from '@island.is/service-portal/core'
import { OccupationalLicenseV2Status } from '@island.is/api/schema'
import { TagVariant } from '@island.is/island-ui/core'

type LicenseActionCardProps = {
  title?: string
  validFrom?: string | Date
  url?: string
  image?: string
  status: OccupationalLicenseV2Status
}

const getTagProps = (
  status: OccupationalLicenseV2Status,
  formatMessage: FormatMessage,
): { label: string; variant: TagVariant | undefined } => {
  switch (status) {
    case OccupationalLicenseV2Status.VALID:
      return {
        label: formatMessage(ol.validLicense),
        variant: 'blue',
      }
    case OccupationalLicenseV2Status.LIMITED:
      return {
        label: formatMessage(ol.validWithLimitationsLicense),
        variant: 'yellow',
      }
    case OccupationalLicenseV2Status.IN_PROGRESS:
      return {
        label: formatMessage(ol.inProgressLicense),
        variant: 'yellow',
      }
    case OccupationalLicenseV2Status.REVOKED:
      return {
        label: formatMessage(ol.revokedLicense),
        variant: 'red',
      }
    case OccupationalLicenseV2Status.WAIVED:
      return {
        label: formatMessage(ol.waivedLicense),
        variant: 'red',
      }
    case OccupationalLicenseV2Status.INVALID:
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
