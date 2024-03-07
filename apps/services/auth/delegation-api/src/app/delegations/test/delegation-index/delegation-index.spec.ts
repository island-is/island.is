import { TestApp, truncate } from '@island.is/testing/nest'
import { getConnectionToken, getModelToken } from '@nestjs/sequelize'
import { createNationalRegistryUser } from '@island.is/testing/fixtures'
import {
  DelegationsIndexService,
  DelegationIndex,
  DelegationIndexMeta,
  Delegation,
  DelegationScope,
  PersonalRepresentative,
  DelegationType,
} from '@island.is/auth-api-lib'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { indexingTestcases, prRight1 } from './delegation-index-test-cases'

import { Sequelize } from 'sequelize-typescript'
import { Type } from '@nestjs/common'
import { domainName, TestCase, user } from './delegations-index-types'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import faker from 'faker'
import { RskRelationshipsClient } from '@island.is/clients-rsk-relationships'
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
  let personalRepresentativeModel: typeof PersonalRepresentative

  const setup = async (testcase: TestCase) => {
    await truncate(sequelize)
    await factory.createDomain(testcase.domain)
    await factory.createClient(testcase.client)

    await Promise.all(
      testcase.apiScopes.map((scope) => factory.createApiScope(scope)),
    )

    // create custom delegations
    await Promise.all(
      testcase.customDelegations.map((delegation) =>
        factory.createCustomDelegation(delegation),
      ),
    )

    // create personal representation delegations
    await Promise.all(
      testcase.personalRepresentativeDelegation.map((d) =>
        factory.createPersonalRepresentativeDelegation(d),
      ),
    )

    // mock national registry for ward delegations
    jest
      .spyOn(nationalRegistryApi, 'getCustodyChildren')
      .mockImplementation(async () => testcase.fromChildren)

    // mock rsk for procuration delegations
    jest
      .spyOn(rskApi, 'getIndividualRelationships')
      .mockImplementation(async () => testcase.procuration)
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
    personalRepresentativeModel = app.get(getModelToken(PersonalRepresentative))

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
      beforeAll(async () => setup(indexingTestcases.custom))

      beforeEach(async () => {
        // remove all delegation meta and delegations
        await delegationIndexMetaModel.destroy({ where: {} })
        await delegationIndexModel.destroy({ where: {} })

        jest.useFakeTimers()
        jest.setSystemTime(testDate)
      })

      afterEach(() => {
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

    describe.each(Object.keys(indexingTestcases))(
      'Index delegations of type: %s',
      (type) => {
        const testcase = indexingTestcases[type]
        testcase.user = user

        beforeAll(async () => setup(testcase))

        it('should index delegations', async () => {
          // Act
          await delegationIndexService.indexDelegations(user)

          // Assert
          const delegations = await delegationIndexModel.findAll()

          expect(delegations.length).toBe(testcase.expectedFrom.length)
          delegations.forEach((delegation) => {
            expect(testcase.expectedFrom).toContain(delegation.fromNationalId)
            expect(delegation.toNationalId).toBe(user.nationalId)
          })
        })
      },
    )

    describe('Reindex (multiple indexing)', () => {
      const testcase = indexingTestcases.custom

      beforeAll(async () => setup(testcase))

      beforeEach(async () => {
        // remove all data
        await delegationIndexMetaModel.destroy({ where: {} })
        await delegationIndexModel.destroy({ where: {} })
        await delegationModel.destroy({ where: {} })
        await delegationScopeModel.destroy({ where: {} })

        // create custom delegations
        await Promise.all(
          testcase.customDelegations.map((delegation) =>
            factory.createCustomDelegation(delegation),
          ),
        )
      })

      it('should not duplicate delegations on reindex', async () => {
        // Act
        await delegationIndexService.indexDelegations(user)
        await delegationIndexService.indexDelegations(user)

        // Assert
        const delegations = await delegationIndexModel.findAll({
          where: {
            toNationalId: user.nationalId,
          },
        })

        expect(delegations.length).toBe(testcase.expectedFrom.length)
      })

      it('should remove delegations from index that are no longer valid', async () => {
        // Act
        await delegationIndexService.indexDelegations(user)

        const fromNationalId = testcase.customDelegations[0].fromNationalId
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
            type: DelegationType.Custom,
          },
        })

        expect(delegations.length).toBe(testcase.expectedFrom.length - 1)
        expect(deletedDelegation).toBeNull()
      })

      it('should update delegation index item if delegation has changed', async () => {
        // Act
        await delegationIndexService.indexDelegations(user)

        const fromNationalId = testcase.customDelegations[0].fromNationalId
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

        const fromNationalId = testcase.customDelegations[0].fromNationalId
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
        const fromNationalId = testcase.customDelegations[0].fromNationalId
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
    const testcase = indexingTestcases.custom

    beforeAll(async () => setup(testcase))

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

      expect(delegations.length).toEqual(testcase.expectedFrom.length)
      delegations.forEach((delegation) => {
        expect(testcase.expectedFrom).toContain(delegation.fromNationalId)
        expect(delegation.toNationalId).toBe(user.nationalId)
      })
    })
  })

  describe('indexRepresentativeDelegations', () => {
    const testcase = indexingTestcases.personalRepresentative

    beforeAll(async () => setup(testcase))

    beforeEach(async () => {
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

      expect(delegations.length).toEqual(testcase.expectedFrom.length)
      delegations.forEach((delegation) => {
        expect(testcase.expectedFrom).toContain(delegation.fromNationalId)
        expect(delegation.toNationalId).toBe(user.nationalId)
        expect(delegation.type).toBe(
          `${DelegationType.PersonalRepresentative}:${prRight1}`,
        )
      })
    })

    it('should create delegation index item for each right of personal representative delegation', async () => {
      // Arrange
      const personalRepresentative = await personalRepresentativeModel.findOne({
        where: {
          nationalIdPersonalRepresentative: user.nationalId,
        },
      })
      const prRight2 = 'prRight2'

      // Add new delegation right to existing personal representation delegation
      if (personalRepresentative) {
        const rightType = await factory.createPersonalRepresentativeRightType({
          code: prRight2,
        })
        await factory.createPersonalRepresentativeRight({
          rightTypeCode: rightType.code,
          personalRepresentativeId: personalRepresentative.id,
        })
      }

      // Act
      await delegationIndexService.indexRepresentativeDelegations(
        user.nationalId,
      )

      // Assert
      const delegations = await delegationIndexModel.findAll({
        where: {
          toNationalId: user.nationalId,
        },
      })
      expect(delegations.length).toEqual(2)
      expect(
        delegations.find(
          (d) =>
            d.type === `${DelegationType.PersonalRepresentative}:${prRight1}`,
        ),
      ).toBeDefined()
      expect(
        delegations.find(
          (d) =>
            d.type === `${DelegationType.PersonalRepresentative}:${prRight2}`,
        ),
      ).toBeDefined()
    })
  })
})
