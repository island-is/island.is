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
  let logged: jest.SpyInstance

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

    logged = jest.spyOn(logger, 'error').mockImplementation()
  })

  // logger is module-level and shared, unlike the per-test fund mock.
  afterEach(() => {
    jest.restoreAllMocks()
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
    expect(logged.mock.calls[0][0]).toContain(
      'a vehicle with no registration number',
    )
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
  // A failure used to be logged twice: once by the step that knew which vehicle
  // it was, and again by the catch in sendApplication. Two entries for one
  // fault makes a log harder to read and doubles whatever they contain.
  it('logs a failed vehicle exactly once', async () => {
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

    expect(logged).toHaveBeenCalledTimes(1)
    // toContain('H32') would also pass for the full plate, which is the one
    // thing the shortening exists to prevent.
    expect(logged.mock.calls[0][0]).toBe('car-recycling: Failed on vehicle H32')
  })

  it('logs a failure to record the owner exactly once', async () => {
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

    expect(logged).toHaveBeenCalledTimes(1)
    expect(logged.mock.calls[0][0]).toContain('recording the owner')
  })

  // A FetchError from the fund carries the whole Response: the url, the headers
  // and the parsed body, and the body repeats the registration number this
  // service is careful to shorten. Only the named fields may be logged, so a
  // later spread cannot quietly put the response back in.
  it('logs no part of the fund response', async () => {
    const fetchError = Object.assign(
      new Error('Request failed with status code 400'),
      {
        name: 'FetchError',
        status: 400,
        statusText: 'Bad Request',
        url: 'https://securityserver/r1/IS/GOV/xroad/vehicle',
        body: { permno: 'AH-H32', nationalId: '0101302399' },
        problem: { detail: 'Citizen has not accepted to recycle the vehicle.' },
        response: { url: 'https://securityserver/xroad/vehicle' },
      },
    )
    jest
      .spyOn(recyclingFundService, 'recycleVehicle')
      .mockRejectedValue(fetchError)

    await expect(
      carRecyclingService.sendApplication({
        application: applicationWith(['AH-H32']),
        auth: createCurrentUser(),
        currentUserLocale: 'is',
      }),
    ).rejects.toThrow('Error occurred when recycling vehicle(s)')

    // winston's typings narrow spyOn to the single-argument overload.
    const [, payload] = logged.mock.calls.find((call) =>
      String(call[0]).includes('Failed on'),
    ) as unknown as [string, { error: Record<string, unknown> }]
    expect(Object.keys(payload.error).sort()).toEqual([
      'message',
      'name',
      'stack',
      'status',
      'statusText',
    ])
    expect(JSON.stringify(payload)).not.toContain('0101302399')
  })
})
