import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'

export const getBuyerNationalId = (application: Application) => {
  try {
    const buyerNationalId = getValueViaPath(
      application.answers,
      'buyer.nationalId',
      '',
    ) as string
    return buyerNationalId
  } catch (error) {
    console.error(error)
    return ''
  }
}
