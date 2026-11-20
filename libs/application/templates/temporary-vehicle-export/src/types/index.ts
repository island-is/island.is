import { DefaultEvents } from '@island.is/application/types'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }

export enum States {
  PREREQUISITES = 'prerequisites',
  DEPARTURE = 'departure',
  AWAITING_ARRIVAL = 'awaitingArrival',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum ApiActions {
  getEligibleVehicles = 'getEligibleVehicles',
  registerDepartureMileage = 'registerDepartureMileage',
  submitArrival = 'submitArrival',
}

/**
 * Origin codes sent to Samgöngustofa with each mileage reading so the reading
 * can be traced back to this application. Max 10 characters, and each code
 * has to exist in Samgöngustofa's `mileagereadingorigin` code table.
 */
export enum MileageOriginCode {
  DEPARTURE = 'BROTTFOR',
  ARRIVAL = 'KOMA',
}

export interface EligibleVehicle {
  permno: string
  make?: string
  color?: string
  latestMileage?: number
  latestMileageReadDate?: string
}

export interface EligibleVehiclesResponse {
  vehicles: EligibleVehicle[]
}

export interface RegisteredMileage {
  permno: string
  mileage: number
  /** Not set when the latest reading at Samgöngustofa was used as it is */
  originCode?: MileageOriginCode
  readDate?: string
}

/** The kilometre fee reimbursement application created at Skatturinn */
export interface SkatturinnSubmission {
  id: number
  status: string
}

export interface ArrivalSubmission {
  mileage: RegisteredMileage
  skatturinn: SkatturinnSubmission
}
