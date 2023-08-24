import { getQueueToken } from '@nestjs/bull'
import assert from 'assert'
import faker from 'faker'
import sortBy from 'lodash/sortBy'
import request from 'supertest'

import { ApiScope, SessionsScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import { AuthDelegationType } from '@island.is/shared/types'
import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  getRequestMethod,
  TestApp,
  TestEndpointOptions,
} from '@island.is/testing/nest'

import { FixtureFactory } from '../../../test/fixture.factory'
import { createSessionDto } from '../../../test/session.fixture'
import {
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutPermission,
} from '../../../test/setup'
import { sessionsQueueName } from '../sessions.config'
import { Session } from './session.model'

const filterRelatedSession = (user: User, otherUser?: string) => {
  const nationalId = user.nationalId

  return (session: Session) =>
    (session.actorNationalId === nationalId &&
      (!otherUser || session.subjectNationalId === otherUser)) ||
    (session.subjectNationalId === nationalId &&
      (!otherUser || session.actorNationalId === otherUser))
}

describe('SessionsController', () => {
  describe('with the authenticated user', () => {
    const user = createCurrentUser({
      scope: [ApiScope.internal, SessionsScope.sessionsWrite],
      nationalIdType: 'person',
    })

    describe('Parameter support and pagination', () => {
      let app: TestApp
      let server: request.SuperTest<request.Test>
      let sessionsQueueAddSpy: jest.SpyInstance
      let factory: FixtureFactory
      let sessions: Session[]

      beforeAll(async () => {
        // Arrange
        app = await setupWithAuth({ user })

        factory = new FixtureFactory(app)
        sessions = await factory.createSessions(user.nationalId)

        const sessionsQueue = app.get(getQueueToken(sessionsQueueName))
        sessionsQueueAddSpy = jest
          .spyOn(sessionsQueue, 'add')
          .mockImplementation(() => Promise.resolve({ id: 1 }))

        server = request(app.getHttpServer())
      })

      beforeEach(() => {
        sessionsQueueAddSpy.mockClear()
      })

      afterAll(() => {
        app.cleanUp()
      })

      it('GET /v1/me/sessions should return first page of user sessions in descending order', async () => {
        // Act
        const res = await server.get(`/v1/me/sessions`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body.data.every(filterRelatedSession(user)))
        expect(res.body.data).toMatchObject(
          sortBy(sessions, 'timestamp')
            .reverse()
            .filter(filterRelatedSession(user))
            .map((session) => ({
              sessionId: session.sessionId,
              actorNationalId: session.actorNationalId,
              subjectNationalId: session.subjectNationalId,
              clientId: session.clientId,
              timestamp: session.timestamp.toISOString(),
              userAgent: session.userAgent,
              ip: session.ip,
            }))
            .slice(0, 10),
        )
        expect(res.body.totalCount).toEqual(
          sessions.filter(filterRelatedSession(user)).length,
        )
      })

      it('GET /v1/me/sessions should support forward cursor based pagination', async () => {
        // Act
        const res1 = await server.get(`/v1/me/sessions`)
        const res2 = await server.get(
          `/v1/me/sessions?after=${res1.body.pageInfo.endCursor}`,
        )

        // Assert
        expect(res1.status).toEqual(200)
        expect(res2.status).toEqual(200)
        expect(res2.body.data.every(filterRelatedSession(user)))
        expect(res2.body.data).toMatchObject(
          sortBy(sessions, 'timestamp')
            .reverse()
            .filter(filterRelatedSession(user))
            .map((session) => ({ id: session.id }))
            .slice(10, 20),
        )
      })

      it('GET /v1/me/sessions should support backward cursor based pagination', async () => {
        // Act
        const res1 = await server.get(`/v1/me/sessions`)
        const res2 = await server.get(
          `/v1/me/sessions?after=${res1.body.pageInfo.endCursor}`,
        )
        const res3 = await server.get(
          `/v1/me/sessions?before=${res2.body.pageInfo.startCursor}`,
        )

        // Assert
        expect(res1.status).toEqual(200)
        expect(res2.status).toEqual(200)
        expect(res3.status).toEqual(200)
        expect(
          res3.body.data.every(
            (session: Session) => session.actorNationalId === user.nationalId,
          ),
        )
        expect(res3.body.data).toMatchObject(
          sortBy(sessions, 'timestamp')
            .reverse()
            .filter(filterRelatedSession(user))
            .map((session) => ({ id: session.id }))
            .slice(0, 10),
        )
      })

      it('GET /v1/me/sessions should support limit parameter', async () => {
        // Act
        const res1 = await server.get(`/v1/me/sessions`)
        const res2 = await server.get(
          `/v1/me/sessions?after=${res1.body.pageInfo.endCursor}&limit=5`,
        )

        // Assert
        expect(res1.status).toEqual(200)
        expect(res2.status).toEqual(200)
        expect(
          res2.body.data.every(
            (session: Session) => session.actorNationalId === user.nationalId,
          ),
        )
        expect(res2.body.data).toMatchObject(
          sortBy(sessions, 'timestamp')
            .reverse()
            .filter(filterRelatedSession(user))
            .map((session) => ({ id: session.id }))
            .slice(10, 15),
        )
      })

      it('GET /v1/me/sessions should limit limit parameter', async () => {
        // Act
        const res1 = await server.get(`/v1/me/sessions`)
        const res2 = await server.get(
          `/v1/me/sessions?after=${res1.body.pageInfo.endCursor}&limit=200`,
        )

        // Assert
        expect(res1.status).toEqual(200)
        expect(res2.status).toEqual(200)
        expect(
          res2.body.data.every(
            (session: Session) => session.actorNationalId === user.nationalId,
          ),
        )
        expect(res2.body.data).toMatchObject(
          sortBy(sessions, 'timestamp')
            .reverse()
            .filter(filterRelatedSession(user))
            .map((session) => ({ id: session.id }))
            .slice(10, 110),
        )
      })

      it('GET /v1/me/sessions should support order parameter', async () => {
        // Act
        const res = await server.get(`/v1/me/sessions?order=ASC`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body.data.every(filterRelatedSession(user)))
        expect(res.body.data).toMatchObject(
          sortBy(sessions, 'timestamp')
            .filter(filterRelatedSession(user))
            .map((session) => ({ id: session.id }))
            .slice(0, 10),
        )
        expect(res.body.totalCount).toEqual(
          sessions.filter(filterRelatedSession(user)).length,
        )
      })

      it('GET /v1/me/sessions should support otheruser parameter', async () => {
        // Arrange
        const otherUser = sessions.find(
          (session) =>
            session.actorNationalId === user.nationalId &&
            session.subjectNationalId !== user.nationalId,
        )?.subjectNationalId
        assert(otherUser)

        // Act
        const res = await server
          .get(`/v1/me/sessions`)
          .set('X-Query-OtherUser', otherUser)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body.data.every(filterRelatedSession(user)))
        expect(res.body.data).toMatchObject(
          sortBy(sessions, 'timestamp')
            .filter(filterRelatedSession(user, otherUser))
            .map((session) => ({ id: session.id }))
            .slice(0, 10),
        )
        expect(res.body.totalCount).toEqual(
          sessions.filter(
            (session) =>
              (session.actorNationalId === user.nationalId &&
                session.subjectNationalId === otherUser) ||
              (session.actorNationalId === otherUser &&
                session.subjectNationalId === user.nationalId),
          ).length,
        )
      })

      it('POST /v1/me/sessions should return success', async () => {
        // Act
        const res = await server
          .post(`/v1/me/sessions`)
          .send(createSessionDto({ actorNationalId: user.nationalId }))

        // Assert
        expect(res.status).toEqual(202)
        expect(res.body.data).toBeUndefined()
        expect(sessionsQueueAddSpy).toHaveBeenCalledTimes(1)
      })

      it('POST /v1/me/sessions should return forbidden when not actor', async () => {
        // Act
        const res = await server
          .post(`/v1/me/sessions`)
          .send(
            createSessionDto({ actorNationalId: faker.datatype.string(10) }),
          )

        // Assert
        expect(res.status).toEqual(403)
      })
    })

    describe('Filter by date', () => {
      const from = '2022-01-03'
      const to = '2022-01-05'
      let app: TestApp
      let server: request.SuperTest<request.Test>
      let factory: FixtureFactory
      let mockSessions: Session[]

      beforeAll(async () => {
        app = await setupWithAuth({ user })

        factory = new FixtureFactory(app)
        mockSessions = await factory.createDateSessions(
          user.nationalId,
          new Date(to),
          new Date(from),
        )

        server = request(app.getHttpServer())
      })
      afterAll(() => {
        app.cleanUp()
      })

      it('GET /v1/me/sessions should support from parameter', async () => {
        // Act
        const res1 = await server.get(`/v1/me/sessions?from=${from}`)

        // Assert
        expect(res1.status).toEqual(200)
        expect(
          res1.body.data.every(
            (session: Session) => session.actorNationalId === user.nationalId,
          ),
        )
        expect(res1.body.data).toMatchObject(
          sortBy(mockSessions, 'timestamp')
            .reverse()
            .filter((session) => session.timestamp >= new Date(from))
            .map((session) => ({ id: session.id })),
        )
      })

      it('GET /v1/me/sessions should support to parameter', async () => {
        // Act
        const res1 = await server.get(`/v1/me/sessions?to=${to}`)

        // Assert
        expect(res1.status).toEqual(200)
        expect(
          res1.body.data.every(
            (session: Session) => session.actorNationalId === user.nationalId,
          ),
        )

        expect(res1.body.data).toMatchObject(
          sortBy(mockSessions, 'timestamp')
            .reverse()
            .filter((session) => session.timestamp <= new Date(to))
            .map((session) => ({ id: session.id })),
        )
      })

      it('GET /v1/me/sessions should support from and to parameter', async () => {
        // Act
        const res1 = await server.get(`/v1/me/sessions?from=${from}&to=${to}`)

        // Assert
        expect(res1.status).toEqual(200)
        expect(
          res1.body.data.every(
            (session: Session) => session.actorNationalId === user.nationalId,
          ),
        )

        const expected = sortBy(mockSessions, 'timestamp')
          .reverse()
          .filter(
            (session) =>
              session.timestamp >= new Date(from) &&
              session.timestamp <= new Date(to),
          )
          .map((session) => ({ id: session.id }))

        expect(res1.body.data).toMatchObject(expected)
      })
    })
  })

  describe('with company delegation', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let factory: FixtureFactory
    let sessions: Session[]
    const user = createCurrentUser({
      scope: [ApiScope.internalProcuring, SessionsScope.sessionsWrite],
      nationalIdType: 'company',
      delegationType: AuthDelegationType.ProcurationHolder,
    })

    beforeAll(async () => {
      // Arrange
      app = await setupWithAuth({ user })

      factory = new FixtureFactory(app)
      sessions = await factory.createSessions(user.nationalId)

      server = request(app.getHttpServer())
    })

    afterAll(() => {
      app.cleanUp()
    })

    it('GET /v1/me/sessions should return first page of company sessions in descending order', async () => {
      // Act
      const res = await server.get(`/v1/me/sessions`)

      // Assert
      expect(res.status).toEqual(200)
      expect(
        res.body.data.every(
          (session: Session) => session.subjectNationalId === user.nationalId,
        ),
      )
      expect(res.body.data).toMatchObject(
        sortBy(sessions, 'timestamp')
          .reverse()
          .filter((session) => session.subjectNationalId == user.nationalId)
          .map((session) => ({ id: session.id }))
          .slice(0, 10),
      )
      expect(res.body.totalCount).toEqual(
        sessions.filter(
          (session) => session.subjectNationalId === user.nationalId,
        ).length,
      )
    })
  })

  describe('withoutAuth and permission', () => {
    it.each`
      method    | endpoint
      ${'GET'}  | ${'/v1/me/sessions'}
      ${'POST'} | ${'/v1/me/sessions'}
    `(
      '$method $endpoint should return 401 when user is not authenticated',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupWithoutAuth()
        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(401)
        expect(res.body).toMatchObject({
          status: 401,
          type: 'https://httpstatuses.org/401',
          title: 'Unauthorized',
        })

        // CleanUp
        app.cleanUp()
      },
    )

    it.each`
      method    | endpoint
      ${'GET'}  | ${'/v1/me/sessions'}
      ${'POST'} | ${'/v1/me/sessions'}
    `(
      '$method $endpoint should return 403 Forbidden when user does not have the correct scope',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupWithoutPermission()
        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(403)
        expect(res.body).toMatchObject({
          status: 403,
          type: 'https://httpstatuses.org/403',
          title: 'Forbidden',
          detail: 'Forbidden resource',
        })

        // CleanUp
        app.cleanUp()
      },
    )
  })
})
