import * as request from 'supertest'

import { INestApplication } from '@nestjs/common'

import { NotificationType } from '@island.is/judicial-system/types'

import { setup, user } from '../../../../../test/setup'
import { Case } from '../../case/models'
import { Notification } from '../models'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
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
        .send({ nationalId: user.nationalId, type: NotificationType.HEADS_UP })
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
          expect(response.body.notification.message).toBe(
            `Ný gæsluvarðhaldskrafa í vinnslu. Ákærandi: ${user.name}.`,
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
            expect(value.message).toBe(response.body.notification.message)
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
