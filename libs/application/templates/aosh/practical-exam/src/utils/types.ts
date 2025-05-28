import { TrueOrFalse } from './enums'
import { DefaultEvents } from '@island.is/application/types'

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

export type Events = {
  type: DefaultEvents.SUBMIT | DefaultEvents.ABORT
}
