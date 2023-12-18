import { getValueViaPath } from '@island.is/application/core'
import { ApplicationContext } from '@island.is/application/types'

export const isPaymentRequired = ({ application }: ApplicationContext) => {
  const isPaymentRequired = getValueViaPath(
    application.answers,
    'machine.isPaymentRequired',
    false,
  ) as boolean
  return isPaymentRequired
}
