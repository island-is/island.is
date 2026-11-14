import { YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { DeliveryMethod } from './constants'
import { getApplicationAnswers } from './getApplicationAnswers'

export const wantsPlasticCard = (answers: FormValue) =>
  getApplicationAnswers(answers).plasticCard === YES

export const isOtherAddress = (answers: FormValue) =>
  wantsPlasticCard(answers) &&
  getApplicationAnswers(answers).deliveryMethod === DeliveryMethod.OTHER_ADDRESS
