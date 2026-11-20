import { ApplicationWithAttachments } from '@island.is/application/types'
import { MileageOriginCode } from '@island.is/application/templates/temporary-vehicle-export'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import { MileageReadingApi } from '@island.is/clients/vehicles-mileage'
import { FetchError } from '@island.is/clients/middlewares'
import { RskKilometragjaldReimbursementClient } from '@island.is/clients/rsk/kilometragjald-reimbursement'
import { TemplateApiError } from '@island.is/nest/problem'
import { Logger } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../types'
import { AttachmentS3Service } from '../../shared/services'
import { TemporaryVehicleExportService } from './temporary-vehicle-export.service'

const PERMNO = 'AB123'

const vehicle = { permno: PERMNO, make: 'Toyota', latestMileage: 10000 }

const createService = () => {
  const vehiclesApi = {
    currentvehicleswithmileageandinspGet: jest
      .fn()
      .mockResolvedValue({ data: [vehicle], totalPages: 1 }),
  }
  const mileageApi = {
    rootPostRaw: jest.fn().mockResolvedValue({
      raw: { status: 201 },
      value: () => Promise.resolve({ readDate: new Date('2026-06-01') }),
    }),
    getMileageReading: jest
      .fn()
      .mockResolvedValue([{ internalId: 7, readDate: new Date('2026-06-01') }]),
    rootPut: jest.fn().mockResolvedValue([]),
  }
  const attachmentService = {
    getFiles: jest
      .fn()
      .mockResolvedValue([{ fileName: 'booking.pdf', fileContent: 'YQ==' }]),
  }
  const skatturinn = {
    submitApplication: jest.fn().mockResolvedValue({ id: 42, status: 'Open' }),
  }
  const logger = { error: jest.fn(), warn: jest.fn() }

  const service = new TemporaryVehicleExportService(
    {
      withMiddleware: () => vehiclesApi,
    } as unknown as VehicleSearchApi,
    { withMiddleware: () => mileageApi } as unknown as MileageReadingApi,
    attachmentService as unknown as AttachmentS3Service,
    skatturinn as unknown as RskKilometragjaldReimbursementClient,
    logger as unknown as Logger,
  )

  return { service, vehiclesApi, mileageApi, skatturinn }
}

const props = (answers: object) =>
  ({
    application: {
      id: 'application-id',
      applicant: '0000000000',
      answers,
      externalData: {},
      attachments: {},
    } as unknown as ApplicationWithAttachments,
    auth: { nationalId: '0000000000', authorization: 'Bearer token' },
  } as unknown as TemplateApiModuleActionProps)

const answers = {
  vehicle: { permno: PERMNO },
  departure: { date: '2026-06-01', mileage: '12000' },
  arrival: { date: '2026-06-20', mileage: '14500' },
  proofOfTravel: [{ key: 'file-key', name: 'booking.pdf' }],
}

describe('TemporaryVehicleExportService', () => {
  it('throws when the user has no eligible vehicles', async () => {
    const { service, vehiclesApi } = createService()
    vehiclesApi.currentvehicleswithmileageandinspGet.mockResolvedValue({
      data: [],
      totalPages: 1,
    })

    await expect(service.getEligibleVehicles(props({}))).rejects.toThrow(
      TemplateApiError,
    )
  })

  it('fetches every page of eligible vehicles', async () => {
    const { service, vehiclesApi } = createService()
    vehiclesApi.currentvehicleswithmileageandinspGet
      .mockResolvedValueOnce({ data: [vehicle], totalPages: 2 })
      .mockResolvedValueOnce({
        data: [{ permno: 'CD456' }, { permno: null }],
        totalPages: 2,
      })

    const result = await service.getEligibleVehicles(props({}))

    expect(result.vehicles.map((v) => v.permno)).toEqual([PERMNO, 'CD456'])
  })

  it('registers the departure mileage with the departure origin code', async () => {
    const { service, mileageApi } = createService()

    const result = await service.registerDepartureMileage(props(answers))

    expect(mileageApi.rootPostRaw).toHaveBeenCalledWith({
      postMileageReadingModel: {
        permno: PERMNO,
        mileage: 12000,
        originCode: MileageOriginCode.DEPARTURE,
      },
    })
    expect(mileageApi.rootPut).not.toHaveBeenCalled()
    expect(result.originCode).toBe(MileageOriginCode.DEPARTURE)
  })

  it('uses the latest reading at Samgöngustofa without registering a new one', async () => {
    const { service, mileageApi } = createService()

    const result = await service.registerDepartureMileage(
      props({
        ...answers,
        departure: {
          date: '2026-06-01',
          useLatestMileage: 'yes',
          latestMileage: '10000',
        },
      }),
    )

    expect(mileageApi.rootPostRaw).not.toHaveBeenCalled()
    expect(result).toMatchObject({ permno: PERMNO, mileage: 10000 })
    expect(result.originCode).toBeUndefined()
  })

  it('rejects the latest reading when a newer one has been registered', async () => {
    const { service, mileageApi } = createService()

    await expect(
      service.registerDepartureMileage(
        props({
          ...answers,
          departure: {
            date: '2026-06-01',
            useLatestMileage: 'yes',
            latestMileage: '9000',
          },
        }),
      ),
    ).rejects.toThrow(TemplateApiError)
    expect(mileageApi.rootPostRaw).not.toHaveBeenCalled()
  })

  it('rejects the latest reading when its date has changed', async () => {
    const { service, vehiclesApi } = createService()
    vehiclesApi.currentvehicleswithmileageandinspGet.mockResolvedValue({
      data: [{ ...vehicle, latestMileageReadDate: new Date('2026-06-02') }],
      totalPages: 1,
    })

    await expect(
      service.registerDepartureMileage(
        props({
          ...answers,
          departure: {
            useLatestMileage: 'yes',
            latestMileage: '10000',
            latestMileageReadDate: '2026-05-01T00:00:00.000Z',
          },
        }),
      ),
    ).rejects.toThrow(TemplateApiError)
  })

  it('updates the reading when one was already registered today', async () => {
    const { service, mileageApi } = createService()
    mileageApi.rootPostRaw.mockResolvedValue({ raw: { status: 200 } })

    await service.submitArrival(props(answers))

    expect(mileageApi.rootPut).toHaveBeenCalledWith({
      putMileageReadingModel: {
        permno: PERMNO,
        internalId: 7,
        mileage: 14500,
        originCode: MileageOriginCode.ARRIVAL,
      },
    })
  })

  it('rejects mileage lower than the latest reading at Samgöngustofa', async () => {
    const { service, mileageApi } = createService()

    await expect(
      service.registerDepartureMileage(
        props({
          ...answers,
          departure: { date: '2026-06-01', mileage: '9000' },
        }),
      ),
    ).rejects.toThrow(TemplateApiError)
    expect(mileageApi.rootPostRaw).not.toHaveBeenCalled()
  })

  it('rejects a vehicle the user cannot register mileage for', async () => {
    const { service, vehiclesApi, mileageApi } = createService()
    vehiclesApi.currentvehicleswithmileageandinspGet.mockResolvedValue({
      data: [],
    })

    await expect(
      service.registerDepartureMileage(props(answers)),
    ).rejects.toThrow(TemplateApiError)
    expect(mileageApi.rootPostRaw).not.toHaveBeenCalled()
  })

  it('registers the arrival mileage and sends the trip and documents to Skatturinn', async () => {
    const { service, mileageApi, skatturinn } = createService()

    const result = await service.submitArrival(props(answers))

    expect(mileageApi.rootPostRaw).toHaveBeenCalledWith({
      postMileageReadingModel: {
        permno: PERMNO,
        mileage: 14500,
        originCode: MileageOriginCode.ARRIVAL,
      },
    })

    expect(skatturinn.submitApplication).toHaveBeenCalledWith(
      expect.objectContaining({ authorization: 'Bearer token' }),
      {
        fastnr: PERMNO,
        departureDate: '2026-06-01',
        departureMileage: 12000,
        useExistingMileageRegistration: false,
        arrivalDate: '2026-06-20',
        arrivalMileage: 14500,
        files: [{ fileName: 'booking.pdf', content: Buffer.from('a') }],
      },
    )
    expect(result.mileage.originCode).toBe(MileageOriginCode.ARRIVAL)
    expect(result.skatturinn).toEqual({ id: 42, status: 'Open' })
  })

  it('does not register the arrival again when a retry finds it registered', async () => {
    const { service, mileageApi, skatturinn } = createService()
    mileageApi.getMileageReading.mockResolvedValue([
      {
        internalId: 8,
        originCode: MileageOriginCode.ARRIVAL,
        mileage: 14500,
        readDate: new Date('2026-06-20'),
      },
    ])

    const result = await service.submitArrival(props(answers))

    expect(mileageApi.rootPostRaw).not.toHaveBeenCalled()
    expect(mileageApi.rootPut).not.toHaveBeenCalled()
    expect(skatturinn.submitApplication).toHaveBeenCalled()
    expect(result.mileage).toMatchObject({
      mileage: 14500,
      originCode: MileageOriginCode.ARRIVAL,
    })
  })

  it('registers the arrival when no km were driven, even if a KOMA reading has the same mileage', async () => {
    const { service, mileageApi } = createService()
    // E.g. the departure reused an earlier trip's arrival reading
    mileageApi.getMileageReading.mockResolvedValue([
      {
        internalId: 8,
        originCode: MileageOriginCode.ARRIVAL,
        mileage: 12000,
        readDate: new Date('2026-06-01'),
      },
    ])

    await service.submitArrival(
      props({ ...answers, arrival: { ...answers.arrival, mileage: '12000' } }),
    )

    expect(mileageApi.rootPostRaw).toHaveBeenCalledWith({
      postMileageReadingModel: {
        permno: PERMNO,
        mileage: 12000,
        originCode: MileageOriginCode.ARRIVAL,
      },
    })
  })

  it('rejects an arrival before the stored departure date without registering it', async () => {
    const { service, mileageApi, skatturinn } = createService()

    await expect(
      service.submitArrival(
        props({
          ...answers,
          arrival: {
            ...answers.arrival,
            date: '2026-05-20',
            // A tampered copy of the departure date must not be trusted
            departureDate: '2026-05-01',
          },
        }),
      ),
    ).rejects.toThrow(TemplateApiError)
    expect(mileageApi.rootPostRaw).not.toHaveBeenCalled()
    expect(skatturinn.submitApplication).not.toHaveBeenCalled()
  })

  it('does not send the trip to Skatturinn when the arrival mileage is rejected', async () => {
    const { service, mileageApi, skatturinn } = createService()
    mileageApi.rootPostRaw.mockRejectedValue(new Error('400'))

    await expect(service.submitArrival(props(answers))).rejects.toThrow(
      TemplateApiError,
    )
    expect(skatturinn.submitApplication).not.toHaveBeenCalled()
  })

  it("shows Samgöngustofa's reason when a reading is rejected", async () => {
    const { service, mileageApi } = createService()
    const error = Object.create(FetchError.prototype) as FetchError
    Object.assign(error, {
      status: 400,
      body: {
        Errors: [
          { warnSever: 'W', errorMess: 'Km staða fer yfir hámark per dag' },
        ],
      },
    })
    mileageApi.rootPostRaw.mockRejectedValue(error)

    await expect(service.submitArrival(props(answers))).rejects.toMatchObject({
      problem: {
        status: 400,
        errorReason: { summary: 'Km staða fer yfir hámark per dag' },
      },
    })
  })

  it('fails the submission when Skatturinn rejects it', async () => {
    const { service, skatturinn } = createService()
    skatturinn.submitApplication.mockRejectedValue(new Error('400'))

    await expect(service.submitArrival(props(answers))).rejects.toThrow(
      TemplateApiError,
    )
  })
})
