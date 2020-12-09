import * as request from 'supertest'

import { INestApplication } from '@nestjs/common'

import { NotificationType, User } from '@island.is/judicial-system/types'
import { ACCESS_TOKEN_COOKIE_NAME } from '@island.is/judicial-system/consts'
import { SharedAuthService } from '@island.is/judicial-system/auth'

import { setup, user } from '../../../../../test/setup'
import { Case } from '../../case'
import { Notification } from '../models'
import { UserService } from '../../user'

let app: INestApplication
let authCookie: string

beforeAll(async () => {
  app = await setup()
  const userService = await app.resolve(UserService)
  const user = await userService.findByNationalId('1112902539')
  const sharedAuthService = await app.resolve(SharedAuthService)
  authCookie = sharedAuthService.signJwt((user as unknown) as User)
})

function dbNotificationToNotification(dbNotification: Notification) {
  const notification = dbNotification.toJSON() as Notification

  return ({
    ...notification,
    created: notification.created && notification.created.toISOString(),
  } as unknown) as Notification
}

describe('Notification', () => {
  it('POST /api/case/:id/notification should send a notification', async () => {
    await Case.create({
      policeCaseNumber: 'Case Number',
      accusedNationalId: '0101010000',
    }).then(async (value) => {
      await request(app.getHttpServer())
        .post(`/api/case/${value.id}/notification`)
        .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${authCookie}`)
        .send({ type: NotificationType.HEADS_UP })
        .expect(201)
        .then(async (response) => {
          // Check the response
          expect(response.body.notificationSent).toBe(true)
          expect(response.body.notification.id).toBeTruthy()
          expect(response.body.notification.created).toBeTruthy()
          expect(response.body.notification.caseId).toBe(value.id)
          expect(response.body.notification.type).toBe(
            NotificationType.HEADS_UP,
          )
          expect(response.body.notification.condition).toBeNull()
          expect(response.body.notification.recipients).toBe(
            `[{"success":true}]`,
          )

          // Check the data in the database
          await Notification.findOne({
            where: { id: response.body.notification.id },
          }).then((value) => {
            expect(value.id).toBe(response.body.notification.id)
            expect(value.created.toISOString()).toBe(
              response.body.notification.created,
            )
            expect(value.type).toBe(response.body.notification.type)
            expect(value.condition).toBe(response.body.notification.condition)
            expect(value.recipients).toBe(response.body.notification.recipients)
          })
        })
    })
  })

  it('GET /api/case/:id/notifications should get all notifications by case id', async () => {
    await Case.create({
      policeCaseNumber: 'Case Number',
      accusedNationalId: '0101010000',
    }).then(async (caseValue) => {
      await Notification.create({
        caseId: caseValue.id,
        type: NotificationType.HEADS_UP,
        message: 'Test Message',
      }).then(async (notificationValue) => {
        await request(app.getHttpServer())
          .get(`/api/case/${caseValue.id}/notifications`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${authCookie}`)
          .expect(200)
          .then(async (response) => {
            // Check the response
            expect(response.body).toStrictEqual([
              dbNotificationToNotification(notificationValue),
            ])
          })
      })
    })
  })
})
