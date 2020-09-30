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
    const data = {
      policeCaseNumber: 'Case Number',
      accusedNationalId: '0101010000',
      accusedName: 'Accused Name',
      accusedAddress: 'Accused Address',
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
        expect(response.body.accusedNationalId).toBe(data.accusedNationalId)
        expect(response.body.accusedName).toBe(data.accusedName)
        expect(response.body.accusedAddress).toBe(data.accusedAddress)
        expect(response.body.court).toBe(data.court)
        expect(response.body.arrestDate).toBe(data.arrestDate)
        expect(response.body.requestedCourtDate).toBe(data.requestedCourtDate)
        expect(response.body.requestedCustodyEndDate).toBeNull()
        expect(response.body.lawsBroken).toBeNull()
        expect(response.body.custodyProvisions).toBeNull()
        expect(response.body.requestedCustodyRestrictions).toBeNull()
        expect(response.body.caseFacts).toBeNull()
        expect(response.body.witnessAccounts).toBeNull()
        expect(response.body.investigationProgress).toBeNull()
        expect(response.body.legalArguments).toBeNull()
        expect(response.body.comments).toBeNull()
        expect(response.body.courtCaseNumber).toBeNull()
        expect(response.body.courtStartTime).toBeNull()
        expect(response.body.courtEndTime).toBeNull()
        expect(response.body.courtAttendees).toBeNull()
        expect(response.body.policeDemands).toBeNull()
        expect(response.body.accusedPlea).toBeNull()
        expect(response.body.litigationPresentations).toBeNull()
        expect(response.body.ruling).toBeNull()
        expect(response.body.custodyEndDate).toBeNull()
        expect(response.body.custodyRestrictions).toBeNull()
        expect(response.body.accusedAppealDecision).toBeNull()
        expect(response.body.prosecutorAppealDecision).toBeNull()
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
          expect(value.accusedNationalId).toBe(data.accusedNationalId)
          expect(value.accusedName).toBe(data.accusedName)
          expect(value.accusedAddress).toBe(data.accusedAddress)
          expect(value.court).toBe(data.court)
          expect(value.arrestDate.toISOString()).toBe(data.arrestDate)
          expect(value.requestedCourtDate.toISOString()).toBe(
            data.requestedCourtDate,
          )
          expect(value.requestedCustodyEndDate).toBeNull()
          expect(value.lawsBroken).toBeNull()
          expect(value.custodyProvisions).toBeNull()
          expect(value.requestedCustodyRestrictions).toBeNull()
          expect(value.caseFacts).toBeNull()
          expect(value.witnessAccounts).toBeNull()
          expect(value.investigationProgress).toBeNull()
          expect(value.legalArguments).toBeNull()
          expect(value.comments).toBeNull()
          expect(value.courtCaseNumber).toBeNull()
          expect(value.courtStartTime).toBeNull()
          expect(value.courtEndTime).toBeNull()
          expect(value.courtAttendees).toBeNull()
          expect(value.policeDemands).toBeNull()
          expect(value.accusedPlea).toBeNull()
          expect(value.litigationPresentations).toBeNull()
          expect(value.ruling).toBeNull()
          expect(value.custodyEndDate).toBeNull()
          expect(value.custodyRestrictions).toBeNull()
          expect(value.accusedAppealDecision).toBeNull()
          expect(value.prosecutorAppealDecision).toBeNull()
          expect(value.notifications).toStrictEqual([])
        })
      })
  })

  it('POST /api/case with required fields should create a case', async () => {
    const data = getMinimalCase()

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
        expect(response.body.accusedNationalId).toBe(data.accusedNationalId)
        expect(response.body.accusedName).toBeNull()
        expect(response.body.accusedAddress).toBeNull()
        expect(response.body.court).toBeNull()
        expect(response.body.arrestDate).toBeNull()
        expect(response.body.requestedCourtDate).toBeNull()
        expect(response.body.requestedCustodyEndDate).toBeNull()
        expect(response.body.lawsBroken).toBeNull()
        expect(response.body.custodyProvisions).toBeNull()
        expect(response.body.requestedCustodyRestrictions).toBeNull()
        expect(response.body.caseFacts).toBeNull()
        expect(response.body.witnessAccounts).toBeNull()
        expect(response.body.investigationProgress).toBeNull()
        expect(response.body.legalArguments).toBeNull()
        expect(response.body.comments).toBeNull()
        expect(response.body.courtCaseNumber).toBeNull()
        expect(response.body.courtStartTime).toBeNull()
        expect(response.body.courtEndTime).toBeNull()
        expect(response.body.courtAttendees).toBeNull()
        expect(response.body.policeDemands).toBeNull()
        expect(response.body.accusedPlea).toBeNull()
        expect(response.body.litigationPresentations).toBeNull()
        expect(response.body.ruling).toBeNull()
        expect(response.body.custodyEndDate).toBeNull()
        expect(response.body.custodyRestrictions).toBeNull()
        expect(response.body.accusedAppealDecision).toBeNull()
        expect(response.body.prosecutorAppealDecision).toBeNull()
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
          expect(value.accusedNationalId).toBe(data.accusedNationalId)
          expect(value.accusedName).toBeNull()
          expect(value.accusedAddress).toBeNull()
          expect(value.court).toBeNull()
          expect(value.arrestDate).toBeNull()
          expect(value.requestedCourtDate).toBeNull()
          expect(value.requestedCustodyEndDate).toBeNull()
          expect(value.lawsBroken).toBeNull()
          expect(value.custodyProvisions).toBeNull()
          expect(value.requestedCustodyRestrictions).toBeNull()
          expect(value.caseFacts).toBeNull()
          expect(value.witnessAccounts).toBeNull()
          expect(value.investigationProgress).toBeNull()
          expect(value.legalArguments).toBeNull()
          expect(value.comments).toBeNull()
          expect(value.courtCaseNumber).toBeNull()
          expect(value.courtStartTime).toBeNull()
          expect(value.courtEndTime).toBeNull()
          expect(value.courtAttendees).toBeNull()
          expect(value.policeDemands).toBeNull()
          expect(value.accusedPlea).toBeNull()
          expect(value.litigationPresentations).toBeNull()
          expect(value.ruling).toBeNull()
          expect(value.custodyEndDate).toBeNull()
          expect(value.custodyRestrictions).toBeNull()
          expect(value.accusedAppealDecision).toBeNull()
          expect(value.prosecutorAppealDecision).toBeNull()
          expect(value.notifications).toStrictEqual([])
        })
      })
  })

  it('PUT /api/case/:id should update a case by id', async () => {
    await Case.create(getMinimalCase()).then(async (value) => {
      const data = {
        state: CaseState.ACCEPTED,
        policeCaseNumber: 'New Case Number',
        accusedNationalId: '0101010009',
        accusedName: 'Accused Name',
        accusedAddress: 'Accused Address',
        court: 'Court',
        arrestDate: '2020-09-08T08:00:00.000Z',
        requestedCourtDate: '2020-09-08T11:30:00.000Z',
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
          expect(response.body.accusedNationalId).toBe(data.accusedNationalId)
          expect(response.body.accusedName).toBe(data.accusedName)
          expect(response.body.accusedAddress).toBe(data.accusedAddress)
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
          expect(response.body.requestedCustodyRestrictions).toStrictEqual(
            data.requestedCustodyRestrictions,
          )
          expect(response.body.caseFacts).toBe(data.caseFacts)
          expect(response.body.witnessAccounts).toBe(data.witnessAccounts)
          expect(response.body.investigationProgress).toBe(
            data.investigationProgress,
          )
          expect(response.body.legalArguments).toBe(data.legalArguments)
          expect(response.body.comments).toBe(data.comments)
          expect(response.body.courtCaseNumber).toBe(data.courtCaseNumber)
          expect(response.body.courtStartTime).toBe(data.courtStartTime)
          expect(response.body.courtEndTime).toBe(data.courtEndTime)
          expect(response.body.courtAttendees).toBe(data.courtAttendees)
          expect(response.body.policeDemands).toBe(data.policeDemands)
          expect(response.body.accusedPlea).toBe(data.accusedPlea)
          expect(response.body.litigationPresentations).toBe(
            data.litigationPresentations,
          )
          expect(response.body.ruling).toBe(data.ruling)
          expect(response.body.custodyEndDate).toStrictEqual(
            data.custodyEndDate,
          )
          expect(response.body.custodyRestrictions).toStrictEqual(
            data.custodyRestrictions,
          )
          expect(response.body.accusedAppealDecision).toBe(
            data.accusedAppealDecision,
          )
          expect(response.body.prosecutorAppealDecision).toBe(
            data.prosecutorAppealDecision,
          )
          expect(response.body.notifications).toBeUndefined()

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
            expect(newValue.accusedNationalId).toBe(data.accusedNationalId)
            expect(newValue.accusedName).toBe(data.accusedName)
            expect(newValue.accusedAddress).toBe(data.accusedAddress)
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
            expect(newValue.requestedCustodyRestrictions).toStrictEqual(
              data.requestedCustodyRestrictions,
            )
            expect(newValue.caseFacts).toBe(data.caseFacts)
            expect(newValue.witnessAccounts).toBe(data.witnessAccounts)
            expect(newValue.investigationProgress).toBe(
              data.investigationProgress,
            )
            expect(newValue.legalArguments).toBe(data.legalArguments)
            expect(newValue.comments).toBe(data.comments)
            expect(newValue.courtCaseNumber).toBe(data.courtCaseNumber)
            expect(newValue.courtStartTime.toISOString()).toBe(
              data.courtStartTime,
            )
            expect(newValue.courtEndTime.toISOString()).toBe(data.courtEndTime)
            expect(newValue.courtAttendees).toBe(data.courtAttendees)
            expect(newValue.policeDemands).toBe(data.policeDemands)
            expect(newValue.accusedPlea).toBe(data.accusedPlea)
            expect(newValue.litigationPresentations).toBe(
              data.litigationPresentations,
            )
            expect(newValue.ruling).toBe(data.ruling)
            expect(newValue.custodyEndDate.toISOString()).toBe(
              data.custodyEndDate,
            )
            expect(newValue.custodyRestrictions).toStrictEqual(
              data.custodyRestrictions,
            )
            expect(newValue.accusedAppealDecision).toBe(
              data.accusedAppealDecision,
            )
            expect(newValue.prosecutorAppealDecision).toBe(
              data.prosecutorAppealDecision,
            )
            expect(newValue.notifications).toStrictEqual([])
          })
        })
    })
  })

  it('Put /api/case/:id/state should transition case to a new state', async () => {
    await Case.create(getMinimalCase()).then(async (value) => {
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
          expect(response.body.modified).not.toBe(value.modified.toISOString())
          expect(response.body.state).toBe(CaseState.SUBMITTED)

          // Check the data in the database
          await Case.findOne({
            where: { id: response.body.id },
          }).then((newValue) => {
            expect(newValue.modified.toISOString()).toBe(response.body.modified)
            expect(newValue.state).toBe(response.body.state)
          })
        })
    })
  })

  it('Get /api/cases should get all cases', async () => {
    await Case.create({
      state: CaseState.SUBMITTED,
      policeCaseNumber: 'Case Number 1',
      accusedNationalId: '0101010000',
    }).then(async (value1) => {
      await Case.create({
        state: CaseState.SUBMITTED,
        policeCaseNumber: 'Case Number 2',
        accusedNationalId: '1010109999',
      }).then(async (value2) => {
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
    await Case.create({
      state: CaseState.SUBMITTED,
      policeCaseNumber: 'Case Number',
      accusedNationalId: '0101010000',
      accusedName: 'Accused Name',
      accusedAddress: 'Accused Address',
      court: 'Court',
      arrestDate: '2020-09-08T08:00:00.000Z',
      requestedCourtDate: '2020-09-08T11:30:00.000Z',
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
          expect(response.body.accusedNationalId).toBe(value.accusedNationalId)
          expect(response.body.accusedName).toBe(value.accusedName)
          expect(response.body.accusedAddress).toBe(value.accusedAddress)
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
          expect(response.body.requestedCustodyRestrictions).toStrictEqual(
            value.requestedCustodyRestrictions,
          )
          expect(response.body.caseFacts).toBe(value.caseFacts)
          expect(response.body.witnessAccounts).toBe(value.witnessAccounts)
          expect(response.body.investigationProgress).toBe(
            value.investigationProgress,
          )
          expect(response.body.legalArguments).toBe(value.legalArguments)
          expect(response.body.comments).toBe(value.comments)
          expect(response.body.courtCaseNumber).toBe(value.courtCaseNumber)
          expect(response.body.courtStartTime).toBe(
            value.courtStartTime.toISOString(),
          )
          expect(response.body.courtEndTime).toBe(
            value.courtEndTime.toISOString(),
          )
          expect(response.body.courtAttendees).toBe(value.courtAttendees)
          expect(response.body.policeDemands).toBe(value.policeDemands)
          expect(response.body.accusedPlea).toBe(value.accusedPlea)
          expect(response.body.litigationPresentations).toBe(
            value.litigationPresentations,
          )
          expect(response.body.ruling).toBe(value.ruling)
          expect(response.body.custodyEndDate).toBe(
            value.custodyEndDate.toISOString(),
          )
          expect(response.body.custodyRestrictions).toStrictEqual(
            value.custodyRestrictions,
          )
          expect(response.body.accusedAppealDecision).toBe(
            value.accusedAppealDecision,
          )
          expect(response.body.prosecutorAppealDecision).toBe(
            value.prosecutorAppealDecision,
          )
          expect(response.body.notifications).toStrictEqual([])
        })
    })
  })

  it('POST /api/case/:id/notification should send a notification', async () => {
    await Case.create(getMinimalCase()).then(async (value) => {
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
    await Case.create(getMinimalCase()).then(async (caseValue) => {
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
    await Case.create(getMinimalCase()).then(async (caseValue) => {
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

function getMinimalCase() {
  return {
    policeCaseNumber: 'Case Number',
    accusedNationalId: '0101010000',
  }
}
