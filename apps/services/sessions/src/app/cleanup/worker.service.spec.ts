import { createNationalId } from '@island.is/testing/fixtures'
import { TestApp, testServer, useDatabase } from '@island.is/testing/nest'

import { FixtureFactory } from '../../../test/fixture.factory'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { Session } from '../sessions/session.model'
import { SessionsCleanupWorkerModule } from './worker.module'
import { SessionsCleanupService } from './worker.service'

const setupWithoutAuth = async (): Promise<TestApp> =>
  testServer({
    appModule: SessionsCleanupWorkerModule,
    enableVersioning: true,
    hooks: [useDatabase({ type: 'sqlite', provider: SequelizeConfigService })],
  })

describe('SessionsService', () => {
  let app: TestApp
  let sessionsCleanupService: SessionsCleanupService
  let factory: FixtureFactory

  beforeAll(async () => {
    app = await setupWithoutAuth()
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

  it('should', async () => {
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
    expect(sessions.every((s) => s.timestamp > new Date('2023-02-01')))
  })
})
