import { Test, TestingModule } from '@nestjs/testing'
import { VehicleService } from '../vehicle.service'
import { VehicleModel } from '..'
import { SequelizeModule } from '@nestjs/sequelize'
import { VehicleOwnerModel } from '../../vehicleOwner'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { RecyclingRequestModel } from '../../recyclingRequest'
import { RecyclingPartnerModel } from '../../recyclingPartner'

const mockVehicleModel = () => ({
  // save: jest.fn(),
})

describe('skilavottordVehicleService', () => {
  let vehicleService: VehicleService
  let tmodule: TestingModule
  // let vehicleModel: VehicleModel

  beforeEach(async () => {
    tmodule = await Test.createTestingModule({
      providers: [
        VehicleService,
        { provide: VehicleModel, useFactory: mockVehicleModel },
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile()
    // vehicleModel = tmodule.get<VehicleModel>(VehicleModel)
    vehicleService = tmodule.get<VehicleService>(VehicleService)
  })

  describe('run test', () => {
    it('run test', () => {
      const testRes = vehicleService.test()
      expect(testRes).toBe('test')
    })

    it('run create', async () => {
      const vm = new VehicleModel()
      vm.vehicleColor = 'white'
      vm.ownerNationalId = '1111111111'
      vm.vehicleType = 'Toyota corolla'
      vm.vehicleId = 'tcm32'
      let res = await vehicleService.create(vm)
      expect(true).toEqual(true)
    })
  })
})

// async create(vehicle: VehicleModel): Promise<boolean> {
