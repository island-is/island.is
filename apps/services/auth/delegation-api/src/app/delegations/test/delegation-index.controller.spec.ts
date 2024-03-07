import { TestApp } from '@island.is/testing/nest'
import request from 'supertest'
import { FixtureFactory } from '@island.is/services/auth/testing'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { AuthScope } from '@island.is/auth/scopes'
import { setupWithAuth } from '../../../../test/setup'
import { DelegationIndex } from '@island.is/auth-api-lib'
import { getModelToken } from '@nestjs/sequelize'
import { AuthDelegationProvider, AuthDelegationType } from 'delegation'

const validationTestcases = [
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
    param: `${AuthDelegationType.ProcurationHolder}_${createNationalId(
      'person',
    )}`,
    responseDetail: 'Invalid delegation information',
  },
  {
    message: 'should return status 400 if toNationalId is invalid',
    param: `${
      AuthDelegationType.ProcurationHolder
    }_invalidToNationalId_${createNationalId('person')}`,
    responseDetail: 'Invalid national id',
  },
  {
    message: 'should return status 400 if fromNationalId is invalid',
    param: `${AuthDelegationType.ProcurationHolder}_${createNationalId(
      'person',
    )}_invalidToNationalId`,
    responseDetail: 'Invalid national id',
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
        const user = createCurrentUser({
          nationalIdType: 'person',
          scope: [AuthScope.delegations],
          delegationProvider: name as AuthDelegationProvider,
        })

        beforeAll(async () => {
          app = await setupWithAuth({
            user,
          })

          server = request(app.getHttpServer())
        })

        testcase.forEach((delegationType) => {
          it(`PUT: should return status 400 for ${delegationType}`, async () => {
            // Act
            const response = await server
              .put('/delegation-index/.id')
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
              .delete('/delegation-index/.id')
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
      scope: [AuthScope.delegations],
      delegationProvider: 'invalidProvider' as AuthDelegationProvider,
    })

    beforeAll(async () => {
      app = await setupWithAuth({
        user,
      })

      server = request(app.getHttpServer())
    })

    it('PUT: should return status 400', async () => {
      // Act
      const response = await server
        .put('/delegation-index/.id')
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
        .delete('/delegation-index/.id')
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
    let factory: FixtureFactory

    let delegationIndexModel: typeof DelegationIndex
    const delegationProvider = AuthDelegationProvider.CompanyRegistry
    const user = createCurrentUser({
      nationalIdType: 'person',
      scope: [AuthScope.delegations],
      delegationProvider: delegationProvider as AuthDelegationProvider,
    })

    beforeAll(async () => {
      app = await setupWithAuth({
        user,
      })
      server = request(app.getHttpServer())

      delegationIndexModel = app.get(getModelToken(DelegationIndex))
    })

    describe('PUT - validation', () => {
      validationTestcases.forEach((testcase) => {
        it(testcase.message, async () => {
          // Act
          const response = await server
            .put('/delegation-index/.id')
            .set('X-Param-Id', testcase.param)
            .send({})

          // Assert
          expect(response.status).toBe(400)
          expect(response.body.detail).toBe(testcase.responseDetail)
        })
      })
    })

    it('PUT - should add new delegation to index', async () => {
      // Arrange
      const toNationalId = createNationalId('person')
      const fromNationalId = user.nationalId
      const type = AuthDelegationType.ProcurationHolder
      const validTo = new Date().toISOString()

      // Act
      const response = await server
        .put('/delegation-index/.id')
        .set('X-Param-Id', `${type}_${toNationalId}_${fromNationalId}`)
        .send({
          validTo,
        })

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
      expect(delegation).toBeDefined()
      expect(delegation?.validTo?.toISOString()).toBe(validTo)
      expect(delegation?.provider).toBe(delegationProvider)
      expect(delegation?.fromNationalId).toBe(fromNationalId)
      expect(delegation?.toNationalId).toBe(toNationalId)
    })

    it('PUT - should update delegation in index', async () => {
      // Arrange
      const toNationalId = createNationalId('person')
      const fromNationalId = user.nationalId
      const type = AuthDelegationType.ProcurationHolder
      const validTo = new Date().toISOString()
      const validToUpdated = new Date(new Date().getTime() + 1000).toISOString()

      // Act
      await server
        .put('/delegation-index/.id')
        .set('X-Param-Id', `${type}_${toNationalId}_${fromNationalId}`)
        .send({
          validTo,
        })
      const response = await server
        .put('/delegation-index/.id')
        .set('X-Param-Id', `${type}_${toNationalId}_${fromNationalId}`)
        .send({
          validTo: validToUpdated,
        })

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
      expect(delegation).toBeDefined()
      expect(delegation?.validTo?.toISOString()).toBe(validToUpdated)
      expect(delegation?.provider).toBe(delegationProvider)
      expect(delegation?.fromNationalId).toBe(fromNationalId)
      expect(delegation?.toNationalId).toBe(toNationalId)
    })

    describe('DELETE - validation', () => {
      validationTestcases.forEach((testcase) => {
        it(testcase.message, async () => {
          // Act
          const response = await server
            .delete('/delegation-index/.id')
            .set('X-Param-Id', testcase.param)
            .send({})

          // Assert
          expect(response.status).toBe(400)
          expect(response.body.detail).toBe(testcase.responseDetail)
        })
      })
    })

    it('DELETE - should remove delegation from index', async () => {
      // Arrange
      const toNationalId = createNationalId('person')
      const fromNationalId = user.nationalId
      const type = AuthDelegationType.ProcurationHolder
      const validTo = new Date().toISOString()

      // Act
      await server
        .put('/delegation-index/.id')
        .set('X-Param-Id', `${type}_${toNationalId}_${fromNationalId}`)
        .send({
          validTo,
        })
      const response = await server
        .delete('/delegation-index/.id')
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
})
