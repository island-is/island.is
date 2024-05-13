import { Module, Type } from '@nestjs/common'
import {
  SequelizeModule,
  getModelToken,
  getConnectionToken,
} from '@nestjs/sequelize'
import assert from 'assert'
import { Sequelize } from 'sequelize-typescript'

import { TestApp, testServer, useDatabase } from '@island.is/testing/nest'

import { SequelizeConfigService } from '../core/sequelizeConfig.service'
import { PasskeyModel } from './models/passkey.model'
import { PasskeysCoreModule } from './passkeys-core.module'
import { PasskeysCoreService } from './passkeys-core.service'
import { ConfigModule } from '@nestjs/config'
import { PasskeysCoreConfig } from './passkeys-core.config'

const TEST_AUTHORIZATION_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR2VydmltYWR1ciB0ZXN0IiwiaWRwIjoiZ2VydmltYWR1ciJ9.nwPzZbpXWWBh2WFoHdCY0q9EwRBKBWwANVqF_c0cIPs'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [PasskeysCoreConfig],
    }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    PasskeysCoreModule,
  ],
})
class TestModule {}

const USER_SUB = '1234567890'

describe('PasskeyCoreService', () => {
  let app: TestApp
  let passkeysCoreService: PasskeysCoreService
  let passkeyModel: typeof PasskeyModel
  let sequelize: Sequelize

  beforeAll(async () => {
    app = await testServer({
      appModule: TestModule,
      hooks: [
        // SQLite doesn't support two transactions at a time, so we use postgres here
        // to be able to test parallel requests. Starting postgres is done in ../test/globalSetup.ts.
        useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
      ],
    })

    sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)

    passkeysCoreService = app.get(PasskeysCoreService)
    passkeyModel = app.get(getModelToken(PasskeyModel))
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  describe('register', () => {
    it('should generate registration options', async () => {
      const user = {
        sub: USER_SUB,
        authorization: TEST_AUTHORIZATION_TOKEN,
      } as any // since only user.sub is used in the function

      const opts = await passkeysCoreService.generateRegistrationOptions(user)

      assert(opts)
      expect(typeof opts.challenge).toBe('string')
      assert(opts.pubKeyCredParams)
      assert(opts.rp)
      assert(opts.user)
    })
  })

  describe('authenticate', () => {
    it('should not generate authentication options when passkey is not found for user', async () => {
      const user = {
        sub: USER_SUB,
        authorization: TEST_AUTHORIZATION_TOKEN,
      } as any // since only user.sub is used in the function

      await expect(() =>
        passkeysCoreService.generateAuthenticationOptions(user),
      ).rejects.toThrow('Passkey not found')
    })

    it('should generate authentication options when passkey is found for user', async () => {
      // Create a passkey for the user
      await passkeyModel.create({
        user_sub: USER_SUB,
        passkey_id: '123',
        public_key: 'public_key',
        audkenni_sim_number: '123',
        name: 'Tester',
        type: 'IslandisApp',
      })

      const user = {
        sub: USER_SUB,
        authorization: TEST_AUTHORIZATION_TOKEN,
      } as any // since only user.sub is used in the function

      const opts = await passkeysCoreService.generateAuthenticationOptions(user)

      assert(opts)
      expect(typeof opts.challenge).toBe('string')
    })
  })
})
