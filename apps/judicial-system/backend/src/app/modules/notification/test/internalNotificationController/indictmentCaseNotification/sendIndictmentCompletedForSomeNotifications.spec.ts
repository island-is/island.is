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
  concludedDecisions: CaseIndictmentRulingDecision[],
) => Promise<Then>

describe('IndictmentCaseService - send indictment completed for some', () => {
  const caseId = uuid()
  const courtName = 'Héraðsdómur Reykjavíkur'
  const courtCaseNumber = 'S-275/2026'

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
      concludedDecisions: CaseIndictmentRulingDecision[],
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

  it('should notify all confirmed defenders, civil claimant spokespersons and the prosecutor', async () => {
    const theCase = {
      ...baseCase,
      defendants: [
        {
          isDefenderChoiceConfirmed: true,
          defenderName: 'Verjandi AA',
          defenderEmail: 'aa@defender.is',
          eventLogs: [],
        },
        {
          isDefenderChoiceConfirmed: true,
          defenderName: 'Verjandi BB',
          defenderEmail: 'bb@defender.is',
          eventLogs: [],
        },
      ],
      civilClaimants: [
        {
          hasSpokesperson: true,
          isSpokespersonConfirmed: true,
          spokespersonName: 'Réttargæslumaður CC',
          spokespersonEmail: 'cc@spokesperson.is',
        },
      ],
    } as Case

    const then = await givenWhenThen(theCase, [
      CaseIndictmentRulingDecision.DISMISSAL,
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

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject,
        html: defenderHtml,
        to: [{ name: 'Verjandi AA', address: 'aa@defender.is' }],
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject,
        html: defenderHtml,
        to: [{ name: 'Verjandi BB', address: 'bb@defender.is' }],
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject,
        html: defenderHtml,
        to: [{ name: 'Réttargæslumaður CC', address: 'cc@spokesperson.is' }],
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject,
        html: prosecutorHtml,
        to: [{ name: 'Ákærandi', address: 'prosecutor@omnitrix.is' }],
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(4)
    expect(then.result).toEqual({ delivered: true })
  })

  it('should not notify unconfirmed defenders or spokespersons', async () => {
    const theCase = {
      ...baseCase,
      prosecutor: undefined,
      defendants: [
        {
          isDefenderChoiceConfirmed: false,
          defenderName: 'Verjandi AA',
          defenderEmail: 'aa@defender.is',
          eventLogs: [],
        },
      ],
      civilClaimants: [
        {
          hasSpokesperson: true,
          isSpokespersonConfirmed: false,
          spokespersonName: 'Réttargæslumaður CC',
          spokespersonEmail: 'cc@spokesperson.is',
        },
      ],
    } as Case

    await givenWhenThen(theCase, [CaseIndictmentRulingDecision.CANCELLATION])

    expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
  })

  it('should send one notification per concluded defendant when decisions are mixed', async () => {
    const theCase = {
      ...baseCase,
      defendants: [
        {
          isDefenderChoiceConfirmed: true,
          defenderName: 'Verjandi AA',
          defenderEmail: 'aa@defender.is',
          eventLogs: [],
        },
        {
          isDefenderChoiceConfirmed: true,
          defenderName: 'Verjandi BB',
          defenderEmail: 'bb@defender.is',
          eventLogs: [],
        },
      ],
    } as Case

    await givenWhenThen(theCase, [
      CaseIndictmentRulingDecision.DISMISSAL,
      CaseIndictmentRulingDecision.CANCELLATION,
    ])

    // 2 concluded defendants × 3 recipients (AA defender, BB defender, prosecutor)
    expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(6)
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining('Niðurstaða: Frávísun'),
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining('Niðurstaða: Niðurfelling máls'),
      }),
    )
    expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining('Frávísun / Niðurfelling máls'),
      }),
    )
  })
})
