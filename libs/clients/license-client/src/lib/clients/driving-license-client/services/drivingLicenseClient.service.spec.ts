import { User } from '@island.is/auth-nest-tools'
import {
  DrivingLicenseApi,
  PenaltyPointsClientService,
} from '@island.is/clients/driving-license'
import { SmartSolutionsApi } from '@island.is/clients/smartsolutions'
import { FeatureFlagService } from '@island.is/nest/feature-flags'

import { DrivingLicenseClient } from './drivingLicenseClient.service'

const createLogger = () => ({
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
})

const createUser = () =>
  ({
    nationalId: '1234567890',
    authorization: 'Bearer test-token',
  } as User)

describe('DrivingLicenseClient.getLicenses', () => {
  let drivingApi: Pick<DrivingLicenseApi, 'getCurrentLicenseV5'>
  let smartApi: SmartSolutionsApi
  let featureFlagService: FeatureFlagService
  let penaltyPointsClient: Pick<
    PenaltyPointsClientService,
    'penaltyPointDetails' | 'deprivations'
  >
  let logger: ReturnType<typeof createLogger>

  const buildClient = () =>
    new DrivingLicenseClient(
      logger as never,
      drivingApi as DrivingLicenseApi,
      smartApi,
      featureFlagService,
      penaltyPointsClient as PenaltyPointsClientService,
    )

  beforeEach(() => {
    logger = createLogger()
    smartApi = {} as SmartSolutionsApi
    featureFlagService = {} as FeatureFlagService
    drivingApi = {
      getCurrentLicenseV5: jest.fn().mockResolvedValue({ name: 'Jon Jonsson' }),
    }
    penaltyPointsClient = {
      penaltyPointDetails: jest.fn().mockResolvedValue([]),
      deprivations: jest.fn().mockResolvedValue([]),
    }
  })

  it('computes total penalty points and active deprivation flag', async () => {
    penaltyPointsClient.penaltyPointDetails = jest
      .fn()
      .mockResolvedValue([{ points: 2 }, { points: 3 }, { points: null }])

    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)

    penaltyPointsClient.deprivations = jest.fn().mockResolvedValue([
      {
        dateFrom: new Date('2020-01-01'),
        dateTo: new Date('2020-06-01'),
      },
      {
        dateFrom: new Date('2023-01-01'),
        dateTo: futureDate,
      },
    ])

    const client = buildClient()
    const result = await client.getLicenses(createUser())

    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.data).toHaveLength(1)
    expect(result.data[0].totalPenaltyPoints).toBe(5)
    expect(result.data[0].hasActiveDeprivation).toBe(true)
  })

  it('returns hasActiveDeprivation: false when there are no deprivations', async () => {
    penaltyPointsClient.deprivations = jest.fn().mockResolvedValue([])

    const client = buildClient()
    const result = await client.getLicenses(createUser())

    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.data[0].hasActiveDeprivation).toBe(false)
  })

  it('treats a past dateTo on the most recent deprivation as inactive', async () => {
    const pastDate = new Date()
    pastDate.setFullYear(pastDate.getFullYear() - 1)

    penaltyPointsClient.deprivations = jest.fn().mockResolvedValue([
      {
        dateFrom: new Date('2023-01-01'),
        dateTo: pastDate,
      },
    ])

    const client = buildClient()
    const result = await client.getLicenses(createUser())

    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.data[0].hasActiveDeprivation).toBe(false)
  })

  it('treats a future dateTo on the most recent deprivation as active', async () => {
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)

    penaltyPointsClient.deprivations = jest.fn().mockResolvedValue([
      {
        dateFrom: new Date('2023-01-01'),
        dateTo: futureDate,
      },
    ])

    const client = buildClient()
    const result = await client.getLicenses(createUser())

    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.data[0].hasActiveDeprivation).toBe(true)
  })

  it('degrades only the penalty points field when penaltyPointDetails throws, keeping the successful deprivations field', async () => {
    penaltyPointsClient.penaltyPointDetails = jest
      .fn()
      .mockRejectedValue(new Error('boom'))
    penaltyPointsClient.deprivations = jest.fn().mockResolvedValue([])

    const client = buildClient()
    const result = await client.getLicenses(createUser())

    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.data).toHaveLength(1)
    expect(result.data[0].totalPenaltyPoints).toBeUndefined()
    expect(result.data[0].hasActiveDeprivation).toBe(false)
    expect(logger.warn).toHaveBeenCalled()
  })

  it('degrades only the deprivations field when deprivations throws, keeping the successful penalty points field', async () => {
    penaltyPointsClient.penaltyPointDetails = jest
      .fn()
      .mockResolvedValue([{ points: 2 }, { points: 3 }])
    penaltyPointsClient.deprivations = jest
      .fn()
      .mockRejectedValue(new Error('boom'))

    const client = buildClient()
    const result = await client.getLicenses(createUser())

    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.data).toHaveLength(1)
    expect(result.data[0].totalPenaltyPoints).toBe(5)
    expect(result.data[0].hasActiveDeprivation).toBeUndefined()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('degrades both fields when both penaltyPointDetails and deprivations throw', async () => {
    penaltyPointsClient.penaltyPointDetails = jest
      .fn()
      .mockRejectedValue(new Error('boom'))
    penaltyPointsClient.deprivations = jest
      .fn()
      .mockRejectedValue(new Error('boom'))

    const client = buildClient()
    const result = await client.getLicenses(createUser())

    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.data).toHaveLength(1)
    expect(result.data[0].totalPenaltyPoints).toBeUndefined()
    expect(result.data[0].hasActiveDeprivation).toBeUndefined()
    expect(logger.warn).toHaveBeenCalledTimes(2)
  })

  it('returns no license data when there is no license, discarding any concurrently fetched penalty/deprivation data', async () => {
    drivingApi.getCurrentLicenseV5 = jest.fn().mockResolvedValue(null)

    const client = buildClient()
    const result = await client.getLicenses(createUser())

    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.data).toHaveLength(0)
  })

  it('kicks off the license fetch and the penalty-points/deprivations fetch concurrently rather than sequentially', async () => {
    let resolveLicense: (value: { name: string }) => void = () => undefined
    drivingApi.getCurrentLicenseV5 = jest.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLicense = resolve
        }),
    )

    const client = buildClient()
    const resultPromise = client.getLicenses(createUser())

    // Flush pending microtasks without ever resolving the license fetch, to
    // verify the penalty-points/deprivations calls don't wait on it.
    await Promise.resolve()
    await Promise.resolve()

    expect(penaltyPointsClient.penaltyPointDetails).toHaveBeenCalled()
    expect(penaltyPointsClient.deprivations).toHaveBeenCalled()

    resolveLicense({ name: 'Jon Jonsson' })
    const result = await resultPromise

    expect(result.ok).toBe(true)
  })
})
