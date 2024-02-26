import { TestApp, truncate } from '@island.is/testing/nest'

import { getConnectionToken, getModelToken } from '@nestjs/sequelize'

import { createNationalRegistryUser } from '@island.is/testing/fixtures'
import {
  DelegationsIndexService,
  DelegationIndex,
  DelegationIndexMeta,
} from '@island.is/auth-api-lib'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { indexingTestcases } from './delegation-index-test-cases'
import { setupWithAuth } from '../../../../test/setup'
import { Sequelize } from 'sequelize-typescript'
import { Type } from '@nestjs/common'
import { user } from './delegations-filters-types'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import faker from 'faker'
import { RskRelationshipsClient } from '@island.is/clients-rsk-relationships'

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

  beforeAll(async () => {
    app = await setupWithAuth({
      user: user,
    })

    delegationIndexService = app.get(DelegationsIndexService)

    delegationIndexModel = app.get(getModelToken(DelegationIndex))
    delegationIndexMetaModel = app.get(getModelToken(DelegationIndexMeta))

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

  beforeEach(async () => {
    const mockedDate = testDate

    jest.useFakeTimers()
    jest.setSystemTime(mockedDate)

    // remove all delegation meta and delegations
    await delegationIndexMetaModel.destroy({ where: {} })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('indexDelegations', () => {
    describe('should reindex', () => {
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
    })

    describe('delegation index meta logic', () => {
      it('should set nextReindex to week in the future after successful reindex', async () => {
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

        beforeAll(async () => {
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
        })

        it('should index delegations', async () => {
          // Act
          await delegationIndexService.indexDelegations(user)

          // Assert
          const delegations = await delegationIndexModel.findAll()

          expect(delegations.length).toBe(testcase.expectedFrom.length)
          delegations.forEach((delegation) => {
            expect(testcase.expectedFrom).toContain(delegation.fromNationalId)
          })
        })
      },
    )
  })
})
