import { Cache as CacheManager } from 'cache-manager'
import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  NationalRegistryService,
  NationalRegistryUser,
} from '../../../nationalRegistry'
import { Flight } from '../../flight.model'
import { AirDiscountSchemeScope } from '@island.is/auth/scopes'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { setup } from '../../../../../../test/setup'

let app: INestApplication
let cacheManager: CacheManager
let nationalRegistryService: NationalRegistryService

const user: NationalRegistryUser = {
  nationalId: '1234567890',
  firstName: 'Jón',
  gender: 'kk',
  lastName: 'Jónsson',
  middleName: 'Gunnar',
  address: 'Bessastaðir 1',
  postalcode: 900,
  city: 'Vestmannaeyjar',
}

const mockAuthGuard = new MockAuthGuard({
  nationalId: '1326487905',
  scope: [AirDiscountSchemeScope.default, AirDiscountSchemeScope.admin],
})

beforeAll(async () => {
  app = await setup({
    override: (builder) =>
      builder.overrideGuard(IdsUserGuard).useValue(mockAuthGuard),
  })
  cacheManager = app.get<CacheManager>(CACHE_MANAGER)
  cacheManager.store.ttl = () => Promise.resolve(0)
  nationalRegistryService = app.get<NationalRegistryService>(
    NationalRegistryService,
  )
  jest
    .spyOn(nationalRegistryService, 'getUser')
    .mockImplementation(() => Promise.resolve(user))

  // 2020-08-18T14:26:22.018Z
  Date.now = jest.fn(() => 1597760782018)
})

describe('Create Flight', () => {
  it(`POST /api/public/discounts/:discountCode/flights should create a flight`, async () => {
    const spy = jest.spyOn(cacheManager, 'get').mockImplementation(() =>
      Promise.resolve({
        user,
        nationalId: user.nationalId,
        connectionDiscountCodes: [],
        discountCode: '12345678',
      }),
    )
    const response = await request(app.getHttpServer())
      .post('/api/public/discounts/12345678/flights')
      .set('Authorization', 'Bearer ernir')
      .send({
        bookingDate: '2020-08-17T12:35:50.971Z',
        flightLegs: [
          {
            origin: 'REK',
            destination: 'AEY',
            originalPrice: 50000,
            discountPrice: 30000,
            date: '2021-03-12T12:35:50.971Z',
          },
          {
            origin: 'AEY',
            destination: 'REK',
            originalPrice: 100000,
            discountPrice: 60000,
            date: '2021-03-15T12:35:50.971Z',
          },
        ],
      })
      .expect(201)

    expect(response.body).toEqual({
      id: expect.any(String),
      nationalId: '123456xxx0',
      bookingDate: '2020-08-17T12:35:50.971Z',
      flightLegs: [
        {
          id: expect.any(String),
          date: '2021-03-12T12:35:50.971Z',
          origin: 'REK',
          destination: 'AEY',
          discountPrice: 30000,
          originalPrice: 50000,
        },
        {
          id: expect.any(String),
          date: '2021-03-15T12:35:50.971Z',
          origin: 'AEY',
          destination: 'REK',
          discountPrice: 60000,
          originalPrice: 100000,
        },
      ],
    })

    spy.mockRestore()
  })

  it('POST /api/public/discounts/:discountCode/flights should return bad request when flightLegs are omitted', async () => {
    await request(app.getHttpServer())
      .post('/api/public/discounts/12345678/flights')
      .set('Authorization', 'Bearer ernir')
      .send({
        nationalId: user.nationalId,
        bookingDate: '2020-08-17T12:35:50.971Z',
      })
      .expect(400)
  })
})

describe('ConnectionDiscountCodes generation', () => {
  it('Should not create a discount code for Reykjavík-Gjögur flight', async () => {
    // Create discount without flights in the system
    let createDiscount = await request(app.getHttpServer())
      .post('/api/private/users/1234567890/discounts')
      .set('Authorization', 'Bearer norlandair')
      .send({
        nationalId: user.nationalId,
      })
      .expect(201)

    const discountCode = createDiscount.body.discountCode

    await request(app.getHttpServer())
      .post(`/api/public/discounts/${discountCode}/flights`)
      .set('Authorization', 'Bearer norlandair')
      .send({
        bookingDate: '2020-08-10T14:26:22.018Z',
        flightLegs: [
          {
            origin: 'REK',
            destination: 'GJG',
            originalPrice: 50000,
            discountPrice: 30000,
            date: '2020-08-17T14:26:22',
          },
        ],
      })
      .expect(201)

    // Re-create discounts with a flight in the system
    createDiscount = await request(app.getHttpServer())
      .post('/api/private/users/1234567890/discounts')
      .set('Authorization', 'Bearer norlandair')
      .send({
        nationalId: user.nationalId,
      })
      .expect(201)

    expect(createDiscount.body.connectionDiscountCodes.length).toBe(0)
  })
})

describe('Reykjavik -> Akureyri connecting flight validations', () => {
  let cacheSpy: jest.SpyInstance<Promise<any>, any[]>
  let flightId = ''

  beforeEach(async () => {
    cacheSpy = jest.spyOn(cacheManager, 'get').mockImplementation(() =>
      Promise.resolve({
        user,
        nationalId: user.nationalId,
        connectionDiscountCodes: [
          {
            code: 'ABCDEFGH',
            flightId,
            validUntil: '2020-08-19T14:26:22',
          },
        ],
      }),
    )

    const response = await request(app.getHttpServer())
      .post('/api/public/discounts/12345678/flights')
      .set('Authorization', 'Bearer norlandair')
      .send({
        bookingDate: '2020-08-10T14:26:22.018Z',
        flightLegs: [
          {
            origin: 'REK',
            destination: 'AEY',
            originalPrice: 50000,
            discountPrice: 30000,
            date: '2020-08-17T14:26:22', // 24 hours before Date.now jest
          },
        ],
      })

    flightId = response.body.id
    expect(response.status).toBe(201)
  })

  it('Akureyri->Grímsey 24 hours after allowed', async () => {
    await request(app.getHttpServer())
      .post('/api/public/discounts/ABCDEFGH/isValidConnectionFlight')
      .set('Authorization', 'Bearer norlandair')
      .send({
        flightLegs: [
          {
            origin: 'AEY',
            destination: 'GRY',
            date: '2020-08-18T14:26:22',
          },
        ],
      })
      .expect(200)
    cacheSpy.mockRestore()
  })

  it('Grímsey->Vopnafjörður 24 hours after not allowed (must touch Akureyri)', async () => {
    const connectionRes = await request(app.getHttpServer())
      .post('/api/public/discounts/ABCDEFGH/isValidConnectionFlight')
      .set('Authorization', 'Bearer norlandair')
      .send({
        flightLegs: [
          {
            origin: 'GRY',
            destination: 'VPN',
            date: '2020-08-18T14:26:22',
          },
        ],
      })
      .expect(403)

    expect(
      connectionRes.body.message.includes('User does not meet the requirement'),
    ).toBe(true)
    cacheSpy.mockRestore()
  })

  it('Akureyri->Reykjavík not allowed as a connecting flight', async () => {
    const connectionRes = await request(app.getHttpServer())
      .post('/api/public/discounts/ABCDEFGH/isValidConnectionFlight')
      .set('Authorization', 'Bearer norlandair')
      .send({
        flightLegs: [
          {
            origin: 'AEY',
            destination: 'RKV',
            date: '2020-08-18T14:26:22',
          },
        ],
      })
      .expect(403)

    expect(connectionRes.body.message).toEqual(
      'A flightleg contains invalid flight code/s [AEY, RKV]. Allowed flight codes: [AEY,VPN,GRY,THO]',
    )
    cacheSpy.mockRestore()
  })

  it('Akureyri->Grímsey 72 hours after not allowed (validUntil expired)', async () => {
    const connectionRes = await request(app.getHttpServer())
      .post('/api/public/discounts/ABCDEFGH/isValidConnectionFlight')
      .set('Authorization', 'Bearer norlandair')
      .send({
        flightLegs: [
          {
            origin: 'AEY',
            destination: 'GRY',
            date: '2020-08-20T14:26:22',
          },
        ],
      })
      .expect(403)

    expect(
      connectionRes.body.message.includes('User does not meet the requirement'),
    ).toBe(true)
    cacheSpy.mockRestore()
  })

  it('Akureyri -> Grímsey 24 hours before not allowed', async () => {
    const connectionRes = await request(app.getHttpServer())
      .post('/api/public/discounts/ABCDEFGH/isValidConnectionFlight')
      .set('Authorization', 'Bearer norlandair')
      .send({
        flightLegs: [
          {
            origin: 'AEY',
            destination: 'GRY',
            date: '2020-08-16T14:26:22',
          },
        ],
      })
      .expect(403)

    expect(
      connectionRes.body.message.includes('User does not meet the requirement'),
    ).toBe(true)
    cacheSpy.mockRestore()
  })

  it('AEY -> GRY -> GRY -> AEY, not allowed since there is no return trip to RKV', async () => {
    const connectionRes = await request(app.getHttpServer())
      .post('/api/public/discounts/ABCDEFGH/isValidConnectionFlight')
      .set('Authorization', 'Bearer norlandair')
      .send({
        flightLegs: [
          {
            origin: 'AEY',
            destination: 'GRY',
            date: '2020-08-16T14:26:22',
          },
          {
            origin: 'GRY',
            destination: 'AEY',
            date: '2020-08-16T16:26:22',
          },
        ],
      })
      .expect(403)

    expect(
      connectionRes.body.message.includes('User does not meet the requirement'),
    ).toBe(true)
    cacheSpy.mockRestore()
  })

  it('Correct flight, wrong discount code should result in error', async () => {
    const connectionRes = await request(app.getHttpServer())
      .post('/api/public/discounts/HIJKLMNO/isValidConnectionFlight')
      .set('Authorization', 'Bearer norlandair')
      .send({
        flightLegs: [
          {
            origin: 'AEY',
            destination: 'GRY',
            date: '2020-08-18T14:26:22',
          },
        ],
      })
      .expect(403)

    expect(connectionRes.body.message).toEqual(
      'The provided discount code is either not intended for connecting flights or is expired',
    )

    cacheSpy.mockRestore()
  })
})

describe('Reykjavik -> Akureyri -> Akureyri -> Reykjavík connecting flight validations', () => {
  let cacheSpy: jest.SpyInstance<Promise<any>, any[]>
  let flightId = ''

  beforeEach(async () => {
    cacheSpy = jest.spyOn(cacheManager, 'get').mockImplementation(() =>
      Promise.resolve({
        user,
        nationalId: user.nationalId,
        connectionDiscountCodes: [
          {
            code: 'ABCDEFGH',
            flightId,
            validUntil: '2020-08-19T14:26:22',
          },
        ],
      }),
    )

    const response = await request(app.getHttpServer())
      .post('/api/public/discounts/12345678/flights')
      .set('Authorization', 'Bearer norlandair')
      .send({
        bookingDate: '2020-08-10T14:26:22.018Z',
        flightLegs: [
          {
            origin: 'RKV',
            destination: 'AEY',
            originalPrice: 50000,
            discountPrice: 30000,
            date: '2020-08-14T14:26:22',
          },
          {
            origin: 'AEY',
            destination: 'RKV',
            originalPrice: 50000,
            discountPrice: 30000,
            date: '2020-08-17T14:26:22', // 24 hours before Date.now jest
          },
        ],
      })

    flightId = response.body.id
    expect(response.status).toBe(201)
  })

  it('Akureyri -> Grímsey -> Grímsey -> Akureyri', async () => {
    await request(app.getHttpServer())
      .post('/api/public/discounts/ABCDEFGH/isValidConnectionFlight')
      .set('Authorization', 'Bearer norlandair')
      .send({
        flightLegs: [
          {
            origin: 'AEY',
            destination: 'GRY',
            date: '2020-08-15T14:26:22',
          },
          {
            origin: 'GRY',
            destination: 'AEY',
            date: '2020-08-16T14:26:22',
          },
        ],
      })
      .expect(200)
    cacheSpy.mockRestore()
  })

  it('AEY->GRY->GRY->AEY, one flightLeg has wrong date', async () => {
    const connectionRes = await request(app.getHttpServer())
      .post('/api/public/discounts/ABCDEFGH/isValidConnectionFlight')
      .set('Authorization', 'Bearer norlandair')
      .send({
        flightLegs: [
          {
            origin: 'AEY',
            destination: 'GRY',
            date: '2020-08-15T14:26:22',
          },
          {
            origin: 'GRY',
            destination: 'AEY',
            date: '2020-08-20T14:26:22',
          },
        ],
      })
      .expect(403)

    expect(
      connectionRes.body.message.includes(
        'Must be 48 hours or less between flight and connectingflight',
      ),
    ).toBe(true)
    cacheSpy.mockRestore()
  })

  it('Akureyri -> Raufarhöfn -> Raufarhöfn -> Akureyri not allowed (Raufarhöfn not an allowed airport)', async () => {
    const connectionRes = await request(app.getHttpServer())
      .post('/api/public/discounts/ABCDEFGH/isValidConnectionFlight')
      .set('Authorization', 'Bearer norlandair')
      .send({
        flightLegs: [
          {
            origin: 'AEY',
            destination: 'RHN',
            date: '2020-08-15T14:26:22',
          },
          {
            origin: 'RHN',
            destination: 'AEY',
            date: '2020-08-16T14:26:22',
          },
        ],
      })
      .expect(403)

    expect(connectionRes.body.message).toBe(
      'A flightleg contains invalid flight code/s [AEY, RHN]. Allowed flight codes: [AEY,VPN,GRY,THO]',
    )
    cacheSpy.mockRestore()
  })
})

describe('Delete Flight', () => {
  it(`DELETE /api/public/flights/:flightId should delete a flight`, async () => {
    const spy = jest
      .spyOn(cacheManager, 'get')
      .mockImplementation(() =>
        Promise.resolve({ user: user, nationalId: user.nationalId }),
      )
    const createRes = await request(app.getHttpServer())
      .post('/api/public/discounts/12345678/flights')
      .set('Authorization', 'Bearer icelandair')
      .send({
        bookingDate: '2020-08-17T12:35:50.971Z',
        flightLegs: [
          {
            origin: 'REK',
            destination: 'AEY',
            originalPrice: 50000,
            discountPrice: 30000,
            date: '2021-03-12T12:35:50.971Z',
          },
          {
            origin: 'AEY',
            destination: 'REK',
            originalPrice: 100000,
            discountPrice: 60000,
            date: '2021-03-15T12:35:50.971Z',
          },
        ],
      })
      .expect(201)
    spy.mockRestore()

    await request(app.getHttpServer())
      .delete(`/api/public/flights/${createRes.body.id}`)
      .set('Authorization', 'Bearer icelandair')
      .expect(204)

    const getRes = await request(app.getHttpServer())
      .get(`/api/private/flights`)
      .expect(200)

    expect(getRes.body.length).toBe(0)
  })

  it(`DELETE /api/public/flights/:flightId should validate flightId`, async () => {
    await request(app.getHttpServer())
      .delete('/api/public/flights/this-is-not-uuid')
      .set('Authorization', 'Bearer ernir')
      .expect(400)
  })

  it(`DELETE /api/public/flights/:flightId should return not found if flight does not exist`, async () => {
    await request(app.getHttpServer())
      .delete('/api/public/flights/dfac526d-5dc0-4748-b858-3d9cd2ae45be')
      .set('Authorization', 'Bearer ernir')
      .expect(404)
  })

  it(`DELETE /api/public/flights/:flightId/flightLegs/:flightLegId should delete a flightLeg`, async () => {
    // Arrange
    const spy = jest
      .spyOn(cacheManager, 'get')
      .mockImplementation(() =>
        Promise.resolve({ user, nationalId: user.nationalId }),
      )
    const createRes = await request(app.getHttpServer())
      .post('/api/public/discounts/12345678/flights')
      .set('Authorization', 'Bearer icelandair')
      .send({
        bookingDate: '2020-08-17T12:35:50.971Z',
        flightLegs: [
          {
            origin: 'REK',
            destination: 'AEY',
            originalPrice: 50000,
            discountPrice: 30000,
            date: '2021-03-12T12:35:50.971Z',
          },
          {
            origin: 'AEY',
            destination: 'REK',
            originalPrice: 100000,
            discountPrice: 60000,
            date: '2021-03-15T12:35:50.971Z',
          },
        ],
      })
      .expect(201)
    spy.mockRestore()
    expect(createRes.body.flightLegs.length).toBe(2)

    // Act
    await request(app.getHttpServer())
      .delete(
        `/api/public/flights/${createRes.body.id}/flightLegs/${createRes.body.flightLegs[0].id}`,
      )
      .set('Authorization', 'Bearer icelandair')
      .expect(204)

    // Assert
    const getRes = await request(app.getHttpServer()).get(
      `/api/private/flights`,
    )
    expect(
      getRes.body.find((flight: Flight) => flight.id === createRes.body.id)
        .flightLegs.length,
    ).toBe(1)
  })
})
