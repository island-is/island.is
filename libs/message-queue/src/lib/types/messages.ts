export type Message = GjafakortApplicationMessage

export interface GjafakortApplicationMessage {
  id: string
  state: string
  authorSSN: string
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
    operationsTrouble: boolean
    generalEmail: string
    validLicenses: boolean
    serviceCategory: string
    operatingPermitForRestaurant: boolean
    companyDisplayName: string
    operatingPermitForVehicles: boolean
  }

  created: string
  modified: string
}
