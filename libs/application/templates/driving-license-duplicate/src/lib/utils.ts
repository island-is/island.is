import {
  Application,
  ExternalData,
  BasicChargeItem,
} from '@island.is/application/types'
import { getValueViaPath, NO, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  B_FULL,
  IGNORE,
  CHARGE_ITEM_CODES,
  DELIVERY_FEE,
  Delivery,
} from './constants'
import { DriversLicense } from '@island.is/clients/driving-license'

export const getCurrencyString = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const requirementsMet = (
  answers: FormValue,
  externalData: ExternalData,
): boolean => {
  // We have the ignore option because some Gervimenn actually do have
  // license data but never do they have photo/signature data.
  // This way we ignore this requirement in order to test data
  // from the api when needed
  if (allowFakeCondition(IGNORE)(answers)) {
    return true
  }
  let photoPath = 'qualityPhoto.data.hasQualityPhoto'
  let signaturePath = 'qualitySignature.data.hasQualitySignature'
  if (allowFakeCondition(YES)(answers)) {
    photoPath = 'fakeData.qualityPhoto'
    signaturePath = 'fakeData.qualitySignature'
  }
  const photo = getValueViaPath({ ...externalData, ...answers }, photoPath)
  const signature = getValueViaPath(
    { ...externalData, ...answers },
    signaturePath,
  )
  if (allowFakeCondition(YES)(answers)) {
    return !(photo === NO || signature === NO)
  }
  return !!photo && !!signature
}

export const allowFakeCondition =
  (result: string | undefined) => (answers: FormValue) =>
    getValueViaPath<string>(answers, 'fakeData.useFakeData', undefined) ===
    result

export const getCodes = (application: Application): BasicChargeItem[] => {
  const applicationFor = getValueViaPath<DriversLicense>(
    application.externalData,
    'currentLicense.data',
  )

  const deliveryMethod = getValueViaPath<Delivery>(
    application.answers,
    'delivery.deliveryMethod',
  )

  const codes: BasicChargeItem[] = []

  const DEFAULT_ITEM_CODE = CHARGE_ITEM_CODES[B_FULL]

  const targetCode =
    typeof applicationFor === 'string'
      ? CHARGE_ITEM_CODES[applicationFor]
        ? CHARGE_ITEM_CODES[applicationFor]
        : DEFAULT_ITEM_CODE
      : DEFAULT_ITEM_CODE

  codes.push({ code: targetCode })

  if (deliveryMethod === Delivery.SEND_HOME) {
    codes.push({ code: CHARGE_ITEM_CODES[DELIVERY_FEE] })
  }

  if (!targetCode) {
    throw new Error('No selected charge item code')
  }

  console.log('--------------------------------')
  console.log('utils codes', codes)
  console.log('--------------------------------')

  return codes
}
