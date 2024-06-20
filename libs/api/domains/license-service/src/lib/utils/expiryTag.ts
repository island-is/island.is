import { FormatMessage } from '@island.is/cms-translations'
import { GenericUserLicenseMetaTag } from '../dto/GenericUserLicenseMetaTag.dto'
import { m } from '../messages'

const expiryTag = (isExpired: boolean, formatMessage: FormatMessage): GenericUserLicenseMetaTag => {
  return {
    text: isExpired ?
      formatMessage(m.expired)
      : formatMessage(m.valid),
    color: isExpired ? 'red' : 'blue'
    icon: isExpired ? ''
  }
}
