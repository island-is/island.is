import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'

import {
  DEFENDER_INDICTMENT_CASE_ROUTE,
  ROUTE_HANDLER_ROUTE,
} from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  AppealCaseNotificationType,
  AppealCourtSessionType,
  User,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../createTestingNotificationModule'

import {
  AppealCase,
  AppealCourtSession,
  Case,
  NotificationRepositoryService,
} from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  appealCase: AppealCase,
  appealCourtSessionId?: string,
) => Promise<Then>

describe('InternalNotificationController - Send appeal court session changed notifications', () => {
  const { prosecutor, appealDefender, spokesperson } = createTestUsers([
    'prosecutor',
    'appealDefender',
    'spokesperson',
  ])

  const caseId = uuid()
  const appealCaseId = uuid()
  const sessionId = uuid()
  const courtCaseNumber = 'S-123/2026'
  const appealCaseNumber = '366/2026'
  const sessionDate = new Date(2026, 9, 24, 13, 0)
  const clientUrl = 'http://localhost:4200'
  // The session as it now stands, after the change.
  const session = {
    id: sessionId,
    sessionType: AppealCourtSessionType.MAIN_HEARING,
    sessionDate,
    courtRoom: '2',
  } as AppealCourtSession
  const theCase = {
    id: caseId,
    courtCaseNumber,
    prosecutor: { name: prosecutor.name, email: prosecutor.email },
    defendants: [
      {
        appealDefenderName: appealDefender.name,
        appealDefenderEmail: appealDefender.email,
        appealDefenderNationalId: appealDefender.nationalId,
        isAppealDefenderConfirmed: true,
      },
    ],
    civilClaimants: [
      {
        hasSpokesperson: true,
        isSpokespersonConfirmed: true,
        spokespersonName: spokesperson.name,
        spokespersonEmail: spokesperson.email,
        spokespersonNationalId: spokesperson.nationalId,
      },
      {
        hasSpokesperson: true,
        isSpokespersonConfirmed: true,
        spokespersonName: 'Talsmaður án kennitölu',
        spokespersonEmail: 'talsmadur@dummy.dd',
      },
    ],
  } as Case

  let mockEmailService: EmailService
  let mockNotificationRepositoryService: NotificationRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      emailService,
      notificationRepositoryService,
      internalNotificationController,
    } = await createTestingNotificationModule()

    mockEmailService = emailService
    mockNotificationRepositoryService = notificationRepositoryService

    givenWhenThen = async (
      appealCase: AppealCase,
      appealCourtSessionId?: string,
    ) => {
      const then = {} as Then

      await internalNotificationController
        .sendAppealCaseNotification(caseId, appealCaseId, theCase, appealCase, {
          user: { id: uuid() } as User,
          type: AppealCaseNotificationType.APPEAL_COURT_SESSION_CHANGED,
          appealCourtSessionId,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  const expectedDetails = `Landsréttur hefur breytt þinghaldi í máli ${appealCaseNumber}.<br/><br/>Aðalmeðferð mun nú fara fram ${formatDate(
    sessionDate,
    'PPP',
  )}, kl. 13:00.<br/><br/>Dómsalur: 2.<br/><br/>Það áréttast að því er beint til aðila að þeir afhendi til Landsréttar með fjögurra virkra daga fyrirvara tilvitnanir í fræðirit og dóma ef þeir hyggjast styðjast við slík gögn í málflutningi, sbr. 2. mgr. 205. gr. laga nr. 88/2008.`

  describe('session changed on a numbered appeal', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        {
          id: appealCaseId,
          appealCaseNumber,
          courtSessions: [session],
        } as AppealCase,
        sessionId,
      )
    })

    it('should tell the prosecutor the session as it now stands, pointing at the case', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: `Breytt þinghald í máli ${appealCaseNumber}`,
          html: `${expectedDetails}<br/><br/>Hægt er að nálgast gögn málsins á <a href="${clientUrl}${ROUTE_HANDLER_ROUTE}/${caseId}">${clientUrl}${ROUTE_HANDLER_ROUTE}/${caseId}</a>.`,
        }),
      )
    })

    it('should tell the defence, pointing at the defender view', () => {
      const defenderHtml = `${expectedDetails}<br/><br/>Hægt er að nálgast gögn málsins á <a href="${clientUrl}${DEFENDER_INDICTMENT_CASE_ROUTE}/${caseId}">${clientUrl}${DEFENDER_INDICTMENT_CASE_ROUTE}/${caseId}</a>.`

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: appealDefender.name, address: appealDefender.email }],
          html: defenderHtml,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: spokesperson.name, address: spokesperson.email }],
          html: defenderHtml,
        }),
      )
    })

    it('should tell a spokesperson without a national id, without a link', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(4)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            { name: 'Talsmaður án kennitölu', address: 'talsmadur@dummy.dd' },
          ],
          html: expectedDetails,
        }),
      )
    })

    it('should record the notification', () => {
      expect(mockNotificationRepositoryService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          caseId,
          type: AppealCaseNotificationType.APPEAL_COURT_SESSION_CHANGED,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('a session other than a main hearing changed', () => {
    beforeEach(async () => {
      await givenWhenThen(
        {
          id: appealCaseId,
          appealCaseNumber,
          courtSessions: [
            {
              ...session,
              sessionType: AppealCourtSessionType.PREPARATORY_HEARING,
            } as AppealCourtSession,
          ],
        } as AppealCase,
        sessionId,
      )
    })

    it('should not remind the parties of the main hearing deadline', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining(
            'Undirbúningsþinghald mun nú fara fram',
          ),
        }),
      )
      expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining('Það áréttast'),
        }),
      )
    })
  })

  describe('session changed before a case number is given', () => {
    beforeEach(async () => {
      await givenWhenThen(
        { id: appealCaseId, courtSessions: [session] } as AppealCase,
        sessionId,
      )
    })

    it('should name the district court case', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: `Breytt þinghald í máli ${courtCaseNumber}`,
          html: expect.stringContaining(
            `Landsréttur hefur breytt þinghaldi í máli ${courtCaseNumber}.`,
          ),
        }),
      )
    })
  })

  // The session can be cancelled between the change's commit and the
  // message running. The cancellation's own mail covers it.
  describe('session no longer on the appeal', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        { id: appealCaseId, courtSessions: [] } as unknown as AppealCase,
        sessionId,
      )
    })

    it('should send nothing and not ask for a retry', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
