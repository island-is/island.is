import {
  ExternalData,
  FormValue,
  PaymentCatalogItem,
} from '@island.is/application/types'
import {
  IdentityDocumentData,
  PassportChargeCodes,
  Passport,
  PersonalInfo,
  Service,
  Services,
} from './constants'
import { getValueViaPath } from '@island.is/application/core'

export const getCurrencyString = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const getChildPassport = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  return (
    externalData.identityDocument?.data as IdentityDocumentData
  )?.childPassports?.find((child) => {
    return (
      child.childNationalId === (answers.passport as Passport)?.childPassport
    )
  })
}
export const hasSecondGuardian = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const child = getChildPassport(answers, externalData)
  return !!child?.secondParent
}

export const needAssignment = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const userHasPassport = (answers.passport as Passport).userPassport !== ''
  const thereIsSecondGuardian = hasSecondGuardian(answers, externalData)

  return !userHasPassport && thereIsSecondGuardian
}

export const isChild = (answers: FormValue): boolean => {
  const isChildPassport = (answers.passport as Passport)?.childPassport !== ''
  return isChildPassport
}

export const isDisabled = (answers: FormValue): boolean => {
  const hasDisabilityDiscount =
    (answers.passport as Passport)?.userPassport !== '' &&
    (answers.personalInfo as PersonalInfo)?.disabilityCheckbox?.length &&
    (answers.personalInfo as PersonalInfo)?.hasDisabilityLicense
  return !!hasDisabilityDiscount
}

export const isElder = (externalData: ExternalData): boolean => {
  const age = (
    externalData.nationalRegistry?.data as {
      age?: number
    }
  )?.age
  const elder = age ? age >= 67 : false
  return elder
}

export const hasDiscount = (answers: FormValue, externalData: ExternalData) => {
  const child = isChild(answers)
  const disabled = isDisabled(answers)
  const elder = isElder(externalData)
  return child || disabled || elder
}

export const getChargeCode = (
  answers: FormValue,
  externalData: ExternalData,
  options?: {
    type?: string
    withDiscount?: boolean
  },
): string => {
  const withDiscount =
    typeof options?.withDiscount === 'boolean'
      ? options.withDiscount
      : hasDiscount(answers, externalData)

  const serviceType = options?.type
    ? options.type
    : (answers.service as Service).type

  const chargeCode = withDiscount
    ? serviceType === Services.REGULAR
      ? PassportChargeCodes.DISCOUNT_REGULAR
      : PassportChargeCodes.DISCOUNT_EXPRESS
    : serviceType === Services.REGULAR
    ? PassportChargeCodes.REGULAR
    : PassportChargeCodes.EXPRESS

  return chargeCode
}

export const getPrice = (
  externalData: ExternalData,
  chargeCode: string,
): string => {
  const chargeItems = getValueViaPath(
    externalData,
    'payment.data',
  ) as PaymentCatalogItem[]

  const chargeItem = chargeItems.find(
    (item) => item.chargeItemCode === chargeCode,
  )

  return getCurrencyString(chargeItem?.priceAmount || 0)
}

export const ageCanHaveDiscount = (age: number) => age < 18 || age >= 67
