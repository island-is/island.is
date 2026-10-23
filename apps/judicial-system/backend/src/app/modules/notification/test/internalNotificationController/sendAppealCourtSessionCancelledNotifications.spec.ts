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
  Case,
  NotificationRepositoryService,
} from '../../../repository'
import { AppealCourtSessionNotificationDto } from '../../dto/appealCaseNotification.dto'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  appealCase: AppealCase,
  appealCourtSession?: AppealCourtSessionNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send appeal court session cancelled notifications', () => {
  const { prosecutor, appealDefender, spokesperson } = createTestUsers([
    'prosecutor',
    'appealDefender',
    'spokesperson',
  ])

  const caseId = uuid()
  const appealCaseId = uuid()
  const courtCaseNumber = 'S-123/2026'
  const appealCaseNumber = '366/2026'
  const sessionDate = new Date(2026, 9, 24, 13, 0)
  const clientUrl = 'http://localhost:4200'
  // What the message says the session was: the row itself is gone.
  const cancelledSession: AppealCourtSessionNotificationDto = {
    sessionType: AppealCourtSessionType.MAIN_HEARING,
    sessionDate,
    courtRoom: '1',
  }
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
      appealCourtSession?: AppealCourtSessionNotificationDto,
    ) => {
      const then = {} as Then

      await internalNotificationController
        .sendAppealCaseNotification(caseId, appealCaseId, theCase, appealCase, {
          user: { id: uuid() } as User,
          type: AppealCaseNotificationType.APPEAL_COURT_SESSION_CANCELLED,
          appealCourtSession,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  const expectedDetails = `Landsréttur hefur fellt niður þinghald í máli ${appealCaseNumber}.<br/><br/>Aðalmeðferð sem fara átti fram ${formatDate(
    sessionDate,
    'PPP',
  )}, kl. 13:00, fellur niður.`

  describe('session cancelled on a numbered appeal', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        { id: appealCaseId, appealCaseNumber } as AppealCase,
        cancelledSession,
      )
    })

    it('should tell the prosecutor which session was cancelled, pointing at the case', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: `Þinghald fellt niður í máli ${appealCaseNumber}`,
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
          type: AppealCaseNotificationType.APPEAL_COURT_SESSION_CANCELLED,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('session cancelled before a case number is given', () => {
    beforeEach(async () => {
      await givenWhenThen({ id: appealCaseId } as AppealCase, cancelledSession)
    })

    it('should name the district court case', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: `Þinghald fellt niður í máli ${courtCaseNumber}`,
          html: expect.stringContaining(
            `Landsréttur hefur fellt niður þinghald í máli ${courtCaseNumber}.`,
          ),
        }),
      )
    })
  })

  describe('message without the session', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({ id: appealCaseId } as AppealCase)
    })

    it('should send nothing and not ask for a retry', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
