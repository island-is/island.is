import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'

export function getApplicationAnswers(answers: Application['answers']) {
  const bank = getValueViaPath(answers, 'paymentInfo.bank') as string

  return {
    bank,
  }
}

export function getApplicationExternalData(
  externalData: Application['externalData'],
) {
  // const bank = getValueViaPath(
  //   externalData,
  //   'userProfile.data.bankInfo',
  // ) as string
  // return {
  //   bank,
  // }
}
