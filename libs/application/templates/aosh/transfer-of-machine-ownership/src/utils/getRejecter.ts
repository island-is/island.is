import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { Operator, Rejecter, UserInformation } from '../shared'

export const getRejecter = (reviewerNationalId: string, answers: FormValue) => {
  try {
    const id = getValueViaPath(answers, 'pickMachine.id', '') as string
    const buyer = getValueViaPath(answers, 'buyer') as UserInformation

    if (buyer && buyer.nationalId === reviewerNationalId) {
      return {
        regNumber: id,
        name: buyer.name,
        nationalId: buyer.nationalId,
        type: 'buyer',
      } as Rejecter
    }
  } catch (error) {
    console.log('getRejector ERROR', error)
  }

  return undefined
}
