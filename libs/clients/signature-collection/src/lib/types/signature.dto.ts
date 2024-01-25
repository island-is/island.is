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
  active: boolean
}

export const mapSignature = (signature: MedmaeliDTO): Signature => {
  const isDigital = signature.medmaeliTegundNr === 1
  return {
    id: signature.id?.toString() ?? '',
    listId: signature.medmaelalistiID?.toString() ?? '',
    signee: {
      nationalId: signature.kennitala ?? '',
      name: signature.nafn ?? '',
      address: signature.heimilisfang ?? '',
    },
    isDigital,
    created: signature.dagsetning ?? new Date(),
    pageNumber:
      !isDigital && signature.bladsidaNr ? signature.bladsidaNr : undefined,
    active: signature.valid ?? true,
  }
}
