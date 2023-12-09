import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'
import { VehicleService } from '../vehicle.service'
import { VehicleModel } from '..'
import { Sequelize } from 'sequelize-typescript'
import { VehicleOwnerModel } from '../../vehicleOwner'
import { RecyclingRequestModel } from '../../recyclingRequest'
import { RecyclingPartnerModel } from '../../recyclingPartner'
import { setup } from '../../../../../test/setup'
import { INestApplication } from '@nestjs/common'

let app: INestApplication
let vehicleService: VehicleService

//sjá->apps/air-discount-scheme/backend/src/app/modules/flight/test/integration/flight.service.spec.ts
beforeAll(async () => {
  app = await setup()
  vehicleService = app.get<VehicleService>(VehicleService)
})

describe('PublicVehicleServiceTest', () => {
  let vehicleModel: VehicleModel

  describe('run test', () => {
    it('run test test', () => {
      const testRes = vehicleService.test()
      expect(testRes).toBe('test')
    })
    it('run test findByVehicleId', async () => {
      const testRes = await vehicleService.findByVehicleId('fox33')
      console.log(testRes)
      // expect(true).toBe(true)
      expect(testRes).toBe(null)
    })
  })
})

// const sequelizeInstance = new Sequelize(config);
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

// const sequelize = new Sequelize({
//   database: 'dev_db',
//   username: 'dev_db',
//   password: 'dev_db',
//   host: '127.0.0.1',
//   port: 5432,
//   dialect: 'postgres',
// })

// sequelize.addModels([
//   VehicleModel,
//   VehicleOwnerModel,
//   RecyclingRequestModel,
//   RecyclingPartnerModel,
// ])
