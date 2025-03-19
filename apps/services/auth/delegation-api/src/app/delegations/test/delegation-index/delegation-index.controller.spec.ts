import { generatePerson } from 'kennitala'
import request from 'supertest'
import { getModelToken } from '@nestjs/sequelize'

import { TestApp } from '@island.is/testing/nest'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { AuthScope } from '@island.is/auth/scopes'
import { DelegationIndex } from '@island.is/auth-api-lib'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'

import { setupWithAuth } from '../../../../../test/setup'
import addYears from 'date-fns/addYears'

const path = '/v1/delegation-index/.id'
const testNationalId = createNationalId('person')

const validationTestCases = [
  {
    message: 'should return status 400 if delegation information is missing',
    param: '',
    responseDetail: 'Invalid delegation information',
  },
  {
    message:
      'should return status 400 if some delegation information is missing (1)',
    param: `${AuthDelegationType.ProcurationHolder}`,
    responseDetail: 'Invalid delegation information',
  },
  {
    message:
      'should return status 400 if some delegation information is missing (2)',
    param: `${AuthDelegationType.ProcurationHolder}_${testNationalId}`,
    responseDetail: 'Invalid delegation information',
  },
  {
    message: 'should return status 400 if toNationalId is invalid',
    param: `${AuthDelegationType.ProcurationHolder}_invalidToNationalId_${testNationalId}`,
    responseDetail: 'Invalid national ids',
  },
  {
    message: 'should return status 400 if fromNationalId is invalid',
    param: `${AuthDelegationType.ProcurationHolder}_${testNationalId}_invalidToNationalId`,
    responseDetail: 'Invalid national ids',
  },
  {
    message:
      'should return status 400 if fromNationalId is the same as toNationalId',
    param: `${AuthDelegationType.ProcurationHolder}_${testNationalId}_${testNationalId}`,
    responseDetail: 'Invalid national ids',
  },
]

const invalidDelegationTypeAndProviderMapTestcases: Record<
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
  describe('Without valid scope', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    const user = createCurrentUser({
      nationalIdType: 'person',
      scope: [],
    })

    beforeAll(async () => {
      app = await setupWithAuth({
        user,
      })

      server = request(app.getHttpServer())
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('PUT: should return status 403', async () => {
      // Act
      const response = await server
        .put(path)
        .set(
          'X-Param-Id',
          `${AuthDelegationType.ProcurationHolder}_${createNationalId(
            'person',
          )}_${user.nationalId}`,
        )
        .send({})

      // Assert
      expect(response.status).toBe(403)
    })

    it('DELETE: should return status 403', async () => {
      // Act
      const response = await server
        .delete(path)
        .set(
          'X-Param-Id',
          `${AuthDelegationType.ProcurationHolder}_${createNationalId(
            'person',
          )}_${user.nationalId}`,
        )
        .send({})

      // Assert
      expect(response.status).toBe(403)
    })
  })

  describe('With invalid delegation type and provider combination', () => {
    describe.each(Object.keys(invalidDelegationTypeAndProviderMapTestcases))(
      'Delegation provider: %s',
      (provider) => {
        const testCase = invalidDelegationTypeAndProviderMapTestcases[provider]
        let app: TestApp
        let server: request.SuperTest<request.Test>
        const user = createCurrentUser({
          nationalIdType: 'person',
          scope: [AuthScope.delegationIndexWrite],
          delegationProvider: provider as AuthDelegationProvider,
        })

        beforeAll(async () => {
          app = await setupWithAuth({
            user,
          })

          server = request(app.getHttpServer())
        })

        afterAll(async () => {
          await app.cleanUp()
        })

        testCase.forEach((delegationType) => {
          it(`PUT: should return status 400 for ${delegationType}`, async () => {
            // Act
            const response = await server
              .put(path)
              .set(
                'X-Param-Id',
                `${delegationType}_${createNationalId('person')}_${
                  user.nationalId
                }`,
              )
              .send({})

            // Assert
            expect(response.status).toBe(400)
            expect(response.body.detail).toBe(
              'Invalid delegation type and provider combination',
            )
          })

          it(`DELETE: should return status 400 for ${delegationType}`, async () => {
            // Act
            const response = await server
              .delete(path)
              .set(
                'X-Param-Id',
                `${delegationType}_${createNationalId('person')}_${
                  user.nationalId
                }`,
              )
              .send({})

            // Assert
            expect(response.status).toBe(400)
            expect(response.body.detail).toBe(
              'Invalid delegation type and provider combination',
            )
          })
        })
      },
    )
  })

  describe('With invalid delegation provider', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    const user = createCurrentUser({
      nationalIdType: 'person',
      scope: [AuthScope.delegationIndexWrite],
      delegationProvider: 'invalidProvider' as AuthDelegationProvider,
    })

    beforeAll(async () => {
      app = await setupWithAuth({
        user,
      })

      server = request(app.getHttpServer())
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('PUT: should return status 400', async () => {
      // Act
      const response = await server
        .put(path)
        .set(
          'X-Param-Id',
          `${AuthDelegationType.ProcurationHolder}_${createNationalId(
            'person',
          )}_${user.nationalId}`,
        )
        .send({})

      // Assert
      expect(response.status).toBe(400)
    })

    it('DELETE: should return status 400', async () => {
      // Act
      const response = await server
        .delete(path)
        .set(
          'X-Param-Id',
          `${AuthDelegationType.ProcurationHolder}_${createNationalId(
            'person',
          )}_${user.nationalId}`,
        )
        .send({})

      // Assert
      expect(response.status).toBe(400)
    })
  })

  describe('With valid delegation provider', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>

    let delegationIndexModel: typeof DelegationIndex
    const delegationProvider = AuthDelegationProvider.CompanyRegistry
    const user = createCurrentUser({
      nationalIdType: 'person',
      scope: [AuthScope.delegationIndexWrite],
      delegationProvider: delegationProvider as AuthDelegationProvider,
    })

    beforeAll(async () => {
      app = await setupWithAuth({
        user,
      })
      server = request(app.getHttpServer())

      delegationIndexModel = app.get(getModelToken(DelegationIndex))
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    describe('PUT - validation', () => {
      validationTestCases.forEach((testCase) => {
        it(testCase.message, async () => {
          // Act
          const response = await server
            .put(path)
            .set('X-Param-Id', testCase.param)
            .send({})

          // Assert
          expect(response.status).toBe(400)
          expect(response.body.detail).toBe(testCase.responseDetail)
        })
      })
    })

    it('PUT - should add new delegation to index', async () => {
      // Arrange
      const { toNationalId, fromNationalId, type, validTo } = {
        toNationalId: createNationalId('person'),
        fromNationalId: user.nationalId,
        type: AuthDelegationType.ProcurationHolder,
        validTo: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
      }

      // Act
      const response = await server
        .put(path)
        .set('X-Param-Id', `${type}_${toNationalId}_${fromNationalId}`)
        .send({
          validTo: validTo,
        })

      // Assert
      const delegation = await delegationIndexModel.findOne({
        where: {
          fromNationalId: fromNationalId,
          toNationalId: toNationalId,
          type: type,
          provider: delegationProvider,
        },
      })

      expect(response.status).toBe(200)
      expect(response.body.fromNationalId).toBe(fromNationalId)
      expect(response.body.toNationalId).toBe(toNationalId)
      expect(delegation).toBeDefined()
      expect(delegation?.validTo).toStrictEqual(validTo)
    })

    it('PUT - should update delegation in index', async () => {
      // Arrange
      const { fromNationalId, toNationalId, type, validTo } = {
        toNationalId: createNationalId('person'),
        fromNationalId: user.nationalId,
        type: AuthDelegationType.ProcurationHolder,
        validTo: new Date(),
      }
      const validToUpdated = new Date(new Date().getTime() + 1000)

      // Act
      await server
        .put(path)
        .set('X-Param-Id', `${type}_${toNationalId}_${fromNationalId}`)
        .send({
          validTo: validTo,
        })
      const response = await server
        .put(path)
        .set('X-Param-Id', `${type}_${toNationalId}_${fromNationalId}`)
        .send({
          validTo: validToUpdated,
        })

      // Assert
      const delegation = await delegationIndexModel.findOne({
        where: {
          fromNationalId: fromNationalId,
          toNationalId: toNationalId,
          type: type,
          provider: delegationProvider,
          validTo: validToUpdated,
        },
      })

      expect(response.status).toBe(200)
      expect(delegation).toBeDefined()
      expect(delegation?.validTo).toStrictEqual(validToUpdated)
      expect(delegation?.provider).toBe(delegationProvider)
      expect(response.body.fromNationalId).toBe(fromNationalId)
      expect(response.body.toNationalId).toBe(toNationalId)
    })

    describe('DELETE - validation', () => {
      validationTestCases.forEach((testCase) => {
        it(testCase.message, async () => {
          // Act
          const response = await server
            .delete(path)
            .set('X-Param-Id', testCase.param)
            .send({})

          // Assert
          expect(response.status).toBe(400)
          expect(response.body.detail).toBe(testCase.responseDetail)
        })
      })
    })

    it('DELETE - should remove delegation from index', async () => {
      // Arrange
      const toNationalId = createNationalId('person')
      const fromNationalId = user.nationalId
      const type = AuthDelegationType.ProcurationHolder
      const validTo = new Date()

      // Act
      await server
        .put(path)
        .set('X-Param-Id', `${type}_${toNationalId}_${fromNationalId}`)
        .send({
          validTo,
        })
      const response = await server
        .delete(path)
        .set('X-Param-Id', `${type}_${toNationalId}_${fromNationalId}`)
        .send({})

      // Assert
      const delegation = await delegationIndexModel.findOne({
        where: {
          fromNationalId,
          toNationalId,
          type,
          provider: delegationProvider,
        },
      })

      expect(response.status).toBe(204)
      expect(delegation).toBeNull()
    })
  })

  describe('PUT for Legal guardians', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>

    let delegationIndexModel: typeof DelegationIndex
    const delegationProvider = AuthDelegationProvider.NationalRegistry
    const user = createCurrentUser({
      nationalIdType: 'person',
      scope: [AuthScope.delegationIndexWrite],
      delegationProvider: delegationProvider as AuthDelegationProvider,
    })

    beforeAll(async () => {
      app = await setupWithAuth({
        user,
      })
      server = request(app.getHttpServer())

      delegationIndexModel = app.get(getModelToken(DelegationIndex))
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('PUT - should create LegalGuardianMinor delegation record if creating LegalGuardian delegation for child under 16', async () => {
      // Arrange
      const DATE_OF_BIRTH = new Date(addYears(new Date(), -15).toDateString())
      const { toNationalId, fromNationalId, type } = {
        toNationalId: user.nationalId,
        fromNationalId: generatePerson(DATE_OF_BIRTH),
        type: AuthDelegationType.LegalGuardian,
      }

      // Act
      const response = await server
        .put(path)
        .set('X-Param-Id', `${type}_${toNationalId}_${fromNationalId}`)
        .send()

      // Assert
      const legalGuardianDelegation = await delegationIndexModel.findOne({
        where: {
          fromNationalId: fromNationalId,
          toNationalId: toNationalId,
          type: type,
          provider: delegationProvider,
        },
      })
      const legalGuardianMinorDelegation = await delegationIndexModel.findOne({
        where: {
          fromNationalId: fromNationalId,
          toNationalId: toNationalId,
          type: AuthDelegationType.LegalGuardianMinor,
          provider: delegationProvider,
        },
      })

      expect(response.status).toBe(200)
      expect(response.body.fromNationalId).toBe(fromNationalId)
      expect(response.body.toNationalId).toBe(toNationalId)
      expect(legalGuardianDelegation).toBeDefined()
      expect(legalGuardianMinorDelegation).toBeDefined()
      expect(legalGuardianDelegation?.validTo).toStrictEqual(
        // 18 years from kid's birthday
        addYears(DATE_OF_BIRTH, 18),
      )
      expect(legalGuardianMinorDelegation?.validTo).toStrictEqual(
        // 16 years from kid's birthday
        addYears(DATE_OF_BIRTH, 16),
      )

      jest.resetAllMocks()
    })
  })
})
