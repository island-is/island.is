import { ExemptionFor } from '@island.is/application/templates/transport-authority/exemption-for-transportation'

export interface Person {
  nationalId: string
  fullName: string
  address?: string
  postalCode?: string
  city?: string
  email: string
  phone: string
}

export interface CargoAssignment {
  freightId: string
  height: string
  width: string
  totalLength: string
  exemptionFor: ExemptionFor[]
}
