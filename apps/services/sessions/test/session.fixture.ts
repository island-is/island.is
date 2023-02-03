import faker from 'faker'

import { createNationalId, NationalIdType } from '@island.is/testing/fixtures'

import { CreateSessionDto } from '../src/app/sessions/create-session.dto'

export interface CreateSessionDtoOptions {
  subjectType?: NationalIdType
  actorNationalId?: string
  subjectNationalId?: string
}

export const createSessionDto = (
  options?: CreateSessionDtoOptions,
): CreateSessionDto => ({
  id: faker.datatype.uuid(),
  actorNationalId: options?.actorNationalId ?? createNationalId('person'),
  subjectNationalId:
    options?.subjectNationalId ??
    createNationalId(options?.subjectType ?? 'person'),
  clientId: faker.random.word(),
  timestamp: faker.datatype.datetime(),
  userAgent: faker.internet.userAgent(),
  ip: faker.internet.ip(),
})
