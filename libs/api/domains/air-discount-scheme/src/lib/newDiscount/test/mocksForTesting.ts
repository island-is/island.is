import { User } from '@island.is/auth-nest-tools'

import { ApiScope } from '@island.is/auth/scopes'
import { NewDiscount } from '../../models/newDiscount.model'
import { User as TUser } from '@island.is/air-discount-scheme/types'
type DiscountWithTUser = NewDiscount & { user: TUser; id: string }

export const idsForGetDiscount = ['1010303019', '1010307789', '2222222229']
export const idsForCreateDiscount = ['1010302399', '3333333339']
export const idsForGetUserRelations = ['1010307789', '1010302989']

export const fabAuthUser = (nationalId: string): User => ({
  authorization: '',
  client: '',
  nationalId,
  scope: [ApiScope.internal],
})

export const fabDiscount = (
  nationalId: string,
  discountCode: string | null,
): DiscountWithTUser => ({
  id: '123',
  user: {
    ...fabTUser(nationalId),
    // The DiscountWithTUser.user takes from both TUser and the User model
    // We fabricate TUser and name is simply the odd one out from between them.
    name: 'Bergvin',
  },
  discountedFlights: [
    fabFlight(
      '123,',
      [fabFlightLeg('AEY', 'REK')],
      true,
      fabAirDiscount(nationalId, true, false, discountCode),
    ),
  ],
  active: true,
  nationalId,
})

export const fabGetDiscount = (nationalId: string): DiscountWithTUser => {
  return fabDiscount(nationalId, 'GETDISCO')
}

export const fabCreateDiscount = (nationalId: string): DiscountWithTUser => {
  return fabDiscount(nationalId, 'CREATEDC')
}

export const fabInvalidDiscount = (_nationalId: string) => {
  return null
}

export const fabAirDiscount = (
  nationalId: string,
  isConnectionCode: boolean,
  hasReturnFlight: boolean,
  discountCode: string | null,
) => ({
  nationalId,
  code: discountCode,
  validUntil: '12-12-12',
  usedAt: '12-12-12',
  active: true,
  isConnectionCode,
  explicit: false,
  comment: '',
  employeeId: '123',
  hasReturnFlight,
})

export const fabFlightLeg = (origin: string, destination: string) => {
  return {
    id: '123',
    origin,
    destination,
  }
}
export const fabFlight = (
  discountId: string,
  flightLegs: { id: string; origin: string; destination: string }[],
  isConnectionFlight: boolean,
  airDiscount: any,
) => {
  return {
    id: '123',
    discountId,
    flightLegs,
    isConnectionFlight,
    discount: airDiscount,
  }
}

export const fabTUser = (nationalId: string): TUser => ({
  address: 'Neinsstaðarból 18',
  city: 'Reykjavík',
  firstName: 'Bergvin',
  middleName: 'Björn',
  lastName: 'Bóason',
  gender: 'kk',
  nationalId,
  postalcode: 200,
  fund: {
    credit: 6,
    total: 6,
    used: 0,
  },
})

export const userRelationsWardResponse: TUser[] = [
  fabTUser('2222222229'),
  fabTUser('3333333339'),
]
