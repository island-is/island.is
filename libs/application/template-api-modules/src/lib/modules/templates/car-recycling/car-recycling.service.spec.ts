import { createApplication } from '@island.is/application/testing'
import { RecyclingFundClientService } from '@island.is/clients/recycling-fund'
import { Test, TestingModule } from '@nestjs/testing'
import { CarRecyclingService } from './car-recycling.service'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'

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
          provide: RecyclingFundClientService,
          useClass: jest.fn(() => ({
            sendApplication: () =>
              Promise.resolve({
                applicationLineId: '123A',
              }),
          })),
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

    // Also need to mock the Create vehicles here
    jest
      .spyOn(carRecyclingService, 'createVehicle')
      .mockImplementation(jest.fn())

    // Also need to mock the recycling vehicles
    jest
      .spyOn(carRecyclingService, 'recycleVehicles')
      .mockImplementation(jest.fn())

    const result = await carRecyclingService.sendApplication({
      application,
      auth,
      currentUserLocale: 'is',
    })

    expect(result).toBeUndefined()
  })
})
