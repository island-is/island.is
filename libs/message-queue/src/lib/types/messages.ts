export type Message = ApplicationMessage

export interface ApplicationMessage {
  id: string
  state: string
  issuerSSN: string
  type: string
  data: {
    name: string
    email: string
    comments: string[]
    webpage: string
    companySSN: string
    exhibition: boolean
    companyName: string
    phoneNumber: string
    validPermit: boolean
    approveTerms: boolean
    generalEmail: string
    followingLaws: boolean
    validLicenses: boolean
    serviceCategory: string
    acknowledgedMuseum: boolean
    companyDisplayName: string
    operatingPermitForVehicles: boolean
  }

  created: string
  modified: string
}
