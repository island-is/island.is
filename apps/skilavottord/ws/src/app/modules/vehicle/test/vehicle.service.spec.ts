import { VehicleService } from '../vehicle.service'
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
