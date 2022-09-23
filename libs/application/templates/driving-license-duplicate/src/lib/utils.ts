import { applicationForMessages } from './messages'
import { MessageDescriptor } from 'react-intl'
import { ExternalData } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'

type CurrentRightsMessages = {
  title: MessageDescriptor
  rightsDescription: MessageDescriptor
}

export const getApplicationInfo = (rights: string): CurrentRightsMessages => {
  switch (rights) {
    case 'B':
      return applicationForMessages.B_TEMP
    case 'B-full':
      return applicationForMessages.B_FULL
    default:
      return applicationForMessages.B_FULL
  }
}

export const getCurrencyString = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const requirementsMet = (externalData: ExternalData): boolean => {
  const photo = getValueViaPath(
    externalData,
    'qualityPhoto.data.hasQualityPhoto',
  )
  const signature = getValueViaPath(
    externalData,
    'qualitySignature.data.hasQualitySignature',
  )
  return !!photo && !!signature
}
