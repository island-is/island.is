import { Module, Type } from '@nestjs/common'
import {
  getConnectionToken,
  getModelToken,
  SequelizeModule,
} from '@nestjs/sequelize'
import faker from 'faker'
import { Sequelize } from 'sequelize-typescript'

import { TestApp, testServer, useDatabase } from '@island.is/testing/nest'

import { SequelizeConfigService } from '../core/sequelizeConfig.service'
import { SessionDto } from './dto/session.dto'
import { Session } from './models/session.model'
import { SessionsModule } from './sessions.module'
import { SessionsService } from './sessions.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SessionsModule,
  ],
})
class TestModule {}

const createSessionDto = (expires?: Date): SessionDto => {
  return {
    key: faker.random.alpha({ count: 40 }),
    scheme: faker.random.word(),
    subjectId: faker.random.alpha({ count: 40 }),
    sessionId: faker.random.alpha({ count: 40 }),
    created: new Date(),
    renewed: new Date(),
    expires: expires ?? new Date(),
    ticket: faker.lorem.paragraph(),
    actorSubjectId: faker.random.alpha({ count: 40 }),
  }
}

describe('SessionsService', () => {
  let app: TestApp
  let sessionsService: SessionsService
  let sessionModel: typeof Session
  let sequelize: Sequelize

  beforeAll(async () => {
    app = await testServer({
      appModule: TestModule,
      hooks: [
        useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
      ],
    })

    sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)

    sessionsService = app.get(SessionsService)
    sessionModel = app.get(getModelToken(Session))
  })

  afterEach(async () => {
    await sequelize.transaction(async (transaction) => {
      await sessionModel.destroy({ where: {}, transaction })
    })
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  it('should create session', async () => {
    const sessionDto = createSessionDto()
    await sessionsService.create(sessionDto)

    const session = await sessionModel.findByPk(sessionDto.key)
    expect(session).toBeDefined()
  })

  it('should get session by key', async () => {
    const sessionDto = createSessionDto()
    await sessionsService.create(sessionDto)

    const session = await sessionsService.findOne(sessionDto.key)
    expect(session).toBeDefined()
  })

  it('should get session by sessionId', async () => {
    const sessionDto = createSessionDto()
    await sessionsService.create(sessionDto)

    const session = await sessionsService.findMany({
      sessionId: sessionDto.sessionId,
    })
    expect(session[0]).toBeDefined()
  })

  it('should get session by subjectId', async () => {
    const sessionDto = createSessionDto()
    await sessionsService.create(sessionDto)

    const session = await sessionsService.findMany({
      subjectId: sessionDto.subjectId,
    })
    expect(session[0]).toBeDefined()
  })

  it('should get session by actorSubjectId', async () => {
    const sessionDto = createSessionDto()
    await sessionsService.create(sessionDto)

    const session = await sessionsService.findMany({
      actorSubjectId: sessionDto.actorSubjectId,
    })
    expect(session[0]).toBeDefined()
  })

  it('get should throw if filter invalid', async () => {
    const sessionDto = createSessionDto()
    await sessionsService.create(sessionDto)

    expect(async () => {
      await sessionsService.findMany({})
    }).rejects.toThrow()
  })

  it('should delete session by key', async () => {
    const sessionDto = createSessionDto()
    await sessionsService.create(sessionDto)

    expect(await sessionModel.count()).toBe(1)

    await sessionsService.delete(sessionDto.key)

    expect(await sessionModel.count()).toBe(0)
  })

  it('should delete session by sessionid', async () => {
    const sessionDto = createSessionDto()
    await sessionsService.create(sessionDto)

    expect(await sessionModel.count()).toBe(1)

    await sessionsService.deleteMany({
      sessionId: sessionDto.sessionId,
    })

    expect(await sessionModel.count()).toBe(0)
  })

  it('should delete session by actorSubjectId', async () => {
    const sessionDto = createSessionDto()
    await sessionsService.create(sessionDto)

    expect(await sessionModel.count()).toBe(1)

    await sessionsService.deleteMany({
      subjectId: sessionDto.subjectId,
    })

    expect(await sessionModel.count()).toBe(0)
  })

  it('should delete session by actorSubjectId', async () => {
    const sessionDto = createSessionDto()
    await sessionsService.create(sessionDto)

    expect(await sessionModel.count()).toBe(1)

    await sessionsService.deleteMany({
      actorSubjectId: sessionDto.actorSubjectId,
    })

    expect(await sessionModel.count()).toBe(0)
  })

  it('delete should throw if filter invalid', async () => {
    const sessionDto = createSessionDto()
    await sessionsService.create(sessionDto)

    expect(async () => {
      await sessionsService.deleteMany({})
    }).rejects.toThrow()
  })

  it('should update session expired date', async () => {
    const sessionDto = createSessionDto()
    await sessionsService.create(sessionDto)

    await sessionsService.update({
      ...sessionDto,
      expires: new Date('2024-01-01'),
    })

    const session = await sessionModel.findByPk(sessionDto.key)
    expect(session).toBeDefined()
    expect(session?.expires).toStrictEqual(new Date('2024-01-01'))
  })

  it('should update session ticket', async () => {
    const sessionDto = createSessionDto()
    await sessionsService.create(sessionDto)

    await sessionsService.update({
      ...sessionDto,
      ticket: 'abc',
    })

    const session = await sessionModel.findByPk(sessionDto.key)
    expect(session).toBeDefined()
    expect(session?.data).toStrictEqual('abc')
  })

  it('should delete expired session', async () => {
    await sessionsService.create(createSessionDto(new Date('2024-01-01')))

    expect(await sessionModel.count()).toBe(1)

    const sessions = await sessionsService.getAndRemoveExpired({ count: 1 })

    expect(await sessionModel.count()).toBe(0)
    expect(sessions.length).toBe(1)
  })

  it('should delete correct count of expired session', async () => {
    await sessionsService.create(createSessionDto(new Date('2024-01-01')))
    await sessionsService.create(createSessionDto(new Date('2024-01-01')))

    expect(await sessionModel.count()).toBe(2)

    const sessions = await sessionsService.getAndRemoveExpired({ count: 1 })

    expect(await sessionModel.count()).toBe(1)
    expect(sessions.length).toBe(1)
  })

  it('should not delete non-expired session', async () => {
    const aYearFromNow = new Date()
    aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1)
    await sessionsService.create(createSessionDto(aYearFromNow))

    expect(await sessionModel.count()).toBe(1)

    const sessions = await sessionsService.getAndRemoveExpired({ count: 1 })

    expect(await sessionModel.count()).toBe(1)
    expect(sessions.length).toBe(0)
  })
})
