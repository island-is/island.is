import {
  OccupationalLicenseStatus,
  ShipRegistryValueUnit,
} from '@island.is/api/schema'
import { FormatMessage } from '@island.is/localization'
import { olMessage } from './messages'
import { TagVariant } from '@island.is/island-ui/core'

const formatNumber = (value: string, locale: string) => {
  const n = parseFloat(value)
  return isNaN(n) ? value : new Intl.NumberFormat(locale).format(n)
}

export const formatValueUnit = (
  vu: Pick<ShipRegistryValueUnit, 'value' | 'unit'> | null | undefined,
  options?: { locale?: string; omitUnit?: boolean },
): string => {
  if (!vu) return '-'
  const value = options?.locale ? formatNumber(vu.value, options.locale) : vu.value
  const unit = !options?.omitUnit && vu.unit ? ` ${vu.unit}` : ''
  return `${value}${unit}`
}

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
