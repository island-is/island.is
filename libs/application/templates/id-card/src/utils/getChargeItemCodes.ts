import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { Routes, Services } from '../lib/constants'
import { isChild } from './isChild'

export const getChargeItemCodes = (application: Application): Array<string> => {
  const chosenPaymentForm = getValueViaPath(
    application.answers,
    `${Routes.PRICELIST}.priceChoice`,
  )

  const chosenTypeOfId = getValueViaPath(application.answers, Routes.TYPEOFID)

  const applicantInformation = getValueViaPath(
    application.externalData,
    'nationalRegistry,data',
  ) as NationalRegistryIndividual

  const paymentAsChild = isUnderAge(application, applicantInformation.age)
  const hasDisability = getValueViaPath<boolean>(
    application.answers,
    'applicantInformation.hasDisabilityLicense',
  ) as boolean | undefined
  const isOver66 = applicantInformation.age > 66

  if (isOver66) {
    if (chosenPaymentForm === Services.REGULAR) {
      if (chosenTypeOfId === 'II') {
        return [ChargeItemCode.ID_CARD_OLDER_TRAVEL_REGULAR.toString()]
      }
      if (chosenTypeOfId === 'ID') {
        return [ChargeItemCode.ID_CARD_OLDER_REGULAR.toString()]
      }
    }
    if (chosenPaymentForm === Services.EXPRESS) {
      if (chosenTypeOfId === 'II') {
        return [ChargeItemCode.ID_CARD_OLDER_TRAVEL_EXPRESS.toString()]
      }
      if (chosenTypeOfId === 'ID') {
        return [ChargeItemCode.ID_CARD_OLDER_EXPRESS.toString()]
      }
    }
  } else if (paymentAsChild) {
    if (chosenPaymentForm === Services.REGULAR) {
      if (chosenTypeOfId === 'II') {
        return [ChargeItemCode.ID_CARD_CHILDREN_TRAVEL_REGULAR.toString()]
      }
      if (chosenTypeOfId === 'ID') {
        return [ChargeItemCode.ID_CARD_CHILDREN_REGULAR.toString()]
      }
    }
    if (chosenPaymentForm === Services.EXPRESS) {
      if (chosenTypeOfId === 'II') {
        return [ChargeItemCode.ID_CARD_CHILDREN_TRAVEL_EXPRESS.toString()]
      }
      if (chosenTypeOfId === 'ID') {
        return [ChargeItemCode.ID_CARD_CHILDREN_EXPRESS.toString()]
      }
    }
  } else if (hasDisability) {
    if (chosenPaymentForm === Services.REGULAR) {
      if (chosenTypeOfId === 'II') {
        return [ChargeItemCode.ID_CARD_DISABILITY_TRAVEL_REGULAR.toString()]
      }
      if (chosenTypeOfId === 'ID') {
        return [ChargeItemCode.ID_CARD_DISABILITY_REGULAR.toString()]
      }
    }
    if (chosenPaymentForm === Services.EXPRESS) {
      if (chosenTypeOfId === 'II') {
        return [ChargeItemCode.ID_CARD_DISABILITY_TRAVEL_EXPRESS.toString()]
      }
      if (chosenTypeOfId === 'ID') {
        return [ChargeItemCode.ID_CARD_DISABILITY_EXPRESS.toString()]
      }
    }
  } else {
    if (chosenPaymentForm === Services.REGULAR) {
      if (chosenTypeOfId === 'II') {
        return [ChargeItemCode.ID_CARD_TRAVEL_REGULAR.toString()]
      }
      if (chosenTypeOfId === 'ID') {
        return [ChargeItemCode.ID_CARD_REGULAR.toString()]
      }
    }
    if (chosenPaymentForm === Services.EXPRESS) {
      if (chosenTypeOfId === 'II') {
        return [ChargeItemCode.ID_CARD_TRAVEL_EXPRESS.toString()]
      }
      if (chosenTypeOfId === 'ID') {
        return [ChargeItemCode.ID_CARD_EXPRESS.toString()]
      }
    }
  }

  return []
}

const isUnderAge = (application: Application, age: number) => {
  if (age < 18) return true

  const applicantIsApplyingForChild = isChild(
    application.answers,
    application.externalData,
  )

  return applicantIsApplyingForChild
}
