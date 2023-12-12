import { VehicleService } from '../../vehicle.service'
import { VehicleModel } from '../../vehicle.model'
import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'

describe('PublicFlightController', () => {
  let vehicleService: VehicleService
  let vehicleModel: VehicleModel

  const vehicleMoc = {
    vehicleId: '123345',
    ownerNationalId: '1111111111',
    vehicleType: 'Kia-soul',
    vehicleColor: 'Blue',
    destroy: jest.fn(),
    save: jest.fn(),
  } as unknown as VehicleModel

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: getModelToken(VehicleModel),
          useClass: jest.fn(() => ({
            save: () => ({}),
            destroy: () => ({}),
          })),
        },
      ],
    }).compile()
    vehicleService = moduleRef.get<VehicleService>(VehicleService)
    vehicleModel = moduleRef.get<VehicleModel>(getModelToken(VehicleModel))
  })

  describe('UnitTestVehicleService', () => {
    it('create vehicle, same owner', async () => {
      expect(true).toBe(true)
    })
    it('create vehicle, same owner', async () => {
      jest
        .spyOn(vehicleService, 'findByVehicleId')
        .mockImplementation(() => Promise.resolve(vehicleMoc))
      const result = await vehicleService.create(vehicleMoc)
      expect(result).toBe(true)
    })
    it('create vehicle, owner has changed', async () => {
      jest
        .spyOn(vehicleService, 'findByVehicleId')
        .mockImplementation(() => Promise.resolve(vehicleMoc))
      const vehicleMocNewOwner = {
        ...vehicleMoc,
        ownerNationalId: '2222222222',
      } as unknown as VehicleModel
      const result = await vehicleService.create(vehicleMocNewOwner)
      expect(vehicleMoc.destroy).toHaveBeenCalled()
      expect(vehicleMocNewOwner.save).toHaveBeenCalled()
      expect(result).toBe(true)
    })
  })
})
