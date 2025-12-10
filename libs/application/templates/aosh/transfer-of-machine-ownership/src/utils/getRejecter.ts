import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { Rejecter, UserInformation } from '../shared'

export const getRejecter = (reviewerNationalId: string, answers: FormValue) => {
  const id = getValueViaPath(answers, 'machine.id', '') as string
  const buyer = getValueViaPath(answers, 'buyer') as UserInformation

  if (buyer && buyer.nationalId === reviewerNationalId) {
    return {
      regNumber: id,
      name: buyer.name,
      nationalId: buyer.nationalId,
      type: 'buyer',
    } as Rejecter
  }

  return undefined
}
