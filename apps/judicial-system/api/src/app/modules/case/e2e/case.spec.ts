import * as request from 'supertest'

import { INestApplication } from '@nestjs/common'

import { CaseState, CaseTransition } from '@island.is/judicial-system/types'

import { setup } from '../../../../../test/setup'
import { test } from '../../../../../sequelize.config.js'
import {
  Case,
  CaseCustodyRestrictions,
  CaseCustodyProvisions,
  CaseAppealDecision,
  Notification,
  NotificationType,
} from '../models'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

describe('Case', () => {
  it('POST /api/case should create a case', async () => {
    const data = getCaseData(true)

    await request(app.getHttpServer())
      .post('/api/case')
      .send(data)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expectCasesToMatch(response.body, {
          ...data,
          id: response.body.id || 'FAILURE',
          created: response.body.created || 'FAILURE',
          modified: response.body.modified || 'FAILURE',
          state: CaseState.DRAFT,
        } as Case)

        // Check the data in the database
        await Case.findOne({
          where: { id: response.body.id },
          include: [Notification],
        }).then((value) => {
          expectCasesToMatch(dbCaseToCase(value), {
            ...response.body,
            notifications: [],
          })
        })
      })
  })

  it('POST /api/case with required fields should create a case', async () => {
    const data = getCaseData()

    await request(app.getHttpServer())
      .post('/api/case')
      .send(data)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expectCasesToMatch(response.body, {
          ...data,
          id: response.body.id || 'FAILURE',
          created: response.body.created || 'FAILURE',
          modified: response.body.modified || 'FAILURE',
          state: CaseState.DRAFT,
        } as Case)

        // Check the data in the database
        await Case.findOne({
          where: { id: response.body.id },
          include: [Notification],
        }).then((value) => {
          expectCasesToMatch(dbCaseToCase(value), {
            ...response.body,
            notifications: [],
          })
        })
      })
  })

  it('PUT /api/case/:id should update a case by id', async () => {
    await Case.create(getCaseData()).then(async (value) => {
      const data = getCaseData(true, true)

      await request(app.getHttpServer())
        .put(`/api/case/${value.id}`)
        .send(data)
        .expect(200)
        .then(async (response) => {
          // Check the response
          const dbCase = dbCaseToCase(value)

          expect(response.body.modified).not.toBe(dbCase.modified)
          expectCasesToMatch(response.body, {
            ...data,
            id: dbCase.id || 'FAILURE',
            created: dbCase.created || 'FAILURE',
            modified: response.body.modified,
          } as Case)

          // Check the data in the database
          await Case.findOne({
            where: { id: response.body.id },
            include: [Notification],
          }).then((newValue) => {
            expectCasesToMatch(dbCaseToCase(newValue), {
              ...response.body,
              notifications: [],
            })
          })
        })
    })
  })

  it('Put /api/case/:id/state should transition case to a new state', async () => {
    await Case.create(getCaseData()).then(async (value) => {
      const data = {
        modified: value.modified.toISOString(),
        transition: CaseTransition.SUBMIT,
      }

      await request(app.getHttpServer())
        .put(`/api/case/${value.id}/state`)
        .send(data)
        .expect(200)
        .then(async (response) => {
          // Check the response
          const dbCase = dbCaseToCase(value)

          expect(response.body.modified).not.toBe(dbCase.modified)
          expect(response.body.state).not.toBe(dbCase.state)
          expectCasesToMatch(response.body, {
            ...dbCase,
            modified: response.body.modified,
            state: CaseState.SUBMITTED,
          } as Case)

          // Check the data in the database
          await Case.findOne({
            where: { id: response.body.id },
            include: [Notification],
          }).then((newValue) => {
            expectCasesToMatch(dbCaseToCase(newValue), {
              ...response.body,
              notifications: [],
            })
          })
        })
    })
  })

  it('Get /api/cases should get all cases', async () => {
    await Case.create(getCaseData()).then(async (value1) => {
      await Case.create(getCaseData()).then(async (value2) => {
        await request(app.getHttpServer())
          .get(`/api/cases`)
          .send()
          .expect(200)
          .then((response) => {
            // Check the response - should have at least two cases
            expect(response.body.length).toBeGreaterThanOrEqual(2)
          })
      })
    })
  })

  it('GET /api/case/:id should get a case by id', async () => {
    await Case.create(getCaseData(true, true)).then(async (value) => {
      await request(app.getHttpServer())
        .get(`/api/case/${value.id}`)
        .send()
        .expect(200)
        .then((response) => {
          // Check the response
          const dbCase = dbCaseToCase(value)
          expectCasesToMatch(response.body, {
            ...dbCase,
            notifications: [],
          } as Case)
        })
    })
  })

  it('POST /api/case/:id/notification should send a notification', async () => {
    await Case.create(getCaseData()).then(async (value) => {
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
            `Ný gæsluvarðhaldskrafa í vinnslu. Ákærandi: ${test.userSeed[0].name}.`,
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
    await Case.create(getCaseData()).then(async (caseValue) => {
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

  it('GET /api/case/:id should include notifications', async () => {
    await Case.create(getCaseData()).then(async (caseValue) => {
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

  it('POST /api/case/:id/signature should request a signature for a case', async () => {})

  it('GET /api/case/:id/signature should confirm a signature for a case', async () => {})
})

const minimalCaseData = {
  policeCaseNumber: 'Case Number',
  accusedNationalId: '0101010000',
}

const remainingCreateCaseData = {
  accusedName: 'Accused Name',
  accusedAddress: 'Accused Address',
  court: 'Court',
  arrestDate: '2020-09-08T08:00:00.000Z',
  requestedCourtDate: '2020-09-08T11:30:00.000Z',
}

const remainingCaseData = {
  state: CaseState.DRAFT,
  requestedCustodyEndDate: '2020-09-29T12:00:00.000Z',
  lawsBroken: 'Broken Laws',
  custodyProvisions: [
    CaseCustodyProvisions._95_1_A,
    CaseCustodyProvisions._99_1_B,
  ],
  requestedCustodyRestrictions: [
    CaseCustodyRestrictions.ISOLATION,
    CaseCustodyRestrictions.MEDIA,
  ],
  caseFacts: 'Case Facts',
  witnessAccounts: 'Witness Accounts',
  investigationProgress: 'Investigation Progress',
  legalArguments: 'Legal Arguments',
  comments: 'Comments',
  courtCaseNumber: 'Court Case Number',
  courtStartTime: '2020-09-29T13:00:00.000Z',
  courtEndTime: '2020-09-29T14:00:00.000Z',
  courtAttendees: 'Court Attendees',
  policeDemands: 'Police Demands',
  accusedPlea: 'Accused Plea',
  litigationPresentations: 'Litigation Presentations',
  ruling: 'Ruling',
  custodyEndDate: '2020-09-28T12:00:00.000Z',
  custodyRestrictions: [CaseCustodyRestrictions.MEDIA],
  accusedAppealDecision: CaseAppealDecision.APPEAL,
  prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
}

function getCaseData(
  fullCreateCaseData: boolean = false,
  otherCaseData: boolean = false,
) {
  let data = minimalCaseData
  if (fullCreateCaseData) {
    data = { ...data, ...remainingCreateCaseData }
  }
  if (otherCaseData) {
    data = { ...data, ...remainingCaseData }
  }

  return data as Case
}

function dbCaseToCase(dbCase: Case) {
  const theCase = dbCase.toJSON() as Case

  return ({
    ...theCase,
    created: theCase.created && theCase.created.toISOString(),
    modified: theCase.modified && theCase.modified.toISOString(),
    arrestDate: theCase.arrestDate && theCase.arrestDate.toISOString(),
    requestedCourtDate:
      theCase.requestedCourtDate && theCase.requestedCourtDate.toISOString(),
    requestedCustodyEndDate:
      theCase.requestedCustodyEndDate &&
      theCase.requestedCustodyEndDate.toISOString(),
    courtStartTime:
      theCase.courtStartTime && theCase.courtStartTime.toISOString(),
    courtEndTime: theCase.courtEndTime && theCase.courtEndTime.toISOString(),
    custodyEndDate:
      theCase.custodyEndDate && theCase.custodyEndDate.toISOString(),
  } as unknown) as Case
}

function dbNotificationToNotification(dbNotification: Notification) {
  const notification = dbNotification.toJSON() as Notification

  return {
    ...notification,
    created: notification.created && notification.created.toISOString(),
  }
}

function expectCasesToMatch(resCase: Case, theCase: Case) {
  expect(resCase.id).toBe(theCase.id)
  expect(resCase.created).toBe(theCase.created)
  expect(resCase.modified).toBe(theCase.modified)
  expect(resCase.state).toBe(theCase.state)
  expect(resCase.policeCaseNumber).toBe(theCase.policeCaseNumber)
  expect(resCase.accusedNationalId).toBe(theCase.accusedNationalId)
  expect(resCase.accusedName || null).toBe(theCase.accusedName || null)
  expect(resCase.accusedAddress || null).toBe(theCase.accusedAddress || null)
  expect(resCase.court || null).toBe(theCase.court || null)
  expect(resCase.arrestDate || null).toBe(theCase.arrestDate || null)
  expect(resCase.requestedCourtDate || null).toBe(
    theCase.requestedCourtDate || null,
  )
  expect(resCase.requestedCustodyEndDate || null).toBe(
    theCase.requestedCustodyEndDate || null,
  )
  expect(resCase.lawsBroken || null).toBe(theCase.lawsBroken || null)
  expect(resCase.custodyProvisions || null).toStrictEqual(
    theCase.custodyProvisions || null,
  )
  expect(resCase.requestedCustodyRestrictions || null).toStrictEqual(
    theCase.requestedCustodyRestrictions || null,
  )
  expect(resCase.caseFacts || null).toBe(theCase.caseFacts || null)
  expect(resCase.witnessAccounts || null).toBe(theCase.witnessAccounts || null)
  expect(resCase.investigationProgress || null).toBe(
    theCase.investigationProgress || null,
  )
  expect(resCase.legalArguments || null).toBe(theCase.legalArguments || null)
  expect(resCase.comments || null).toBe(theCase.comments || null)
  expect(resCase.courtCaseNumber || null).toBe(theCase.courtCaseNumber || null)
  expect(resCase.courtStartTime || null).toBe(theCase.courtStartTime || null)
  expect(resCase.courtEndTime || null).toBe(theCase.courtEndTime || null)
  expect(resCase.courtAttendees || null).toBe(theCase.courtAttendees || null)
  expect(resCase.policeDemands || null).toBe(theCase.policeDemands || null)
  expect(resCase.accusedPlea || null).toBe(theCase.accusedPlea || null)
  expect(resCase.litigationPresentations || null).toBe(
    theCase.litigationPresentations || null,
  )
  expect(resCase.ruling || null).toBe(theCase.ruling || null)
  expect(resCase.custodyEndDate || null).toBe(theCase.custodyEndDate || null)
  expect(resCase.custodyRestrictions || null).toStrictEqual(
    theCase.custodyRestrictions || null,
  )
  expect(resCase.accusedAppealDecision || null).toBe(
    theCase.accusedAppealDecision || null,
  )
  expect(resCase.prosecutorAppealDecision || null).toBe(
    theCase.prosecutorAppealDecision || null,
  )
  expect(resCase.notifications).toStrictEqual(theCase.notifications)
}
