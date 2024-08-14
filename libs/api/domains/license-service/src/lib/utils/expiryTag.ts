import { FormatMessage } from '@island.is/cms-translations'
import { GenericUserLicenseMetaTag } from '../dto/GenericUserLicenseMetaTag.dto'
import { m } from '../messages'
import {
  GenericUserLicenseDataFieldTagColor,
  GenericUserLicenseDataFieldTagType,
} from '../licenceService.type'

export const expiryTag = (
  formatMessage: FormatMessage,
  isExpired?: boolean,
  validityText?: string,
  expiryText?: string,
): GenericUserLicenseMetaTag => {
  const expiredText = expiryText ?? formatMessage(m.expired)
  const validText = validityText ?? formatMessage(m.valid)

  if (isExpired === undefined) {
    return {
      text: formatMessage(m.unknownStatus),
      color: 'red',
      icon: GenericUserLicenseDataFieldTagType.closeCircle,
      iconColor: GenericUserLicenseDataFieldTagColor.red,
      iconText: formatMessage(m.unknownStatus),
    }
  }

  return {
    text: isExpired ? expiredText : validText,
    color: isExpired ? 'red' : 'blue',
    icon: isExpired
      ? GenericUserLicenseDataFieldTagType.closeCircle
      : GenericUserLicenseDataFieldTagType.checkmarkCircle,
    iconColor: isExpired
      ? GenericUserLicenseDataFieldTagColor.red
      : GenericUserLicenseDataFieldTagColor.green,
    iconText: isExpired ? formatMessage(m.expired) : formatMessage(m.valid),
  }
}
