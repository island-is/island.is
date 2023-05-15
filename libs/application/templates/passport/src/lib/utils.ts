import { ExternalData, FormValue } from '@island.is/application/types'
import { IdentityDocumentData, Passport } from './constants'

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
