import { createNationalId } from '@island.is/testing/fixtures'
import { setupAppWithoutAuth, TestApp } from '@island.is/testing/nest'

import { FixtureFactory } from '../../../test/fixture.factory'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { Session } from '../sessions/session.model'
import { SessionsCleanupWorkerModule } from './cleanup-worker.module'
import { SessionsCleanupService } from './cleanup-worker.service'

describe('SessionsService', () => {
  let app: TestApp
  let sessionsCleanupService: SessionsCleanupService
  let factory: FixtureFactory

  beforeAll(async () => {
    app = await setupAppWithoutAuth({
      AppModule: SessionsCleanupWorkerModule,
      SequelizeConfigService,
      dbType: 'sqlite',
    })
    factory = new FixtureFactory(app)

    sessionsCleanupService = app.get(SessionsCleanupService)
  })

  beforeEach(async () => {
    await factory.get(Session).destroy({
      where: {},
      cascade: true,
      truncate: true,
      force: true,
    })
  })

  afterAll(async () => {
    await app?.cleanUp()
  })

  it('should remove old enough session records', async () => {
    // Arrange

    // Create sessions that should be deleted
    await factory.createDateSessions(
      createNationalId('person'),
      new Date('2023-01-01'),
      new Date('2023-02-01'),
    )

    // Create sessions that should remain
    await factory.createDateSessions(
      createNationalId('person'),
      new Date('3023-01-01'),
      new Date('3023-02-01'),
    )

    // Act
    await sessionsCleanupService.run()

    // Assert
    const sessions = await factory.get(Session).findAll()
    expect(sessions).toHaveLength(5)
    // Check that all remaining sessions are newer than the cutoff date
    expect(sessions.every((s) => s.timestamp > new Date('2023-02-01')))
  })
})
