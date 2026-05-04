import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'

import {
  CaseNotificationType,
  CaseType,
  EventType,
  User,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../createTestingNotificationModule'

import { Case, EventLog } from '../../../repository'
import { InstitutionContactRepositoryService } from '../../../repository'
import { CaseNotificationDto } from '../../dto/caseNotification.dto'
import { DeliverResponse } from '../../models/deliver.response'

jest.mock('../../../../factories')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (theCase: Case) => Promise<Then>

describe('InternalNotificationController - Send indictment reopened notification', () => {
  const caseId = uuid()
  const userId = uuid()
  const courtCaseNumber = uuid()
  const courtName = 'Héraðsdómur Reykjavíkur'

  const { prosecutor, defender } = createTestUsers(['prosecutor', 'defender'])

  const notificationDto: CaseNotificationDto = {
    user: { id: userId } as User,
    type: CaseNotificationType.INDICTMENT_REOPENED,
  }

  const prosecutorSubject = `Mál ${courtCaseNumber} enduropnað`
  const bodyText = `${courtName} hefur enduropnað mál ${courtCaseNumber}.<br /><br />Fyrri lyktum hefur verið eytt og málið verður afgreitt á ný.`
  const prosecutorHtml = `${bodyText}<br /><br /><a href="http://localhost:4200/akaera/stadfesta/${caseId}">Hægt er að nálgast yfirlitssíðu málsins í Réttarvörslugátt.</a>`
  const defenderHtml = `${bodyText}<br /><br /><a href="http://localhost:4200/verjandi/akaera/${caseId}">Hægt er að nálgast yfirlitssíðu málsins í Réttarvörslugátt.</a>`

  const baseCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    courtCaseNumber,
    court: { name: courtName },
    prosecutor: { name: prosecutor.name, email: prosecutor.email },
    defendants: [],
    eventLogs: [],
  } as unknown as Case

  let mockEmailService: EmailService
  let mockInstitutionContactRepositoryService: InstitutionContactRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      emailService,
      internalNotificationController,
      institutionContactRepositoryService,
    } = await createTestingNotificationModule()

    mockEmailService = emailService
    mockInstitutionContactRepositoryService =
      institutionContactRepositoryService

    givenWhenThen = async (theCase: Case) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(caseId, theCase, notificationDto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('sends to prosecutor', () => {
    beforeEach(async () => {
      await givenWhenThen(baseCase)
    })

    it('should send email to prosecutor', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: prosecutorSubject,
          html: prosecutorHtml,
        }),
      )
    })
  })

  describe('sends to confirmed defender', () => {
    const caseWithDefender = {
      ...baseCase,
      defendants: [
        {
          defenderName: defender.name,
          defenderEmail: defender.email,
          isDefenderChoiceConfirmed: true,
        },
      ],
    } as unknown as Case

    beforeEach(async () => {
      await givenWhenThen(caseWithDefender)
    })

    it('should send email to defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: prosecutorSubject,
          html: defenderHtml,
        }),
      )
    })
  })

  describe('does not send to unconfirmed defender', () => {
    const caseWithUnconfirmedDefender = {
      ...baseCase,
      defendants: [
        {
          defenderName: defender.name,
          defenderEmail: defender.email,
          isDefenderChoiceConfirmed: false,
        },
      ],
    } as unknown as Case

    beforeEach(async () => {
      await givenWhenThen(caseWithUnconfirmedDefender)
    })

    it('should not send email to defender', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
        }),
      )
    })
  })

  describe('sends to prison admin when case was sent to prison admin', () => {
    const caseWithPrisonAdmin = {
      ...baseCase,
      defendants: [{ isSentToPrisonAdmin: true }],
    } as unknown as Case

    beforeEach(async () => {
      await givenWhenThen(caseWithPrisonAdmin)
    })

    it('should send email to prison admin', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Fangelsismálastofnun',
              address: 'jl+d+prisonAdmin@kolibri.is',
            },
          ],
          subject: prosecutorSubject,
          html: bodyText,
        }),
      )
    })
  })

  describe('does not send to prison admin when case was not sent to prison admin', () => {
    const caseWithoutPrisonAdmin = {
      ...baseCase,
      defendants: [{ isSentToPrisonAdmin: false }],
    } as unknown as Case

    beforeEach(async () => {
      await givenWhenThen(caseWithoutPrisonAdmin)
    })

    it('should not send email to prison admin', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
        expect.objectContaining({
          to: [expect.objectContaining({ name: 'Fangelsismálastofnun' })],
        }),
      )
    })
  })

  describe('sends to public prosecutor when case was sent to public prosecutor', () => {
    const publicProsecutorEmail = `publicProsecutor-${uuid()}@test.is`

    const caseWithPublicProsecutorEventLog = {
      ...baseCase,
      eventLogs: [
        {
          eventType: EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
          created: new Date(),
        },
      ] as unknown as EventLog[],
    } as unknown as Case

    beforeEach(async () => {
      const mockGetInstitutionContact =
        mockInstitutionContactRepositoryService.getInstitutionContact as jest.Mock
      mockGetInstitutionContact.mockResolvedValueOnce(publicProsecutorEmail)

      await givenWhenThen(caseWithPublicProsecutorEventLog)
    })

    it('should send email to public prosecutor', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Ríkissaksóknari', address: publicProsecutorEmail }],
          subject: prosecutorSubject,
          html: bodyText,
        }),
      )
    })
  })

  describe('does not send to public prosecutor when case was not sent to public prosecutor', () => {
    beforeEach(async () => {
      await givenWhenThen(baseCase)
    })

    it('should not look up public prosecutor contact', () => {
      expect(
        mockInstitutionContactRepositoryService.getInstitutionContact,
      ).not.toHaveBeenCalled()
    })
  })
})
