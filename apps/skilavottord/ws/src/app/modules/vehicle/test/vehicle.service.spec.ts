import { Test, TestingModule } from '@nestjs/testing'
import { VehicleService } from '../vehicle.service'
import { VehicleModel } from '..'
import { SequelizeModule } from '@nestjs/sequelize'
import { VehicleOwnerModel } from '../../vehicleOwner'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { RecyclingRequestModel } from '../../recyclingRequest'
import { RecyclingPartnerModel } from '../../recyclingPartner'

const mockVehicleModel = () => ({
  test: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findByVehicleId: jest.fn(),
})

const mockVehicleOwnerModel = () => ({})

describe('skilavottordVehicleService', () => {
  let vehicleService: VehicleService
  let tmodule: TestingModule
  let vehicleModel: VehicleModel
  //
  beforeEach(async () => {
    tmodule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forFeature([VehicleModel]),
        SequelizeModule.forFeature([VehicleOwnerModel]),
        SequelizeModule.forFeature([RecyclingRequestModel]),
        SequelizeModule.forFeature([RecyclingPartnerModel]),

        SequelizeModule.forRoot({
          dialect: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'dev_db',
          password: 'dev_db',
          database: 'dev_db',
          autoLoadModels: true,
          synchronize: true,
        }),
      ],
      providers: [
        VehicleService,
        { provide: VehicleModel, useFactory: mockVehicleModel },
        { provide: VehicleOwnerModel, useFactory: mockVehicleOwnerModel },
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile()
    vehicleService = tmodule.get(VehicleService)
  })

  afterEach(async () => {
    await tmodule.close()
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
