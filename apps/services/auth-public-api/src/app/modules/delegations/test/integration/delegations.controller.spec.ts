import request from 'supertest'
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder'

import {
  CreateDelegationDTO,
  DelegationsService,
  Delegation,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'
import {
  testServer,
  useDatabase,
  useAuth,
  TestApp,
} from '@island.is/testing/nest'
import {
  createCurrentUser,
  createOpenIDUser,
  createNationalRegistryUser,
} from '@island.is/testing/fixtures'

import { AppModule } from '../../../../app.module'

const currentUser = createCurrentUser()
const nationalRegistryUser = createNationalRegistryUser()

class MockEinstaklingarApi {
  withMiddleware() {
    return this
  }

  einstaklingarGetEinstaklingur() {
    return nationalRegistryUser
  }
}

describe('DelegationsController with auth', () => {
  let app: TestApp
  let delegationModel: typeof Delegation

  beforeAll(async () => {
    app = await testServer<AppModule>({
      appModule: AppModule,
      override: (builder: TestingModuleBuilder) =>
        builder
          .overrideProvider(EinstaklingarApi)
          .useValue(new MockEinstaklingarApi()),
      hooks: [
        useAuth({ currentUser }),
        useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
      ],
    })
    delegationModel = app.get<typeof Delegation>('DelegationRepository')
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  describe('create', () => {
    it('should create a delegation', async () => {
      // Arrange
      const openIdUser = createOpenIDUser()
      const payload: CreateDelegationDTO = {
        toNationalId: nationalRegistryUser.kennitala,
        scopes: [],
      }
      jest
        .spyOn(
          app.get<DelegationsService>(DelegationsService) as any,
          'getUserName',
        )
        .mockImplementation(() => openIdUser.profile.name)
      const numberOfExistingDelegations = await delegationModel.count()

      // Act
      const response = await request(app.getHttpServer())
        .post('/v1/delegations')
        .send(payload)

      // Assert
      expect(response.status).toEqual(201)
      expect(response.body).toMatchObject({
        fromName: openIdUser.profile.name,
        fromNationalId: currentUser.nationalId,
        provider: 'delegationdb',
        scopes: [],
        toName: nationalRegistryUser.fulltNafn,
        toNationalId: nationalRegistryUser.kennitala,
        type: 'Custom',
      })

      const numberOfDelegations = await delegationModel.count()
      expect(numberOfDelegations).toEqual(numberOfExistingDelegations + 1)

      const newDelegation = await delegationModel.findOne({
        where: { id: response.body.id },
      })
      expect(newDelegation).not.toBeNull()
    })
  })
})

describe('DelegationsController without auth', () => {
  let app: TestApp

  beforeAll(async () => {
    app = await testServer({
      appModule: AppModule,
      hooks: [
        useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
      ],
    })
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  describe('create', () => {
    it('should return 401 unauthorized ', async () => {
      // Arrange
      const payload = {}

      // Act
      const response = await request(app.getHttpServer())
        .post('/v1/delegations')
        .send(payload)

      // Assert
      expect(response.status).toEqual(401)
      expect(response.body).toEqual({
        statusCode: 401,
        message: 'Unauthorized',
      })
    })
  })
})
