import request from 'supertest'
import { Controller, Get, INestApplication, UseGuards } from '@nestjs/common'
import { ApolloDriver } from '@nestjs/apollo'
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

const testUser = createCurrentUser({ nationalIdType: 'person' })
const testCompany = createCurrentUser({ nationalIdType: 'company' })
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

@UseGuards(IdsUserGuard, FeatureFlagGuard)
@FeatureFlag(testFeature)
@Controller('rest-feature')
export class TestFeatureController {
  @Get()
  getSomething() {
    // Will only reach here if someFeature is turned on, either globally or for the authenticated user.
  }
}

@UseGuards(IdsUserGuard, FeatureFlagGuard)
@FeatureFlag(testFeature)
@Resolver()
export class TestFeatureResolver {
  @Query(() => Boolean, { nullable: true })
  getSomethingElse() {
    // Will only reach here if someFeature is turned on, either globally or for the authenticated user.
  }
}

describe('FeatureFlagGuard', () => {
  let app: INestApplication
  const authGuard = new MockAuthGuard(testUser)
  const featureFlagClient = {
    getValue: jest.fn(),
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TestController, TestFeatureController],
      providers: [TestResolver, TestFeatureResolver],
      imports: [
        FeatureFlagModule,
        GraphQLModule.forRoot({
          autoSchemaFile: true,
          driver: ApolloDriver,
          path: '/graphql',
        }),
        ConfigModule.forRoot({ isGlobal: true, load: [FeatureFlagConfig] }),
      ],
    })
      .overrideProvider(FEATURE_FLAG_CLIENT)
      .useValue(featureFlagClient)
      .overrideGuard(IdsUserGuard)
      .useValue(authGuard)
      .compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('guards controller if feature is disabled', () => {
    // Arrange
    featureFlagClient.getValue.mockResolvedValue(false)

    // Act
    return request(app.getHttpServer()).get('/rest-feature').expect(403)
  })

  it('guards controller endpoint if feature is disabled', () => {
    // Arrange
    featureFlagClient.getValue.mockResolvedValue(false)

    // Act
    return request(app.getHttpServer()).get('/rest').expect(403)
  })

  it('allows controller endpoint if feature is enabled', async () => {
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
        attributes: {
          subjectType: 'person',
        },
      },
    )
  })

  it('passes company details to getValue', async () => {
    // Arrange
    jest.spyOn(authGuard, 'getAuth').mockReturnValue(testCompany)

    // Act
    await request(app.getHttpServer()).get('/rest')

    // Assert
    expect(featureFlagClient.getValue).toHaveBeenCalledWith(
      testFeature,
      false,
      {
        id: testCompany.nationalId,
        attributes: {
          subjectType: 'legalEntity',
        },
      },
    )
  })

  it('guards resolver class if feature is disabled', async () => {
    // Arrange
    featureFlagClient.getValue.mockResolvedValue(false)

    // Act
    const response = await request(app.getHttpServer())
      .get('/graphql')
      .query({ query: '{ getSomethingElse }' })

    // Assert
    expect(response.body).toMatchObject({
      data: { getSomethingElse: null },
      errors: [{ message: 'Forbidden resource' }],
    })
  })

  it('guards resolver method if feature is disabled', async () => {
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

  it('allows resolver method if feature is enabled', async () => {
    // Arrange
    featureFlagClient.getValue.mockResolvedValue(true)

    // Act
    return request(app.getHttpServer())
      .get('/graphql')
      .query({ query: '{ getSomething }' })
      .expect(200)
  })
})
