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

describe('InternalNotificationController - Send appeal court session booked notifications', () => {
  const { prosecutor, appealDefender, districtCourtDefender, spokesperson } =
    createTestUsers([
      'prosecutor',
      'appealDefender',
      'districtCourtDefender',
      'spokesperson',
    ])

  const caseId = uuid()
  const appealCaseId = uuid()
  const sessionId = uuid()
  const courtCaseNumber = 'S-123/2026'
  const appealCaseNumber = '366/2026'
  const sessionDate = new Date(2026, 9, 24, 13, 0)
  const clientUrl = 'http://localhost:4200'
  const session = {
    id: sessionId,
    sessionType: AppealCourtSessionType.MAIN_HEARING,
    sessionDate,
    courtRoom: '1',
  } as AppealCourtSession
  const theCase = {
    id: caseId,
    courtCaseNumber,
    prosecutor: { name: prosecutor.name, email: prosecutor.email },
    defendants: [
      {
        defenderName: districtCourtDefender.name,
        defenderEmail: districtCourtDefender.email,
        isDefenderChoiceConfirmed: true,
        appealDefenderName: appealDefender.name,
        appealDefenderEmail: appealDefender.email,
        appealDefenderNationalId: appealDefender.nationalId,
        isAppealDefenderConfirmed: true,
      },
      {
        appealDefenderName: 'Unconfirmed',
        appealDefenderEmail: 'unconfirmed@dummy.dd',
        isAppealDefenderConfirmed: false,
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
          type: AppealCaseNotificationType.APPEAL_COURT_SESSION_BOOKED,
          appealCourtSessionId,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  const expectedDetails = `Landsréttur boðar til þinghalds í máli ${appealCaseNumber}.<br/><br/>Aðalmeðferð mun fara fram ${formatDate(
    sessionDate,
    'PPP',
  )}, kl. 13:00.<br/><br/>Dómsalur: 1.`

  describe('session booked on a numbered appeal', () => {
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

    it('should tell the prosecutor, pointing at the case', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: `Nýtt þinghald í máli ${appealCaseNumber}`,
          html: `${expectedDetails}<br/><br/>Hægt er að nálgast gögn málsins á <a href="${clientUrl}${ROUTE_HANDLER_ROUTE}/${caseId}">${clientUrl}${ROUTE_HANDLER_ROUTE}/${caseId}</a>.`,
        }),
      )
    })

    it('should tell the confirmed appeal defender and the spokesperson, pointing at the defender view', () => {
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

    // A link to the defender view is no use to someone who cannot sign in,
    // and neither is the footer's link to the system.
    it('should tell a spokesperson without a national id, without a link', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            { name: 'Talsmaður án kennitölu', address: 'talsmadur@dummy.dd' },
          ],
          html: expectedDetails,
        }),
      )
    })

    it('should leave out the district court defender and unconfirmed appeal defenders', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(4)
      expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: districtCourtDefender.name,
              address: districtCourtDefender.email,
            },
          ],
        }),
      )
    })

    it('should record the notification', () => {
      expect(mockNotificationRepositoryService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          caseId,
          type: AppealCaseNotificationType.APPEAL_COURT_SESSION_BOOKED,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('session booked before a case number is given', () => {
    beforeEach(async () => {
      await givenWhenThen(
        { id: appealCaseId, courtSessions: [session] } as AppealCase,
        sessionId,
      )
    })

    it('should name the district court case', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: `Nýtt þinghald í máli ${courtCaseNumber}`,
          html: expect.stringContaining(
            `Landsréttur boðar til þinghalds í máli ${courtCaseNumber}.`,
          ),
        }),
      )
    })
  })

  // The session can be cancelled between the booking's commit and the
  // message running. A retry would not bring it back.
  describe('session no longer on the appeal', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        { id: appealCaseId, courtSessions: [session] } as AppealCase,
        uuid(),
      )
    })

    it('should send nothing and not ask for a retry', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
