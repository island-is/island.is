import { YES } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { DeliveryMethod } from './constants'
import { getApplicationAnswers } from './getApplicationAnswers'
import { getApplicationExternalData } from './getApplicationExternalData'
import { getOtherRights } from './machineLicenseRights'

export const wantsPlasticCard = (answers: FormValue) =>
  getApplicationAnswers(answers).plasticCard === YES

export const isLegalDomicile = (answers: FormValue) =>
  wantsPlasticCard(answers) &&
  getApplicationAnswers(answers).deliveryMethod ===
    DeliveryMethod.LEGAL_DOMICILE

export const isOtherAddress = (answers: FormValue) =>
  wantsPlasticCard(answers) &&
  getApplicationAnswers(answers).deliveryMethod === DeliveryMethod.OTHER_ADDRESS

export const hasOtherRights = (
  _answers: FormValue,
  externalData: ExternalData,
) =>
  getOtherRights(getApplicationExternalData(externalData).workMachineLicense)
    .length > 0
