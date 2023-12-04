/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { UtilTest } from './util.test'
import { VehicleModel } from '../vehicle.model'
// import { VehicleModel } from '../vehicle.model'
// import { VehicleService } from '../vehicle.service'

describe('TestJest', () => {
  let service: UtilTest

  // let fakeVehicleService: Partial<VehicleService>

  beforeEach(async () => {
    // fakeVehicleService = {
    //   // findByVehicleId: () => Promise.resolve(VehicleModel),
    //   // findByVehicleId: (vehicleId: string) => {
    //   //   return Promise.resolve({})
    //   // },
    // }

    const module: TestingModule = await Test.createTestingModule({
      // controllers: [UtilTest],
      providers: [UtilTest],
    }).compile()
    service = module.get<UtilTest>(UtilTest)
  })
  it('can create an instance of service', async () => {
    expect(service).toBeDefined()
  })

  it('check add function', async () => {
    // service.findByVehicleId = () => Promise.resolve({} as VehicleModel)
    const res = service.add(2, 2)
    expect(res).toEqual(4)
  })

  it('test check', async () => {
    const vehicle = new VehicleModel()
    vehicle.vehicleId = 'fax344'
    vehicle.vehicleColor = 'white'
    // service.findByVehicleId = () => Promise.resolve({} as VehicleModel)
    // const res = service.create(vehicle)
    const res = service.create()
    expect(res).toBeDefined()
  })
})
