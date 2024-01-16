import { UserBase } from './user.dto'
import { MedmaeliBaseDTO } from '../../../gen/fetch'

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
}

export const mapSignature = (signature: MedmaeliBaseDTO): Signature => {
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
  }
}
