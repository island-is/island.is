import format from 'date-fns/format'
import { rights as rightsMessages } from '../lib/messages'
import { MachineLicenseRight } from './types'

export const formatDate = (date: string) => format(new Date(date), 'dd.MM.yyyy')

export const formatRightName = (right: MachineLicenseRight) =>
  `${right.flokkur} - ${right.fulltHeiti}`

export const getValidToDescription = (rights: MachineLicenseRight[]) => {
  const validTo = rights[0]?.stjorna
  return validTo
    ? {
        ...rightsMessages.labels.validTo,
        values: { validTo: formatDate(validTo) },
      }
    : ''
}
