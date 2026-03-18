import { Test } from '@nestjs/testing'
import { ApolloDriver } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { VacancyApi } from '@island.is/clients/financial-management-authority'
import { DefaultApi } from '@island.is/clients/icelandic-government-institution-vacancies'
import { CmsContentfulService, CmsElasticsearchService } from '@island.is/cms'
import {
  FeatureFlagModule,
  FeatureFlagConfig,
  FEATURE_FLAG_CLIENT,
} from '@island.is/nest/feature-flags'
import { Features } from '@island.is/feature-flags'
import { ConfigModule } from '@island.is/nest/config'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { IcelandicGovernmentInstitutionVacanciesResolver } from './icelandic-government-institution-vacancies.resolver'

describe('IcelandicGovernmentInstitutionVacanciesResolver', () => {
  let app: INestApplication
  const featureFlagClient = {
    getValue: jest.fn().mockResolvedValue(false),
    dispose: jest.fn(),
  }

  const mockElasticService = {
    getVacancies: jest.fn().mockResolvedValue([]),
    getSingleVacancy: jest.fn().mockResolvedValue(null),
  }

  const mockContentfulService = {
    getOrganizations: jest.fn().mockResolvedValue({ items: [] }),
  }

  const mockXRoadApi = {
    vacanciesGet: jest.fn().mockResolvedValue([]),
    vacanciesVacancyIdGet: jest.fn().mockResolvedValue(null),
  }

  const mockElfurApi = {
    v1VacancyGetVacancyListGet: jest.fn().mockResolvedValue([]),
    v1VacancyGetVacancyGet: jest.fn().mockResolvedValue(null),
  }

  const mockLogger = {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  }

  const listQuery =
    '{ icelandicGovernmentInstitutionVacancies(input: {}) { vacancies { id } } }'
  const byIdQuery =
    '{ icelandicGovernmentInstitutionVacancyById(input: { id: "123" }) { vacancy { id } } }'

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        FeatureFlagModule,
        GraphQLModule.forRoot({
          autoSchemaFile: true,
          driver: ApolloDriver,
          path: '/graphql',
        }),
        ConfigModule.forRoot({ isGlobal: true, load: [FeatureFlagConfig] }),
      ],
      providers: [
        IcelandicGovernmentInstitutionVacanciesResolver,
        { provide: VacancyApi, useValue: mockElfurApi },
        { provide: DefaultApi, useValue: mockXRoadApi },
        { provide: CmsElasticsearchService, useValue: mockElasticService },
        { provide: CmsContentfulService, useValue: mockContentfulService },
        { provide: LOGGER_PROVIDER, useValue: mockLogger },
      ],
    })
      .overrideProvider(FEATURE_FLAG_CLIENT)
      .useValue(featureFlagClient)
      .compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    featureFlagClient.getValue.mockResolvedValue(false)
    mockElasticService.getVacancies.mockResolvedValue([])
    mockElasticService.getSingleVacancy.mockResolvedValue(null)
    mockXRoadApi.vacanciesGet.mockResolvedValue([])
    mockXRoadApi.vacanciesVacancyIdGet.mockResolvedValue(null)
    mockElfurApi.v1VacancyGetVacancyListGet.mockResolvedValue([])
    mockElfurApi.v1VacancyGetVacancyGet.mockResolvedValue(null)
  })

  afterAll(async () => {
    await app.close()
  })

  it('passes client IP from x-forwarded-for to feature flag evaluation', async () => {
    await request(app.getHttpServer())
      .get('/graphql')
      .set('x-forwarded-for', '192.168.1.100')
      .query({ query: listQuery })

    expect(featureFlagClient.getValue).toHaveBeenCalledWith(
      Features.useNewVacancyApi,
      false,
      expect.objectContaining({
        id: '',
        attributes: expect.objectContaining({
          ipAddress: '192.168.1.100',
        }),
      }),
    )
  })

  it('uses first client IP when x-forwarded-for has multiple values', async () => {
    await request(app.getHttpServer())
      .get('/graphql')
      .set('x-forwarded-for', '10.0.0.50, 10.0.0.10, 10.0.0.1')
      .query({ query: listQuery })

    expect(featureFlagClient.getValue).toHaveBeenCalledWith(
      Features.useNewVacancyApi,
      false,
      expect.objectContaining({
        id: '',
        attributes: expect.objectContaining({
          ipAddress: '10.0.0.50',
        }),
      }),
    )
  })

  it('falls back to request IP when x-forwarded-for is missing', async () => {
    await request(app.getHttpServer())
      .get('/graphql')
      .query({ query: listQuery })

    const [, , user] = featureFlagClient.getValue.mock.calls[0]
    expect(user).toEqual(
      expect.objectContaining({
        id: '',
        attributes: expect.objectContaining({
          ipAddress: expect.any(String),
        }),
      }),
    )
    expect(user.attributes.ipAddress).not.toBe('')
    expect(user.attributes.ipAddress).not.toContain(',')
  })

  it('uses xroad list API when feature flag is disabled', async () => {
    featureFlagClient.getValue.mockResolvedValue(false)

    await request(app.getHttpServer())
      .get('/graphql')
      .query({ query: listQuery })

    expect(mockXRoadApi.vacanciesGet).toHaveBeenCalledTimes(1)
    expect(mockElfurApi.v1VacancyGetVacancyListGet).not.toHaveBeenCalled()
  })

  it('uses new list API when feature flag is enabled', async () => {
    featureFlagClient.getValue.mockResolvedValue(true)

    await request(app.getHttpServer())
      .get('/graphql')
      .query({ query: listQuery })

    expect(mockElfurApi.v1VacancyGetVacancyListGet).toHaveBeenCalledTimes(1)
    expect(mockXRoadApi.vacanciesGet).not.toHaveBeenCalled()
  })

  it('uses xroad detail API for vacancy by id when feature flag is disabled', async () => {
    featureFlagClient.getValue.mockResolvedValue(false)

    await request(app.getHttpServer())
      .get('/graphql')
      .query({ query: byIdQuery })

    expect(mockXRoadApi.vacanciesVacancyIdGet).toHaveBeenCalledWith(
      expect.objectContaining({
        vacancyId: 123,
      }),
    )
    expect(mockElfurApi.v1VacancyGetVacancyGet).not.toHaveBeenCalled()
  })

  it('uses new detail API for vacancy by id when feature flag is enabled', async () => {
    featureFlagClient.getValue.mockResolvedValue(true)

    await request(app.getHttpServer())
      .get('/graphql')
      .query({ query: byIdQuery })

    expect(mockElfurApi.v1VacancyGetVacancyGet).toHaveBeenCalledWith({
      vacancyId: '123',
    })
    expect(mockXRoadApi.vacanciesVacancyIdGet).not.toHaveBeenCalled()
  })
})
