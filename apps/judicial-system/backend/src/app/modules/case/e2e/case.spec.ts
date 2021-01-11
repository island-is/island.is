import * as request from 'supertest'

import { INestApplication } from '@nestjs/common'

import {
  Case as TCase,
  CaseState,
  CaseTransition,
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseAppealDecision,
  CaseGender,
  User as TUser,
  CaseDecision,
} from '@island.is/judicial-system/types'
import { ACCESS_TOKEN_COOKIE_NAME } from '@island.is/judicial-system/consts'
import { SharedAuthService } from '@island.is/judicial-system/auth'

import { setup } from '../../../../../test/setup'
import { User } from '../../user'
import { Case } from '../models'

jest.setTimeout(10000)

let app: INestApplication
let prosecutor: TUser
let prosecutorAuthCookie: string
let judge: TUser
let judgeAuthCookie: string

interface CCase extends TCase {
  state: CaseState
  prosecutorId: string
  judgeId: string
}

beforeAll(async () => {
  app = await setup()

  const sharedAuthService = await app.resolve(SharedAuthService)

  prosecutor = (await request(app.getHttpServer()).get(`/api/user/2510654469`))
    .body
  prosecutorAuthCookie = sharedAuthService.signJwt(prosecutor)

  judge = (await request(app.getHttpServer()).get(`/api/user/1112902539`)).body
  judgeAuthCookie = sharedAuthService.signJwt(judge)
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
}

const remainingProsecutorCaseData = {
  arrestDate: '2020-09-08T08:00:00.000Z',
  requestedCourtDate: '2020-09-08T11:30:00.000Z',
  alternativeTravelBan: false,
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
}

const remainingJudgeCaseData = {
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
  decision: CaseDecision.ACCEPTING,
  custodyEndDate: '2020-09-28T12:00:00.000Z',
  custodyRestrictions: [CaseCustodyRestrictions.MEDIA],
  accusedAppealDecision: CaseAppealDecision.APPEAL,
  accusedAppealAnnouncement: 'Accused Appeal Announcement',
  prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
  prosecutorAppealAnnouncement: 'Prosecutor Appeal Announcement',
}

function getProsecutorCaseData(
  fullCreateCaseData: boolean,
  otherProsecutorCaseData: boolean,
) {
  let data = minimalCaseData
  if (fullCreateCaseData) {
    data = { ...data, ...remainingCreateCaseData }
  }
  if (otherProsecutorCaseData) {
    data = { ...data, ...remainingProsecutorCaseData }
  }
  return data
}

function getJudgeCaseData() {
  return remainingJudgeCaseData
}

function getCaseData(
  fullCreateCaseData = false,
  otherProsecutorCaseData = false,
  judgeCaseData = false,
) {
  let data = getProsecutorCaseData(fullCreateCaseData, otherProsecutorCaseData)
  if (judgeCaseData) {
    data = { ...data, ...getJudgeCaseData() }
  }

  return data as CCase
}

function caseToCCase(dbCase: Case) {
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
  } as unknown) as CCase
}

function parseBoolean(value: string | boolean) {
  return value === 'false' ? false : value === 'true' ? true : value || false
}

function expectCasesToMatch(caseOne: CCase, caseTwo: CCase) {
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
  expect(parseBoolean(caseOne.alternativeTravelBan)).toBe(
    parseBoolean(caseTwo.alternativeTravelBan),
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
  expect(caseOne.decision || null).toBe(caseTwo.decision || null)
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
}

describe('Case', () => {
  it('POST /api/case should create a case', async () => {
    const data = getCaseData(true)
    let apiCase: CCase

    await request(app.getHttpServer())
      .post('/api/case')
      .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${prosecutorAuthCookie}`)
      .send(data)
      .expect(201)
      .then((response) => {
        apiCase = response.body

        // Check the response
        expectCasesToMatch(apiCase, {
          ...data,
          id: apiCase.id || 'FAILURE',
          created: apiCase.created || 'FAILURE',
          modified: apiCase.modified || 'FAILURE',
          state: CaseState.NEW,
        })

        // Check the data in the database
        return Case.findOne({
          where: { id: apiCase.id },
          include: [
            { model: User, as: 'prosecutor' },
            { model: User, as: 'judge' },
          ],
        })
      })
      .then((value) => {
        expectCasesToMatch(caseToCCase(value), apiCase)
      })
  })

  it('POST /api/case with required fields should create a case', async () => {
    const data = getCaseData()
    let apiCase: CCase

    await request(app.getHttpServer())
      .post('/api/case')
      .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${prosecutorAuthCookie}`)
      .send(data)
      .expect(201)
      .then((response) => {
        apiCase = response.body

        // Check the response
        expectCasesToMatch(apiCase, {
          ...data,
          id: apiCase.id || 'FAILURE',
          created: apiCase.created || 'FAILURE',
          modified: apiCase.modified || 'FAILURE',
          state: CaseState.NEW,
        })

        // Check the data in the database
        return Case.findOne({
          where: { id: apiCase.id },
          include: [
            { model: User, as: 'prosecutor' },
            { model: User, as: 'judge' },
          ],
        })
      })
      .then((value) => {
        expectCasesToMatch(caseToCCase(value), apiCase)
      })
  })

  it('PUT /api/case/:id should update prosecutor fields of a case by id', async () => {
    const data = getCaseData(true, true)
    let dbCase: CCase
    let apiCase: CCase

    await Case.create(getCaseData())
      .then((value) => {
        dbCase = caseToCCase(value)

        return request(app.getHttpServer())
          .put(`/api/case/${value.id}`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${prosecutorAuthCookie}`)
          .send(data)
          .expect(200)
      })
      .then((response) => {
        apiCase = response.body

        // Check the response
        expect(apiCase.modified).not.toBe(dbCase.modified)
        expectCasesToMatch(apiCase, {
          ...data,
          id: dbCase.id || 'FAILURE',
          created: dbCase.created || 'FAILURE',
          modified: apiCase.modified,
          state: dbCase.state || 'FAILURE',
        } as CCase)

        // Check the data in the database
        return Case.findOne({
          where: { id: apiCase.id },
          include: [
            { model: User, as: 'prosecutor' },
            { model: User, as: 'judge' },
          ],
        })
      })
      .then((newValue) => {
        expectCasesToMatch(caseToCCase(newValue), apiCase)
      })
  })

  it('PUT /api/case/:id should update judge fields of a case by id', async () => {
    const judgeCaseData = getJudgeCaseData()
    let dbCase: CCase
    let apiCase: CCase

    await Case.create(getCaseData())
      .then((value) => {
        dbCase = caseToCCase(value)

        return request(app.getHttpServer())
          .put(`/api/case/${value.id}`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${judgeAuthCookie}`)
          .send(judgeCaseData)
          .expect(200)
      })
      .then((response) => {
        apiCase = response.body

        // Check the response
        expect(apiCase.modified).not.toBe(dbCase.modified)
        expectCasesToMatch(apiCase, {
          ...dbCase,
          modified: apiCase.modified,
          ...judgeCaseData,
        } as CCase)

        // Check the data in the database
        return Case.findOne({
          where: { id: apiCase.id },
          include: [
            { model: User, as: 'prosecutor' },
            { model: User, as: 'judge' },
          ],
        })
      })
      .then((newValue) => {
        expectCasesToMatch(caseToCCase(newValue), apiCase)
      })
  })

  it('Put /api/case/:id/state should transition case to a new state', async () => {
    let dbCase: CCase
    let apiCase: CCase

    await Case.create({ ...getCaseData(), state: CaseState.RECEIVED })
      .then((value) => {
        dbCase = caseToCCase(value)

        const data = {
          modified: value.modified.toISOString(),
          transition: CaseTransition.ACCEPT,
        }

        return request(app.getHttpServer())
          .put(`/api/case/${value.id}/state`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${judgeAuthCookie}`)
          .send(data)
          .expect(200)
      })
      .then((response) => {
        apiCase = response.body

        // Check the response
        expect(apiCase.modified).not.toBe(dbCase.modified)
        expect(apiCase.state).not.toBe(dbCase.state)
        expectCasesToMatch(apiCase, {
          ...dbCase,
          modified: apiCase.modified,
          state: CaseState.ACCEPTED,
          judgeId: judge.id,
        })

        // Check the data in the database
        return Case.findOne({
          where: { id: apiCase.id },
          include: [
            { model: User, as: 'prosecutor' },
            { model: User, as: 'judge' },
          ],
        })
      })
      .then((value) => {
        expectCasesToMatch(caseToCCase(value), {
          ...apiCase,
          judge: ({
            ...judge,
            created: value.judge.created,
            modified: value.judge.modified,
          } as unknown) as TUser,
        })
      })
  })

  it('Get /api/cases should get all cases', async () => {
    await Case.create(getCaseData())
      .then(() => Case.create(getCaseData()))
      .then(() =>
        request(app.getHttpServer())
          .get(`/api/cases`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${judgeAuthCookie}`)
          .send()
          .expect(200),
      )
      .then((response) => {
        // Check the response - should have at least two cases
        expect(response.body.length).toBeGreaterThanOrEqual(2)
      })
  })

  it('GET /api/case/:id should get a case by id', async () => {
    let dbCase: CCase

    await Case.create(getCaseData(true, true))
      .then((value) => {
        dbCase = caseToCCase(value)

        return request(app.getHttpServer())
          .get(`/api/case/${dbCase.id}`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${judgeAuthCookie}`)
          .send()
          .expect(200)
      })
      .then((response) => {
        // Check the response
        expectCasesToMatch(response.body, dbCase)
      })
  })

  it('POST /api/case/:id/signature should request a signature for a case', async () => {
    await Case.create({
      ...getCaseData(true, true),
      state: CaseState.REJECTED,
      judgeId: judge.id,
    })
      .then(async (value) =>
        request(app.getHttpServer())
          .post(`/api/case/${value.id}/signature`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${judgeAuthCookie}`)
          .expect(201),
      )
      .then(async (response) => {
        // Check the response
        expect(response.body.controlCode).toBe('0000')
        expect(response.body.documentToken).toBe('DEVELOPMENT')
      })
  })

  it('GET /api/case/:id/signature should confirm a signature for a case', async () => {
    await Case.create({
      ...getCaseData(),
      state: CaseState.ACCEPTED,
      judgeId: judge.id,
    })
      .then((value) =>
        request(app.getHttpServer())
          .get(`/api/case/${value.id}/signature`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${judgeAuthCookie}`)
          .query({ documentToken: 'DEVELOPMENT' })
          .expect(200),
      )
      .then(async (response) => {
        // Check the response
        expect(response.body).not.toBeNull()
        expect(response.body.documentSigned).toBe(true)
        expect(response.body.code).toBeUndefined()
        expect(response.body.message).toBeUndefined()
      })
  })
})
