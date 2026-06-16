import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'

import {
  DefendantEventType,
  IndictmentCaseNotificationType,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../../createTestingNotificationModule'

import { Case } from '../../../../repository'
import { DeliverResponse } from '../../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (theCase: Case) => Promise<Then>

describe('IndictmentCaseService - send indictment completed for some', () => {
  const caseId = uuid()
  const courtName = 'Héraðsdómur Reykjavíkur'
  const courtCaseNumber = 'S-275/2026'

  let mockEmailService: EmailService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { emailService, indictmentCaseNotificationService } =
      await createTestingNotificationModule()

    mockEmailService = emailService

    givenWhenThen = async (theCase: Case) => {
      const then = {} as Then

      await indictmentCaseNotificationService
        .sendIndictmentCaseNotification(
          IndictmentCaseNotificationType.INDICTMENT_COMPLETED_FOR_SOME,
          theCase,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  const baseCase = {
    id: caseId,
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
          eventLogs: [
            {
              eventType: DefendantEventType.INDICTMENT_DISMISSED,
              created: new Date('2026-02-23T23:59:59.999Z'),
            },
          ],
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

    const then = await givenWhenThen(theCase)

    const expected = {
      subject: `Lyktir skráðar í máli ${courtCaseNumber}`,
      html: expect.stringContaining(
        `Lyktir hafa verið skráðar á aðila í máli ${courtCaseNumber} hjá Héraðsdómi Reykjavíkur.`,
      ),
    }

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        ...expected,
        to: [{ name: 'Verjandi AA', address: 'aa@defender.is' }],
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        ...expected,
        to: [{ name: 'Verjandi BB', address: 'bb@defender.is' }],
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        ...expected,
        to: [{ name: 'Réttargæslumaður CC', address: 'cc@spokesperson.is' }],
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        ...expected,
        to: [{ name: 'Ákærandi', address: 'prosecutor@omnitrix.is' }],
      }),
    )
    // The recorded decision (Frávísun) is reflected in the body
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining('Niðurstaða: Frávísun'),
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
          eventLogs: [
            {
              eventType: DefendantEventType.INDICTMENT_CANCELLED,
              created: new Date('2026-02-23T23:59:59.999Z'),
            },
          ],
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

    await givenWhenThen(theCase)

    expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
  })

  it('should reflect both decisions when defendants have mixed conclusions', async () => {
    const theCase = {
      ...baseCase,
      defendants: [
        {
          isDefenderChoiceConfirmed: true,
          defenderName: 'Verjandi AA',
          defenderEmail: 'aa@defender.is',
          eventLogs: [
            {
              eventType: DefendantEventType.INDICTMENT_DISMISSED,
              created: new Date('2026-02-23T23:59:59.999Z'),
            },
          ],
        },
        {
          isDefenderChoiceConfirmed: true,
          defenderName: 'Verjandi BB',
          defenderEmail: 'bb@defender.is',
          eventLogs: [
            {
              eventType: DefendantEventType.INDICTMENT_CANCELLED,
              created: new Date('2026-02-23T23:59:59.999Z'),
            },
          ],
        },
      ],
    } as Case

    await givenWhenThen(theCase)

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining(
          'Niðurstaða: Frávísun / Niðurfelling máls',
        ),
      }),
    )
  })
})
