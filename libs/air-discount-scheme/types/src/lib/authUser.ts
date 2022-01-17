import { FlightLeg } from '..'
import { Fund } from './user'

export enum Role {
  DEVELOPER = 'developer',
  ADMIN = 'admin',
  USER = 'user',
}

export interface AuthUser {
  nationalId: string
  name: string
  mobile?: string
  role: Role
  fund?: Fund
  meetsADSRequirements?: boolean
  flightLegs?: FlightLeg
}
