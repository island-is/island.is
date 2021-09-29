import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import * as uuidv4 from 'uuidv4'
import {
  TestContainer,
  StartedTestContainer,
  StoppedTestContainer,
  GenericContainer,
} from 'testcontainers'

import {
  CreateDelegationDTO,
  DelegationsService,
  SEQUELIZE_CONFIG,
  SequalizeConfig,
} from '@island.is/auth-api-lib'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'
import { IdsUserGuard, User } from '@island.is/auth-nest-tools'

import { setup } from '../../../../../../test/setup'

const user = {
  nationalId: '1234567890',
  name: 'Test name',
  fullName: 'Test fullName',
  info: {
    name: 'Test info name',
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
  let currentUser: any

  beforeAll(async () => {
    // const container = await new GenericContainer(
    //   'public.ecr.aws/bitnami/postgresql:11.12.0',
    // )
    //   .withExposedPorts(5432)
    //   .withEnv('PG_PASSWORD', 'stafraentislandisthebest')
    //   .start()

    app = await setup({
      // sequalizeConfig: {
      //   // host: container.getIpAddress,
      //   // port: container.getMappedPort(5432),
      //   username: 'postgres',
      //   password: 'stafraentislandisthebest',
      //   database: ':memory:',
      //   dialect: 'sqlite',
      // },
      override: (builder) => {
        builder
          .overrideProvider(EinstaklingarApi)
          .useValue(new MockEinstaklingarApi())
          .overrideProvider(SEQUELIZE_CONFIG)
          .useValue({
            username: 'postgres',
            password: 'stafraentislandisthebest',
            database: ':memory:',
            dialect: 'sqlite',
          } as SequalizeConfig)
      },
    })
    currentUser = (app.get<IdsUserGuard>(IdsUserGuard) as IdsUserGuard & {
      user: User
    }).user
  })

  xdescribe('create', () => {
    it('should create a delegation', async () => {
      // Arrange
      const id = '00000000-0000-0000-0000-000000000000'
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
      jest.spyOn(uuidv4, 'uuid').mockImplementation(() => id)

      // Act
      const response = await request(app.getHttpServer())
        .post('/public/v1/delegations')
        .send(payload)

      // Assert
      expect(response.status).toEqual(201)
      expect(response.body).toEqual({
        fromName: user.info.name,
        fromNationalId: currentUser.nationalId,
        id,
        provider: 'delegationdb',
        scopes: [],
        toName: user.fullName,
        toNationalId: user.nationalId,
        type: 'Custom',
      })
    })
  })
})

describe('DelegationsController without auth', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await setup({ withAuth: false })
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
