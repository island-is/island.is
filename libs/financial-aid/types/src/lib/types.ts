export interface Application {
  id: string
  created: string
  modified: string
  nationalId: string
  name: string
  phoneNumber: string
  email: string
}

export interface CreateApplication{
  nationalId: string
  name: string
  phoneNumber: string
  email: string
}