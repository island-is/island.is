export interface Person {
  name: string
  nationalId: string
}

export interface Address {
  address: {
    locality: string
    municipalityCode: string
    postalCode: string
    streetAddress: string
  }
}

export interface NationalRegistry {
  address: any
  nationalId: string
  fullName: string
  name: string
  ssn: string
  length: number
  data: any
}
