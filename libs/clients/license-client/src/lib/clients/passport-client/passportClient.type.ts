import {
  IdentityDocument,
  IdentityDocumentChild,
} from '@island.is/clients/passports'

export interface Passports {
  userPassport?: IdentityDocument | undefined
  childPassports?: Array<IdentityDocumentChild>
}
