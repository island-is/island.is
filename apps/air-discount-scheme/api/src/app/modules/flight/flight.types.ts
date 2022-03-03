import { Flight,User } from '@island.is/air-discount-scheme/types'

export type FlightWithUser = Flight & { user: User }
