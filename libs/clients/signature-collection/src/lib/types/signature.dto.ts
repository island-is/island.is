import { UserBase } from './user.dto'
import { MedmaeliBaseDTO } from '../../../gen/fetch'

export interface Signee extends UserBase {
  address?: string
}
export interface Signature {
  id: string
  listId: string
  signee: Signee
  signatureType: string
  created: Date
}

export const mapSignature = (signature: MedmaeliBaseDTO): Signature => {
  return {
    id: signature.id?.toString() ?? '',
    listId: signature.medmaelalistiID?.toString() ?? '',
    signee: {
      nationalId: signature.kennitala ?? '',
      name: signature.nafn ?? '',
      address: signature.heimilisfang ?? '',
    },
    signatureType: signature.medmaeliTegund?.toString() ?? '',
    created: signature.dagsetning ?? new Date(),
  }
}
