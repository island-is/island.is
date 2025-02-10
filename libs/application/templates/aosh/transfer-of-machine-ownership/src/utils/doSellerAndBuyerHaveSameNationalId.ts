import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const doSellerAndBuyerHaveSameNationalId = (answers: FormValue) => {
  const buyerNationalId = getValueViaPath(
    answers,
    'buyer.nationalId',
    '',
  ) as string
  const sellerNationalId = getValueViaPath(
    answers,
    'seller.nationalId',
    '',
  ) as string

  return buyerNationalId === sellerNationalId
}
