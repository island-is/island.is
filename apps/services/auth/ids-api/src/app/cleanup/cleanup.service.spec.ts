import { getModelToken } from '@nestjs/sequelize'
import faker from 'faker'

import { Grant, SequelizeConfigService } from '@island.is/auth-api-lib'
import { setupAppWithoutAuth, TestApp } from '@island.is/testing/nest'

import { CleanupWorkerModule } from './cleanup-worker.module'
import { CleanupService } from './cleanup.service'

describe('CleanupService', () => {
  let app: TestApp
  let cleanupService: CleanupService
  let grantsModel: typeof Grant

  beforeAll(async () => {
    app = await setupAppWithoutAuth({
      AppModule: CleanupWorkerModule,
      SequelizeConfigService,
      dbType: 'postgres',
    })

    cleanupService = app.get(CleanupService)

    grantsModel = app.get(getModelToken(Grant))
  })

  beforeEach(async () => {
    await grantsModel.destroy({
      where: {},
      cascade: true,
      truncate: true,
      force: true,
    })
  })

  afterAll(async () => {
    await app?.cleanUp()
  })

  it('should remove expired grants', async () => {
    // Arrange

    // Create grants that should be deleted
    await grantsModel.create({
      key: faker.datatype.uuid(),
      type: faker.random.word(),
      subjectId: faker.datatype.uuid(),
      clientId: faker.random.word(),
      creationTime: new Date('2023-01-01'),
      data: faker.random.words(),
      expiration: new Date('2024-01-01'),
    })

    // Create grants that should remain
    await grantsModel.create({
      key: faker.datatype.uuid(),
      type: faker.random.word(),
      subjectId: faker.datatype.uuid(),
      clientId: faker.random.word(),
      creationTime: new Date('2023-01-01'),
      data: faker.random.words(),
      expiration: new Date('3024-01-01'),
    })

    // Act
    await cleanupService.run()

    // Assert
    const grants = await grantsModel.findAll()
    expect(grants).toHaveLength(1)
    // Check that all remaining grants have not expired
    expect(grants.every((s) => !s.expiration || s.expiration > new Date()))
  })
})
