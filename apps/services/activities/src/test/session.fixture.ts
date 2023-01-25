import faker from 'faker'
import { CreateSessionDto } from '../app/sessions/create-session.dto'

export const createRandomSession = (
  actorNationalId: string,
): CreateSessionDto => {
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
