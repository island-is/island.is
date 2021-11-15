import { Sequelize } from 'sequelize-typescript'
import { execSync } from 'child_process'
import request from 'supertest'

import { getConnectionToken } from '@nestjs/sequelize'
import { INestApplication, Type } from '@nestjs/common'

import { testServer } from '@island.is/infra-nest-server'
import {
  CaseState,
  CaseTransition,
  CaseLegalProvisions,
  CaseCustodyRestrictions,
  CaseAppealDecision,
  CaseGender,
  CaseDecision,
  NotificationType,
  CaseType,
  UserRole,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import type {
  User as TUser,
  Case as TCase,
  Institution as TInstitution,
} from '@island.is/judicial-system/types'
import { ACCESS_TOKEN_COOKIE_NAME } from '@island.is/judicial-system/consts'
import { SharedAuthService } from '@island.is/judicial-system/auth'

import { environment } from '../src/environments'
import { AppModule } from '../src/app'
import { Institution } from '../src/app/modules/institution'
import { User } from '../src/app/modules/user'
import { Case } from '../src/app/modules/case'
import {
  Notification,
  SendNotificationResponse,
} from '../src/app/modules/notification/models'

interface CUser extends TUser {
  institutionId: string
}

interface CCase extends TCase {
  courtId: string
  prosecutorId: string
  prosecutor: CUser
  sharedWithProsecutorsOfficeId: string
  judgeId: string
  judge: CUser
  registrarId: string
  registrar: CUser
  parentCaseId: string
  parentCase: CCase
}

let app: INestApplication
let sequelize: Sequelize
const courtName = 'Héraðsdómur Reykjavíkur'
let court: TInstitution
const prosecutorNationalId = '0000000009'
let prosecutor: CUser
let prosecutorAuthCookie: string
const prosecutorsOfficeName = 'Lögreglustjórinn á höfuðborgarsvæðinu'
let sharedWithProsecutorsOffice: TInstitution
const registrarNationalId = '0000001119'
let registrar: CUser
const judgeNationalId = '0000002229'
let judge: CUser
let judgeAuthCookie: string
const adminNationalId = '3333333333'
let admin: CUser
let adminAuthCookie: string

beforeAll(async () => {
  app = await testServer({ appModule: AppModule })

  sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)

  // Need to use sequelize-cli becuase sequelize.sync does not keep track of completed migrations
  // await sequelize.sync()
  execSync('yarn nx run judicial-system-backend:migrate')

  // Seed the database
  execSync('yarn nx run judicial-system-backend:seed')

  const sharedAuthService = await app.resolve(SharedAuthService)

  await Institution.findOne({ where: { name: courtName } }).then((value) => {
    court = institutionToTInstitution(value?.toJSON() as Institution)
    return
  })

  prosecutor = (
    await request(app.getHttpServer())
      .get(`/api/user/?nationalId=${prosecutorNationalId}`)
      .set('authorization', `Bearer ${environment.auth.secretToken}`)
  ).body
  prosecutorAuthCookie = sharedAuthService.signJwt(prosecutor)

  await Institution.findOne({ where: { name: prosecutorsOfficeName } }).then(
    (value) => {
      sharedWithProsecutorsOffice = institutionToTInstitution(
        value?.toJSON() as Institution,
      )
      return
    },
  )

  judge = (
    await request(app.getHttpServer())
      .get(`/api/user/?nationalId=${judgeNationalId}`)
      .set('authorization', `Bearer ${environment.auth.secretToken}`)
  ).body
  judgeAuthCookie = sharedAuthService.signJwt(judge)

  registrar = (
    await request(app.getHttpServer())
      .get(`/api/user/${registrarNationalId}`)
      .set('authorization', `Bearer ${environment.auth.secretToken}`)
  ).body

  admin = (
    await request(app.getHttpServer())
      .get(`/api/user/?nationalId=${adminNationalId}`)
      .set('authorization', `Bearer ${environment.auth.secretToken}`)
  ).body
  adminAuthCookie = sharedAuthService.signJwt(admin)
})

afterAll(async () => {
  if (app && sequelize) {
    await app.close()
    await sequelize.close()
  }
})

const minimalCaseData = {
  policeCaseNumber: 'Case Number',
  accusedNationalId: '0101010000',
}

function remainingCreateCaseData() {
  return {
    description: 'Description',
    accusedName: 'Accused Name',
    accusedAddress: 'Accused Address',
    accusedGender: CaseGender.OTHER,
    defenderName: 'Defender Name',
    defenderEmail: 'Defender Email',
    defenderPhoneNumber: '555-5555',
    sendRequestToDefender: true,
    courtId: court.id,
    leadInvestigator: 'Lead Investigator',
  }
}

function remainingProsecutorCaseData() {
  return {
    arrestDate: '2020-09-08T08:00:00.000Z',
    requestedCourtDate: '2020-09-08T11:30:00.000Z',
    requestedValidToDate: '2020-09-29T12:00:00.000Z',
    demands: 'Demands',
    lawsBroken: 'Broken Laws',
    legalBasis: 'Legal Basis',
    legalProvisions: [CaseLegalProvisions._95_1_A, CaseLegalProvisions._99_1_B],
    requestedCustodyRestrictions: [
      CaseCustodyRestrictions.ISOLATION,
      CaseCustodyRestrictions.MEDIA,
    ],
    requestedOtherRestrictions: 'Requested Other Restrictions',
    caseFacts: 'Case Facts',
    legalArguments: 'Legal Arguments',
    requestProsecutorOnlySession: true,
    prosecutorOnlySessionRequest: 'Prosecutor Only Session Request',
    comments: 'Comments',
    caseFilesComments: 'Case Files Comments',
    prosecutorId: prosecutor.id,
    sharedWithProsecutorsOfficeId: sharedWithProsecutorsOffice.id,
  }
}

function remainingJudgeCaseData() {
  return {
    courtCaseNumber: 'Court Case Number',
    sessionArrangements: SessionArrangements.PROSECUTOR_PRESENT,
    courtDate: '2020-09-29T13:00:00.000Z',
    courtRoom: '201',
    defenderIsSpokesperson: true,
    courtStartDate: '2020-09-29T13:00:00.000Z',
    courtEndTime: '2020-09-29T14:00:00.000Z',
    isClosedCourtHidden: true,
    courtAttendees: 'Court Attendees',
    prosecutorDemands: 'Police Demands',
    courtDocuments: ['Þingskjal 1', 'Þingskjal 2'],
    accusedBookings: 'Accused Plea',
    litigationPresentations: 'Litigation Presentations',
    courtCaseFacts: 'Court Case Facts',
    courtLegalArguments: 'Court Legal Arguments',
    ruling: 'Ruling',
    decision: CaseDecision.ACCEPTING,
    validToDate: '2021-09-28T12:00:00.000Z',
    custodyRestrictions: [CaseCustodyRestrictions.MEDIA],
    otherRestrictions: 'Other Restrictions',
    isolationToDate: '2021-09-10T12:00:00.000Z',
    conclusion: 'Addition to Conclusion',
    accusedAppealDecision: CaseAppealDecision.APPEAL,
    accusedAppealAnnouncement: 'Accused Appeal Announcement',
    prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
    prosecutorAppealAnnouncement: 'Prosecutor Appeal Announcement',
    accusedPostponedAppealDate: '2020-09-30T12:00:00.000Z',
    prosecutorPostponedAppealDate: '2020-09-29T12:00:00.000Z',
    judgeId: judge.id,
    registrarId: registrar.id,
  }
}

function getProsecutorCaseData(
  fullCreateCaseData: boolean,
  otherProsecutorCaseData: boolean,
) {
  let data = minimalCaseData
  if (fullCreateCaseData) {
    data = { ...data, ...remainingCreateCaseData() }
  }
  if (otherProsecutorCaseData) {
    data = { ...data, ...remainingProsecutorCaseData() }
  }
  return data
}

function getJudgeCaseData() {
  return remainingJudgeCaseData()
}

function getCaseType() {
  return { type: CaseType.CUSTODY }
}

function getCaseData(
  withCaseType = true,
  fullCreateCaseData = false,
  otherProsecutorCaseData = false,
  judgeCaseData = false,
) {
  let data = getProsecutorCaseData(fullCreateCaseData, otherProsecutorCaseData)
  if (judgeCaseData) {
    data = { ...data, ...getJudgeCaseData() }
  }
  if (withCaseType) {
    data = { ...data, ...getCaseType() }
  }

  return data as CCase
}

function institutionToTInstitution(institution: Institution) {
  return ({
    ...institution,
    created: institution.created && institution.created.toISOString(),
    modified: institution.modified && institution.modified.toISOString(),
  } as unknown) as TInstitution
}

function userToCUser(user: User) {
  return ({
    ...user,
    created: user.created && user.created.toISOString(),
    modified: user.modified && user.modified.toISOString(),
    institution:
      user.institution && institutionToTInstitution(user.institution),
  } as unknown) as CUser
}

function caseToCCase(dbCase: Case): CCase {
  const theCase = dbCase.toJSON() as Case

  return ({
    ...theCase,
    created: theCase.created && theCase.created.toISOString(),
    modified: theCase.modified && theCase.modified.toISOString(),
    court: theCase.court && institutionToTInstitution(theCase.court),
    arrestDate: theCase.arrestDate && theCase.arrestDate.toISOString(),
    requestedCourtDate:
      theCase.requestedCourtDate && theCase.requestedCourtDate.toISOString(),
    requestedValidToDate:
      theCase.requestedValidToDate &&
      theCase.requestedValidToDate.toISOString(),
    prosecutor: theCase.prosecutor && userToCUser(theCase.prosecutor),
    sharedWithProsecutorsOffice:
      theCase.sharedWithProsecutorsOffice &&
      institutionToTInstitution(theCase.sharedWithProsecutorsOffice),
    courtDate: theCase.courtDate && theCase.courtDate.toISOString(),
    courtStartDate:
      theCase.courtStartDate && theCase.courtStartDate.toISOString(),
    courtEndTime: theCase.courtEndTime && theCase.courtEndTime.toISOString(),
    validToDate: theCase.validToDate && theCase.validToDate.toISOString(),
    isolationToDate:
      theCase.isolationToDate && theCase.isolationToDate.toISOString(),
    rulingDate: theCase.rulingDate && theCase.rulingDate.toISOString(),
    accusedPostponedAppealDate:
      theCase.accusedPostponedAppealDate &&
      theCase.accusedPostponedAppealDate.toISOString(),
    prosecutorPostponedAppealDate:
      theCase.prosecutorPostponedAppealDate &&
      theCase.prosecutorPostponedAppealDate.toISOString(),
    judge: theCase.judge && userToCUser(theCase.judge),
    registrar: theCase.registrar && userToCUser(theCase.registrar),
    parentCase: theCase.parentCase
      ? caseToCCase(theCase.parentCase)
      : theCase.parentCase,
  } as unknown) as CCase
}

function expectInstitutionsToMatch(
  institutionOne?: TInstitution,
  institutionTwo?: TInstitution,
) {
  expect(institutionOne?.id).toBe(institutionTwo?.id)
  expect(institutionOne?.created).toBe(institutionTwo?.created)
  expect(institutionOne?.modified).toBe(institutionTwo?.modified)
  expect(institutionOne?.type).toBe(institutionTwo?.type)
  expect(institutionOne?.name).toBe(institutionTwo?.name)
}

function expectUsersToMatch(userOne: CUser, userTwo: CUser) {
  expect(userOne?.id).toBe(userTwo?.id)
  expect(userOne?.created).toBe(userTwo?.created)
  expect(userOne?.modified).toBe(userTwo?.modified)
  expect(userOne?.nationalId).toBe(userTwo?.nationalId)
  expect(userOne?.name).toBe(userTwo?.name)
  expect(userOne?.title).toBe(userTwo?.title)
  expect(userOne?.mobileNumber).toBe(userTwo?.mobileNumber)
  expect(userOne?.email).toBe(userTwo?.email)
  expect(userOne?.role).toBe(userTwo?.role)
  expect(userOne?.institutionId ?? null).toBe(userTwo?.institutionId ?? null)
  expectInstitutionsToMatch(userOne?.institution, userTwo?.institution)
  expect(userOne?.active).toBe(userTwo?.active)
}

function expectCasesToMatch(caseOne: CCase, caseTwo: CCase) {
  expect(caseOne.id).toBe(caseTwo.id)
  expect(caseOne.created).toBe(caseTwo.created)
  expect(caseOne.modified).toBe(caseTwo.modified)
  expect(caseOne.type).toBe(caseTwo.type)
  expect(caseOne.description ?? null).toBe(caseTwo.description ?? null)
  expect(caseOne.state).toBe(caseTwo.state)
  expect(caseOne.policeCaseNumber).toBe(caseTwo.policeCaseNumber)
  expect(caseOne.accusedNationalId).toBe(caseTwo.accusedNationalId)
  expect(caseOne.accusedName ?? null).toBe(caseTwo.accusedName ?? null)
  expect(caseOne.accusedAddress ?? null).toBe(caseTwo.accusedAddress ?? null)
  expect(caseOne.accusedGender ?? null).toBe(caseTwo.accusedGender ?? null)
  expect(caseOne.defenderName ?? null).toBe(caseTwo.defenderName ?? null)
  expect(caseOne.defenderEmail ?? null).toBe(caseTwo.defenderEmail ?? null)
  expect(caseOne.defenderPhoneNumber ?? null).toBe(
    caseTwo.defenderPhoneNumber ?? null,
  )
  expect(caseOne.sendRequestToDefender ?? null).toBe(
    caseTwo.sendRequestToDefender ?? null,
  )
  expect(caseOne.defenderIsSpokesperson ?? null).toBe(
    caseTwo.defenderIsSpokesperson ?? null,
  )
  expect(caseOne.isHeightenedSecurityLevel ?? null).toBe(
    caseTwo.isHeightenedSecurityLevel ?? null,
  )
  expect(caseOne.courtId ?? null).toBe(caseTwo.courtId ?? null)
  expectInstitutionsToMatch(caseOne.court, caseTwo.court)
  expect(caseOne.leadInvestigator ?? null).toBe(
    caseTwo.leadInvestigator ?? null,
  )
  expect(caseOne.arrestDate ?? null).toBe(caseTwo.arrestDate ?? null)
  expect(caseOne.requestedCourtDate ?? null).toBe(
    caseTwo.requestedCourtDate ?? null,
  )
  expect(caseOne.translator ?? null).toBe(caseTwo.translator ?? null)
  expect(caseOne.requestedValidToDate ?? null).toBe(
    caseTwo.requestedValidToDate ?? null,
  )
  expect(caseOne.demands ?? null).toBe(caseTwo.demands ?? null)
  expect(caseOne.lawsBroken ?? null).toBe(caseTwo.lawsBroken ?? null)
  expect(caseOne.legalBasis ?? null).toBe(caseTwo.legalBasis ?? null)
  expect(caseOne.legalProvisions ?? null).toStrictEqual(
    caseTwo.legalProvisions ?? null,
  )
  expect(caseOne.requestedCustodyRestrictions ?? null).toStrictEqual(
    caseTwo.requestedCustodyRestrictions ?? null,
  )
  expect(caseOne.requestedOtherRestrictions ?? null).toBe(
    caseTwo.requestedOtherRestrictions ?? null,
  )
  expect(caseOne.caseFacts ?? null).toBe(caseTwo.caseFacts ?? null)
  expect(caseOne.legalArguments ?? null).toBe(caseTwo.legalArguments ?? null)
  expect(caseOne.requestProsecutorOnlySession ?? null).toBe(
    caseTwo.requestProsecutorOnlySession ?? null,
  )
  expect(caseOne.prosecutorOnlySessionRequest ?? null).toBe(
    caseTwo.prosecutorOnlySessionRequest ?? null,
  )
  expect(caseOne.comments ?? null).toBe(caseTwo.comments ?? null)
  expect(caseOne.caseFilesComments ?? null).toBe(
    caseTwo.caseFilesComments ?? null,
  )
  expect(caseOne.prosecutorId ?? null).toBe(caseTwo.prosecutorId ?? null)
  expectUsersToMatch(caseOne.prosecutor, caseTwo.prosecutor)
  expect(caseOne.sharedWithProsecutorsOfficeId ?? null).toBe(
    caseTwo.sharedWithProsecutorsOfficeId ?? null,
  )
  expectInstitutionsToMatch(
    caseOne.sharedWithProsecutorsOffice,
    caseTwo.sharedWithProsecutorsOffice,
  )
  expect(caseOne.courtCaseNumber ?? null).toBe(caseTwo.courtCaseNumber ?? null)
  expect(caseOne.sessionArrangements ?? null).toBe(
    caseTwo.sessionArrangements ?? null,
  )
  expect(caseOne.courtDate ?? null).toBe(caseTwo.courtDate ?? null)
  expect(caseOne.courtLocation ?? null).toBe(caseTwo.courtLocation ?? null)
  expect(caseOne.courtRoom ?? null).toBe(caseTwo.courtRoom ?? null)
  expect(caseOne.courtStartDate ?? null).toBe(caseTwo.courtStartDate ?? null)
  expect(caseOne.courtEndTime ?? null).toBe(caseTwo.courtEndTime ?? null)
  expect(caseOne.isClosedCourtHidden ?? null).toBe(
    caseTwo.isClosedCourtHidden ?? null,
  )
  expect(caseOne.courtAttendees ?? null).toBe(caseTwo.courtAttendees ?? null)
  expect(caseOne.prosecutorDemands ?? null).toBe(
    caseTwo.prosecutorDemands ?? null,
  )
  expect(caseOne.courtDocuments ?? null).toStrictEqual(
    caseTwo.courtDocuments ?? null,
  )
  expect(caseOne.accusedBookings ?? null).toBe(caseTwo.accusedBookings ?? null)
  expect(caseOne.litigationPresentations ?? null).toBe(
    caseTwo.litigationPresentations ?? null,
  )
  expect(caseOne.courtCaseFacts ?? null).toBe(caseTwo.courtCaseFacts ?? null)
  expect(caseOne.courtLegalArguments ?? null).toBe(
    caseTwo.courtLegalArguments ?? null,
  )
  expect(caseOne.ruling ?? null).toBe(caseTwo.ruling ?? null)
  expect(caseOne.decision ?? null).toBe(caseTwo.decision ?? null)
  expect(caseOne.validToDate ?? null).toBe(caseTwo.validToDate ?? null)
  expect(caseOne.custodyRestrictions ?? null).toStrictEqual(
    caseTwo.custodyRestrictions ?? null,
  )
  expect(caseOne.otherRestrictions ?? null).toBe(
    caseTwo.otherRestrictions ?? null,
  )
  expect(caseOne.isolationToDate ?? null).toBe(caseTwo.isolationToDate ?? null)
  expect(caseOne.conclusion ?? null).toBe(caseTwo.conclusion ?? null)
  expect(caseOne.accusedAppealDecision ?? null).toBe(
    caseTwo.accusedAppealDecision ?? null,
  )
  expect(caseOne.accusedAppealAnnouncement ?? null).toBe(
    caseTwo.accusedAppealAnnouncement ?? null,
  )
  expect(caseOne.prosecutorAppealDecision ?? null).toBe(
    caseTwo.prosecutorAppealDecision ?? null,
  )
  expect(caseOne.prosecutorAppealAnnouncement ?? null).toBe(
    caseTwo.prosecutorAppealAnnouncement ?? null,
  )
  expect(caseOne.rulingDate ?? null).toBe(caseTwo.rulingDate ?? null)
  expect(caseOne.accusedPostponedAppealDate ?? null).toBe(
    caseTwo.accusedPostponedAppealDate ?? null,
  )
  expect(caseOne.prosecutorPostponedAppealDate ?? null).toBe(
    caseTwo.prosecutorPostponedAppealDate ?? null,
  )
  expect(caseOne.judgeId ?? null).toBe(caseTwo.judgeId ?? null)
  expectUsersToMatch(caseOne.judge, caseTwo.judge)
  expect(caseOne.registrarId ?? null).toBe(caseTwo.registrarId ?? null)
  expectUsersToMatch(caseOne.registrar, caseTwo.registrar)
  expect(caseOne.parentCaseId ?? null).toBe(caseTwo.parentCaseId ?? null)
  if (caseOne.parentCase || caseTwo.parentCase) {
    expectCasesToMatch(caseOne.parentCase, caseTwo.parentCase)
  }
}

function getCase(id: string): Case | PromiseLike<Case> {
  return Case.findOne({
    where: { id },
    include: [
      {
        model: Institution,
        as: 'court',
      },
      {
        model: User,
        as: 'prosecutor',
        include: [{ model: Institution, as: 'institution' }],
      },
      { model: Institution, as: 'sharedWithProsecutorsOffice' },
      {
        model: User,
        as: 'judge',
        include: [{ model: Institution, as: 'institution' }],
      },
      {
        model: User,
        as: 'registrar',
        include: [{ model: Institution, as: 'institution' }],
      },
    ],
  })
}

describe('Institution', () => {
  it('GET /api/institutions should get all institutions', async () => {
    await request(app.getHttpServer())
      .get('/api/institutions')
      .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${adminAuthCookie}`)
      .send()
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(8)
      })
  })
})

describe('User', () => {
  it('POST /api/user should create a user', async () => {
    const data = {
      nationalId: '1234567890',
      name: 'The User',
      title: 'The Title',
      mobileNumber: '1234567',
      email: 'user@dmr.is',
      role: UserRole.JUDGE,
      institutionId: 'a38666f3-0444-4e44-9654-b83f39f4db11',
      active: true,
    }
    let apiUser: CUser

    await User.destroy({
      where: {
        national_id: data.nationalId,
      },
    })
      .then(() => {
        return request(app.getHttpServer())
          .post('/api/user')
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${adminAuthCookie}`)
          .send(data)
          .expect(201)
      })
      .then((response) => {
        apiUser = response.body

        // Check the response
        expectUsersToMatch(apiUser, {
          ...data,
          id: apiUser.id ?? 'FAILURE',
          created: apiUser.created ?? 'FAILURE',
          modified: apiUser.modified ?? 'FAILURE',
        })

        // Check the data in the database
        return User.findOne({ where: { id: apiUser.id } })
      })
      .then((value) => {
        expectUsersToMatch(userToCUser(value?.toJSON() as User), apiUser)
      })
  })

  it('PUT /api/user/:id should update fields of a user by id', async () => {
    const nationalId = '0987654321'
    const data = {
      name: 'The Modified User',
      title: 'The Modified Title',
      mobileNumber: '7654321',
      email: 'modifieduser@dmr.is',
      role: UserRole.PROSECUTOR,
      institutionId: '7b261673-8990-46b4-a310-5412ad77686a',
      active: false,
    }
    let dbUser: CUser
    let apiUser: CUser

    await User.destroy({
      where: {
        national_id: nationalId,
      },
    })
      .then(() => {
        return User.create({
          nationalId: nationalId,
          name: 'The User',
          title: 'The Title',
          mobileNumber: '1234567',
          email: 'user@dmr.is',
          role: UserRole.JUDGE,
          institutionId: 'a38666f3-0444-4e44-9654-b83f39f4db11',
          active: true,
        })
      })
      .then((value) => {
        dbUser = userToCUser(value.toJSON() as User)

        return request(app.getHttpServer())
          .put(`/api/user/${dbUser.id}`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${adminAuthCookie}`)
          .send(data)
          .expect(200)
      })
      .then((response) => {
        apiUser = response.body

        // Check the response
        expect(apiUser.modified).not.toBe(dbUser.modified)
        expectUsersToMatch(apiUser, {
          ...data,
          id: dbUser.id ?? 'FAILURE',
          created: dbUser.created ?? 'FAILURE',
          modified: apiUser.modified,
          nationalId: dbUser.nationalId ?? 'FAILURE',
        } as CUser)

        // Check the data in the database
        return User.findOne({
          where: { id: apiUser.id },
        })
      })
      .then((newValue) => {
        expectUsersToMatch(userToCUser(newValue?.toJSON() as User), apiUser)
      })
  })

  it('GET /api/users should get all users', async () => {
    await request(app.getHttpServer())
      .get('/api/users')
      .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${adminAuthCookie}`)
      .send()
      .expect(200)
      .then((response) => {
        // Check the response - should have at least the three default users
        expect(response.body.length).toBeGreaterThanOrEqual(3)
      })
  })

  it('GET /api/user/:id should get the user', async () => {
    await request(app.getHttpServer())
      .get(`/api/user/${prosecutor.id}`)
      .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${adminAuthCookie}`)
      .send()
      .expect(200)
      .then((response) => {
        expectUsersToMatch(response.body, prosecutor)
      })
  })

  it('GET /api/user/?nationalId=<national id> should get the user', async () => {
    let dbUser: CUser

    await User.findOne({
      where: { national_id: judgeNationalId },
      include: [{ model: Institution, as: 'institution' }],
    })
      .then((value) => {
        dbUser = userToCUser(value?.toJSON() as User)

        return request(app.getHttpServer())
          .get(`/api/user/?nationalId=${judgeNationalId}`)
          .set('authorization', `Bearer ${environment.auth.secretToken}`)
          .send()
          .expect(200)
      })
      .then((response) => {
        expectUsersToMatch(response.body, dbUser)
      })
  })
})

describe('Case', () => {
  it('POST /api/case should create a case', async () => {
    const data = getCaseData(true, true)
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
          id: apiCase.id ?? 'FAILURE',
          created: apiCase.created ?? 'FAILURE',
          modified: apiCase.modified ?? 'FAILURE',
          state: CaseState.NEW,
          prosecutorId: prosecutor.id,
          prosecutor,
          court,
        })

        // Check the data in the database
        return getCase(apiCase.id)
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
          id: apiCase.id ?? 'FAILURE',
          created: apiCase.created ?? 'FAILURE',
          modified: apiCase.modified ?? 'FAILURE',
          state: CaseState.NEW,
          prosecutorId: prosecutor.id,
          prosecutor,
        })

        // Check the data in the database
        return getCase(apiCase.id)
      })
      .then((value) => {
        expectCasesToMatch(caseToCCase(value), apiCase)
      })
  })

  it('PUT /api/case/:id should update prosecutor fields of a case by id', async () => {
    const data = getCaseData(true, true, true)
    let dbCase: CCase
    let apiCase: CCase

    await Case.create(getCaseData())
      .then((value) => {
        dbCase = caseToCCase(value)

        return request(app.getHttpServer())
          .put(`/api/case/${dbCase.id}`)
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
          id: dbCase.id ?? 'FAILURE',
          created: dbCase.created ?? 'FAILURE',
          modified: apiCase.modified,
          type: dbCase.type,
          state: dbCase.state ?? 'FAILURE',
          court,
          prosecutor,
          sharedWithProsecutorsOffice,
        } as CCase)

        // Check the data in the database
        return getCase(apiCase.id)
      })
      .then((newValue) => {
        expectCasesToMatch(caseToCCase(newValue), apiCase)
      })
  })

  it('PUT /api/case/:id should update judge fields of a case by id', async () => {
    const judgeCaseData = getJudgeCaseData()
    let dbCase: CCase
    let apiCase: CCase

    await Case.create({
      ...getCaseData(),
      state: CaseState.DRAFT,
    })
      .then((value) => {
        dbCase = caseToCCase(value)

        return request(app.getHttpServer())
          .put(`/api/case/${dbCase.id}`)
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
          judge,
        } as CCase)

        // Check the data in the database
        return getCase(apiCase.id)
      })
      .then((newValue) => {
        expectCasesToMatch(caseToCCase(newValue), apiCase)
      })
  })

  it('PUT /api/case/:id/state should transition case to a new state', async () => {
    let dbCase: CCase
    let apiCase: CCase

    await Case.create({
      ...getCaseData(true, true, true, true),
      state: CaseState.RECEIVED,
    })
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
          court,
          prosecutor,
          sharedWithProsecutorsOffice,
          judge,
        })

        // Check the data in the database
        return getCase(apiCase.id)
      })
      .then((value) => {
        expectCasesToMatch(caseToCCase(value), {
          ...apiCase,
          court,
          prosecutor,
          sharedWithProsecutorsOffice,
          judge,
          registrar,
        })
      })
  })

  it('Get /api/cases should get all cases', async () => {
    await Case.create(getCaseData())
      .then(() => Case.create(getCaseData()))
      .then(() =>
        request(app.getHttpServer())
          .get(`/api/cases`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${prosecutorAuthCookie}`)
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

    await Case.create(getCaseData(true, true, true, true))
      .then((value) => {
        dbCase = caseToCCase(value)

        return request(app.getHttpServer())
          .get(`/api/case/${dbCase.id}`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${prosecutorAuthCookie}`)
          .send()
          .expect(200)
      })
      .then((response) => {
        // Check the response
        expectCasesToMatch(response.body, {
          ...dbCase,
          court,
          prosecutor,
          sharedWithProsecutorsOffice,
          judge,
          registrar,
        })
      })
  })

  it('POST /api/case/:id/signature should request a signature for a case', async () => {
    await Case.create({
      ...getCaseData(true, true, true, true),
      state: CaseState.REJECTED,
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
    let dbCase: CCase

    await Case.create({
      ...getCaseData(true, true, true, true),
      state: CaseState.ACCEPTED,
    })
      .then((value) => {
        dbCase = caseToCCase(value)

        return request(app.getHttpServer())
          .get(`/api/case/${dbCase.id}/signature`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${judgeAuthCookie}`)
          .query({ documentToken: 'DEVELOPMENT' })
          .expect(200)
      })
      .then(async (response) => {
        // Check the response
        expect(response.body).not.toBeNull()
        expect(response.body.documentSigned).toBe(true)
        expect(response.body.code).toBeUndefined()
        expect(response.body.message).toBeUndefined()

        // Check the data in the database
        return getCase(dbCase.id)
      })
      .then((value) => {
        const updatedDbCase = caseToCCase(value)

        expect(updatedDbCase.rulingDate).not.toBeNull()
        expectCasesToMatch(updatedDbCase, {
          ...dbCase,
          modified: updatedDbCase.modified,
          rulingDate: updatedDbCase.rulingDate,
          court,
          prosecutor,
          sharedWithProsecutorsOffice,
          registrar,
          judge,
        })
      })
  })

  it('POST /api/case/:id/extend should extend case', async () => {
    let dbCase: CCase

    await Case.create(getCaseData(true, true, true, true))
      .then((value) => {
        dbCase = caseToCCase(value)

        return request(app.getHttpServer())
          .post(`/api/case/${dbCase.id}/extend`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${prosecutorAuthCookie}`)
          .expect(201)
      })
      .then(async (response) => {
        // Check the response
        const apiCase = response.body

        // Check the response
        expectCasesToMatch(apiCase, {
          id: apiCase.id ?? 'FAILURE',
          created: apiCase.created ?? 'FAILURE',
          modified: apiCase.modified ?? 'FAILURE',
          type: dbCase.type,
          description: dbCase.description,
          state: CaseState.NEW,
          policeCaseNumber: dbCase.policeCaseNumber,
          accusedNationalId: dbCase.accusedNationalId,
          accusedName: dbCase.accusedName,
          accusedAddress: dbCase.accusedAddress,
          accusedGender: dbCase.accusedGender,
          defenderName: dbCase.defenderName,
          defenderEmail: dbCase.defenderEmail,
          defenderPhoneNumber: dbCase.defenderPhoneNumber,
          leadInvestigator: dbCase.leadInvestigator,
          courtId: dbCase.courtId,
          court,
          lawsBroken: dbCase.lawsBroken,
          legalBasis: dbCase.legalBasis,
          legalProvisions: dbCase.legalProvisions,
          requestedCustodyRestrictions: dbCase.requestedCustodyRestrictions,
          caseFacts: dbCase.caseFacts,
          legalArguments: dbCase.legalArguments,
          requestProsecutorOnlySession: dbCase.requestProsecutorOnlySession,
          prosecutorOnlySessionRequest: dbCase.prosecutorOnlySessionRequest,
          prosecutorId: prosecutor.id,
          prosecutor,
          parentCaseId: dbCase.id,
          parentCase: dbCase,
        } as CCase)
      })
  })
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
      type: CaseType.CUSTODY,
      policeCaseNumber: 'Case Number',
      accusedNationalId: '0101010000',
    })
      .then((value) => {
        dbCase = value

        return request(app.getHttpServer())
          .post(`/api/case/${dbCase.id}/notification`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${prosecutorAuthCookie}`)
          .send({ type: NotificationType.HEADS_UP })
          .expect(201)
      })
      .then((response) => {
        apiSendNotificationResponse = response.body

        // Check the response
        expect(apiSendNotificationResponse.notificationSent).toBe(true)
        expect(apiSendNotificationResponse.notification?.id).toBeTruthy()
        expect(apiSendNotificationResponse.notification?.created).toBeTruthy()
        expect(apiSendNotificationResponse.notification?.caseId).toBe(dbCase.id)
        expect(apiSendNotificationResponse.notification?.type).toBe(
          NotificationType.HEADS_UP,
        )
        expect(apiSendNotificationResponse.notification?.recipients).toBe(
          `[{"success":true}]`,
        )

        // Check the data in the database
        return Notification.findOne({
          where: { id: response.body.notification.id },
        })
      })
      .then((value) => {
        expect(value?.id).toBe(apiSendNotificationResponse.notification?.id)
        expect(value?.created.toISOString()).toBe(
          apiSendNotificationResponse.notification?.created,
        )
        expect(value?.type).toBe(apiSendNotificationResponse.notification?.type)
        expect(value?.recipients).toBe(
          apiSendNotificationResponse.notification?.recipients,
        )
      })
  })

  it('GET /api/case/:id/notifications should get all notifications by case id', async () => {
    let dbCase: Case
    let dbNotification: Notification

    await Case.create({
      type: CaseType.CUSTODY,
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
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${prosecutorAuthCookie}`)
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
