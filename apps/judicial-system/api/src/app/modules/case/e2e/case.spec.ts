import * as request from 'supertest'

import { INestApplication } from '@nestjs/common'

import { CaseState } from '@island.is/judicial-system/types'

import { setup } from '../../../../../test/setup'
import {
  Case,
  CaseCustodyRestrictions,
  CaseCustodyProvisions,
  Notification,
  NotificationType,
} from '../models'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

describe('Case', () => {
  it('POST /api/case should create a case', async () => {
    const data = {
      policeCaseNumber: 'Case Number',
      suspectNationalId: '0101010000',
      suspectName: 'Suspect Name',
      suspectAddress: 'Suspect Address',
      court: 'Court',
      arrestDate: '2020-09-08T08:00:00.000Z',
      requestedCourtDate: '2020-09-08T11:30:00.000Z',
    }

    await request(app.getHttpServer())
      .post('/api/case')
      .send(data)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body.id).toBeTruthy()
        expect(response.body.created).toBeTruthy()
        expect(response.body.modified).toBeTruthy()
        expect(response.body.state).toBe(CaseState.DRAFT)
        expect(response.body.policeCaseNumber).toBe(data.policeCaseNumber)
        expect(response.body.suspectNationalId).toBe(data.suspectNationalId)
        expect(response.body.suspectName).toBe(data.suspectName)
        expect(response.body.suspectAddress).toBe(data.suspectAddress)
        expect(response.body.court).toBe(data.court)
        expect(response.body.arrestDate).toBe(data.arrestDate)
        expect(response.body.requestedCourtDate).toBe(data.requestedCourtDate)
        expect(response.body.requestedCustodyEndDate).toBeNull()
        expect(response.body.lawsBroken).toBeNull()
        expect(response.body.custodyProvisions).toBeNull()
        expect(response.body.custodyRestrictions).toBeNull()
        expect(response.body.caseFacts).toBeNull()
        expect(response.body.witnessAccounts).toBeNull()
        expect(response.body.investigationProgress).toBeNull()
        expect(response.body.legalArguments).toBeNull()
        expect(response.body.comments).toBeNull()
        expect(response.body.notifications).toBeUndefined()

        // Check the data in the database
        await Case.findOne({
          where: { id: response.body.id },
          include: [Notification],
        }).then((value) => {
          expect(value.id).toBe(response.body.id)
          expect(value.created.toISOString()).toBe(response.body.created)
          expect(value.modified.toISOString()).toBe(response.body.modified)
          expect(value.state).toBe(response.body.state)
          expect(value.policeCaseNumber).toBe(data.policeCaseNumber)
          expect(value.suspectNationalId).toBe(data.suspectNationalId)
          expect(value.suspectName).toBe(data.suspectName)
          expect(value.suspectAddress).toBe(data.suspectAddress)
          expect(value.court).toBe(data.court)
          expect(value.arrestDate.toISOString()).toBe(data.arrestDate)
          expect(value.requestedCourtDate.toISOString()).toBe(
            data.requestedCourtDate,
          )
          expect(value.requestedCustodyEndDate).toBeNull()
          expect(value.lawsBroken).toBeNull()
          expect(value.custodyProvisions).toBeNull()
          expect(value.custodyRestrictions).toBeNull()
          expect(value.caseFacts).toBeNull()
          expect(value.witnessAccounts).toBeNull()
          expect(value.investigationProgress).toBeNull()
          expect(value.legalArguments).toBeNull()
          expect(value.comments).toBeNull()
          expect(value.notifications).toStrictEqual([])
        })
      })
  })

  it('POST /api/case with required fields should create a case', async () => {
    const data = {
      policeCaseNumber: 'Case Number',
      suspectNationalId: '0101010000',
    }

    await request(app.getHttpServer())
      .post('/api/case')
      .send(data)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body.id).toBeTruthy()
        expect(response.body.created).toBeTruthy()
        expect(response.body.modified).toBeTruthy()
        expect(response.body.state).toBe(CaseState.DRAFT)
        expect(response.body.policeCaseNumber).toBe(data.policeCaseNumber)
        expect(response.body.suspectNationalId).toBe(data.suspectNationalId)
        expect(response.body.suspectName).toBeNull()
        expect(response.body.suspectAddress).toBeNull()
        expect(response.body.court).toBeNull()
        expect(response.body.arrestDate).toBeNull()
        expect(response.body.requestedCourtDate).toBeNull()
        expect(response.body.requestedCustodyEndDate).toBeNull()
        expect(response.body.lawsBroken).toBeNull()
        expect(response.body.custodyProvisions).toBeNull()
        expect(response.body.custodyRestrictions).toBeNull()
        expect(response.body.caseFacts).toBeNull()
        expect(response.body.witnessAccounts).toBeNull()
        expect(response.body.investigationProgress).toBeNull()
        expect(response.body.legalArguments).toBeNull()
        expect(response.body.comments).toBeNull()
        expect(response.body.notifications).toBeUndefined()

        // Check the data in the database
        await Case.findOne({
          where: { id: response.body.id },
          include: [Notification],
        }).then((value) => {
          expect(value.id).toBe(response.body.id)
          expect(value.created.toISOString()).toBe(response.body.created)
          expect(value.modified.toISOString()).toBe(response.body.modified)
          expect(value.state).toBe(response.body.state)
          expect(value.policeCaseNumber).toBe(data.policeCaseNumber)
          expect(value.suspectNationalId).toBe(data.suspectNationalId)
          expect(value.suspectName).toBeNull()
          expect(value.suspectAddress).toBeNull()
          expect(value.court).toBeNull()
          expect(value.arrestDate).toBeNull()
          expect(value.requestedCourtDate).toBeNull()
          expect(value.requestedCustodyEndDate).toBeNull()
          expect(value.lawsBroken).toBeNull()
          expect(value.custodyProvisions).toBeNull()
          expect(value.custodyRestrictions).toBeNull()
          expect(value.caseFacts).toBeNull()
          expect(value.witnessAccounts).toBeNull()
          expect(value.investigationProgress).toBeNull()
          expect(value.legalArguments).toBeNull()
          expect(value.comments).toBeNull()
          expect(value.notifications).toStrictEqual([])
        })
      })
  })

  it('GET /api/case/:id should get a case by id', async () => {
    await Case.create({
      state: CaseState.SUBMITTED,
      policeCaseNumber: 'Case Number',
      suspectNationalId: '0101010000',
      suspectName: 'Suspect Name',
      suspectAddress: 'Suspect Address',
      court: 'Court',
      arrestDate: '2020-09-08T08:00:00.000Z',
      requestedCourtDate: '2020-09-08T11:30:00.000Z',
      requestedCustodyEndDate: '2020-09-29T12:00:00.000Z',
      lawsBroken: 'Broken Laws',
      custodyProvisions: [
        CaseCustodyProvisions._95_1_A,
        CaseCustodyProvisions._99_1_B,
      ],
      custodyRestrictions: [
        CaseCustodyRestrictions.ISOLATION,
        CaseCustodyRestrictions.MEDIA,
      ],
      caseFacts: 'Case Facts',
      witnessAccounts: 'Witness Accounts',
      investigationProgress: 'Investigation Progress',
      legalArguments: 'Legal Arguments',
      comments: 'Comments',
    }).then(async (value) => {
      await request(app.getHttpServer())
        .get(`/api/case/${value.id}`)
        .send()
        .expect(200)
        .then((response) => {
          // Check the response
          expect(response.body.id).toBe(value.id)
          expect(response.body.created).toBe(value.created.toISOString())
          expect(response.body.modified).toBe(value.modified.toISOString())
          expect(response.body.state).toBe(value.state)
          expect(response.body.policeCaseNumber).toBe(value.policeCaseNumber)
          expect(response.body.suspectNationalId).toBe(value.suspectNationalId)
          expect(response.body.suspectName).toBe(value.suspectName)
          expect(response.body.suspectAddress).toBe(value.suspectAddress)
          expect(response.body.court).toBe(value.court)
          expect(response.body.arrestDate).toBe(value.arrestDate.toISOString())
          expect(response.body.requestedCourtDate).toBe(
            value.requestedCourtDate.toISOString(),
          )
          expect(response.body.requestedCustodyEndDate).toBe(
            value.requestedCustodyEndDate.toISOString(),
          )
          expect(response.body.lawsBroken).toBe(value.lawsBroken)
          expect(response.body.custodyProvisions).toStrictEqual(
            value.custodyProvisions,
          )
          expect(response.body.custodyRestrictions).toStrictEqual(
            value.custodyRestrictions,
          )
          expect(response.body.caseFacts).toBe(value.caseFacts)
          expect(response.body.witnessAccounts).toBe(value.witnessAccounts)
          expect(response.body.investigationProgress).toBe(
            value.investigationProgress,
          )
          expect(response.body.legalArguments).toBe(value.legalArguments)
          expect(response.body.comments).toBe(value.comments)
          expect(response.body.notifications).toStrictEqual([])
        })
    })
  })

  it('PUT /api/case/:id should update a case by id', async () => {
    await Case.create({
      policeCaseNumber: 'Case Number',
      suspectNationalId: '0101010000',
    }).then(async (value) => {
      const data = {
        state: CaseState.ACCEPTED,
        policeCaseNumber: 'New Case Number',
        suspectNationalId: '0101010009',
        suspectName: 'Suspect Name',
        suspectAddress: 'Suspect Address',
        court: 'Court',
        arrestDate: '2020-09-08T08:00:00.000Z',
        requestedCourtDate: '2020-09-08T11:30:00.000Z',
        requestedCustodyEndDate: '2020-09-29T12:00:00.000Z',
        lawsBroken: 'Broken Laws',
        custodyProvisions: [
          CaseCustodyProvisions._95_1_A,
          CaseCustodyProvisions._99_1_B,
        ],
        custodyRestrictions: [
          CaseCustodyRestrictions.ISOLATION,
          CaseCustodyRestrictions.MEDIA,
        ],
        caseFacts: 'Case Facts',
        witnessAccounts: 'Witness Accounts',
        investigationProgress: 'Investigation Progress',
        legalArguments: 'Legal Arguments',
        comments: 'Comments',
        courtCaseNumber: 'Court Case Number',
      }

      await request(app.getHttpServer())
        .put(`/api/case/${value.id}`)
        .send(data)
        .expect(200)
        .then(async (response) => {
          // Check the response
          expect(response.body.id).toBe(value.id)
          expect(response.body.created).toBe(value.created.toISOString())
          expect(response.body.modified).not.toBe(value.modified.toISOString())
          expect(response.body.state).toBe(data.state)
          expect(response.body.policeCaseNumber).toBe(data.policeCaseNumber)
          expect(response.body.suspectNationalId).toBe(data.suspectNationalId)
          expect(response.body.suspectName).toBe(data.suspectName)
          expect(response.body.suspectAddress).toBe(data.suspectAddress)
          expect(response.body.court).toBe(data.court)
          expect(response.body.arrestDate).toBe(data.arrestDate)
          expect(response.body.requestedCourtDate).toBe(data.requestedCourtDate)
          expect(response.body.requestedCustodyEndDate).toBe(
            data.requestedCustodyEndDate,
          )
          expect(response.body.lawsBroken).toBe(data.lawsBroken)
          expect(response.body.custodyProvisions).toStrictEqual(
            data.custodyProvisions,
          )
          expect(response.body.custodyRestrictions).toStrictEqual(
            data.custodyRestrictions,
          )
          expect(response.body.caseFacts).toBe(data.caseFacts)
          expect(response.body.witnessAccounts).toBe(data.witnessAccounts)
          expect(response.body.investigationProgress).toBe(
            data.investigationProgress,
          )
          expect(response.body.legalArguments).toBe(data.legalArguments)
          expect(response.body.comments).toBe(data.comments)
          expect(response.body.notifications).toBeUndefined()
          expect(response.body.courtCaseNumber).toBe(data.courtCaseNumber)

          // Check the data in the database
          await Case.findOne({
            where: { id: response.body.id },
            include: [Notification],
          }).then((newValue) => {
            expect(newValue.id).toBe(value.id)
            expect(newValue.created).toStrictEqual(value.created)
            expect(newValue.modified.toISOString()).toBe(response.body.modified)
            expect(newValue.state).toBe(data.state)
            expect(newValue.policeCaseNumber).toBe(data.policeCaseNumber)
            expect(newValue.suspectNationalId).toBe(data.suspectNationalId)
            expect(newValue.suspectName).toBe(data.suspectName)
            expect(newValue.suspectAddress).toBe(data.suspectAddress)
            expect(newValue.court).toBe(data.court)
            expect(newValue.arrestDate.toISOString()).toBe(data.arrestDate)
            expect(newValue.requestedCourtDate.toISOString()).toBe(
              data.requestedCourtDate,
            )
            expect(newValue.requestedCustodyEndDate.toISOString()).toBe(
              data.requestedCustodyEndDate,
            )
            expect(newValue.lawsBroken).toBe(data.lawsBroken)
            expect(newValue.custodyProvisions).toStrictEqual(
              data.custodyProvisions,
            )
            expect(newValue.custodyRestrictions).toStrictEqual(
              data.custodyRestrictions,
            )
            expect(newValue.caseFacts).toBe(data.caseFacts)
            expect(newValue.witnessAccounts).toBe(data.witnessAccounts)
            expect(newValue.investigationProgress).toBe(
              data.investigationProgress,
            )
            expect(newValue.legalArguments).toBe(data.legalArguments)
            expect(newValue.comments).toBe(data.comments)
            expect(newValue.notifications).toStrictEqual([])
            expect(newValue.courtCaseNumber).toBe(data.courtCaseNumber)
          })
        })
    })
  })

  it('POST /api/case/:id/notification should send a notification', async () => {
    await Case.create({
      policeCaseNumber: 'Case Number',
      suspectNationalId: '0101010000',
    }).then(async (value) => {
      await request(app.getHttpServer())
        .post(`/api/case/${value.id}/notification`)
        .expect(201)
        .then(async (response) => {
          // Check the response
          expect(response.body.id).toBeTruthy()
          expect(response.body.created).toBeTruthy()
          expect(response.body.caseId).toBe(value.id)
          expect(response.body.type).toBe(NotificationType.HEADS_UP)
          expect(response.body.message).toBe(
            'Ný gæsluvarðhaldskrafa í vinnslu.',
          )

          // Check the data in the database
          await Notification.findOne({ where: { id: response.body.id } }).then(
            (value) => {
              expect(value.id).toBe(response.body.id)
              expect(value.created.toISOString()).toBe(response.body.created)
              expect(value.type).toBe(response.body.type)
              expect(value.message).toBe(response.body.message)
            },
          )
        })
    })
  })

  it('GET /api/case/:id/notifications should get all notifications by case id', async () => {
    await Case.create({
      policeCaseNumber: 'Case Number',
      suspectNationalId: '0101010000',
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
            expect(response.body.length).toBe(1)
            expect(response.body[0].id).toBe(notificationValue.id)
            expect(response.body[0].created).toBe(
              notificationValue.created.toISOString(),
            )
            expect(response.body[0].caseId).toBe(caseValue.id)
            expect(response.body[0].type).toBe(notificationValue.type)
            expect(response.body[0].message).toBe(notificationValue.message)
          })
      })
    })
  })

  it('GET /api/case/:id should include notifications', async () => {
    await Case.create({
      policeCaseNumber: 'Case Number',
      suspectNationalId: '0101010000',
    }).then(async (caseValue) => {
      await Notification.create({
        caseId: caseValue.id,
        type: NotificationType.HEADS_UP,
        message: 'Test Message',
      }).then(async (notificationValue) => {
        await request(app.getHttpServer())
          .get(`/api/case/${caseValue.id}`)
          .send()
          .expect(200)
          .then((response) => {
            // Check the response
            expect(response.body.notifications.length).toBe(1)
            expect(response.body.notifications[0].id).toBe(notificationValue.id)
            expect(response.body.notifications[0].created).toBe(
              notificationValue.created.toISOString(),
            )
            expect(response.body.notifications[0].caseId).toBe(caseValue.id)
            expect(response.body.notifications[0].type).toBe(
              notificationValue.type,
            )
            expect(response.body.notifications[0].message).toBe(
              notificationValue.message,
            )
          })
      })
    })
  })
})
