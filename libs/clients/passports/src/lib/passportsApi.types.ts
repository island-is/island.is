export interface IdentityDocument {
  productionRequestID?: string
  number?: string
  type?: string
  verboseType?: string
  subType?: string
  status?: string
  issuingDate?: Date
  expirationDate?: Date
  displayFirstName?: string
  displayLastName?: string
  mrzFirstName?: string
  mrzLastName?: string
  sex?: string
}

export interface IdentityDocumentChild {
  nationalId: string
  secondParent: string[]
  identityDocuments?: IdentityDocument[]
}

export interface ContactInfo {
  phoneAtHome?: string
  phoneAtWork?: string
  phoneMobile?: string
  email?: string
  personalComment?: string
}
export interface Document {
  name?: string
  documentType?: string
  contentType?: string
  content?: string
}
export interface PreregistrationInput {
  guId?: string
  appliedForPersonId?: string
  appliedByAPersonId?: string
  appliedByBPersonId?: string
  contactInfo?: ContactInfo
  documents?: Document[]
}
