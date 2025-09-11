export interface User {
  nationalId: string
  emails: Array<{ primary: boolean; email: string }>
  mobilePhoneNumber: string
}
