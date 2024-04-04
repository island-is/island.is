import { Module, Type } from '@nestjs/common'
import {
  SequelizeModule,
  getModelToken,
  getConnectionToken,
} from '@nestjs/sequelize'
import assert from 'assert'
import faker from 'faker'
import { Sequelize } from 'sequelize-typescript'

import {
  TestApp,
  testServer,
  truncate,
  useDatabase,
} from '@island.is/testing/nest'
import { createNationalId } from '@island.is/testing/fixtures'
import { AuthDelegationType } from '@island.is/shared/types'

import { SequelizeConfigService } from '../core/sequelizeConfig.service'
import { Claim } from './models/claim.model'
import { UserIdentitiesModule } from './user-identities.module'
import {
  actorSubjectIdType,
  audkenniProvider,
  delegationProvider,
  UserIdentitiesService,
} from './user-identities.service'
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
  let userIdentityModel: typeof UserIdentity
  let sequelize: Sequelize

  beforeAll(async () => {
    app = await testServer({
      appModule: TestModule,
      hooks: [
        // SQLite doesn't support two transactions at a time, so we use postgres here
        // to be able to test parallel requests. Starting postgres is done in ../test/globalSetup.ts.
        useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
      ],
    })

    sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)

    userIdentitiesService = app.get(UserIdentitiesService)
    claimModel = app.get(getModelToken(Claim))
    userIdentityModel = app.get(getModelToken(UserIdentity))

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
        value: AuthDelegationType.ProcurationHolder,
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

  describe('findOrCreateSubjectId', () => {
    const userIdentitySubjectId1 = faker.datatype.uuid()
    const toNationalId = createNationalId('person')

    beforeAll(async () => {
      // User identity with audkenni provider
      await userIdentitiesService.create({
        subjectId: userIdentitySubjectId1,
        name: faker.name.findName(),
        providerName: audkenniProvider,
        providerSubjectId: `IS-${toNationalId}`,
        active: true,
      })
    })

    afterAll(async () => {
      await truncate(sequelize)
    })

    it('should throw NotFoundException if actor (toNationalId) not found', async () => {
      // Arrange
      const fromNationalId = createNationalId('person')
      const toNationalId = createNationalId('person')

      // Act
      const act = async () =>
        userIdentitiesService.findOrCreateSubjectId({
          fromNationalId,
          toNationalId,
        })

      // Assert
      await expect(act()).rejects.toThrowError('Actor not found')
    })

    it('should return subjectId if delegation exists', async () => {
      // Arrange
      const fromNationalId = createNationalId('person')
      const userIdentitySubjectId2 = faker.datatype.uuid()

      // User identity with delegation provider
      await userIdentitiesService.create({
        subjectId: userIdentitySubjectId2,
        name: faker.name.findName(),
        providerName: delegationProvider,
        providerSubjectId: `IS-${fromNationalId}`,
        active: true,
      })

      // subject id claim
      await claimModel.create({
        subjectId: userIdentitySubjectId2,
        type: actorSubjectIdType,
        value: userIdentitySubjectId1,
        valueType: faker.random.word(),
        issuer: faker.random.word(),
        originalIssuer: faker.random.word(),
      })

      // Act
      const subjectId = await userIdentitiesService.findOrCreateSubjectId({
        toNationalId,
        fromNationalId,
      })

      // Assert
      expect(subjectId).toEqual(userIdentitySubjectId2)
    })

    it('should create subjectId if delegation does not exist', async () => {
      // Arrange
      const fromNationalId = createNationalId('person')

      // Act
      const subjectId = await userIdentitiesService.findOrCreateSubjectId({
        toNationalId,
        fromNationalId,
      })

      const delegation = await userIdentityModel.findOne({
        where: {
          providerName: delegationProvider,
          providerSubjectId: `IS-${fromNationalId}`,
        },
        include: [
          {
            model: Claim,
            where: { type: actorSubjectIdType, value: userIdentitySubjectId1 },
          },
        ],
      })

      // Assert
      expect(subjectId).not.toBeNull()
      expect(delegation).not.toBeNull()
      expect(delegation?.subjectId).toEqual(subjectId)
      expect(delegation?.claims).toHaveLength(1)
      expect(delegation?.claims?.[0]?.issuer).toEqual('delegationindex')
      expect(delegation?.claims?.[0]?.originalIssuer).toEqual('delegationindex')
    })

    it('should return null if creating delegation fails', async () => {
      // Arrange
      const fromNationalId = createNationalId('person')

      // make create fail
      jest
        .spyOn(userIdentitiesService, 'create')
        .mockResolvedValueOnce(undefined)

      // Act
      const subjectId = await userIdentitiesService.findOrCreateSubjectId({
        toNationalId,
        fromNationalId,
      })

      // Assert
      expect(subjectId).toBeNull()
    })
  })
})
