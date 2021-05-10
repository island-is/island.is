export interface Endorsement {
  date: string
  name: string
  nationalId: string
  address: {
    city: string
    postalCode: number
    streetAddress: string
  }
  hasWarning?: boolean
  id: string
}
