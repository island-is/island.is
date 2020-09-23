import { INestApplication } from '@nestjs/common'

import { Airlines } from '@island.is/air-discount-scheme/consts'

import { setup } from '../../../../../../test/setup'
import { NationalRegistryUser } from '../../../nationalRegistry'
import { FlightService } from '../../flight.service'
import { CreateFlightBody } from '../../dto'

let app: INestApplication
let flightService: FlightService

beforeAll(async () => {
  app = await setup()
  flightService = app.get<FlightService>(FlightService)
})

describe('create', () => {
  const flightDto: CreateFlightBody = {
    bookingDate: new Date('2020-08-17T12:35:50.971Z'),
    flightLegs: [
      {
        origin: 'VPN',
        destination: 'AK',
        originalPrice: 50000,
        discountPrice: 30000,
        date: new Date('2021-03-12T12:35:50.971Z'),
        cooperation: '',
      },
      {
        origin: 'AK',
        destination: 'THO',
        originalPrice: 100000,
        discountPrice: 60000,
        date: new Date('2021-03-15T12:35:50.971Z'),
        cooperation: '',
      },
      {
        origin: 'GRY',
        destination: 'GRY',
        originalPrice: 100000,
        discountPrice: 60000,
        date: new Date('2021-03-15T12:35:50.971Z'),
        cooperation: '',
      },
      {
        origin: 'AK',
        destination: 'RVK',
        originalPrice: 100000,
        discountPrice: 60000,
        date: new Date('2021-03-15T12:35:50.971Z'),
        cooperation: Airlines.norlandair,
      },
      {
        origin: 'AK',
        destination: 'RVK',
        originalPrice: 100000,
        discountPrice: 60000,
        date: new Date('2021-03-15T12:35:50.971Z'),
        cooperation: '',
      },
    ],
  }
  const user: NationalRegistryUser = {
    nationalId: 'string',
    firstName: 'string',
    middleName: 'string',
    lastName: 'string',
    gender: 'kk',
    address: 'string',
    postalcode: 200,
    city: 'string',
  }

  it('should set the cooperation as norlandair for first 3 legs, and null for last', async () => {
    const airline = 'icelandair'
    const result = await flightService.create(flightDto, user, airline)

    expect(result.flightLegs.length).toEqual(5)
    expect(result.flightLegs[0].airline).toEqual(airline)
    expect(result.flightLegs[1].airline).toEqual(airline)
    expect(result.flightLegs[2].airline).toEqual(airline)
    expect(result.flightLegs[3].airline).toEqual(airline)
    expect(result.flightLegs[4].airline).toEqual(airline)
    expect(result.flightLegs[0].cooperation).toEqual(Airlines.norlandair)
    expect(result.flightLegs[1].cooperation).toEqual(Airlines.norlandair)
    expect(result.flightLegs[2].cooperation).toEqual(Airlines.norlandair)
    expect(result.flightLegs[3].cooperation).toEqual(Airlines.norlandair)
    expect(result.flightLegs[4].cooperation).toEqual(null)
  })

  it('should set the airline as ernir', async () => {
    const airline = 'ernir'
    const result = await flightService.create(flightDto, user, airline)

    expect(result.flightLegs.length).toEqual(5)
    expect(result.flightLegs[0].airline).toEqual(airline)
    expect(result.flightLegs[1].airline).toEqual(airline)
    expect(result.flightLegs[2].airline).toEqual(airline)
    expect(result.flightLegs[3].airline).toEqual(airline)
    expect(result.flightLegs[0].cooperation).toEqual(null)
    expect(result.flightLegs[1].cooperation).toEqual(null)
    expect(result.flightLegs[2].cooperation).toEqual(null)
    expect(result.flightLegs[3].cooperation).toEqual(Airlines.norlandair)
    expect(result.flightLegs[4].cooperation).toEqual(null)
  })
})
