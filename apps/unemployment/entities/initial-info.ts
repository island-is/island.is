export class InitialInfo {
  dateFrom: Date
  name: string
  address: string
  postalCode: string
  city: string
  nationalId: string
  serviceOffice: string
  email: string
  mobile: string
  phone?: string
  communicationSecret: string
  childrenUnderCare: { name: string; nationalId: string; id?: number }
}
