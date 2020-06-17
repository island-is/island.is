export type ApplicationExchange = 'gjafakort-application-updates'

export type CompanyApplicationRoutingKey =
  | 'gjafakort:approved'
  | 'gjafakort:pending'
  | 'gjafakort:rejected'
  | 'gjafakort:manual-approved'

export type UserApplicationRoutingKey = 'gjafakort-user:approved'

export interface Application {
  id: string
  created: string
  modified: string

  issuerSSN: string
  type: string
  state: string
  data: object
  AuditLogs?: [
    {
      id: string
      state: string
      title: string
      data: string
      authorSSN: string
    },
  ]
}

export interface CompanyApplication extends Application {
  type: 'gjafakort'
  data: {
    comments: string[]
    companyDisplayName: string
    companyName: string
    companySSN: string
    email: string
    exhibition: boolean
    generalEmail: string
    name: string
    operatingPermitForRestaurant: boolean
    operatingPermitForVehicles: boolean
    operationsTrouble: boolean
    phoneNumber: string
    serviceCategory: string
    validLicenses: boolean
    validPermit: boolean
    webpage: string
  }
}

export interface UserApplication extends Application {
  type: 'gjafakort-user'
  data: {
    mobileNumber: string
    countryCode: string
  }
}
