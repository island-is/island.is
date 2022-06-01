export interface NationalRegistryUser {
  nationalId: string
  age: number
  fullName: string
  citizenship: {
    code: string
    name: string
  }
  address: {
    code: string
    lastUpdated: string
    streetAddress: string
    city: string
    postalCode: string
  }
}
