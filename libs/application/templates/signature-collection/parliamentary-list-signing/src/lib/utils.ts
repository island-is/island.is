import { StateLifeCycle } from '@island.is/application/types'
import { formatPhoneNumber } from '@island.is/application/ui-components'

export const formatPhone = (phone: string) => {
  return formatPhoneNumber(phone.replace(/(^00354|^\+354|\D)/g, ''))
}

export const WeekLifeCycle: StateLifeCycle = {
  shouldBeListed: true,
  shouldBePruned: true,
  whenToPrune: 1000 * 3600 * 24 * 7,
}
