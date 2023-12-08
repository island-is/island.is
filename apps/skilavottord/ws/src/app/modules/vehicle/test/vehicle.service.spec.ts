import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'
import { VehicleService } from '../vehicle.service'
import { VehicleModel } from '..'
import { VehicleOwnerModel } from '../../vehicleOwner'
import { RecyclingRequestModel } from '../../recyclingRequest'
import { RecyclingPartnerModel } from '../../recyclingPartner'
import { getModelToken } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'

// describe('skilavottordVehicleService', () => {
//   let vehicleService: VehicleService
//   let vehicleModel: VehicleModel
//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       providers: [
//         {
//           provide: VehicleService,
//           useValue: {
//             findAllByFilter: jest.fn(),
//             findByVehicleId: jest.fn(),
//             create: jest.fn(),
//             test: jest.fn().mockImplementation(() => {
//               return 'test'
//             }),
//           },
//         },
//         {
//           provide: getModelToken(VehicleModel),
//           useClass: jest.fn(() => ({})),
//         },
//       ],
//     }).compile()
//     vehicleService = moduleRef.get<VehicleService>(VehicleService)
//     vehicleModel = moduleRef.get<VehicleModel>(getModelToken(VehicleModel))
//   })

//   describe('run test', () => {
//     it('run test', () => {
//       const testRes = vehicleService.test()
//       expect(testRes).toBe('test')
//     })
//   })
// })
/////
describe('PublicFlightController', () => {
  let vehicleService: VehicleService
  let vehicleModel: VehicleModel

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: getModelToken(VehicleModel),
          useClass: jest.fn(() => ({})),
        },
      ],
    }).compile()
    vehicleService = moduleRef.get<VehicleService>(VehicleService)
    vehicleModel = moduleRef.get<VehicleModel>(getModelToken(VehicleModel))
  })

  describe('run test', () => {
    it('run test', () => {
      const testRes = vehicleService.test()
      expect(testRes).toBe('test')
    })
  })
})
