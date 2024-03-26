import { FormatMessage, useLocale } from '@island.is/localization'
import { ActionCard } from '@island.is/service-portal/core'
import { olMessage as ol } from '../lib/messages'
import { m } from '@island.is/service-portal/core'
import { OccupationalLicenseStatus } from '@island.is/api/schema'
import { TagVariant } from '@island.is/island-ui/core'

type LicenseActionCardProps = {
  type?: string
  validFrom?: string | Date
  url?: string
  image?: string
  status: OccupationalLicenseStatus
}

const getTagProps = (
  status: OccupationalLicenseStatus,
  formatMessage: FormatMessage,
): { label: string; variant: TagVariant | undefined } => {
  switch (status) {
    case OccupationalLicenseStatus.valid:
      return {
        label: formatMessage(ol.validLicense),
        variant: 'blue',
      }
    case OccupationalLicenseStatus.limited:
      return {
        label: formatMessage(ol.validWithLimitationsLicense),
        variant: 'yellow',
      }
    case OccupationalLicenseStatus.revoked:
      return {
        label: formatMessage(ol.revokedLicense),
        variant: 'red',
      }
    case OccupationalLicenseStatus.waived:
      return {
        label: formatMessage(ol.waivedLicense),
        variant: 'red',
      }
    case OccupationalLicenseStatus.error:
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

export const LicenceActionCardV1: React.FC<LicenseActionCardProps> = ({
  type,
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
      heading={type}
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

export default LicenceActionCardV1
