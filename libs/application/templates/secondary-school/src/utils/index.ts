import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  NationalRegistryParent,
} from '@island.is/application/types'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import kennitala from 'kennitala'

export const getParent = (
  externalData: ExternalData,
  index: number,
): NationalRegistryParent | undefined => {
  const parents = getValueViaPath<NationalRegistryParent[]>(
    externalData,
    'nationalRegistryParents.data',
  )
  return parents?.[index]
}

export const hasParent = (
  externalData: ExternalData,
  index: number,
): boolean => {
  const parent = getParent(externalData, index)
  return !!parent
}

export const formatPhoneNumber = (phoneNumber: string | undefined): string => {
  if (!phoneNumber) return ''
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}

export const formatKennitala = (nationalId: string | undefined): string => {
  if (!nationalId) return ''
  return kennitala.format(nationalId, '-')
}
