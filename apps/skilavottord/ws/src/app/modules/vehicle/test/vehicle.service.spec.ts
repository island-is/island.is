import { VehicleService } from '../vehicle.service'
import { setup } from '../../../../../test/setup'
import { INestApplication } from '@nestjs/common'
import { VehicleModel } from '../vehicle.model'

let app: INestApplication
let vehicleService: VehicleService

beforeAll(async () => {
  app = await setup()
  vehicleService = app.get<VehicleService>(VehicleService)
})

const vehicleMoc = {
  vehicleId: '123345',
  ownerNationalId: '1111111111',
  vehicleType: 'Kia-soul',
  vehicleColor: 'Blue',
  destroy: jest.fn(),
  save: jest.fn(),
} as unknown as VehicleModel

describe('PublicVehicleServiceTest', () => {
  it('create vehicle, same owner', async () => {
    jest
      .spyOn(vehicleService, 'findByVehicleId')
      .mockImplementation(() => Promise.resolve(vehicleMoc))
    const result = await vehicleService.create(vehicleMoc)
    expect(result).toBe(true)
  })
  it('create vehicle, owner has changed', async () => {
    const vehicleMocNewOwner = {
      ...vehicleMoc,
      ownerNationalId: '2222222222',
    } as unknown as VehicleModel
    jest
      .spyOn(vehicleService, 'findByVehicleId')
      .mockImplementation(() => Promise.resolve(vehicleMoc))
    const result = await vehicleService.create(vehicleMocNewOwner)
    expect(vehicleMoc.destroy).toHaveBeenCalled()
    expect(vehicleMocNewOwner.save).toHaveBeenCalled()
    expect(result).toBe(true)
  })
})
