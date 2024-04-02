import { getConnectionToken, getModelToken } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { Type } from '@nestjs/common'
import faker from 'faker'

import { TestApp, truncate } from '@island.is/testing/nest'
import { createNationalRegistryUser } from '@island.is/testing/fixtures'
import {
  DelegationsIndexService,
  DelegationIndex,
  DelegationIndexMeta,
  Delegation,
  DelegationScope,
} from '@island.is/auth-api-lib'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { RskRelationshipsClient } from '@island.is/clients-rsk-relationships'
import { AuthDelegationType } from '@island.is/shared/types'

import { indexingTestCases, prRight1 } from './delegation-index-test-cases'
import { domainName, TestCase, user } from './delegations-index-types'
import { setupWithAuth } from '../../../../../test/setup'

const testDate = new Date(2024, 2, 1)

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

  const setup = async (testCase: TestCase) => {
    await truncate(sequelize)
    await factory.createDomain(testCase.domain)
    await factory.createClient(testCase.client)

    await Promise.all(
      testCase.apiScopes.map((scope) => factory.createApiScope(scope)),
    )

    // create custom delegations
    await Promise.all(
      testCase.customDelegations.map((delegation) =>
        factory.createCustomDelegation(delegation),
      ),
    )

    // create personal representation delegations
    await Promise.all(
      testCase.personalRepresentativeDelegation.map((d) =>
        factory.createPersonalRepresentativeDelegation(d),
      ),
    )

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
      beforeAll(async () => setup(indexingTestCases.custom))

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

        beforeEach(async () => setup(testCase))

        it('should index delegations', async () => {
          // Act
          await delegationIndexService.indexDelegations(user)

          // Assert
          const delegations = await delegationIndexModel.findAll()

          expect(delegations.length).toBe(testCase.expectedFrom.length)
          delegations.forEach((delegation) => {
            expect(testCase.expectedFrom).toContain(delegation.fromNationalId)
            expect(delegation.toNationalId).toBe(user.nationalId)
          })
        })
      },
    )

    describe('Reindex (multiple indexing)', () => {
      const testCase = indexingTestCases.custom

      beforeEach(async () => setup(testCase))

      it('should not duplicate delegations on reindex', async () => {
        // Act
        await delegationIndexService.indexDelegations(user)

        try {
          await delegationIndexService.indexDelegations(user)
        } catch (error) {
          console.log(error)
        }

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

    beforeAll(async () => setup(testCase))

    it('should index custom delegations', async () => {
      // Arrange
      const nationalId = user.nationalId

      // Act
      await delegationIndexService.indexCustomDelegations(nationalId)

      // Assert
      const delegations = await delegationIndexModel.findAll({
        where: {
          toNationalId: nationalId,
        },
      })

      expect(delegations.length).toEqual(testCase.expectedFrom.length)
      delegations.forEach((delegation) => {
        expect(testCase.expectedFrom).toContain(delegation.fromNationalId)
        expect(delegation.toNationalId).toBe(user.nationalId)
      })
    })
  })

  describe('indexRepresentativeDelegations', () => {
    const testCase = indexingTestCases.personalRepresentative

    beforeAll(async () => setup(testCase))

    afterEach(async () => {
      // remove all data
      await delegationIndexMetaModel.destroy({ where: {} })
      await delegationIndexModel.destroy({ where: {} })
    })

    it('should index personal representation delegations', async () => {
      // Arrange
      const nationalId = user.nationalId

      // Act
      await delegationIndexService.indexRepresentativeDelegations(nationalId)

      // Assert
      const delegations = await delegationIndexModel.findAll({
        where: {
          toNationalId: nationalId,
        },
      })

      expect(delegations.length).toEqual(testCase.expectedFrom.length)
      delegations.forEach((delegation) => {
        expect(testCase.expectedFrom).toContain(delegation.fromNationalId)
        expect(delegation.toNationalId).toBe(user.nationalId)
        expect(delegation.type).toBe(
          `${AuthDelegationType.PersonalRepresentative}:${prRight1}`,
        )
      })
    })
  })
})
