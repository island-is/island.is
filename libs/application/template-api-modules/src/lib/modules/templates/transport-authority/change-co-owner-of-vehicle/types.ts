export enum EmailRole {
  owner,
  currentCoOwner,
  addedCoOwner,
}

export interface EmailRecipient {
  ssn: string
  name: string
  email?: string
  phone?: string
  role: EmailRole
  approved?: boolean
}
