import { DollyType, ExemptionFor } from '../../shared'

export type Vehicle = {
  permno: string
  makeAndColor: string
  numberOfAxles: number
  hasError: boolean
}
export type Convoy = {
  convoyId: string
  vehicle: Vehicle
  dollyType: DollyType
  trailer?: Vehicle
}

export type Freight = {
  freightId: string
  name: string
}

export type FreightPairing = {
  convoyId: string
  length: string
  weight: string
  height: string
  width: string
  totalLength: string
  exemptionFor: ExemptionFor[]
}
