import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import randomString from 'randomstring'

import {
  CreateDelegationDTO,
  DelegationsService,
  Delegation,
} from '@island.is/auth-api-lib'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'
import { IdsUserGuard, User } from '@island.is/auth-nest-tools'

import { setup } from '../../../../../../test/setup'

const currentUser: User = {
  nationalId: randomString.generate({ length: 10, charset: 'numeric' }),
  scope: [],
  authorization: '',
  client: '',
}

const user = {
  nationalId: randomString.generate({ length: 10, charset: 'numeric' }),
  name: randomString.generate(),
  fullName: randomString.generate(),
  info: {
    name: randomString.generate(),
  },
}

class MockEinstaklingarApi {
  withMiddleware() {
    return this
  }

  einstaklingarGetEinstaklingur() {
    return {
      fulltNafn: user.fullName,
      nafn: user.name,
    }
  }
}

describe('DelegationsController with auth', () => {
  let app: INestApplication
  let delegationModel: typeof Delegation

  beforeAll(async () => {
    app = await setup({
      currentUser,
      override: (builder) => {
        builder
          .overrideProvider(EinstaklingarApi)
          .useValue(new MockEinstaklingarApi())
      },
    })
    delegationModel = app.get<typeof Delegation>('DelegationRepository')
  })

  describe('create', () => {
    it('should create a delegation', async () => {
      // Arrange
      const payload: CreateDelegationDTO = {
        toNationalId: user.nationalId,
        scopes: [],
      }
      jest
        .spyOn(
          app.get<DelegationsService>(DelegationsService) as any,
          'getUserName',
        )
        .mockImplementation(() => Promise.resolve(user.info.name))
      const numberOfExistingDelegations = await delegationModel.count()

      // Act
      const response = await request(app.getHttpServer())
        .post('/public/v1/delegations')
        .send(payload)

      // Assert
      expect(response.status).toEqual(201)
      expect(response.body).toMatchObject({
        fromName: user.info.name,
        fromNationalId: currentUser.nationalId,
        provider: 'delegationdb',
        scopes: [],
        toName: user.fullName,
        toNationalId: user.nationalId,
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
  let app: INestApplication

  beforeAll(async () => {
    app = await setup()
  })

  describe('create', () => {
    it('should return 401 unauthorized ', async () => {
      // Arrange
      const payload = {}

      // Act
      const response = await request(app.getHttpServer())
        .post('/public/v1/delegations')
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
