import { FormatMessage } from '@island.is/cms-translations'
import { GenericUserLicenseMetaTag } from '../dto/GenericUserLicenseMetaTag.dto'
import { m } from '../messages'

export const expiryTag = (
  formatMessage: FormatMessage,
  isExpired: boolean,
  validityText?: string,
  expiryText?: string,
): GenericUserLicenseMetaTag => {
  const expiredText = expiryText ?? formatMessage(m.expired)
  const validText = validityText ?? formatMessage(m.valid)

  return {
    text: isExpired ? expiredText : validText,
    color: isExpired ? 'red' : 'blue',
    icon: isExpired ? 'closeCircle' : 'checkmarkCircle',
    iconColor: isExpired ? 'red600' : 'mint600',
  }
}
