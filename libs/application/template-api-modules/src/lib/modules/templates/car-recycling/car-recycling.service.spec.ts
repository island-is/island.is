import { createApplication } from '@island.is/application/testing'
import { Test, TestingModule } from '@nestjs/testing'
import { CarRecyclingService } from './car-recycling.service'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import {
  RecyclingFundClientService,
  CreateXRoadRecyclingRequestDtoRequestTypeEnum,
} from '@island.is/clients/recycling-fund'

describe('CarRecyclingService', () => {
  let carRecyclingService: CarRecyclingService
  let recyclingFundService: RecyclingFundClientService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarRecyclingService,
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        {
          provide: VehicleSearchApi,
          useValue: {},
        },
        {
          provide: RecyclingFundClientService,
          useValue: {
            createOwner: jest.fn(),
            createVehicle: jest.fn(),
            recycleVehicle: jest.fn(),
          },
        },
      ],
    }).compile()

    carRecyclingService = module.get<CarRecyclingService>(CarRecyclingService)
    recyclingFundService = module.get<RecyclingFundClientService>(
      RecyclingFundClientService,
    )
  })

  const applicationWith = (selected: string[], canceled: string[] = []) =>
    createApplication({
      answers: {
        'vehicles.selectedVehicles': selected.map((permno) => ({ permno })),
        'vehicles.canceledVehicles': canceled.map((permno) => ({ permno })),
      },
      // The applicant's name is read from the identity provider and sent on as
      // the requestor, so the recycling fund records who asked.
      externalData: {
        identity: {
          data: { name: 'Gervimaður Test', nationalId: '0101302399' },
          date: new Date(),
          status: 'success',
        },
      },
    })

  it('should send car recycling application', async () => {
    const result = await carRecyclingService.sendApplication({
      application: applicationWith(['AH-H32']),
      auth: createCurrentUser(),
      currentUserLocale: 'is',
    })

    expect(result).toBeTruthy()
  })

  it('records the owner, the vehicle and the recycling request', async () => {
    await carRecyclingService.sendApplication({
      application: applicationWith(['AH-H32']),
      auth: createCurrentUser(),
      currentUserLocale: 'is',
    })

    expect(recyclingFundService.createOwner).toHaveBeenCalledTimes(1)
    expect(recyclingFundService.createVehicle).toHaveBeenCalledTimes(1)
    expect(recyclingFundService.recycleVehicle).toHaveBeenCalledTimes(1)
  })

  it('records a withdrawn vehicle as cancelled and a chosen one as pending', async () => {
    await carRecyclingService.sendApplication({
      application: applicationWith(['AH-H32'], ['BX-N01']),
      auth: createCurrentUser(),
      currentUserLocale: 'is',
    })

    expect(recyclingFundService.recycleVehicle).toHaveBeenCalledWith(
      expect.anything(),
      'Gervimaður Test',
      'BX-N01',
      CreateXRoadRecyclingRequestDtoRequestTypeEnum.Cancelled,
    )
    expect(recyclingFundService.recycleVehicle).toHaveBeenCalledWith(
      expect.anything(),
      'Gervimaður Test',
      'AH-H32',
      CreateXRoadRecyclingRequestDtoRequestTypeEnum.PendingRecycle,
    )
    // A withdrawn vehicle is not re-sent as a vehicle record.
    expect(recyclingFundService.createVehicle).toHaveBeenCalledTimes(1)
  })

  it('records every chosen vehicle', async () => {
    await carRecyclingService.sendApplication({
      application: applicationWith(['AH-H32', 'BX-N01', 'CY-P22']),
      auth: createCurrentUser(),
      currentUserLocale: 'is',
    })

    expect(recyclingFundService.createVehicle).toHaveBeenCalledTimes(3)
    expect(recyclingFundService.recycleVehicle).toHaveBeenCalledTimes(3)
  })

  // The schema allows a vehicle without a registration number. Recording the
  // rest of the application and dropping that one would report a recycling that
  // never happened.
  it('refuses a selected vehicle with no registration number', async () => {
    const application = createApplication({
      answers: {
        'vehicles.selectedVehicles': [{ permno: '' }],
        'vehicles.canceledVehicles': [],
      },
      externalData: {
        identity: {
          data: { name: 'Gervimaður Test', nationalId: '0101302399' },
          date: new Date(),
          status: 'success',
        },
      },
    })

    await expect(
      carRecyclingService.sendApplication({
        application,
        auth: createCurrentUser(),
        currentUserLocale: 'is',
      }),
    ).rejects.toThrow('Error occurred when recycling vehicle(s)')

    expect(recyclingFundService.recycleVehicle).not.toHaveBeenCalled()
  })

  // Without the old backend there is no response to inspect, so a refused
  // request reaches us only as a thrown error. Swallowing it would mark the
  // application submitted when nothing was recorded.
  it('fails the application when the recycling fund refuses the request', async () => {
    jest
      .spyOn(recyclingFundService, 'recycleVehicle')
      .mockRejectedValue(new Error('400 Bad Request'))

    await expect(
      carRecyclingService.sendApplication({
        application: applicationWith(['AH-H32']),
        auth: createCurrentUser(),
        currentUserLocale: 'is',
      }),
    ).rejects.toThrow('Error occurred when recycling vehicle(s)')
  })

  it('fails the application when the owner cannot be recorded', async () => {
    jest
      .spyOn(recyclingFundService, 'createOwner')
      .mockRejectedValue(new Error('500 Internal Server Error'))

    await expect(
      carRecyclingService.sendApplication({
        application: applicationWith(['AH-H32']),
        auth: createCurrentUser(),
        currentUserLocale: 'is',
      }),
    ).rejects.toThrow('Error occurred when recycling vehicle(s)')

    expect(recyclingFundService.createVehicle).not.toHaveBeenCalled()
  })
})
