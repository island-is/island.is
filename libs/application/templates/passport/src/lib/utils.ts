import { ExternalData, FormValue } from '@island.is/application/types'
import { IdentityDocumentData, Passport, PersonalInfo } from './constants'

export const getCurrencyString = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const getChildPassport = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  return (externalData.identityDocument
    ?.data as IdentityDocumentData)?.childPassports.find((child) => {
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

export const hasDiscount = (answers: FormValue, externalData: ExternalData) => {
  const isChildPassport = (answers.passport as Passport)?.childPassport !== ''
  const hasDisabilityDiscount =
    (answers.passport as Passport)?.userPassport !== '' &&
    (answers.personalInfo as PersonalInfo)?.hasDisabilityDiscountChecked
  const age = (externalData.nationalRegistry?.data as {
    age?: number
  })?.age
  const isElder = age ? age >= 67 : false
  return hasDisabilityDiscount || isChildPassport || isElder
}
