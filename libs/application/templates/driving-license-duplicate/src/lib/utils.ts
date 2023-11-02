import { ExternalData } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { IGNORE, NO, YES } from './constants'

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
