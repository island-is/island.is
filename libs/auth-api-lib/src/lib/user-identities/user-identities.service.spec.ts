import { Module } from '@nestjs/common'
import { SequelizeModule, getModelToken } from '@nestjs/sequelize'
import assert from 'assert'
import faker from 'faker'

import { startPostgres } from '@island.is/testing/containers'
import { TestApp, testServer, useDatabase } from '@island.is/testing/nest'

import { SequelizeConfigService } from '../core/sequelizeConfig.service'
import { DelegationType } from '../delegations/types/delegationType'
import { Claim } from './models/claim.model'
import { UserIdentitiesModule } from './user-identities.module'
import { UserIdentitiesService } from './user-identities.service'
import { ClaimDto } from './dto/claim.dto'
import { UserIdentity } from './models/user-identity.model'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    UserIdentitiesModule,
  ],
})
class TestModule {}

const subjectId = faker.datatype.uuid()
const claimBase: Omit<ClaimDto, 'type' | 'value'> = {
  valueType: faker.random.word(),
  issuer: faker.random.word(),
  originalIssuer: faker.random.word(),
}

describe('UserIdentitiesServices', () => {
  let app: TestApp
  let userIdentitiesService: UserIdentitiesService
  let claimModel: typeof Claim

  beforeAll(async () => {
    app = await testServer({
      appModule: TestModule,
      hooks: [
        // SQLite doesn't support two transactions at a time so we use postgres here
        // to be able to test parallel requests. Starting postgres is done in ../test/globalSetup.ts.
        useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
      ],
    })

    userIdentitiesService = app.get(UserIdentitiesService)
    claimModel = app.get(getModelToken(Claim))

    const createdIdentity = await userIdentitiesService.create({
      subjectId,
      name: faker.name.findName(),
      providerName: faker.random.word(),
      providerSubjectId: faker.datatype.uuid(),
      active: true,
    })
    assert(createdIdentity)
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  describe('updateClaims', () => {
    const mockClaims: ClaimDto[] = [
      {
        ...claimBase,
        type: 'email',
        value: faker.internet.email(),
      },
      {
        ...claimBase,
        type: 'name',
        value: faker.name.findName(),
      },
      {
        ...claimBase,
        type: 'delegation',
        value: DelegationType.ProcurationHolder,
      },
    ]

    beforeEach(async () => {
      // Arrange before each test case that there exists claims in the DB
      const claims = await claimModel.bulkCreate(
        mockClaims.map((c) => ({ ...c, subjectId })),
      )
      assert(claims.length === mockClaims.length)
    })

    afterEach(async () => {
      // Restore DB after each test case to be empty
      await claimModel.destroy({ truncate: true })
    })

    it('should update claims and correctly remove missing claims', async () => {
      // Arrange
      const newClaims: ClaimDto[] = mockClaims.slice(0, 2)

      // Act
      await userIdentitiesService.updateClaims(subjectId, newClaims)

      // Assert
      const updatedClaims = await claimModel.findAll({
        where: { subjectId },
      })
      expect(updatedClaims).toHaveLength(2)
      expect(
        updatedClaims.map((c) => ({ type: c.type, value: c.value })),
      ).toEqual(
        expect.arrayContaining(
          newClaims.map((c) => ({ type: c.type, value: c.value })),
        ),
      )
    })

    it('should succeed with parallel request', async () => {
      // Arrange
      const mockClaim1: ClaimDto = {
        ...claimBase,
        type: 'name',
        value: faker.name.findName(),
      }
      const mockClaim2: ClaimDto = {
        ...claimBase,
        type: 'name',
        value: faker.name.findName(),
      }

      // Act
      const act = async () =>
        Promise.all([
          userIdentitiesService.updateClaims(subjectId, [mockClaim1]),
          userIdentitiesService.updateClaims(subjectId, [mockClaim2]),
        ])

      // Assert
      await expect(act()).resolves.not.toThrow()
    })

    it('should remove all claims if empty array is passed', async () => {
      // Act
      await userIdentitiesService.updateClaims(subjectId, [])

      // Assert
      const updatedClaims = await claimModel.findAll({
        where: { subjectId },
      })
      expect(updatedClaims).toHaveLength(0)
    })
  })
})
