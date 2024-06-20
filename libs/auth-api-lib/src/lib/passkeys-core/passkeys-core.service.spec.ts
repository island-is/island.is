import { Module, Type } from '@nestjs/common'
import {
  SequelizeModule,
  getModelToken,
  getConnectionToken,
} from '@nestjs/sequelize'
import assert from 'assert'
import { Sequelize } from 'sequelize-typescript'
import type {
  VerifyAuthenticationResponseOpts,
  VerifyRegistrationResponseOpts,
} from '@simplewebauthn/server'

import { TestApp, testServer, useDatabase } from '@island.is/testing/nest'

import { SequelizeConfigService } from '../core/sequelizeConfig.service'
import { PasskeyModel } from './models/passkey.model'
import { PasskeysCoreModule } from './passkeys-core.module'
import { PasskeysCoreService } from './passkeys-core.service'
import { ConfigModule } from '@nestjs/config'
import { PasskeysCoreConfig } from './passkeys-core.config'

const {
  verifyRegistrationResponse,
  verifyAuthenticationResponse,
} = require('@simplewebauthn/server') // eslint-disable-line  @typescript-eslint/no-var-requires

jest.mock('@simplewebauthn/server', () => ({
  __esModule: true,
  ...jest.requireActual('@simplewebauthn/server'),
  verifyRegistrationResponse: jest.fn(),
  verifyAuthenticationResponse: jest.fn(),
}))

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
        useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
      ],
    })

    sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)

    passkeysCoreService = app.get(PasskeysCoreService)
    passkeyModel = app.get(getModelToken(PasskeyModel))
  })

  afterEach(async () => {
    await sequelize.transaction(async (transaction) => {
      await passkeyModel.destroy({ where: {}, transaction })
    })
  })

  afterAll(async () => {
    await app.cleanUp()
    jest.restoreAllMocks()
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
      expect(opts.rp.id).toBe('localhost')
    })

    it('should verify registration', async () => {
      const user = {
        sub: USER_SUB,
        authorization: TEST_AUTHORIZATION_TOKEN,
      } as any // since only user.sub is used in the function

      await passkeysCoreService.generateRegistrationOptions(user)

      // mock the verifyRegistration method since we don't have a browser client to create it
      verifyRegistrationResponse.mockImplementation(
        async (options: VerifyRegistrationResponseOpts) => {
          return {
            verified: true,
            registrationInfo: {
              credentialID: options.response.id,
              credentialPublicKey:
                Buffer.from('test-public-key').toString('base64'),
              counter: 0,
            },
          }
        },
      )

      const verification = await passkeysCoreService.verifyRegistration(user, {
        // Mock the registration response that the client would send
        id: '1337',
        // ... only the id is used in the mocked function above
      } as any)

      expect(verification.verified).toBe(true)
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
        public_key: new TextEncoder().encode('public_key'),
        audkenni_sim_number: '123',
        name: 'Tester',
        type: 'IslandisApp',
        idp: 'gervimadur',
        counter: 0,
      })

      const user = {
        sub: USER_SUB,
        authorization: TEST_AUTHORIZATION_TOKEN,
      } as any // since only user.sub is used in the function

      const opts = await passkeysCoreService.generateAuthenticationOptions(user)

      assert(opts)
      expect(typeof opts.challenge).toBe('string')
    })

    it('should not verify authentication using a passkey older than config.maxAgeDays', async () => {
      const PASSKEY_ID = '1337'
      const PASSKEY_AGE_IN_DAYS = 366 // 1 year and 1 day ago (1 day over default maxAgeDays)

      // Create a passkey for the user
      await passkeyModel.create({
        user_sub: USER_SUB,
        passkey_id: PASSKEY_ID,
        public_key: new TextEncoder().encode('public_key'),
        audkenni_sim_number: '123',
        name: 'Tester',
        type: 'IslandisApp',
        idp: 'gervimadur',
        created: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * PASSKEY_AGE_IN_DAYS,
        ),
        counter: 0,
      })

      const user = {
        sub: USER_SUB,
        authorization: TEST_AUTHORIZATION_TOKEN,
      } as any // since only user.sub is used in the function

      await expect(() =>
        passkeysCoreService.generateAuthenticationOptions(user),
      ).rejects.toThrow('Passkey not found')
    })

    it('should verify authentication based on authentication options', async () => {
      const PASSKEY_ID = '1337'

      // Create a passkey for the user
      await passkeyModel.create({
        user_sub: USER_SUB,
        passkey_id: PASSKEY_ID,
        public_key: new TextEncoder().encode('public_key'),
        audkenni_sim_number: '123',
        name: 'Tester',
        type: 'IslandisApp',
        idp: 'gervimadur',
        counter: 0,
      })

      const user = {
        sub: USER_SUB,
        authorization: TEST_AUTHORIZATION_TOKEN,
      } as any // since only user.sub is used in the function

      const opts = await passkeysCoreService.generateAuthenticationOptions(user)

      // mock the verifyAuthentication method since we don't have a browser client to create it
      verifyAuthenticationResponse.mockImplementation(
        async (options: VerifyAuthenticationResponseOpts) => {
          return {
            verified: true,
            authenticationInfo: {
              credentialID: options.response.id,
              credentialPublicKey:
                Buffer.from('test-public-key').toString('base64'),
              newCounter: 0,
            },
          }
        },
      )

      const verification = await passkeysCoreService.verifyAuthentication({
        // Mock the authentication response that the client would send
        id: PASSKEY_ID,
        // ... only the id is used in the mocked function above
        // and then the clientDataJSON is used by the service function
        response: {
          clientDataJSON: Buffer.from(
            JSON.stringify({
              // to find the challenge from the authentication options
              challenge: opts.challenge,
            }),
          ).toString('base64'),
        },
      } as any)

      expect(verification.verified).toBe(true)
    })
  })

  it('passkey counter should match new counter in client authenticator response', async () => {
    const PASSKEY_ID = '1337'
    const EXPECTED_NEW_COUNTER = 13

    // Create a passkey for the user
    await passkeyModel.create({
      user_sub: USER_SUB,
      passkey_id: PASSKEY_ID,
      public_key: new TextEncoder().encode('public_key'),
      audkenni_sim_number: '123',
      name: 'Tester',
      type: 'IslandisApp',
      idp: 'gervimadur',
      counter: 0,
    })

    const user = {
      sub: USER_SUB,
      authorization: TEST_AUTHORIZATION_TOKEN,
    } as any // since only user.sub is used in the function

    const opts = await passkeysCoreService.generateAuthenticationOptions(user)

    // mock the verifyAuthentication method since we don't have a browser client to create it
    verifyAuthenticationResponse.mockImplementation(
      async (options: VerifyAuthenticationResponseOpts) => {
        return {
          verified: true,
          authenticationInfo: {
            credentialID: options.response.id,
            credentialPublicKey:
              Buffer.from('test-public-key').toString('base64'),
            newCounter: EXPECTED_NEW_COUNTER,
          },
        }
      },
    )

    // During this verification, the counter of the passkey in the database
    // should be updated to the new counter from the client response
    await passkeysCoreService.verifyAuthentication({
      // Mock the authentication response that the client would send
      id: PASSKEY_ID,
      // ... only the id is used in the mocked function above
      // and then the clientDataJSON is used by the service function
      response: {
        clientDataJSON: Buffer.from(
          JSON.stringify({
            // to find the challenge from the authentication options
            challenge: opts.challenge,
          }),
        ).toString('base64'),
      },
    } as any)

    const passkey = await passkeyModel.findOne({
      where: { passkey_id: PASSKEY_ID },
    })

    assert(passkey)

    // Ensure that the counter of the passkey in the database
    // has been updated to the new counter from the client response
    expect(passkey.counter).toBe(EXPECTED_NEW_COUNTER)
  })
})
