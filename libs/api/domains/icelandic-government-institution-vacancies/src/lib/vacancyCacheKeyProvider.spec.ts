import { Test } from '@nestjs/testing'
import { FEATURE_FLAG_CLIENT } from '@island.is/nest/feature-flags'
import { Features } from '@island.is/feature-flags'
import { VacancyCacheKeyProvider } from './vacancyCacheKeyProvider'

describe('VacancyCacheKeyProvider', () => {
  let provider: VacancyCacheKeyProvider
  const featureFlagClient = {
    getValue: jest.fn(),
    dispose: jest.fn(),
  }

  const makeRequestContext = (forwardedFor?: string) => ({
    request: {
      http: {
        headers: {
          get: (name: string) =>
            name === 'x-forwarded-for' ? (forwardedFor ?? null) : null,
        },
      },
    },
  })

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        VacancyCacheKeyProvider,
        { provide: FEATURE_FLAG_CLIENT, useValue: featureFlagClient },
      ],
    }).compile()

    provider = moduleRef.get(VacancyCacheKeyProvider)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('extracts first IP from x-forwarded-for and passes it to getValue', async () => {
    featureFlagClient.getValue.mockResolvedValue(false)

    await provider.getCacheKeyData(makeRequestContext('192.168.1.100'))

    expect(featureFlagClient.getValue).toHaveBeenCalledWith(
      Features.useNewVacancyApi,
      false,
      { id: '192.168.1.100', attributes: { ipAddress: '192.168.1.100' } },
    )
  })

  it('uses first IP when x-forwarded-for has multiple values', async () => {
    featureFlagClient.getValue.mockResolvedValue(false)

    await provider.getCacheKeyData(makeRequestContext('10.0.0.50, 10.0.0.10'))

    expect(featureFlagClient.getValue).toHaveBeenCalledWith(
      Features.useNewVacancyApi,
      false,
      { id: '10.0.0.50', attributes: { ipAddress: '10.0.0.50' } },
    )
  })

  it('passes empty string IP when x-forwarded-for header is missing', async () => {
    featureFlagClient.getValue.mockResolvedValue(false)

    await provider.getCacheKeyData(makeRequestContext())

    expect(featureFlagClient.getValue).toHaveBeenCalledWith(
      Features.useNewVacancyApi,
      false,
      { id: '', attributes: { ipAddress: '' } },
    )
  })

  it('passes empty string IP when request.http is absent', async () => {
    featureFlagClient.getValue.mockResolvedValue(false)

    await provider.getCacheKeyData({ request: {} })

    expect(featureFlagClient.getValue).toHaveBeenCalledWith(
      Features.useNewVacancyApi,
      false,
      { id: '', attributes: { ipAddress: '' } },
    )
  })

  it('skips leading whitespace-only entries in x-forwarded-for', async () => {
    featureFlagClient.getValue.mockResolvedValue(false)

    await provider.getCacheKeyData(makeRequestContext(' , , 10.0.0.1'))

    expect(featureFlagClient.getValue).toHaveBeenCalledWith(
      Features.useNewVacancyApi,
      false,
      { id: '10.0.0.1', attributes: { ipAddress: '10.0.0.1' } },
    )
  })

  it('passes empty string IP when x-forwarded-for is empty string', async () => {
    featureFlagClient.getValue.mockResolvedValue(false)

    await provider.getCacheKeyData(makeRequestContext(''))

    expect(featureFlagClient.getValue).toHaveBeenCalledWith(
      Features.useNewVacancyApi,
      false,
      { id: '', attributes: { ipAddress: '' } },
    )
  })

  it('same IPs with different flag results produce different cache keys', async () => {
    featureFlagClient.getValue.mockResolvedValue(false)
    const resultA = await provider.getCacheKeyData(
      makeRequestContext('10.0.0.1'),
    )

    featureFlagClient.getValue.mockResolvedValue(true)
    const resultB = await provider.getCacheKeyData(
      makeRequestContext('10.0.0.1'),
    )

    expect(resultA).toBe('false')
    expect(resultB).toBe('true')
    expect(resultA).not.toBe(resultB)
  })

  it('different IPs with same flag result produce the same cache key', async () => {
    featureFlagClient.getValue.mockResolvedValue(true)
    const resultA = await provider.getCacheKeyData(
      makeRequestContext('10.0.0.1'),
    )

    featureFlagClient.getValue.mockResolvedValue(true)
    const resultB = await provider.getCacheKeyData(
      makeRequestContext('10.0.0.99'),
    )

    expect(resultA).toBe('true')
    expect(resultB).toBe('true')
    expect(resultA).toBe(resultB)
  })

  it('has correct operationNames', () => {
    expect(provider.operationNames).toEqual([
      'GetIcelandicGovernmentInstitutionVacancies',
      'GetIcelandicGovernmentInstitutionVacancyDetails',
    ])
  })

  it('has queryPatterns that match vacancy GraphQL field names', () => {
    const list = '{ icelandicGovernmentInstitutionVacancies(input: {}) { vacancies { id } } }'
    const detail = '{ icelandicGovernmentInstitutionVacancyById(input: { id: "1" }) { vacancy { id } } }'
    const unrelated = '{ someOtherQuery { id } }'

    expect(provider.queryPatterns!.some((r) => r.test(list))).toBe(true)
    expect(provider.queryPatterns!.some((r) => r.test(detail))).toBe(true)
    expect(provider.queryPatterns!.some((r) => r.test(unrelated))).toBe(false)
  })
})
