import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'
import { ConfigType } from '@island.is/nest/config'

import {
  DEFENDER_INDICTMENT_CASE_ROUTE,
  ROUTE_HANDLER_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  CaseIndictmentRulingDecision,
  CaseType,
  DefendantEventType,
  IndictmentCaseNotificationType,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../../createTestingNotificationModule'

import { Case } from '../../../../repository'
import { DeliverResponse } from '../../../models/deliver.response'
import { notificationModuleConfig } from '../../../notification.config'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  concludedDecisions: {
    defendantId: string
    rulingDecision: CaseIndictmentRulingDecision
  }[],
) => Promise<Then>

describe('IndictmentCaseService - send indictment completed for some', () => {
  const caseId = uuid()
  const courtName = 'Héraðsdómur Reykjavíkur'
  const courtCaseNumber = 'S-275/2026'
  const defendantAaId = uuid()
  const defendantBbId = uuid()

  let mockEmailService: EmailService
  let mockConfig: ConfigType<typeof notificationModuleConfig>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      emailService,
      notificationConfig,
      indictmentCaseNotificationService,
    } = await createTestingNotificationModule()

    mockEmailService = emailService
    mockConfig = notificationConfig

    givenWhenThen = async (
      theCase: Case,
      concludedDecisions: {
        defendantId: string
        rulingDecision: CaseIndictmentRulingDecision
      }[],
    ) => {
      const then = {} as Then

      await indictmentCaseNotificationService
        .sendIndictmentCaseNotification(
          IndictmentCaseNotificationType.INDICTMENT_COMPLETED_FOR_SOME,
          theCase,
          undefined,
          concludedDecisions,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  const baseCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    court: { name: courtName },
    courtCaseNumber,
    prosecutor: { name: 'Ákærandi', email: 'prosecutor@omnitrix.is' },
  }

  it("should notify only the concluded defendant's confirmed defender, civil claimant spokespersons and the prosecutor", async () => {
    const theCase = {
      ...baseCase,
      defendants: [
        {
          id: defendantAaId,
          isDefenderChoiceConfirmed: true,
          defenderName: 'Verjandi AA',
          defenderEmail: 'aa@omnitrix.is',
          eventLogs: [],
        },
        {
          id: defendantBbId,
          isDefenderChoiceConfirmed: true,
          defenderName: 'Verjandi BB',
          defenderEmail: 'bb@omnitrix.is',
          eventLogs: [],
        },
      ],
      civilClaimants: [
        {
          hasSpokesperson: true,
          isSpokespersonConfirmed: true,
          spokespersonName: 'Réttargæslumaður CC',
          spokespersonEmail: 'cc@omnitrix.is',
        },
      ],
    } as Case

    const then = await givenWhenThen(theCase, [
      {
        defendantId: defendantAaId,
        rulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      },
    ])

    const defenderUrl = `${mockConfig.clientUrl}${DEFENDER_INDICTMENT_CASE_ROUTE}/${caseId}`
    const prosecutorUrl = `${mockConfig.clientUrl}${ROUTE_HANDLER_ROUTE}/${caseId}`
    const subject = `Lyktir skráðar í máli ${courtCaseNumber}`
    const defenderHtml = expect.stringContaining(
      `Niðurstaða: Frávísun<br>Sjá nánar á <a href="${defenderUrl}">yfirlitssíðu málsins í Réttarvörslugátt.</a>`,
    )
    const prosecutorHtml = expect.stringContaining(
      `Niðurstaða: Frávísun<br>Sjá nánar á <a href="${prosecutorUrl}">yfirlitssíðu málsins í Réttarvörslugátt.</a>`,
    )

    // Only AA (the concluded defendant) gets the defender email
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject,
        html: defenderHtml,
        to: [{ name: 'Verjandi AA', address: 'aa@omnitrix.is' }],
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject,
        html: defenderHtml,
        to: [{ name: 'Réttargæslumaður CC', address: 'cc@omnitrix.is' }],
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject,
        html: prosecutorHtml,
        to: [{ name: 'Ákærandi', address: 'prosecutor@omnitrix.is' }],
      }),
    )
    // BB is not the concluded defendant — must not be notified
    expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
      expect.objectContaining({
        to: [{ name: 'Verjandi BB', address: 'bb@omnitrix.is' }],
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(3)
    expect(then.result).toEqual({ delivered: true })
  })

  it('should not notify unconfirmed defenders or spokespersons', async () => {
    const theCase = {
      ...baseCase,
      prosecutor: undefined,
      defendants: [
        {
          id: defendantAaId,
          isDefenderChoiceConfirmed: false,
          defenderName: 'Verjandi AA',
          defenderEmail: 'aa@omnitrix.is',
          eventLogs: [],
        },
      ],
      civilClaimants: [
        {
          hasSpokesperson: true,
          isSpokespersonConfirmed: false,
          spokespersonName: 'Réttargæslumaður CC',
          spokespersonEmail: 'cc@omnitrix.is',
        },
      ],
    } as Case

    await givenWhenThen(theCase, [
      {
        defendantId: defendantAaId,
        rulingDecision: CaseIndictmentRulingDecision.CANCELLATION,
      },
    ])

    expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
  })

  it('should send one notification round per concluded defendant with the correct decision', async () => {
    const theCase = {
      ...baseCase,
      defendants: [
        {
          id: defendantAaId,
          isDefenderChoiceConfirmed: true,
          defenderName: 'Verjandi AA',
          defenderEmail: 'aa@omnitrix.is',
          eventLogs: [],
        },
        {
          id: defendantBbId,
          isDefenderChoiceConfirmed: true,
          defenderName: 'Verjandi BB',
          defenderEmail: 'bb@omnitrix.is',
          eventLogs: [],
        },
      ],
    } as Case

    await givenWhenThen(theCase, [
      {
        defendantId: defendantAaId,
        rulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      },
      {
        defendantId: defendantBbId,
        rulingDecision: CaseIndictmentRulingDecision.CANCELLATION,
      },
    ])

    // Round 1 (AA dismissed): AA defender + prosecutor
    // Round 2 (BB cancelled): BB defender + prosecutor
    expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(4)
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining('Niðurstaða: Frávísun'),
        to: [{ name: 'Verjandi AA', address: 'aa@omnitrix.is' }],
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining('Niðurstaða: Niðurfelling máls'),
        to: [{ name: 'Verjandi BB', address: 'bb@omnitrix.is' }],
      }),
    )
    expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining('Frávísun / Niðurfelling máls'),
      }),
    )
  })

  it('should not re-notify for defendants concluded in a previous partial completion', async () => {
    // Defendant AA was already concluded (CANCELLATION) in an earlier update.
    // Only BB is newly concluded (DISMISSAL). AA's defender must not receive
    // another email.
    const theCase = {
      ...baseCase,
      defendants: [
        {
          id: defendantAaId,
          isDefenderChoiceConfirmed: true,
          defenderName: 'Verjandi AA',
          defenderEmail: 'aa@omnitrix.is',
          eventLogs: [
            {
              eventType: DefendantEventType.INDICTMENT_CANCELLED,
              created: new Date('2026-02-20T12:00:00.000Z'),
            },
          ],
        },
        {
          id: defendantBbId,
          isDefenderChoiceConfirmed: true,
          defenderName: 'Verjandi BB',
          defenderEmail: 'bb@omnitrix.is',
          eventLogs: [],
        },
      ],
    } as Case

    await givenWhenThen(theCase, [
      {
        defendantId: defendantBbId,
        rulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      },
    ])

    // Only BB defender + prosecutor — AA must not be re-notified
    expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2)
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining('Niðurstaða: Frávísun'),
        to: [{ name: 'Verjandi BB', address: 'bb@omnitrix.is' }],
      }),
    )
    expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
      expect.objectContaining({
        to: [{ name: 'Verjandi AA', address: 'aa@omnitrix.is' }],
      }),
    )
  })
})
