import { Resolver, Query, GraphQLModule } from '@nestjs/graphql'
import { UserAccessGuard } from './userAccess.guard'
import { ExecutionContext, INestApplication, UseGuards } from '@nestjs/common'
import { AllowDelegation, IsOwner } from '../decorators'
import { Test } from '@nestjs/testing'
import { ApolloDriver } from '@nestjs/apollo'
import { ConfigModule } from '@nestjs/config'
jest.mock('@island.is/auth-nest-tools', () => {
  const original = jest.requireActual('@island.is/auth-nest-tools')
  return {
    ...original,
    getRequest: jest.fn(),
  }
})
import {
  getRequest,
  IdsUserGuard,
  MockAuthGuard,
  User,
} from '@island.is/auth-nest-tools'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { AuthDelegationType } from '@island.is/shared/types'
import request from 'supertest'
import {
  CollectionType,
  SignatureCollectionClientConfig,
  SignatureCollectionClientModule,
  SignatureCollectionClientService,
} from '@island.is/clients/signature-collection'
import { SignatureCollectionService } from '../signatureCollection.service'
import { ApiScope } from '@island.is/auth/scopes'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import { CollectionStatus } from '../models/status.model'

const ownerNationalId = '0101303019'
const someNationalId = '1234567890'

const basicUser = createCurrentUser({
  nationalIdType: 'person',
  nationalId: someNationalId,
  scope: [ApiScope.signatureCollection],
})
const authGuard = new MockAuthGuard(basicUser)
const delegatedUserNotToOwner = createCurrentUser({
  nationalIdType: 'person',
  actor: { nationalId: someNationalId },
})

const delegatedUserToOwner = createCurrentUser({
  nationalIdType: 'person',
  actor: { nationalId: someNationalId },
  nationalId: ownerNationalId,
  delegationType: AuthDelegationType.ProcurationHolder,
})

const isOwnerNotDelegated = createCurrentUser({
  nationalIdType: 'person',
  nationalId: ownerNationalId,
})

const okGraphQLResponse = (queryName: string) => ({
  data: {
    [queryName]: true,
  },
})

const forbiddenGraphqlResponse = (queryName: string) => ({
  data: {
    [queryName]: null,
  },
  errors: [{ message: 'Forbidden resource' }],
})

@UseGuards(UserAccessGuard, IdsUserGuard)
@Resolver()
class TestResolver {
  @Query(() => Boolean, { nullable: true })
  @IsOwner()
  getIfOwner() {
    return true
  }

  @Query(() => Boolean, { nullable: true })
  @IsOwner()
  @AllowDelegation()
  getIfOwnerWithDelegationAllowed() {
    return true
  }

  @Query(() => Boolean, { nullable: true })
  @AllowDelegation()
  getIfAllowedDelegation() {
    return true
  }

  @Query(() => Boolean, { nullable: true })
  getThatWorkForEveryUser() {
    return true
  }
}

describe('UserAccessGuard', () => {
  let app: INestApplication
  let signatureCollectionService: SignatureCollectionService
  const setupMockForUser = (user: User): void => {
    jest.spyOn(authGuard, 'getAuth').mockReturnValue(user)
    ;(getRequest as jest.Mock).mockReturnValue({
      user,
    })
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TestResolver, SignatureCollectionService],
      imports: [
        GraphQLModule.forRoot({
          autoSchemaFile: true,
          driver: ApolloDriver,
          path: '/graphql',
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [SignatureCollectionClientConfig, IdsClientConfig, XRoadConfig],
        }),
        SignatureCollectionClientModule,
      ],
    })
      .overrideGuard(IdsUserGuard)
      .useValue(authGuard)
      .compile()

    app = moduleRef.createNestApplication()
    signatureCollectionService = app.get<SignatureCollectionService>(
      SignatureCollectionService,
    )

    await app.init()
  })

  beforeEach(() => {
    jest
      .spyOn(signatureCollectionService, 'signee')
      .mockImplementation((user: User, _nationalId?: string) => {
        return Promise.resolve({
          canCreate: true,
          canSign: true,
          isOwner: user.nationalId === ownerNationalId,
          name: 'Test',
          nationalId: user.nationalId,
          candidate: {
            id: '1',
            name: 'Test',
            nationalId: user.nationalId,
          },
        })
      })

    jest
      .spyOn(signatureCollectionService, 'isCollector')
      .mockImplementation(() => {
        return Promise.resolve(true)
      })
  })

  afterEach(() => {
    jest.clearAllMocks(), jest.restoreAllMocks()
  })

  it('Should allow owner to access isOwner decorated paths', async () => {
    setupMockForUser(isOwnerNotDelegated)

    const response = await request(app.getHttpServer())
      .get('/graphql')
      .query({ query: '{ getIfOwner }' })

    expect(response.body).toMatchObject(okGraphQLResponse('getIfOwner'))
  })

  it('Should not allow delegated user to access isOwner decorated paths without allowDelegation', async () => {
    setupMockForUser(delegatedUserToOwner)

    const response = await request(app.getHttpServer())
      .get('/graphql')
      .query({ query: '{ getIfOwner }' })

    expect(response.body).toMatchObject(forbiddenGraphqlResponse('getIfOwner'))
  })

  it('Where delegationAllowed() and isOwner: Should allow user delegated to owner', async () => {
    setupMockForUser(delegatedUserToOwner)

    const response = await request(app.getHttpServer())
      .get('/graphql')
      .query({ query: '{ getIfOwnerWithDelegationAllowed }' })

    expect(response.body).toMatchObject(
      okGraphQLResponse('getIfOwnerWithDelegationAllowed'),
    )
  })

  it('Where delegationAllowed() and isOwner: Should not allow user delegated to non-owner', async () => {
    setupMockForUser(delegatedUserNotToOwner)

    const response = await request(app.getHttpServer())
      .get('/graphql')
      .query({ query: '{ getIfOwnerWithDelegationAllowed }' })

    expect(response.body).toMatchObject(
      forbiddenGraphqlResponse('getIfOwnerWithDelegationAllowed'),
    )
  })
})
