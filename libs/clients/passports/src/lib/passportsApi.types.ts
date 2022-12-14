export interface IdentityDocument {
  productionRequestID?: string | null
  number?: string | null
  type?: string | null
  verboseType?: string | null
  subType?: string | null
  status?: string | null
  issuingDate?: Date | null
  expirationDate?: Date | null
  displayFirstName?: string | null
  displayLastName?: string | null
  mrzFirstName?: string | null
  mrzLastName?: string | null
  sex?: Gender | null
  numberWithType?: string
  expiryStatus?: ExpiryStatus
  expiresWithinNoticeTime?: boolean
}

export interface IdentityDocumentChild {
  childNationalId?: string | null
  secondParent?: string | null
  secondParentName?: string | null
  childName?: string | null
  passports?: IdentityDocument[]
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

export type Gender = 'F' | 'M' | 'X'

export type ExpiryStatus = 'EXPIRED' | 'LOST'
