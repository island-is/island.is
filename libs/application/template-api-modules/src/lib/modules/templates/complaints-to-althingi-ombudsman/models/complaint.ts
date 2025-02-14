import { GenderAnswerOptions } from '@island.is/application/templates/complaints-to-althingi-ombudsman'

export interface ComplainerContactInfo {
  name: string
  nationalId: string
  type: string //person | felag/samtok,
  address: string
  email: string
  phone: string
  postalCode: string
  city: string
  gender?: GenderAnswerOptions
}

export interface ComplaineeContactInfo {
  name: string
}

export enum ContactRole {
  COMPLAINTANT = 'Kvartandi',
  CLIENT = 'Umbjóðandi',
  GOVERNMENT = 'Stjórnvald',
}
