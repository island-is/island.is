import { Resolver, Query, GraphQLModule } from '@nestjs/graphql'
import { UserAccessGuard } from './userAccess.guard'
import { INestApplication, UseGuards } from '@nestjs/common'
import {
  AllowDelegation,
  IsOwner,
  RestrictGuarantor,
  AllowManager,
} from '../decorators'
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
import request from 'supertest'
import {
  SignatureCollectionClientConfig,
  SignatureCollectionClientModule,
} from '@island.is/clients/signature-collection'
import { SignatureCollectionService } from '../signatureCollection.service'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import { AuthDelegationType } from '@island.is/shared/types'

const ownerNationalId = '0101303019'
const ownerCompanyId = '0000000000'
const someNationalId = '0101307789'
const someCompanyId = '0000000001'

const basicUser = createCurrentUser({
  nationalIdType: 'person',
  nationalId: someNationalId,
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
})

const userIsOwnerNotDelegated = createCurrentUser({
  nationalIdType: 'person',
  nationalId: ownerNationalId,
})

const userHasProcurationAndIsOwner = createCurrentUser({
  nationalIdType: 'company',
  actor: { nationalId: someNationalId },
  nationalId: ownerCompanyId,
  delegationType: [AuthDelegationType.ProcurationHolder],
})

const userHasProcurationAndIsNotOwner = createCurrentUser({
  nationalIdType: 'company',
  actor: { nationalId: someNationalId },
  nationalId: someCompanyId,
  delegationType: [AuthDelegationType.ProcurationHolder],
})

const userDelegatedToCompanyButNotProcurationHolder = createCurrentUser({
  nationalIdType: 'company',
  actor: { nationalId: someNationalId },
  nationalId: someCompanyId,
  delegationType: [AuthDelegationType.Custom],
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
  getForAllNonDelegatedUsers() {
    return true
  }

  @Query(() => Boolean, { nullable: true })
  @RestrictGuarantor()
  getIsRestrictedToGuarantors() {
    return true
  }

  @Query(() => Boolean, { nullable: true })
  @AllowManager()
  getIsAllowedForManagers() {
    return true
  }

  @Query(() => Boolean, { nullable: true })
  @RestrictGuarantor()
  @AllowManager()
  getIsRestrictedToGuarantorsAndAllowedForManagers() {
    return true
  }

  @Query(() => Boolean, { nullable: true })
  @IsOwner()
  @AllowManager()
  getIfOwnerWithAllowManager() {
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
          isOwner: [ownerNationalId, ownerCompanyId].includes(user.nationalId),
          name: 'Test',
          nationalId: user.nationalId,
          candidate: {
            id: '1',
            name: 'Test',
            nationalId: user.nationalId,
            ownerName: 'Test',
            ownerBirthDate: new Date(),
            hasActiveLists: true,
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
    jest.resetModules()
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })

  const gqlQuery = (query: string) =>
    request(app.getHttpServer()).get('/graphql').query({
      query,
    })

  it('Should allow owner to access IsOwner decorated paths', async () => {
    setupMockForUser(userIsOwnerNotDelegated)

    const response = await gqlQuery('{ getIfOwner }')

    expect(response.body).toMatchObject(okGraphQLResponse('getIfOwner'))
  })

  it('Should not allow user delegated to owner to access IsOwner decorated paths without AllowDelegation', async () => {
    setupMockForUser(delegatedUserToOwner)

    const response = await gqlQuery('{ getIfOwner }')

    expect(response.body).toMatchObject(forbiddenGraphqlResponse('getIfOwner'))
  })

  it('Should not allow basic users to access IsOwner when not owner', async () => {
    setupMockForUser(basicUser)

    const response = await gqlQuery('{ getIfOwner }')

    expect(response.body).toMatchObject(forbiddenGraphqlResponse('getIfOwner'))
  })

  it('Where AllowDelegation and IsOwner: Should allow user delegated to owner', async () => {
    setupMockForUser(delegatedUserToOwner)

    const response = await gqlQuery('{ getIfOwnerWithDelegationAllowed }')

    expect(response.body).toMatchObject(
      okGraphQLResponse('getIfOwnerWithDelegationAllowed'),
    )
  })

  it('Where AllowDelegation and IsOwner: Should not allow user delegated to non-owner', async () => {
    setupMockForUser(delegatedUserNotToOwner)

    const response = await gqlQuery('{ getIfOwnerWithDelegationAllowed }')

    expect(response.body).toMatchObject(
      forbiddenGraphqlResponse('getIfOwnerWithDelegationAllowed'),
    )
  })

  it('With no decorators present: Should restrict delegation to owner', async () => {
    setupMockForUser(delegatedUserToOwner)

    const response = await gqlQuery('{ getForAllNonDelegatedUsers }')

    expect(response.body).toMatchObject(
      forbiddenGraphqlResponse('getForAllNonDelegatedUsers'),
    )
  })

  it('With no decorators present: Should restrict delegation to non-owner', async () => {
    setupMockForUser(delegatedUserNotToOwner)

    const response = await gqlQuery('{ getForAllNonDelegatedUsers }')

    expect(response.body).toMatchObject(
      forbiddenGraphqlResponse('getForAllNonDelegatedUsers'),
    )
  })

  it('With no decorators present: Should allow basic users', async () => {
    setupMockForUser(basicUser)

    const response = await gqlQuery('{ getForAllNonDelegatedUsers }')

    expect(response.body).toMatchObject(
      okGraphQLResponse('getForAllNonDelegatedUsers'),
    )
  })

  it('When IsOwner not present: Should allow delegation with AllowDelegation for owner delegations', async () => {
    setupMockForUser(delegatedUserToOwner)

    const response = await gqlQuery('{ getIfAllowedDelegation }')

    expect(response.body).toMatchObject(
      okGraphQLResponse('getIfAllowedDelegation'),
    )
  })

  it('When IsOwner not present: Should allow delegation with AllowDelegation for non-owner delegations', async () => {
    setupMockForUser(delegatedUserNotToOwner)

    const response = await gqlQuery('{ getIfAllowedDelegation }')

    expect(response.body).toMatchObject(
      okGraphQLResponse('getIfAllowedDelegation'),
    )
  })
  it('With only AllowDelegation: Should not restrict basic users', async () => {
    setupMockForUser(basicUser)

    const response = await gqlQuery('{ getIfAllowedDelegation }')

    expect(response.body).toMatchObject(
      okGraphQLResponse('getIfAllowedDelegation'),
    )
  })

  it('With only IsOwner: Should not restrict delegation of a procuration type even with no AllowDelegation when delegated to owner', async () => {
    setupMockForUser(userHasProcurationAndIsOwner)

    const response = await gqlQuery('{ getIfOwner }')

    expect(response.body).toMatchObject(okGraphQLResponse('getIfOwner'))
  })

  it('With only IsOwner: Should restrict delegation of a procuration type even with no AllowDelegation when delegated to non-owner', async () => {
    setupMockForUser(userHasProcurationAndIsNotOwner)

    const response = await gqlQuery('{ getIfOwner }')

    expect(response.body).toMatchObject(forbiddenGraphqlResponse('getIfOwner'))
  })

  it('With RestrictGuarantor: Should restrict access to guarantors', async () => {
    setupMockForUser(userIsOwnerNotDelegated)

    let response = await gqlQuery('{ getIsRestrictedToGuarantors }')

    expect(response.body).toMatchObject(
      forbiddenGraphqlResponse('getIsRestrictedToGuarantors'),
    )

    setupMockForUser(userHasProcurationAndIsOwner)

    response = await gqlQuery('{ getIsRestrictedToGuarantors }')

    expect(response.body).toMatchObject(
      forbiddenGraphqlResponse('getIsRestrictedToGuarantors'),
    )

    setupMockForUser(userHasProcurationAndIsNotOwner)

    response = await gqlQuery('{ getIsRestrictedToGuarantors }')

    expect(response.body).toMatchObject(
      forbiddenGraphqlResponse('getIsRestrictedToGuarantors'),
    )
  })

  it('With RestrictGuarantor and AllowManager: Should allow access to managers', async () => {
    setupMockForUser(userIsOwnerNotDelegated)

    // DISALLOW ALL GUARANTORS
    let response = await gqlQuery(
      '{ getIsRestrictedToGuarantorsAndAllowedForManagers }',
    )

    expect(response.body).toMatchObject(
      forbiddenGraphqlResponse(
        'getIsRestrictedToGuarantorsAndAllowedForManagers',
      ),
    )

    setupMockForUser(userHasProcurationAndIsOwner)

    response = await gqlQuery(
      '{ getIsRestrictedToGuarantorsAndAllowedForManagers }',
    )

    expect(response.body).toMatchObject(
      forbiddenGraphqlResponse(
        'getIsRestrictedToGuarantorsAndAllowedForManagers',
      ),
    )

    setupMockForUser(userHasProcurationAndIsNotOwner)

    response = await gqlQuery(
      '{ getIsRestrictedToGuarantorsAndAllowedForManagers }',
    )

    expect(response.body).toMatchObject(
      forbiddenGraphqlResponse(
        'getIsRestrictedToGuarantorsAndAllowedForManagers',
      ),
    )

    // ALLOW ALL MANAGERS
    setupMockForUser(delegatedUserNotToOwner)

    response = await gqlQuery(
      '{ getIsRestrictedToGuarantorsAndAllowedForManagers }',
    )

    expect(response.body).toMatchObject(
      okGraphQLResponse('getIsRestrictedToGuarantorsAndAllowedForManagers'),
    )

    setupMockForUser(delegatedUserToOwner)

    response = await gqlQuery(
      '{ getIsRestrictedToGuarantorsAndAllowedForManagers }',
    )

    expect(response.body).toMatchObject(
      okGraphQLResponse('getIsRestrictedToGuarantorsAndAllowedForManagers'),
    )

    setupMockForUser(userDelegatedToCompanyButNotProcurationHolder)

    response = await gqlQuery(
      '{ getIsRestrictedToGuarantorsAndAllowedForManagers }',
    )

    expect(response.body).toMatchObject(
      okGraphQLResponse('getIsRestrictedToGuarantorsAndAllowedForManagers'),
    )
  })

  it('With AllowManager: Should allow access to managers', async () => {
    // ALLOW ALL MANAGERS
    setupMockForUser(delegatedUserNotToOwner)

    let response = await gqlQuery(
      '{ getIsRestrictedToGuarantorsAndAllowedForManagers }',
    )

    expect(response.body).toMatchObject(
      okGraphQLResponse('getIsRestrictedToGuarantorsAndAllowedForManagers'),
    )

    setupMockForUser(delegatedUserToOwner)

    response = await gqlQuery(
      '{ getIsRestrictedToGuarantorsAndAllowedForManagers }',
    )

    expect(response.body).toMatchObject(
      okGraphQLResponse('getIsRestrictedToGuarantorsAndAllowedForManagers'),
    )

    setupMockForUser(userDelegatedToCompanyButNotProcurationHolder)

    response = await gqlQuery(
      '{ getIsRestrictedToGuarantorsAndAllowedForManagers }',
    )

    expect(response.body).toMatchObject(
      okGraphQLResponse('getIsRestrictedToGuarantorsAndAllowedForManagers'),
    )
  })

  it('Allow manager does not override the IsOwner decorator', async () => {
    setupMockForUser(delegatedUserToOwner)

    let response = await gqlQuery('{ getIfOwnerWithAllowManager }')

    expect(response.body).toMatchObject(
      okGraphQLResponse('getIfOwnerWithAllowManager'),
    )

    setupMockForUser(delegatedUserNotToOwner)

    response = await gqlQuery('{ getIfOwnerWithAllowManager }')

    expect(response.body).toMatchObject(
      forbiddenGraphqlResponse('getIfOwnerWithAllowManager'),
    )
  })
})
