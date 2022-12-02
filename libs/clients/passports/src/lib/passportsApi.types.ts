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
