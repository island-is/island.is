import { faker } from '@faker-js/faker'

import { createNationalId, NationalIdType } from '@island.is/testing/fixtures'

import { CreateSessionDto } from '../src/app/sessions/create-session.dto'

export interface CreateSessionDtoOptions {
  subjectType?: NationalIdType
  actorNationalId?: string
  subjectNationalId?: string
  timestamp?: Date
}

export const createSessionDto = (
  options?: CreateSessionDtoOptions,
): CreateSessionDto => ({
  sessionId: faker.string.uuid(),
  actorNationalId: options?.actorNationalId ?? createNationalId('person'),
  subjectNationalId:
    options?.subjectNationalId ??
    createNationalId(options?.subjectType ?? 'person'),
  clientId: faker.word.sample(),
  timestamp: options?.timestamp ?? faker.date.anytime(),
  userAgent: faker.internet.userAgent(),
  ip: faker.internet.ip(),
})
