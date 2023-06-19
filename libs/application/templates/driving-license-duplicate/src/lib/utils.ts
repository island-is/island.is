import { applicationForMessages } from './messages'
import { MessageDescriptor } from 'react-intl'
import { ExternalData } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { YES } from './constants'

type CurrentRightsMessages = {
  title: MessageDescriptor
  rightsDescription: MessageDescriptor
}

export const getApplicationInfo = (rights: string): CurrentRightsMessages => {
  switch (rights) {
    case 'A':
      return applicationForMessages.A_TEMP
    case 'B':
      return applicationForMessages.B_TEMP
    case 'B-full':
      return applicationForMessages.B_FULL
    case 'C':
      return applicationForMessages.C_TEMP
    case 'D':
      return applicationForMessages.D_TEMP
    default:
      return applicationForMessages.B_FULL
  }
}

export const getCurrencyString = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const requirementsMet = (
  answers: FormValue,
  externalData: ExternalData,
): boolean => {
  let photoPath = 'qualityPhoto.data.hasQualityPhoto'
  let signaturePath = 'qualitySignature.data.hasQualitySignature'
  if (allowFakeCondition(YES)) {
    photoPath = 'fakeData.qualityPhoto'
    signaturePath = 'fakeData.qualitySignature'
  }
  const photo = getValueViaPath({ ...externalData, ...answers }, photoPath)
  const signature = getValueViaPath(
    { ...externalData, ...answers },
    signaturePath,
  )
  return !!photo && !!signature
}

export const allowFakeCondition = (result = YES) => (answers: FormValue) =>
  getValueViaPath(answers, 'fakeData.useFakeData') === result
