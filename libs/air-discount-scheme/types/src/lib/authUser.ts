import { FlightLeg } from ".."
import { Fund } from './user'

export type Role = 'developer' | 'admin' | 'user'

export interface AuthUser {
  nationalId: string
  name: string
  mobile?: string
  role: Role
  fund?: Fund
  meetsADSRequirements?: boolean
  flightLegs?: FlightLeg
}
