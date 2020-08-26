export interface NationalRegistryResponse {
  source: 'Þjóðskrá' | 'Fyrirtækjaskrá'
  ssn: string
  name: string
  gender: string
  address: string
  postalcode: string
  city: string
  lastmodified: string
  charged: boolean
}

export interface SplitName {
  firstName: string
  middleName: string
  lastName: string
}
