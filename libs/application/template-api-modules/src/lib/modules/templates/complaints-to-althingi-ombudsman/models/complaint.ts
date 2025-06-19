export interface ComplainerContactInfo {
  name: string
  nationalId: string
  type: string //person | felag/samtok,
  address: string
  email: string
  phone: string
  postalCode: string
  city: string
}

export interface ComplaineeContactInfo {
  name: string
}

export enum ContactRole {
  COMPLAINTANT = 'Kvartandi',
  CLIENT = 'Umbjóðandi',
  GOVERNMENT = 'Stjórnvald',
}
