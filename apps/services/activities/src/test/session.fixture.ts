import faker from 'faker'
import { SessionDto } from '../../src/app/sessions/session.dto'

export const createRandomSession = (actorNationalId: string): SessionDto => {
  return {
    actorNationalId: actorNationalId,
    subjectNationalId: faker.datatype.string(10),
    clientId: faker.random.word(),
    timestamp: new Date(),
    sessionId: faker.random.word(),
    userAgent: faker.internet.userAgent(),
    ip: faker.internet.ip(),
  }
}
