import * as request from 'supertest'

import { INestApplication } from '@nestjs/common'

import { NotificationType, User } from '@island.is/judicial-system/types'
import { ACCESS_TOKEN_COOKIE_NAME } from '@island.is/judicial-system/consts'
import { SharedAuthService } from '@island.is/judicial-system/auth'

import { setup } from '../../../../../test/setup'
import { Case } from '../../case'
import { Notification, SendNotificationResponse } from '../models'

jest.setTimeout(10000)

let app: INestApplication
let authCookie: string

beforeAll(async () => {
  app = await setup()

  const sharedAuthService = await app.resolve(SharedAuthService)

  const user = (await request(app.getHttpServer()).get(`/api/user/2510654469`))
    .body
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
    let dbCase: Case
    let apiSendNotificationResponse: SendNotificationResponse

    await Case.create({
      policeCaseNumber: 'Case Number',
      accusedNationalId: '0101010000',
    })
      .then((value) => {
        dbCase = value

        return request(app.getHttpServer())
          .post(`/api/case/${dbCase.id}/notification`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${authCookie}`)
          .send({ type: NotificationType.HEADS_UP })
          .expect(201)
      })
      .then((response) => {
        apiSendNotificationResponse = response.body

        // Check the response
        expect(apiSendNotificationResponse.notificationSent).toBe(true)
        expect(apiSendNotificationResponse.notification.id).toBeTruthy()
        expect(apiSendNotificationResponse.notification.created).toBeTruthy()
        expect(apiSendNotificationResponse.notification.caseId).toBe(dbCase.id)
        expect(apiSendNotificationResponse.notification.type).toBe(
          NotificationType.HEADS_UP,
        )
        expect(apiSendNotificationResponse.notification.condition).toBeNull()
        expect(apiSendNotificationResponse.notification.recipients).toBe(
          `[{"success":true}]`,
        )

        // Check the data in the database
        return Notification.findOne({
          where: { id: response.body.notification.id },
        })
      })
      .then((value) => {
        expect(value.id).toBe(apiSendNotificationResponse.notification.id)
        expect(value.created.toISOString()).toBe(
          apiSendNotificationResponse.notification.created,
        )
        expect(value.type).toBe(apiSendNotificationResponse.notification.type)
        expect(value.condition).toBe(
          apiSendNotificationResponse.notification.condition,
        )
        expect(value.recipients).toBe(
          apiSendNotificationResponse.notification.recipients,
        )
      })
  })

  it('GET /api/case/:id/notifications should get all notifications by case id', async () => {
    let dbCase: Case
    let dbNotification: Notification

    await Case.create({
      policeCaseNumber: 'Case Number',
      accusedNationalId: '0101010000',
    })
      .then((value) => {
        dbCase = value

        return Notification.create({
          caseId: dbCase.id,
          type: NotificationType.HEADS_UP,
          message: 'Test Message',
        })
      })
      .then((value) => {
        dbNotification = value

        return request(app.getHttpServer())
          .get(`/api/case/${dbCase.id}/notifications`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${authCookie}`)
          .expect(200)
      })
      .then((response) => {
        // Check the response
        expect(response.body).toStrictEqual([
          dbNotificationToNotification(dbNotification),
        ])
      })
  })
})
