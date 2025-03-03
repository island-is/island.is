import { formatPhoneNumber } from '@island.is/application/ui-components'

export const formatPhone = (phone: string) => {
  return formatPhoneNumber(phone.replace(/(^00354|^\+354|\D)/g, ''))
}
