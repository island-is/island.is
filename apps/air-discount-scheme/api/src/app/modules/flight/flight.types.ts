import { User, Flight } from '@island.is/air-discount-scheme/types'

export type FlightWithUser = Flight & { user: User }
