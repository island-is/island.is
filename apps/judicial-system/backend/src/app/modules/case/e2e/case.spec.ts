import * as request from 'supertest'

import { INestApplication } from '@nestjs/common'

import {
  CaseState,
  CaseTransition,
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseAppealDecision,
  NotificationType,
  CaseGender,
} from '@island.is/judicial-system/types'

import { setup, user } from '../../../../../test/setup'
import { Notification } from '../../notification/notification.model'
import { Case } from '../models'
import { User } from '../../user'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

const minimalCaseData = {
  policeCaseNumber: 'Case Number',
  accusedNationalId: '0101010000',
}

const remainingCreateCaseData = {
  accusedName: 'Accused Name',
  accusedAddress: 'Accused Address',
  accusedGender: CaseGender.OTHER,
  requestedDefenderName: 'Requested Defender Name',
  requestedDefenderEmail: 'Requested Defender Email',
  court: 'Court',
  arrestDate: '2020-09-08T08:00:00.000Z',
  requestedCourtDate: '2020-09-08T11:30:00.000Z',
}

const remainingCaseData = {
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
  legalArguments: 'Legal Arguments',
  comments: 'Comments',
  courtCaseNumber: 'Court Case Number',
  courtDate: '2020-09-29T13:00:00.000Z',
  courtRoom: '201',
  defenderName: 'Defender Name',
  defenderEmail: 'Defender Email',
  courtStartTime: '2020-09-29T13:00:00.000Z',
  courtEndTime: '2020-09-29T14:00:00.000Z',
  courtAttendees: 'Court Attendees',
  policeDemands: 'Police Demands',
  accusedPlea: 'Accused Plea',
  litigationPresentations: 'Litigation Presentations',
  ruling: 'Ruling',
  rejecting: false,
  custodyEndDate: '2020-09-28T12:00:00.000Z',
  custodyRestrictions: [CaseCustodyRestrictions.MEDIA],
  accusedAppealDecision: CaseAppealDecision.APPEAL,
  accusedAppealAnnouncement: 'Accused Appeal Announcement',
  prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
  prosecutorAppealAnnouncement: 'Prosecutor Appeal Announcement',
}

function getCaseData(fullCreateCaseData = false, otherCaseData = false) {
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
    courtDate: theCase.courtDate && theCase.courtDate.toISOString(),
    courtStartTime:
      theCase.courtStartTime && theCase.courtStartTime.toISOString(),
    courtEndTime: theCase.courtEndTime && theCase.courtEndTime.toISOString(),
    custodyEndDate:
      theCase.custodyEndDate && theCase.custodyEndDate.toISOString(),
  } as unknown) as Case
}

function dbNotificationToNotification(dbNotification: Notification) {
  const notification = dbNotification.toJSON() as Notification

  return ({
    ...notification,
    created: notification.created && notification.created.toISOString(),
  } as unknown) as Notification
}

function parseBoolean(value: string | boolean) {
  return value === 'false' ? false : value === 'true' ? true : value || false
}

function expectCasesToMatch(caseOne: Case, caseTwo: Case) {
  expect(caseOne.id).toBe(caseTwo.id)
  expect(caseOne.created).toBe(caseTwo.created)
  expect(caseOne.modified).toBe(caseTwo.modified)
  expect(caseOne.state).toBe(caseTwo.state)
  expect(caseOne.policeCaseNumber).toBe(caseTwo.policeCaseNumber)
  expect(caseOne.accusedNationalId).toBe(caseTwo.accusedNationalId)
  expect(caseOne.accusedName || null).toBe(caseTwo.accusedName || null)
  expect(caseOne.accusedAddress || null).toBe(caseTwo.accusedAddress || null)
  expect(caseOne.accusedGender || null).toBe(caseTwo.accusedGender || null)
  expect(caseOne.requestedDefenderName || null).toBe(
    caseTwo.requestedDefenderName || null,
  )
  expect(caseOne.requestedDefenderEmail || null).toBe(
    caseTwo.requestedDefenderEmail || null,
  )
  expect(caseOne.court || null).toBe(caseTwo.court || null)
  expect(caseOne.arrestDate || null).toBe(caseTwo.arrestDate || null)
  expect(caseOne.requestedCourtDate || null).toBe(
    caseTwo.requestedCourtDate || null,
  )
  expect(caseOne.requestedCustodyEndDate || null).toBe(
    caseTwo.requestedCustodyEndDate || null,
  )
  expect(caseOne.lawsBroken || null).toBe(caseTwo.lawsBroken || null)
  expect(caseOne.custodyProvisions || null).toStrictEqual(
    caseTwo.custodyProvisions || null,
  )
  expect(caseOne.requestedCustodyRestrictions || null).toStrictEqual(
    caseTwo.requestedCustodyRestrictions || null,
  )
  expect(caseOne.caseFacts || null).toBe(caseTwo.caseFacts || null)
  expect(caseOne.legalArguments || null).toBe(caseTwo.legalArguments || null)
  expect(caseOne.comments || null).toBe(caseTwo.comments || null)
  expect(caseOne.prosecutorId || null).toStrictEqual(
    caseTwo.prosecutorId || null,
  )
  expect(caseOne.prosecutor || null).toStrictEqual(caseTwo.prosecutor || null)
  expect(caseOne.courtCaseNumber || null).toBe(caseTwo.courtCaseNumber || null)
  expect(caseOne.courtDate || null).toBe(caseTwo.courtDate || null)
  expect(caseOne.courtRoom || null).toBe(caseTwo.courtRoom || null)
  expect(caseOne.defenderName || null).toBe(caseTwo.defenderName || null)
  expect(caseOne.defenderEmail || null).toBe(caseTwo.defenderEmail || null)
  expect(caseOne.courtStartTime || null).toBe(caseTwo.courtStartTime || null)
  expect(caseOne.courtEndTime || null).toBe(caseTwo.courtEndTime || null)
  expect(caseOne.courtAttendees || null).toBe(caseTwo.courtAttendees || null)
  expect(caseOne.policeDemands || null).toBe(caseTwo.policeDemands || null)
  expect(caseOne.accusedPlea || null).toBe(caseTwo.accusedPlea || null)
  expect(caseOne.litigationPresentations || null).toBe(
    caseTwo.litigationPresentations || null,
  )
  expect(caseOne.ruling || null).toBe(caseTwo.ruling || null)
  expect(parseBoolean(caseOne.rejecting)).toBe(parseBoolean(caseTwo.rejecting))
  expect(caseOne.custodyEndDate || null).toBe(caseTwo.custodyEndDate || null)
  expect(caseOne.custodyRestrictions || null).toStrictEqual(
    caseTwo.custodyRestrictions || null,
  )
  expect(caseOne.accusedAppealDecision || null).toBe(
    caseTwo.accusedAppealDecision || null,
  )
  expect(caseOne.accusedAppealAnnouncement || null).toBe(
    caseTwo.accusedAppealAnnouncement || null,
  )
  expect(caseOne.prosecutorAppealDecision || null).toBe(
    caseTwo.prosecutorAppealDecision || null,
  )
  expect(caseOne.prosecutorAppealAnnouncement || null).toBe(
    caseTwo.prosecutorAppealAnnouncement || null,
  )
  expect(caseOne.judgeId || null).toStrictEqual(caseTwo.judgeId || null)
  expect(caseOne.judge || null).toStrictEqual(caseTwo.judge || null)
  expect(caseOne.notifications).toStrictEqual(caseTwo.notifications)
}

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
          include: [
            Notification,
            { model: User, as: 'prosecutor' },
            { model: User, as: 'judge' },
          ],
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
          include: [
            Notification,
            { model: User, as: 'prosecutor' },
            { model: User, as: 'judge' },
          ],
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
            state: dbCase.state || 'FAILURE',
          } as Case)

          // Check the data in the database
          await Case.findOne({
            where: { id: response.body.id },
            include: [
              Notification,
              { model: User, as: 'prosecutor' },
              { model: User, as: 'judge' },
            ],
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
    await Case.create({ ...getCaseData(), state: CaseState.SUBMITTED }).then(
      async (value) => {
        const data = {
          nationalId: user.nationalId,
          modified: value.modified.toISOString(),
          transition: CaseTransition.ACCEPT,
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
              state: CaseState.ACCEPTED,
              judgeId: user.id,
            } as Case)

            // Check the data in the database
            await Case.findOne({
              where: { id: response.body.id },
              include: [
                Notification,
                { model: User, as: 'prosecutor' },
                { model: User, as: 'judge' },
              ],
            }).then((newValue) => {
              expectCasesToMatch(dbCaseToCase(newValue), {
                ...response.body,
                judge: {
                  ...user,
                  created: newValue.judge.created,
                  modified: newValue.judge.modified,
                },
                notifications: [],
              })
            })
          })
      },
    )
  })

  it('Get /api/cases should get all cases', async () => {
    await Case.create(getCaseData()).then(async () => {
      await Case.create(getCaseData()).then(async () => {
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

  it('GET /api/case/:id should include notifications', async () => {
    await Case.create({ ...getCaseData(), state: CaseState.REJECTED }).then(
      async (caseValue) => {
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
              const dbCase = dbCaseToCase(caseValue)
              expectCasesToMatch(response.body, {
                ...dbCase,
                notifications: [
                  dbNotificationToNotification(notificationValue),
                ],
              } as Case)
            })
        })
      },
    )
  })

  it('POST /api/case/:id/signature should request a signature for a case', async () => {
    await Case.create({
      ...getCaseData(true, true),
      state: CaseState.REJECTED,
      judgeId: user.id,
    }).then(async (value) => {
      await request(app.getHttpServer())
        .post(`/api/case/${value.id}/signature`)
        .expect(201)
        .then(async (response) => {
          // Check the response
          expect(response.body.controlCode).toBe('0000')
          expect(response.body.documentToken).toBe('DEVELOPMENT')
        })
    })
  })

  it('GET /api/case/:id/signature should confirm a signature for a case', async () => {
    await Case.create({
      ...getCaseData(),
      state: CaseState.ACCEPTED,
      judgeId: user.id,
    }).then(async (value) => {
      await request(app.getHttpServer())
        .get(`/api/case/${value.id}/signature`)
        .query({ documentToken: 'DEVELOPMENT' })
        .expect(200)
        .then(async (response) => {
          // Check the response
          expect(response.body).not.toBeNull()
          expect(response.body.documentSigned).toBe(true)
          expect(response.body.code).toBeUndefined()
          expect(response.body.message).toBeUndefined()
        })
    })
  })
})
