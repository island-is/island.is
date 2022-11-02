export type { ConnectionDiscountCode, Discount } from './lib/discount'
export type {
  FlightLeg,
  UserInfo,
  Flight,
  Travel,
  PeriodInput,
  RangeInput,
  FlightLegsInput,
} from './lib/flight'
export type { User, BaseUser, Fund } from './lib/user'
export type { AuthUser } from './lib/authUser'
export { Role } from './lib/authUser'

export const AIR_DISCOUNT_SCHEME_OPTIONS = 'AIR_DISCOUNT_SCHEME_OPTIONS'
export interface AirDiscountSchemeOptions {
  backendUrl: string
}
