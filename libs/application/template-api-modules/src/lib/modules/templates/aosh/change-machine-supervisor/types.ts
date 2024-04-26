export enum EmailRole {
  owner,
  supervisor,
}

export interface EmailRecipient {
  ssn: string
  name: string
  email?: string
  phone?: string
  role: EmailRole
  approved?: boolean
}

export type UserProfile = {
  nationalId: string
  name: string
  email: string
  mobilePhoneNumber: string
}
