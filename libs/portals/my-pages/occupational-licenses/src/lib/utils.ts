import { OccupationalLicenseStatus } from '@island.is/api/schema'
import { FormatMessage } from '@island.is/localization'
import { olMessage } from './messages'
import { TagVariant } from '@island.is/island-ui/core'

export const getTagProps = (
  status: OccupationalLicenseStatus,
  formatMessage: FormatMessage,
): { label: string; variant: TagVariant | undefined } => {
  switch (status) {
    case OccupationalLicenseStatus.VALID:
      return {
        label: formatMessage(olMessage.validLicense),
        variant: 'blue',
      }
    case OccupationalLicenseStatus.LIMITED:
      return {
        label: formatMessage(olMessage.validWithLimitationsLicense),
        variant: 'yellow',
      }
    case OccupationalLicenseStatus.IN_PROGRESS:
      return {
        label: formatMessage(olMessage.inProgressLicense),
        variant: 'yellow',
      }
    case OccupationalLicenseStatus.REVOKED:
      return {
        label: formatMessage(olMessage.revokedLicense),
        variant: 'red',
      }
    case OccupationalLicenseStatus.WAIVED:
      return {
        label: formatMessage(olMessage.waivedLicense),
        variant: 'red',
      }
    case OccupationalLicenseStatus.INVALID:
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
