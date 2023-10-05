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

export interface Country {
  number?: string
  name?: string
}

export interface Approval {
  personId: string
  approved: Date
  name: string
}
export interface PreregistrationInput {
  guid?: string
  priority?: number
  appliedForPersonId?: string
  approvalA?: Approval
  approvalB?: Approval
  contactInfo?: ContactInfo
  documents?: Document[]
  deliveryName?: string
}

export interface DocumentLossInput {
  status: string
  comment: string
  productionRequestId: string
}

export interface Passport {
  userPassport?: IdentityDocument
  childPassports?: IdentityDocumentChild[]
}

export type Gender = 'F' | 'M' | 'X'

export type ExpiryStatus = 'EXPIRED' | 'LOST'

export interface PreregisterResponse {
  success: boolean
}

export interface DeliveryAddress {
  id?: number
  key?: string
  type?: string
  name?: string
  street?: string
  city?: string
  zip?: string
}
