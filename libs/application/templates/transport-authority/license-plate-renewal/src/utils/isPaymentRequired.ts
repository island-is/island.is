import { getValueViaPath } from '@island.is/application/core'
import { ApplicationContext } from '@island.is/application/types'
import { info } from 'kennitala'

export const isPaymentRequired = ({ application }: ApplicationContext) => {
  return true
  const nationalId = getValueViaPath(
    application.externalData,
    'identity.data.nationalId',
    '',
  ) as string
  if (!nationalId) {
    return true
  }
  const age = info(nationalId).age
  return age < 64
}
