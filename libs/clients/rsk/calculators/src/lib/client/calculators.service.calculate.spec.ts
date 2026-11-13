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
      ar: z.number().int(),
      gjaldskipting: z.string().datetime().optional(),
    },
    result: { bifreidagjoldAlls: z.number().int().optional() },
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
    const gjaldskipting = new Date('2026-07-01T00:00:00.000Z')
    mockGetVehicleTax.mockResolvedValue({ data: { bifreidagjoldAlls: 1000 } })

    await expect(
      service.calculate('vehicleTax', { ar: 2026, gjaldskipting }),
    ).resolves.toEqual({ output: { bifreidagjoldAlls: 1000 } })
    expect(mockGetVehicleTax).toHaveBeenCalledWith({
      query: { ar: 2026, gjaldskipting },
    })
  })

  it('returns rejected fields without calling the endpoint', async () => {
    const result = await service.calculate('vehicleTax', {
      ar: 'x',
      gjaldskipting: '2026',
    })
    expect(result.rejected).toHaveLength(2)
    expect(result.rejected).toEqual(
      expect.arrayContaining(['ar', 'gjaldskipting']),
    )
    expect(mockGetVehicleTax).not.toHaveBeenCalled()
  })

  it('rejects an unknown field without calling the endpoint', async () => {
    await expect(
      service.calculate('vehicleTax', { ar: 2026, foo: 1 }),
    ).resolves.toEqual({ rejected: ['foo'] })
    expect(mockGetVehicleTax).not.toHaveBeenCalled()
  })

  it('returns an undefined output when the endpoint returns no data', async () => {
    mockGetVehicleTax.mockResolvedValue({ data: undefined })

    await expect(
      service.calculate('vehicleTax', { ar: 2026 }),
    ).resolves.toEqual({ output: undefined })
  })

  it('rejects when the request fails', async () => {
    mockGetVehicleTax.mockRejectedValue(new Error('timeout'))

    await expect(service.calculate('vehicleTax', { ar: 2026 })).rejects.toThrow(
      'timeout',
    )
  })
})
