import { OccupationalLicenseV2Status } from '@island.is/api/schema'
import { FormatMessage } from '@island.is/localization'
import { olMessage } from './messages'
import { TagVariant } from '@island.is/island-ui/core'

export const getTagProps = (
  status: OccupationalLicenseV2Status,
  formatMessage: FormatMessage,
): { label: string; variant: TagVariant | undefined } => {
  switch (status) {
    case OccupationalLicenseV2Status.VALID:
      return {
        label: formatMessage(olMessage.validLicense),
        variant: 'blue',
      }
    case OccupationalLicenseV2Status.LIMITED:
      return {
        label: formatMessage(olMessage.validWithLimitationsLicense),
        variant: 'yellow',
      }
    case OccupationalLicenseV2Status.IN_PROGRESS:
      return {
        label: formatMessage(olMessage.inProgressLicense),
        variant: 'yellow',
      }
    case OccupationalLicenseV2Status.REVOKED:
      return {
        label: formatMessage(olMessage.revokedLicense),
        variant: 'red',
      }
    case OccupationalLicenseV2Status.WAIVED:
      return {
        label: formatMessage(olMessage.waivedLicense),
        variant: 'red',
      }
    case OccupationalLicenseV2Status.INVALID:
      return {
        label: formatMessage(olMessage.invalidLicense),
        variant: 'red',
      }
    default:
      return {
        label: formatMessage(olMessage.unknownLicense),
        variant: 'red',
      }
  }
}
