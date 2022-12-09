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
  secondParent: string
  secondParentName: string
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

export interface Region {
  number?: string
  name?: string
}

export interface DeliveryAddress {
  street?: string
  street2?: string
  zipCode?: string
  city?: string
  city2?: string
  region?: Region
  country?: Country
}

export interface Country {
  number?: string
  name?: string
}

export interface Approval {
  personId?: string
  approved?: Date
}
export interface PreregistrationInput {
  guId?: string
  priority?: number
  appliedForPersonId?: string
  approvalA?: Approval
  approvalB?: Approval
  contactInfo?: ContactInfo
  documents?: Document[]
  deliveryName?: string
  deliveryAddress?: DeliveryAddress
}

export interface Passport {
  userPassport?: IdentityDocument
  childPassports?: IdentityDocumentChild[]
}
