import { VehicleService } from '../vehicle.service'
import { setup } from '../../../../../test/setup'
import { INestApplication } from '@nestjs/common'
import { VehicleModel } from '../vehicle.model'
import { Test } from '@nestjs/testing'

let app: INestApplication
let vehicleService: VehicleService
let vehicleModel: VehicleModel

//sjá->apps/air-discount-scheme/backend/src/app/modules/flight/test/integration/flight.service.spec.ts
beforeAll(async () => {
  app = await setup()
  vehicleService = app.get<VehicleService>(VehicleService)
})

const vehicleMoc = {
  vehicleId: '123345',
  ownerNationalId: '1111111111',
  vehicleType: 'Kia-soul',
  vehicleColor: 'White',
} as VehicleModel

describe('PublicVehicleServiceTest', () => {
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: VehicleModel,
          useClass: jest.fn(() => ({
            findOne: () => ({}),
          })),
        },
      ],
    }).compile()
    vehicleModel = moduleRef.get<VehicleModel>(VehicleModel)
  })

  describe('run test', () => {
    it('run test test', () => {
      const testRes = vehicleService.test()
      expect(testRes).toBe('test')
    })
    it('run test findByVehicleId', async () => {
      jest
        .spyOn(vehicleService as any, 'findByVehicleId')
        .mockImplementation(() => Promise.resolve(vehicleMoc))
      const testRes1 = await vehicleService.findByVehicleId('HRX53')
      console.log(`----> testRest1 ----> ` + JSON.stringify(testRes1))
      // expect(true).toBe(true)
      expect(testRes1).toBe(vehicleMoc)
      const testRes2 = await vehicleService.create(vehicleMoc)
      console.log(`----> testRest2 ----> ${testRes2}`)
      expect(testRes2).toBe(true)
    })
  })
})
