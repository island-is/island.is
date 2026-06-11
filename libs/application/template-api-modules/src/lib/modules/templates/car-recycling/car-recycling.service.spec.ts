import { createApplication } from '@island.is/application/testing'
import { CarRecyclingClientService } from '@island.is/clients/car-recycling'
import { Test, TestingModule } from '@nestjs/testing'
import { CarRecyclingService } from './car-recycling.service'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import { RecyclingFundClientService } from '@island.is/clients/recycling-fund'
import { FeatureFlagService } from '@island.is/nest/feature-flags'

describe('CarRecyclingService', () => {
  let carRecyclingService: CarRecyclingService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarRecyclingService,
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        {
          provide: CarRecyclingClientService,
          useValue: {
            sendApplication: jest.fn().mockResolvedValue({
              applicationLineId: '123A',
            }),
          },
        },
        {
          provide: VehicleSearchApi,
          useValue: {
            // Mock methods as needed for your tests
          },
        },
        {
          provide: RecyclingFundClientService,
          useValue: {
            createOwner: jest.fn(),
            createVehicle: jest.fn(),
            recycleVehicle: jest.fn(),
          },
        },
        {
          provide: FeatureFlagService,
          useValue: {
            getValue: jest.fn().mockResolvedValue(false),
          },
        },
      ],
    }).compile()

    carRecyclingService = module.get<CarRecyclingService>(CarRecyclingService)
  })

  it('should send car recycling application', async () => {
    const auth = createCurrentUser()
    const application = createApplication({
      answers: {
        'vehicles.selectedVehicles': [
          {
            permno: 'AH-H32',
          },
        ],
        'vehicles.canceledVehicles': [],
      },
    })

    jest.spyOn(carRecyclingService, 'createOwner').mockImplementation(jest.fn())
    jest
      .spyOn(carRecyclingService, 'createVehicle')
      .mockImplementation(jest.fn())
    jest
      .spyOn(carRecyclingService, 'recycleVehicle')
      .mockImplementation(jest.fn())

    const result = await carRecyclingService.sendApplication({
      application,
      auth,
      currentUserLocale: 'is',
    })

    expect(result).toBeTruthy()
  })
})
