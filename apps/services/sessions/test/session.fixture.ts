import faker from 'faker'

import { CreateSessionDto } from '../src/app/sessions/create-session.dto'

export const createRandomSession = (
  actorNationalId: string,
): CreateSessionDto => ({
  id: faker.random.word(),
  actorNationalId: actorNationalId,
  subjectNationalId: faker.datatype.string(10),
  clientId: faker.random.word(),
  timestamp: new Date(),
  userAgent: faker.internet.userAgent(),
  ip: faker.internet.ip(),
})
