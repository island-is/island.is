import { Test } from '@nestjs/testing'

import { ApiScope } from '@island.is/auth/scopes'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import {
  AirDiscountSchemeClientService,
  Flight,
} from '@island.is/clients/air-discount-scheme'

import { UserService } from './user.service'

describe('ApiDomains: UserService', () => {
  let service: UserService
  const getUserAndRelationsFlights = jest.fn()

  const auth: AuthUser = {
    authorization: '',
    client: '',
    nationalId: '1010303019',
    scope: [ApiScope.internal],
  }
  const relationId = '2222222229'
  const date = new Date('2026-01-01')

  const fabFlightWithoutLegs = (nationalId: string): Flight => ({
    id: `flight-${nationalId}`,
    nationalId,
    userInfo: { age: 30, gender: 'kk', postalCode: 600 },
    bookingDate: date,
    created: date,
    modified: date,
    connectable: false,
  })

  const fabFlight = (
    nationalId: string,
    legs: [origin: string, destination: string][],
  ): Flight => {
    const flight: Flight = {
      ...fabFlightWithoutLegs(nationalId),
      flightLegs: [],
    }
    legs.forEach(([origin, destination], index) => {
      flight.flightLegs?.push({
        id: `leg-${index}`,
        flight,
        origin,
        destination,
        airline: 'icelandair',
        cooperation: '',
        isConnectingFlight: false,
        originalPrice: 0,
        discountPrice: 0,
        financialState: 'AWAITING_DEBIT',
        financialStateUpdated: date,
        date,
        created: date,
        modified: date,
      })
    })
    return flight
  }

  beforeEach(async () => {
    getUserAndRelationsFlights.mockReset()

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: AirDiscountSchemeClientService,
          useValue: { getUserAndRelationsFlights },
        },
      ],
    }).compile()

    service = module.get(UserService)
  })

  it("counts only the person's own flights", async () => {
    getUserAndRelationsFlights.mockResolvedValue([
      fabFlight(auth.nationalId, [['REK', 'AEY']]),
      fabFlight(relationId, [
        ['REK', 'EGS'],
        ['REK', 'EGS'],
      ]),
    ])

    const route = await service.getMostFlownRoute(auth, auth.nationalId)

    expect(route).toEqual({ route: 'REK - AEY', count: 1 })
  })

  it('treats each direction as a separate route', async () => {
    getUserAndRelationsFlights.mockResolvedValue([
      fabFlight(auth.nationalId, [
        ['REK', 'AEY'],
        ['AEY', 'REK'],
        ['REK', 'AEY'],
      ]),
    ])

    const route = await service.getMostFlownRoute(auth, auth.nationalId)

    expect(route).toEqual({ route: 'REK - AEY', count: 2 })
  })

  it('keeps the route that reached the top count first on a tie', async () => {
    getUserAndRelationsFlights.mockResolvedValue([
      fabFlight(auth.nationalId, [
        ['AEY', 'REK'],
        ['REK', 'AEY'],
      ]),
    ])

    const route = await service.getMostFlownRoute(auth, auth.nationalId)

    expect(route).toEqual({ route: 'AEY - REK', count: 1 })
  })

  it('returns null when the person has no legs', async () => {
    getUserAndRelationsFlights.mockResolvedValue([
      fabFlightWithoutLegs(auth.nationalId),
      fabFlight(relationId, [['REK', 'AEY']]),
    ])

    const route = await service.getMostFlownRoute(auth, auth.nationalId)

    expect(route).toBeNull()
  })

  it('returns null when the client call fails', async () => {
    getUserAndRelationsFlights.mockRejectedValue(
      new Error('Service unavailable'),
    )

    const route = await service.getMostFlownRoute(auth, auth.nationalId)

    expect(route).toBeNull()
  })
})
