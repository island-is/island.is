import { TestApp } from '@island.is/testing/nest'
import request from 'supertest'
import { FixtureFactory } from '@island.is/services/auth/testing'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { AuthScope } from '@island.is/auth/scopes'
import { setupWithAuth } from '../../../../test/setup'
import {
  DelegationIndex,
  DelegationsIndexService,
} from '@island.is/auth-api-lib'
import { getModelToken } from '@nestjs/sequelize'
import { AuthDelegationProvider, AuthDelegationType } from 'delegation'

const currentUser = createCurrentUser({
  nationalIdType: 'person',
  scope: [AuthScope.delegations],
  delegationProvider: AuthDelegationProvider.CompanyRegistry,
})

const validationTestcases = [
  {
    message: 'should return status 400 if delegation information is missing',
    param: '',
  },
  {
    message:
      'should return status 400 if some delegation information is missing (1)',
    param: `${AuthDelegationType.ProcurationHolder}`,
  },
  {
    message:
      'should return status 400 if some delegation information is missing (2)',
    param: `${AuthDelegationType.ProcurationHolder}_${createNationalId(
      'person',
    )}`,
  },
  {
    message: 'should return status 400 if type is invalid',
    param: `invalidType_${createNationalId('person')}_${
      currentUser.nationalId
    }`,
  },
]

const delegationTypeAndProviderMapTestcases: Record<
  string,
  AuthDelegationType[]
> = {
  [AuthDelegationProvider.CompanyRegistry]: [
    AuthDelegationType.Custom,
    AuthDelegationType.LegalGuardian,
    AuthDelegationType.PersonalRepresentative,
  ],
  [AuthDelegationProvider.NationalRegistry]: [
    AuthDelegationType.ProcurationHolder,
    AuthDelegationType.Custom,
    AuthDelegationType.PersonalRepresentative,
  ],
}

describe('DelegationIndexController', () => {
  describe('With invalid delegation type and provider combination', () => {
    describe.each(Object.keys(delegationTypeAndProviderMapTestcases))(
      'Delegation provider: %s',
      (name) => {
        const testcase = delegationTypeAndProviderMapTestcases[name]
        let app: TestApp
        let server: request.SuperTest<request.Test>
        let factory: FixtureFactory
        let delegationIndexService: DelegationsIndexService
        let delegationIndexModel: typeof DelegationIndex

        beforeAll(async () => {
          app = await setupWithAuth({
            user: createCurrentUser({
              nationalIdType: 'person',
              scope: [AuthScope.delegations],
              delegationProvider: name as AuthDelegationProvider,
            }),
          })

          server = request(app.getHttpServer())

          delegationIndexService = app.get(DelegationsIndexService)
          delegationIndexModel = app.get(getModelToken(DelegationIndex))
        })

        testcase.forEach((delegationType) => {
          it(`PUT: should return status 400 for ${delegationType}`, async () => {
            // Act
            const response = await server
              .put('/delegation-index/.id')
              .set(
                'X-Param-Id',
                `${delegationType}_${createNationalId('person')}_${
                  currentUser.nationalId
                }`,
              )
              .send({})

            // Assert
            expect(response.status).toBe(400)
          })

          it(`DELETE: should return status 400 for ${delegationType}`, async () => {
            // Act
            const response = await server
              .delete('/delegation-index/.id')
              .set(
                'X-Param-Id',
                `${delegationType}_${createNationalId('person')}_${
                  currentUser.nationalId
                }`,
              )
              .send({})

            // Assert
            expect(response.status).toBe(400)
          })
        })
      },
    )
  })

  describe('With invalid delegation provider', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let factory: FixtureFactory
    let delegationIndexService: DelegationsIndexService
    let delegationIndexModel: typeof DelegationIndex

    beforeAll(async () => {
      app = await setupWithAuth({
        user: createCurrentUser({
          nationalIdType: 'person',
          scope: [AuthScope.delegations],
          delegationProvider: 'invalidProvider' as AuthDelegationProvider,
        }),
      })

      server = request(app.getHttpServer())

      delegationIndexService = app.get(DelegationsIndexService)
      delegationIndexModel = app.get(getModelToken(DelegationIndex))
    })

    it('PUT: should return status 400', async () => {
      // Act
      const response = await server
        .put('/delegation-index/.id')
        .set(
          'X-Param-Id',
          `${AuthDelegationType.ProcurationHolder}_${createNationalId(
            'person',
          )}_${currentUser.nationalId}`,
        )
        .send({})

      // Assert
      expect(response.status).toBe(400)
    })

    it('DELETE: should return status 400', async () => {
      // Act
      const response = await server
        .delete('/delegation-index/.id')
        .set(
          'X-Param-Id',
          `${AuthDelegationType.ProcurationHolder}_${createNationalId(
            'person',
          )}_${currentUser.nationalId}`,
        )
        .send({})

      // Assert
      expect(response.status).toBe(400)
    })
  })

  describe('With valid delegation provider', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let factory: FixtureFactory
    let delegationIndexService: DelegationsIndexService
    let delegationIndexModel: typeof DelegationIndex

    beforeAll(async () => {
      app = await setupWithAuth({
        user: currentUser,
      })
      server = request(app.getHttpServer())

      delegationIndexService = app.get(DelegationsIndexService)
      delegationIndexModel = app.get(getModelToken(DelegationIndex))
    })

    describe('PUT', () => {
      validationTestcases.forEach((testCase) => {
        it(testCase.message, async () => {
          // Act
          const response = await server
            .put('/delegation-index/.id')
            .set('X-Param-Id', testCase.param)
            .send({})

          // Assert
          expect(response.status).toBe(400)
        })
      })
    })

    describe('DELETE', () => {
      validationTestcases.forEach((testCase) => {
        it(testCase.message, async () => {
          // Act
          const response = await server
            .delete('/delegation-index/.id')
            .set('X-Param-Id', testCase.param)
            .send({})

          // Assert
          expect(response.status).toBe(400)
        })
      })
    })
  })
})
