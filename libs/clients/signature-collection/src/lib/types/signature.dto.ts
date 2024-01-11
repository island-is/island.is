import { UserBase } from './user.dto'
import { MedmaeliBaseDTO } from '../../../gen/fetch'

export interface Signee extends UserBase {
  address?: string
}
export interface Signature {
  id: string
  listId: string
  signee: Signee
  isDigital: boolean
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
    isDigital: signature.medmaeliTegundNr === 1,
    created: signature.dagsetning ?? new Date(),
  }
}
