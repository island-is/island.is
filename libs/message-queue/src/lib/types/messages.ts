export type Message =
  | GjafakortCompanyApplicationMessage
  | GjafakortUserApplicationMessage

export interface GjafakortCompanyApplicationMessage {
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

export interface GjafakortUserApplicationMessage {
  id: string
  state: string
  issuerSSN: string
  type: string
  data: {
    mobileNumber: string
    countryCode: string
  }

  created: string
  modified: string
}
