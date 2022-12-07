export interface IdentityDocument {
  productionRequestID: string
  number: string
  type: string
  verboseType: string
  subType: string
  status: string
  issuingDate: Date
  expirationDate: Date
  displayFirstName: string
  displayLastName: string
  mrzFirstName: string
  mrzLastName: string
  sex: string
}

export interface IdentityDocumentChild {
  nationalId: string
  secondParent: string[]
  name: string
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
  priority?: number
  appliedForPersonId?: string
  approvalA?: {
    personId?: string
    approved?: string
  }
  approvalB?: {
    personId?: string
    approved?: string
  }
  contactInfo?: ContactInfo
  documents?: Document[]
}

export interface Passport {
  userPassport?: IdentityDocument
  childPassports?: IdentityDocumentChild[]
}
