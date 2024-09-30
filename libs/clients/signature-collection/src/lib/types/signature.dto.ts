import { UserBase } from './user.dto'
import { MedmaeliDTO } from '../../../gen/fetch'

export interface Signee extends UserBase {
  address?: string
}
export interface Signature {
  id: string
  listId: string
  listTitle?: string
  signee: Signee
  isDigital: boolean
  created: Date
  pageNumber?: number
  valid: boolean
  isInitialType: boolean
  locked: boolean
}
const digitalTypes = [1, 3]
const initialTypes = [1, 2]

export const mapSignature = (signature: MedmaeliDTO): Signature => {
  const type = signature.medmaeliTegundNr
  if (!type) {
    // This should not happen but for typescript to be happy
    throw new Error('Signature type is missing')
  }
  const isDigital = digitalTypes.includes(type)
  const isInitialType = initialTypes.includes(type)
  return {
    id: signature.id?.toString() ?? '',
    listId: signature.medmaelalistiID?.toString() ?? '',
    signee: {
      nationalId: signature.kennitala ?? '',
      name: signature.nafn ?? '',
      address: signature.heimilisfang ?? '',
    },
    isDigital,
    isInitialType,
    created: signature.dagsetning ?? new Date(),
    pageNumber:
      !isDigital && signature.bladsidaNr ? signature.bladsidaNr : undefined,
    valid: signature.valid ?? true,
    locked: signature.locked ?? false,
  }
}
