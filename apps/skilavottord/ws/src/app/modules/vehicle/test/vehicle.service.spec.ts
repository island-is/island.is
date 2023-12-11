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
  // vehicleModel = app.get<VehicleModel>(VehicleModel)
})

const vehicleDestroy = async () => {
  console.log('---> vehicleDestroy called')
  return {}
}

const vehicleMoc = {
  vehicleId: '123345',
  ownerNationalId: '1111111111',
  vehicleType: 'Kia-soul',
  vehicleColor: 'White',
  destroy: jest.fn(),
  save: jest.fn(),
} as unknown as VehicleModel

const vehicleMocNewOwner = {
  vehicleId: '123345',
  ownerNationalId: '2222222222',
  vehicleType: 'Kia-soul',
  vehicleColor: 'White',
  destroy: jest.fn(),
  save: jest.fn(),
} as unknown as VehicleModel

describe('PublicVehicleServiceTest', () => {
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: VehicleModel,
          useClass: jest.fn(() => ({
            findOne: () => ({}),
            destroy: vehicleDestroy,
            save: jest.fn(),
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
    it('run create vehicle', async () => {
      jest
        .spyOn(vehicleService, 'findByVehicleId')
        .mockImplementation(() => Promise.resolve(vehicleMoc))
      // const vehicleModelDestroySpy = jest.spyOn(vehicleModel, 'destroy')
      const testRes1 = await vehicleService.findByVehicleId('HRX53')
      expect(testRes1).toBe(vehicleMoc)
      const testRes2 = await vehicleService.create(vehicleMoc)
      expect(vehicleMoc.save).toHaveBeenCalled()
      expect(testRes2).toBe(true)
      const testRes3 = await vehicleService.create(vehicleMocNewOwner)
      expect(vehicleMocNewOwner.save).toHaveBeenCalled()
      expect(vehicleMocNewOwner.destroy).toHaveBeenCalled()
      expect(testRes3).toBe(true)
    })
  })
})
