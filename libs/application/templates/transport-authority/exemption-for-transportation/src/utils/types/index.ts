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
  length: string
  name: string
  freightId: string
  weight: string
}

export type FreightPairing = {
  convoyId: string
  height: string
  width: string
  totalLength: string
  exemptionFor: ExemptionFor[]
}
