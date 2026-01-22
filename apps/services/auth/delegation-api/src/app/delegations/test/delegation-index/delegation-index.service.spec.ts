import { Type } from '@nestjs/common'
import { getConnectionToken, getModelToken } from '@nestjs/sequelize'
import faker from 'faker'
import { Sequelize } from 'sequelize-typescript'

import {
  indexingTestCases,
  prRight1,
  testDate,
} from './delegation-index-test-cases'
import { setupWithAuth } from '../../../../../test/setup'
import {
  customScopes,
  customScopesOtherDomain,
  domainName,
  TestCase,
  user,
} from './delegations-index-types'

import {
  actorSubjectIdType,
  audkenniProvider,
  Delegation,
  DelegationDirection,
  DelegationIndex,
  DelegationIndexMeta,
  delegationProvider,
  DelegationScope,
  DelegationsIndexService,
  UserIdentitiesService,
} from '@island.is/auth-api-lib'
import { RskRelationshipsClient } from '@island.is/clients-rsk-relationships'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { FixtureFactory } from '@island.is/services/auth/testing'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'
import { createNationalRegistryUser } from '@island.is/testing/fixtures'
import { TestApp, truncate } from '@island.is/testing/nest'

describe('DelegationsIndexService', () => {
  let app: TestApp
  let delegationIndexService: DelegationsIndexService
  let delegationIndexModel: typeof DelegationIndex
  let delegationIndexMetaModel: typeof DelegationIndexMeta
  let factory: FixtureFactory
  let sequelize: Sequelize
  let nationalRegistryApi: NationalRegistryClientService
  let rskApi: RskRelationshipsClient
  let delegationModel: typeof Delegation
  let delegationScopeModel: typeof DelegationScope
  let userIdentitiesService: UserIdentitiesService

  const userIdentitySubjectId1 = faker.datatype.uuid()

  const setup = async (testCase: TestCase) => {
    await truncate(sequelize)
    await Promise.all(
      testCase.domains.map((domain) => factory.createDomain(domain)),
    )
    await factory.createClient(testCase.client)

    await Promise.all(
      testCase.apiScopes.map((scope) => factory.createApiScope(scope)),
    )

    // create custom delegations
    await Promise.all(
      [
        ...testCase.customDelegations,
        ...testCase.customDelegationsOtherDomain,
      ].map((delegation) => factory.createCustomDelegation(delegation)),
    )

    // create personal representation delegations
    await Promise.all(
      testCase.personalRepresentativeDelegation.map((d) =>
        factory.createPersonalRepresentativeDelegation(d),
      ),
    )

    // Create user identity for user with audkenni provider
    await factory.createUserIdentity({
      subjectId: userIdentitySubjectId1,
      name: faker.name.findName(),
      providerName: audkenniProvider,
      providerSubjectId: `IS-${user.nationalId}`,
      active: true,
    })

    await delegationIndexMetaModel.destroy({ where: {} })
    await delegationIndexModel.destroy({ where: {} })

    // mock national registry for ward delegations
    jest
      .spyOn(nationalRegistryApi, 'getCustodyChildren')
      .mockImplementation(async () => testCase.fromChildren)

    // mock rsk for procuration delegations
    jest
      .spyOn(rskApi, 'getIndividualRelationships')
      .mockImplementation(async () => testCase.procuration)
  }

  beforeAll(async () => {
    app = await setupWithAuth({
      user: user,
    })

    delegationIndexService = app.get(DelegationsIndexService)
    userIdentitiesService = app.get(UserIdentitiesService)

    delegationIndexModel = app.get(getModelToken(DelegationIndex))
    delegationIndexMetaModel = app.get(getModelToken(DelegationIndexMeta))
    delegationModel = app.get(getModelToken(Delegation))
    delegationScopeModel = app.get(getModelToken(DelegationScope))

    sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)

    factory = new FixtureFactory(app)

    nationalRegistryApi = app.get(NationalRegistryClientService)
    jest
      .spyOn(nationalRegistryApi, 'getIndividual')
      .mockImplementation(async (nationalId: string) =>
        createNationalRegistryUser({
          nationalId,
          name: faker.name.findName(),
        }),
      )

    rskApi = app.get(RskRelationshipsClient)
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  describe('indexDelegations', () => {
    describe('delegation index meta logic', () => {
      beforeAll(async () => {
        await setup(indexingTestCases.custom)
      })

      beforeEach(async () => {
        jest.useFakeTimers()
        jest.setSystemTime(testDate)
      })

      afterEach(async () => {
        // remove all delegation meta and delegations
        await delegationIndexMetaModel.destroy({ where: {} })
        await delegationIndexModel.destroy({ where: {} })

        jest.useRealTimers()
      })

      it('should not index delegations if next reindex date is in the future', async () => {
        const nextReindex = new Date(testDate.getTime() + 1000) // future date
        const lastFullReindex = new Date(testDate.getTime() - 1000)

        // Arrange
        await delegationIndexMetaModel.create({
          nationalId: user.nationalId,
          nextReindex,
          lastFullReindex,
        })

        // Act
        await delegationIndexService.indexDelegations(user)

        // Assert
        const meta = await delegationIndexMetaModel.findOne({
          where: { nationalId: user.nationalId },
        })
        const delegations = await delegationIndexModel.findAll({
          where: {
            toNationalId: user.nationalId,
          },
        })

        expect(meta).not.toBeNull()
        expect(meta?.nextReindex).toStrictEqual(nextReindex)
        expect(meta?.lastFullReindex).toStrictEqual(lastFullReindex)
        expect(delegations).toHaveLength(0)
      })

      it('should set nextReindex to week in the future after a successful indexing', async () => {
        // Arrange
        // test when there is no meta

        // Act
        await delegationIndexService.indexDelegations(user)

        // Assert
        const meta = await delegationIndexMetaModel.findOne({
          where: { nationalId: user.nationalId },
        })

        expect(meta).not.toBeNull()
        expect(meta?.lastFullReindex).toStrictEqual(testDate)
        expect(meta?.nextReindex).toStrictEqual(
          new Date(2024, 2, 8, 0, 0, 0, 0), // week in the future from test date
        )
      })
    })

    describe.each(Object.keys(indexingTestCases))(
      'Index delegations of type: %s',
      (type) => {
        const testCase = indexingTestCases[type]
        testCase.user = user

        beforeEach(async () => {
          await setup(testCase)
        })

        it('should index delegations', async () => {
          // Act
          await delegationIndexService.indexDelegations(user)

          // Assert
          const delegations = await delegationIndexModel.findAll()

          expect(delegations.length).toBe(testCase.expectedFrom.length)
          delegations.forEach((delegation) => {
            const delegationRecord = testCase.expectedFrom.find(
              (record) =>
                record.nationalId === delegation.fromNationalId &&
                record.type === delegation.type,
            )
            expect(delegationRecord).toBeDefined()
          })
        })
      },
    )

    describe('Delegation deletion', () => {
      const testCase = indexingTestCases.custom

      beforeEach(async () => {
        await setup(testCase)

        await delegationIndexService.indexDelegations(user)
      })

      afterEach(async () => {
        await delegationIndexMetaModel.destroy({ where: {} })
        await delegationIndexModel.destroy({ where: {} })
        await delegationModel.destroy({ where: {} })
      })

      it('should delete one delegation of two', async () => {
        // Arrange
        const fromNationalId = testCase.customDelegations[0].fromNationalId
        const fromNationalId2 = testCase.customDelegations[1].fromNationalId

        // Act
        await delegationModel.destroy({
          where: {
            fromNationalId,
            toNationalId: user.nationalId,
          },
        })
        await delegationIndexMetaModel.destroy({ where: {} }) // delete meta to force reindex

        // Index delegations
        await delegationIndexService.indexDelegations(user)

        // Assert
        const delegations = await delegationIndexModel.findAll({
          where: {
            toNationalId: user.nationalId,
          },
        })

        expect(delegations).toHaveLength(1)
        expect(delegations[0].fromNationalId).toBe(fromNationalId2)
      })

      it('should delete delegations when it is the last of its type in the index', async () => {
        // Arrange
        await delegationModel.destroy({
          where: {
            toNationalId: user.nationalId,
          },
        }) // Delete all delegations for the user

        // Act
        await delegationIndexMetaModel.destroy({
          where: {
            nationalId: user.nationalId,
          },
        }) // delete meta to force reindex
        await delegationIndexService.indexDelegations(user) // Index delegations

        // Assert
        const delegations = await delegationIndexModel.findAll({
          where: {
            toNationalId: user.nationalId,
          },
        })

        expect(delegations).toHaveLength(0) // No delegations should be in the index
      })
    })

    describe('Reindex (multiple indexing)', () => {
      const testCase = indexingTestCases.custom

      beforeEach(async () => {
        await setup(testCase)
      })

      it('should not duplicate delegations on reindex', async () => {
        // Act
        await delegationIndexService.indexDelegations(user)

        // delete delegation index meta to force reindex
        await delegationIndexMetaModel.destroy({ where: {} })

        await delegationIndexService.indexDelegations(user)

        // Assert
        const delegations = await delegationIndexModel.findAll({
          where: {
            toNationalId: user.nationalId,
          },
        })

        expect(delegations.length).toBe(testCase.expectedFrom.length)
      })

      it('should remove delegations from index that are no longer valid', async () => {
        // Act
        await delegationIndexService.indexDelegations(user)

        const fromNationalId = testCase.customDelegations[0].fromNationalId
        // remove custom delegations
        await delegationModel.destroy({
          where: {
            fromNationalId,
            toNationalId: user.nationalId,
          },
        })
        // delete delegation index meta to force reindex
        await delegationIndexMetaModel.destroy({
          where: {
            nationalId: user.nationalId,
          },
        })

        await delegationIndexService.indexDelegations(user)

        // Assert
        const delegations = await delegationIndexModel.findAll()
        const deletedDelegation = await delegationIndexModel.findOne({
          where: {
            fromNationalId,
            toNationalId: user.nationalId,
            type: AuthDelegationType.Custom,
          },
        })

        expect(delegations.length).toBe(testCase.expectedFrom.length - 1)
        expect(deletedDelegation).toBeNull()
      })

      it('should update delegation index item if delegation has changed', async () => {
        // Act
        await delegationIndexService.indexDelegations(user)

        const fromNationalId = testCase.customDelegations[0].fromNationalId
        const updatedValidTo = new Date(
          new Date().getTime() + 1000 * 60 * 60 * 24,
        ) // 1 day in the future

        // Change valid to date of delegation
        const delegation = await delegationModel.findOne({
          where: {
            fromNationalId,
            toNationalId: user.nationalId,
          },
        })

        if (delegation) {
          await delegationScopeModel.update(
            { validTo: updatedValidTo },
            {
              where: {
                delegationId: delegation.id,
              },
            },
          )
        }

        // delete delegation index meta to force reindex
        await delegationIndexMetaModel.destroy({
          where: {
            nationalId: user.nationalId,
          },
        })

        await delegationIndexService.indexDelegations(user)

        // Assert
        const updatedDelegation = await delegationIndexModel.findOne({
          where: {
            validTo: updatedValidTo,
            fromNationalId,
            toNationalId: user.nationalId,
          },
        })

        expect(updatedDelegation).toBeDefined()
      })

      it('should remove scopes from custom delegations index item', async () => {
        // Act
        await delegationIndexService.indexDelegations(user)

        const fromNationalId = testCase.customDelegations[0].fromNationalId
        const testDelegation = await delegationModel.findOne({
          where: {
            fromNationalId,
            toNationalId: user.nationalId,
          },
        })

        // remove scope from delegation
        if (testDelegation) {
          await delegationScopeModel.destroy({
            where: {
              delegationId: testDelegation.id,
              scopeName: 'cu1',
            },
          })
        }

        // delete delegation index meta to force reindex
        await delegationIndexMetaModel.destroy({
          where: {
            nationalId: user.nationalId,
          },
        })

        await delegationIndexService.indexDelegations(user)

        // Assert
        const updatedDelegation = await delegationIndexModel.findOne({
          where: {
            fromNationalId,
            toNationalId: user.nationalId,
          },
        })

        expect(updatedDelegation).toBeDefined()
        expect(updatedDelegation?.customDelegationScopes).toHaveLength(1)
        expect(updatedDelegation?.customDelegationScopes).not.toContain('cu1')
      })

      it('should add new scopes to custom delegation index item', async () => {
        // Act
        await delegationIndexService.indexDelegations(user)

        const testDelegationScope = 'test-scope'
        const fromNationalId = testCase.customDelegations[0].fromNationalId
        const testDelegation = await delegationModel.findOne({
          where: {
            fromNationalId,
            toNationalId: user.nationalId,
          },
        })

        // Add new scope to delegation
        if (testDelegation) {
          await factory.createApiScope({
            name: testDelegationScope,
            domainName: domainName,
            allowExplicitDelegationGrant: true,
            supportedDelegationTypes: [AuthDelegationType.Custom],
            isAccessControlled: false,
          })

          await factory.createCustomScope({
            scopeName: testDelegationScope,
            delegationId: testDelegation.id,
          })
        }

        // delete delegation index meta to force reindex
        await delegationIndexMetaModel.destroy({
          where: {
            nationalId: user.nationalId,
          },
        })

        await delegationIndexService.indexDelegations(user)

        // Assert
        const updatedDelegation = await delegationIndexModel.findOne({
          where: {
            fromNationalId,
            toNationalId: user.nationalId,
          },
        })

        expect(updatedDelegation).toBeDefined()
        expect(updatedDelegation?.customDelegationScopes).toHaveLength(3)
        expect(updatedDelegation?.customDelegationScopes).toContain(
          testDelegationScope,
        )
      })
    })
  })

  describe('indexCustomDelegations', () => {
    const testCase = indexingTestCases.custom

    beforeEach(async () => {
      await setup(testCase)
    })

    it('should index custom delegations', async () => {
      // Arrange
      const nationalId = user.nationalId

      // Act
      await delegationIndexService.indexCustomDelegations(nationalId, user)

      // Assert
      const delegations = await delegationIndexModel.findAll({
        where: {
          toNationalId: nationalId,
        },
      })

      expect(delegations.length).toEqual(testCase.expectedFrom.length)
      delegations.forEach((delegation) => {
        const delegationRecord = testCase.expectedFrom.find(
          (record) =>
            record.nationalId === delegation.fromNationalId &&
            record.type === delegation.type,
        )
        expect(delegationRecord).toBeDefined()
      })
    })

    it('should not fail when re-indexing', async () => {
      // Arrange
      const nationalId = user.nationalId

      // Act
      await delegationIndexService.indexCustomDelegations(nationalId, user)

      await delegationIndexMetaModel.destroy({ where: {} })

      await delegationIndexService.indexCustomDelegations(nationalId, user)

      // Assert
      const delegations = await delegationIndexModel.findAll({
        where: {
          toNationalId: nationalId,
        },
      })

      expect(delegations.length).toEqual(testCase.expectedFrom.length)
      delegations.forEach((delegation) => {
        const delegationRecord = testCase.expectedFrom.find(
          (record) =>
            record.nationalId === delegation.fromNationalId &&
            record.type === delegation.type,
        )
        expect(delegationRecord).toBeDefined()
      })
    })
  })

  describe('indexCustomDelegationWithExisitingDelegations', () => {
    const testCase = indexingTestCases.customAndPersonalRepresentative

    beforeEach(async () => {
      await setup(testCase)
    })

    it('should index custom delegations without overiding existing delegations', async () => {
      // Arrange
      const nationalId = user.nationalId

      // Act
      await delegationIndexService.indexRepresentativeDelegations(
        nationalId,
        user,
      )
      await delegationIndexService.indexCustomDelegations(nationalId, user)

      // Assert
      const delegationsAfter = await delegationIndexModel.findAll({
        where: {
          toNationalId: nationalId,
        },
      })

      expect(delegationsAfter.length).toEqual(testCase.expectedFrom.length)
    })
  })

  describe('indexRepresentativeDelegations', () => {
    const testCase = indexingTestCases.personalRepresentative

    beforeEach(async () => await setup(testCase))

    afterEach(async () => {
      // remove all data
      await delegationIndexMetaModel.destroy({ where: {} })
      await delegationIndexModel.destroy({ where: {} })
    })

    it('should index personal representation delegations', async () => {
      // Arrange
      const nationalId = user.nationalId

      // Act
      await delegationIndexService.indexRepresentativeDelegations(
        nationalId,
        user,
      )

      // Assert
      const delegations = await delegationIndexModel.findAll({
        where: {
          toNationalId: nationalId,
        },
      })

      expect(delegations.length).toEqual(testCase.expectedFrom.length)
      delegations.forEach((delegation) => {
        const delegationRecord = testCase.expectedFrom.find(
          (record) =>
            record.nationalId === delegation.fromNationalId &&
            (record.type as string) ===
              `${AuthDelegationType.PersonalRepresentative}:${prRight1}`,
        )
        expect(delegationRecord).toBeDefined()
      })
    })
  })

  describe('SubjectId', () => {
    const testCase = indexingTestCases.singleCustomDelegation

    beforeEach(async () => {
      await setup(testCase)
    })

    afterEach(async () => {
      // remove all data
      await delegationIndexMetaModel.destroy({ where: {} })
      await delegationIndexModel.destroy({ where: {} })
    })

    it('should reuse subjectId from delegations with same fromNationalId and toNationalId', async () => {
      const fromNationalId = testCase.customDelegations[0].fromNationalId

      const findOrCreateSubjectIdSpy = jest.spyOn(
        userIdentitiesService,
        'findOrCreateSubjectId',
      )

      // Arrange
      // create delegation and delegation index record with same to and from national id
      await factory.createPersonalRepresentativeDelegation({
        fromNationalId,
        toNationalId: user.nationalId,
        rightTypes: [{ code: 'right' }],
      })
      await factory.createDelegationIndexRecord({
        fromNationalId,
        toNationalId: user.nationalId,
        provider: AuthDelegationProvider.PersonalRepresentativeRegistry,
        type: `${AuthDelegationType.PersonalRepresentative}:right`,
        subjectId: userIdentitySubjectId1,
      })

      // Act
      await delegationIndexService.indexDelegations(user)

      // Assert
      const delegations = await delegationIndexModel.findAll({
        where: {
          toNationalId: user.nationalId,
          fromNationalId,
        },
      })

      // Should have two delegations with the same subjectId
      expect(delegations.length).toEqual(2)

      // should not call findOrCreateSubjectId because we are reusing subjectId from delegation in the index
      expect(userIdentitiesService.findOrCreateSubjectId).not.toHaveBeenCalled()

      findOrCreateSubjectIdSpy.mockClear()
    })

    it('should fetch subjectId if userIdentity exits', async () => {
      const fromNationalId = testCase.customDelegations[0].fromNationalId
      const userIdentitySubjectId2 = faker.datatype.uuid()

      // User identity with delegation provider
      await factory.createUserIdentity({
        subjectId: userIdentitySubjectId2,
        name: faker.name.findName(),
        providerName: delegationProvider,
        providerSubjectId: `IS-${fromNationalId}`,
        active: true,
      })

      // delegation claim
      await factory.createClaim({
        subjectId: userIdentitySubjectId2,
        type: actorSubjectIdType,
        value: userIdentitySubjectId1,
        valueType: faker.random.word(),
        issuer: faker.random.word(),
        originalIssuer: faker.random.word(),
      })

      // Act
      await delegationIndexService.indexDelegations(user)

      // Assert
      const delegations = await delegationIndexModel.findAll({
        where: {
          toNationalId: user.nationalId,
          fromNationalId,
          subjectId: userIdentitySubjectId2,
        },
      })

      expect(delegations.length).toEqual(1)
    })

    it('should create subjectId if userIdentity does not exits', async () => {
      const fromNationalId = testCase.customDelegations[0].fromNationalId

      // Act
      await delegationIndexService.indexDelegations(user)

      // Assert
      const delegations = await delegationIndexModel.findAll({
        where: {
          toNationalId: user.nationalId,
          fromNationalId,
        },
      })

      expect(delegations.length).toEqual(1)
      expect(delegations[0].subjectId).toBeDefined()
    })
  })

  describe('mergeCustomDelegations', () => {
    const testCase = indexingTestCases.customTwoDomains

    beforeAll(async () => {
      await setup(testCase)
    })

    it('should merge custom delegations', async () => {
      // Arrange
      const nationalId = user.nationalId

      // Act
      await delegationIndexService.indexCustomDelegations(nationalId, user)

      // Assert
      const delegations = await delegationModel.findAll({
        where: {
          toNationalId: nationalId,
        },
      })
      const indexedDelegations = await delegationIndexModel.findAll({
        where: {
          toNationalId: nationalId,
        },
      })

      expect(delegations.length).toEqual(2)
      expect(indexedDelegations.length).toEqual(1)

      const indexedDelegation = indexedDelegations[0]

      expect(indexedDelegation.fromNationalId).toBe(
        testCase.expectedFrom[0].nationalId,
      )
      expect(indexedDelegation.toNationalId).toBe(user.nationalId)
      expect(indexedDelegation.customDelegationScopes).toHaveLength(4)
      expect(indexedDelegation.customDelegationScopes?.sort()).toEqual(
        [...customScopes, ...customScopesOtherDomain].sort(),
      )
    })
  })

  describe('getDelegationRecords', () => {
    const testCase = indexingTestCases.custom

    beforeEach(async () => {
      await setup(testCase)
      await delegationIndexService.indexDelegations(user)
    })

    afterEach(async () => {
      await delegationIndexMetaModel.destroy({ where: {} })
      await delegationIndexModel.destroy({ where: {} })
    })

    it('should return delegations matching multiple scopes', async () => {
      const scope1 = 'cu1' // Custom scope
      const scope2 = 'cu2' // Another custom scope
      const scopes = [scope1, scope2]

      // Act
      const result = await delegationIndexService.getDelegationRecords({
        scopes,
        nationalId: user.nationalId,
        direction: DelegationDirection.OUTGOING,
      })

      // Assert
      // Should return delegations that match either scope
      result.data.forEach((delegation) => {
        expect(delegation.toNationalId).toBe(user.nationalId)
        if (delegation.type === AuthDelegationType.Custom) {
          // Custom delegations should have at least one of the requested scopes
          expect(
            delegation.customDelegationScopes?.some((s) => scopes.includes(s)),
          ).toBe(true)
        }
      })
    })

    it('should not return delegations with scopes that are not requested', async () => {
      // Arrange
      const requestedScope = 'cu1'
      const scopes = [requestedScope]

      // Act - request only custom scope 'cu1'
      const result = await delegationIndexService.getDelegationRecords({
        scopes,
        nationalId: user.nationalId,
        direction: DelegationDirection.OUTGOING,
      })

      // Assert
      // Should only return custom delegations with the requested scope
      result.data.forEach((delegation) => {
        expect(delegation.toNationalId).toBe(user.nationalId)
        if (delegation.type === AuthDelegationType.Custom) {
          // Custom delegations should have the requested scope
          expect(delegation.customDelegationScopes).toContain(requestedScope)
        }
      })
    })

    it('should return delegations that match any of the multiple requested scopes', async () => {
      // Arrange - use scopes that exist in the test case
      const scope1 = 'cu1'
      const scope2 = 'cu2'
      const scopes = [scope1, scope2]

      // Act
      const result = await delegationIndexService.getDelegationRecords({
        scopes,
        nationalId: user.nationalId,
        direction: DelegationDirection.OUTGOING,
      })

      // Assert
      // Should return delegations matching either scope1 or scope2
      // Verify that all returned delegations have at least one of the requested scopes
      result.data.forEach((delegation) => {
        expect(delegation.toNationalId).toBe(user.nationalId)
        if (delegation.type === AuthDelegationType.Custom) {
          // Should have at least one of the requested scopes
          const hasRequestedScope = delegation.customDelegationScopes?.some(
            (s) => scopes.includes(s),
          )
          expect(hasRequestedScope).toBe(true)
        }
      })
    })

    it('should deduplicate delegations that match multiple scopes', async () => {
      // Arrange
      const scope1 = 'cu1'
      const scope2 = 'cu2'
      const scopes = [scope1, scope2]

      // Get all delegations for the user
      const allDelegations = await delegationIndexModel.findAll({
        where: { toNationalId: user.nationalId },
      })

      // Act
      const result = await delegationIndexService.getDelegationRecords({
        scopes,
        nationalId: user.nationalId,
        direction: DelegationDirection.OUTGOING,
      })

      // Assert
      // Should not have duplicate delegations (same fromNationalId, toNationalId, type)
      const uniqueDelegations = new Set(
        result.data.map(
          (d) => `${d.fromNationalId}-${d.toNationalId}-${d.type}`,
        ),
      )
      expect(uniqueDelegations.size).toBe(result.data.length)

      // Verify that delegations matching both scopes are only returned once
      const delegationsWithBothScopes = result.data.filter(
        (d) =>
          d.type === AuthDelegationType.Custom &&
          d.customDelegationScopes?.includes(scope1) &&
          d.customDelegationScopes?.includes(scope2),
      )
      // Each delegation should appear only once
      expect(delegationsWithBothScopes.length).toBeLessThanOrEqual(
        allDelegations.length,
      )
    })
  })
})
