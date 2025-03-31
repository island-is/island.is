import { MessageDescriptor } from 'react-intl'
import { TrueOrFalse } from './enums'

export type InstructorInformationInput = {
  email: string
  nationalId: {
    nationalId: string
    name: string
  }
  phone: string
}

export type ExamineeInput = {
  email: string
  nationalId: {
    nationalId: string
    name: string
  }
  phone: string
  licenseNumber: string
  countryIssuer: string
}

export type Examinee = {
  email: string
  nationalId: {
    nationalId: string
    name: string
  }
  phone: string
  licenseNumber: string
  countryIssuer: string
  disabled: TrueOrFalse | undefined
}

export type PathAndValue = { path: string; value: string }

export interface IndexableObject {
  [index: number]: Array<string>
}

export interface CSVError {
  items: Array<number>
  error: MessageDescriptor
}
