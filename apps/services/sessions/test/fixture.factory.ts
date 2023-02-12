import { getModelToken } from '@nestjs/sequelize'
import { Model } from 'sequelize-typescript'

import { TestApp } from '@island.is/testing/nest'

import { Session } from '../src/app/sessions/session.model'
import { createSessionDto } from './session.fixture'

export class FixtureFactory {
  constructor(private app: TestApp) {}

  get<T extends new () => Model>(model: T): T {
    return this.app.get(getModelToken(model))
  }

  createSessions(authenticatedUserNationalId: string): Promise<Session[]> {
    const range = [...Array(50).keys()]

    const userAsSelf = range.map(() =>
      createSessionDto({
        actorNationalId: authenticatedUserNationalId,
        subjectNationalId: authenticatedUserNationalId,
      }),
    )

    const userAsPerson = range.map(() =>
      createSessionDto({
        actorNationalId: authenticatedUserNationalId,
      }),
    )

    const userAsCompany = range.map(() =>
      createSessionDto({
        actorNationalId: authenticatedUserNationalId,
        subjectType: 'company',
      }),
    )

    const personAsUser = range.map(() =>
      createSessionDto({
        subjectNationalId: authenticatedUserNationalId,
      }),
    )

    const otherSessions = range.map(() => createSessionDto())

    return this.get(Session).bulkCreate([
      ...userAsSelf,
      ...userAsPerson,
      ...userAsCompany,
      ...personAsUser,
      ...otherSessions,
    ])
  }
}
