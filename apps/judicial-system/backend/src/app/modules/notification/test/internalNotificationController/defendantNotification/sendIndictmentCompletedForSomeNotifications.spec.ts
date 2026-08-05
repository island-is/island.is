import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'
import { ConfigType } from '@island.is/nest/config'

import {
  DEFENDER_INDICTMENT_CASE_ROUTE,
  ROUTE_HANDLER_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  CaseType,
  DefendantEventType,
  DefendantNotificationType,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../../createTestingNotificationModule'

import { Case, Defendant } from '../../../../repository'
import { DefendantNotificationDto } from '../../../dto/defendantNotification.dto'
import { DeliverResponse } from '../../../models/deliver.response'
import { notificationModuleConfig } from '../../../notification.config'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (theCase: Case, defendant: Defendant) => Promise<Then>

describe('InternalNotificationController - Send indictment completed for some notifications', () => {
  const caseId = uuid()
  const courtName = 'Héraðsdómur Reykjavíkur'
  const courtCaseNumber = 'S-275/2026'
  const defendantAaId = uuid()
  const defendantBbId = uuid()

  let mockEmailService: EmailService
  let mockConfig: ConfigType<typeof notificationModuleConfig>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { emailService, notificationConfig, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService
    mockConfig = notificationConfig

    givenWhenThen = async (theCase: Case, defendant: Defendant) => {
      const then = {} as Then

      const notificationDto: DefendantNotificationDto = {
        type: DefendantNotificationType.INDICTMENT_COMPLETED_FOR_SOME,
      }

      try {
        then.result =
          await internalNotificationController.sendDefendantNotification(
            theCase.id,
            defendant.id,
            theCase,
            defendant,
            notificationDto,
          )
      } catch (error) {
        then.error = error as Error
      }

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

  it("should notify the concluded defendant's confirmed defender, civil claimant spokespersons and the prosecutor with the decision read from the event log", async () => {
    const concludedDefendant = {
      id: defendantAaId,
      isDefenderChoiceConfirmed: true,
      defenderName: 'Verjandi AA',
      defenderEmail: 'aa@omnitrix.is',
      eventLogs: [
        {
          eventType: DefendantEventType.INDICTMENT_DISMISSED,
          created: new Date('2026-02-20T12:00:00.000Z'),
        },
      ],
    } as Defendant

    const theCase = {
      ...baseCase,
      defendants: [
        concludedDefendant,
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

    const then = await givenWhenThen(theCase, concludedDefendant)

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

  it('should use the cancellation decision when the event log is a cancellation', async () => {
    const concludedDefendant = {
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
    } as Defendant

    const theCase = {
      ...baseCase,
      prosecutor: undefined,
      defendants: [concludedDefendant],
    } as Case

    await givenWhenThen(theCase, concludedDefendant)

    expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining('Niðurstaða: Niðurfelling máls'),
        to: [{ name: 'Verjandi AA', address: 'aa@omnitrix.is' }],
      }),
    )
  })

  it('should not notify unconfirmed defenders or spokespersons', async () => {
    const concludedDefendant = {
      id: defendantAaId,
      isDefenderChoiceConfirmed: false,
      defenderName: 'Verjandi AA',
      defenderEmail: 'aa@omnitrix.is',
      eventLogs: [
        {
          eventType: DefendantEventType.INDICTMENT_CANCELLED,
          created: new Date('2026-02-20T12:00:00.000Z'),
        },
      ],
    } as Defendant

    const theCase = {
      ...baseCase,
      prosecutor: undefined,
      defendants: [concludedDefendant],
      civilClaimants: [
        {
          hasSpokesperson: true,
          isSpokespersonConfirmed: false,
          spokespersonName: 'Réttargæslumaður CC',
          spokespersonEmail: 'cc@omnitrix.is',
        },
      ],
    } as Case

    await givenWhenThen(theCase, concludedDefendant)

    expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
  })

  it('should not notify when the defendant has no conclusion event log', async () => {
    const defendant = {
      id: defendantAaId,
      isDefenderChoiceConfirmed: true,
      defenderName: 'Verjandi AA',
      defenderEmail: 'aa@omnitrix.is',
      eventLogs: [],
    } as unknown as Defendant

    const theCase = {
      ...baseCase,
      defendants: [defendant],
    } as Case

    const then = await givenWhenThen(theCase, defendant)

    expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
    expect(then.result).toEqual({ delivered: true })
  })
})
