import request from 'supertest'
import { Controller, Get, INestApplication, UseGuards } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { ConfigModule } from '@island.is/nest/config'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { createCurrentUser } from '@island.is/testing/fixtures'

import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
  FeatureFlagModule,
  FeatureFlagConfig,
  FEATURE_FLAG_CLIENT,
} from '../'
import { GraphQLModule, Query, Resolver } from '@nestjs/graphql'

const testUser = createCurrentUser()
const testFeature = 'test' as Features

@UseGuards(IdsUserGuard, FeatureFlagGuard)
@Controller('rest')
export class TestController {
  @Get()
  @FeatureFlag(testFeature)
  getSomething() {
    // Will only reach here if someFeature is turned on, either globally or for the authenticated user.
  }
}

@UseGuards(IdsUserGuard, FeatureFlagGuard)
@Resolver()
export class TestResolver {
  @Query(() => Boolean, { nullable: true })
  @FeatureFlag(testFeature)
  getSomething() {
    // Will only reach here if someFeature is turned on, either globally or for the authenticated user.
  }
}

describe('FeatureFlagGuard', () => {
  let app: INestApplication
  const featureFlagClient = {
    getValue: jest.fn(),
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TestController],
      providers: [TestResolver],
      imports: [
        FeatureFlagModule,
        GraphQLModule.forRoot({ autoSchemaFile: true, path: '/graphql' }),
        ConfigModule.forRoot({ isGlobal: true, load: [FeatureFlagConfig] }),
      ],
    })
      .overrideProvider(FEATURE_FLAG_CLIENT)
      .useValue(featureFlagClient)
      .overrideGuard(IdsUserGuard)
      .useValue(new MockAuthGuard(testUser))
      .compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('guards controller if feature is disabled', () => {
    // Arrange
    featureFlagClient.getValue.mockResolvedValue(false)

    // Act
    return request(app.getHttpServer()).get('/rest').expect(403)
  })

  it('allows controller if feature is enabled', async () => {
    // Arrange
    featureFlagClient.getValue.mockResolvedValue(true)

    // Act
    return request(app.getHttpServer()).get('/rest').expect(200)
  })

  it('passes user details to getValue', async () => {
    // Act
    await request(app.getHttpServer()).get('/rest')

    // Assert
    expect(featureFlagClient.getValue).toHaveBeenCalledWith(
      testFeature,
      false,
      {
        id: testUser.nationalId,
      },
    )
  })

  it('guards resolver if feature is disabled', async () => {
    // Arrange
    featureFlagClient.getValue.mockResolvedValue(false)

    // Act
    const response = await request(app.getHttpServer())
      .get('/graphql')
      .query({ query: '{ getSomething }' })

    // Assert
    expect(response.body).toMatchObject({
      data: { getSomething: null },
      errors: [{ message: 'Forbidden resource' }],
    })
  })

  it('allows resolver if feature is enabled', async () => {
    // Arrange
    featureFlagClient.getValue.mockResolvedValue(true)

    // Act
    return request(app.getHttpServer())
      .get('/graphql')
      .query({ query: '{ getSomething }' })
      .expect(200)
  })
})
