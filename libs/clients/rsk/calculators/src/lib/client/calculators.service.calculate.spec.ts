import { CalculatorsClientService } from './calculators.service'

const mockGetVehicleTax = jest.fn()

jest.mock('../../../gen/fetch', () => ({
  getChildBenefit: jest.fn(),
  getInterestBenefit: jest.fn(),
  getVehicleBenefit: jest.fn(),
  getVehicleDepreciation: jest.fn(),
  getVehicleTax: (...args: unknown[]) => mockGetVehicleTax(...args),
  getWithholdingTax: jest.fn(),
}))

jest.mock('./calculators.registry', () => {
  const { z } = jest.requireActual<typeof import('zod')>('zod')
  const shape = {
    query: {
      count: z.number().int(),
      splitDate: z.string().datetime().optional(),
      ratio: z.number().gte(0).lte(1).optional(),
    },
    result: { total: z.number().int().optional() },
  }
  return {
    calculatorRegistry: {
      childBenefit: shape,
      interestBenefit: shape,
      vehicleBenefit: shape,
      vehicleDepreciation: shape,
      vehicleTax: shape,
      withholdingTax: shape,
    },
  }
})

describe('CalculatorsClientService.calculate', () => {
  const service = new CalculatorsClientService()

  beforeEach(() => mockGetVehicleTax.mockReset())

  it('calls the endpoint with the input and returns its output', async () => {
    const splitDate = new Date('2026-07-01T00:00:00.000Z')
    mockGetVehicleTax.mockResolvedValue({ data: { total: 1000 } })

    await expect(
      service.calculate('vehicleTax', { count: 2026, splitDate }),
    ).resolves.toEqual({ output: { total: 1000 } })
    expect(mockGetVehicleTax).toHaveBeenCalledWith({
      query: { count: 2026, splitDate },
    })
  })

  it('returns rejected fields without calling the endpoint', async () => {
    const result = await service.calculate('vehicleTax', {
      count: 'x',
      splitDate: '2026',
    })
    expect(result.rejected).toHaveLength(2)
    expect(result.rejected).toEqual(
      expect.arrayContaining(['count', 'splitDate']),
    )
    expect(mockGetVehicleTax).not.toHaveBeenCalled()
  })

  it('sends a whole percentage as an RSK ratio', async () => {
    mockGetVehicleTax.mockResolvedValue({ data: { total: 1000 } })

    await service.calculate('vehicleTax', { count: 2026, ratio: 50 })

    expect(mockGetVehicleTax).toHaveBeenCalledWith({
      query: { count: 2026, ratio: 0.5 },
    })
  })

  it('rejects a percentage over 100 without calling the endpoint', async () => {
    await expect(
      service.calculate('vehicleTax', { count: 2026, ratio: 150 }),
    ).resolves.toEqual({ rejected: ['ratio'] })
    expect(mockGetVehicleTax).not.toHaveBeenCalled()
  })

  it('rejects an unknown field without calling the endpoint', async () => {
    await expect(
      service.calculate('vehicleTax', { count: 2026, foo: 1 }),
    ).resolves.toEqual({ rejected: ['foo'] })
    expect(mockGetVehicleTax).not.toHaveBeenCalled()
  })

  it('returns an undefined output when the endpoint returns no data', async () => {
    mockGetVehicleTax.mockResolvedValue({ data: undefined })

    await expect(
      service.calculate('vehicleTax', { count: 2026 }),
    ).resolves.toEqual({ output: undefined })
  })

  it('rejects when the request fails', async () => {
    mockGetVehicleTax.mockRejectedValue(new Error('timeout'))

    await expect(
      service.calculate('vehicleTax', { count: 2026 }),
    ).rejects.toThrow('timeout')
  })
})
