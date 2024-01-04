import { UserBase } from './user.dto'
import { MedmaeliBaseDTO } from '../../../gen/fetch'

export interface Signature {
  id: string
  listId: string
  signee: UserBase
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
    },
    signatureType: signature.medmaeliTegund?.toString() ?? '',
    created: signature.dagsetning ?? new Date(),
  }
}
