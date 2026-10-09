import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'

import {
  CaseType,
  DefendantNotificationType,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../../createTestingNotificationModule'

import { AppealCase, Case, Defendant } from '../../../../repository'
import { DefendantNotificationDto } from '../../../dto/defendantNotification.dto'

jest.mock('../../../../../factories')

/**
 * The mail the court of appeals sends a defender it has just confirmed on an
 * appeal. Distinct from DEFENDER_ASSIGNED, which is the district court doing
 * the same for the case below.
 */
describe('InternalNotificationController - Send appeal defender assigned notifications', () => {
  const caseId = uuid()
  const defendantId = uuid()

  const { defender } = createTestUsers(['defender'])

  let mockEmailService: EmailService
  let send: (defendant: Partial<Defendant>) => Promise<unknown>

  beforeEach(async () => {
    const { emailService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService

    send = (defendantOverrides) => {
      const defendant = {
        id: defendantId,
        isAppealDefenderConfirmed: true,
        appealDefenderName: defender.name,
        appealDefenderEmail: defender.email,
        ...defendantOverrides,
      } as Defendant

      return internalNotificationController.sendDefendantNotification(
        caseId,
        defendantId,
        {
          id: caseId,
          type: CaseType.INDICTMENT,
          courtCaseNumber: 'S-4275/2025',
          court: { name: 'Héraðsdómur Reykjavíkur' } as Case['court'],
          verdictAppealCase: { appealCaseNumber: '77/2026' } as AppealCase,
          defendants: [defendant],
        } as Case,
        defendant,
        {
          type: DefendantNotificationType.APPEAL_DEFENDER_ASSIGNED,
        } as DefendantNotificationDto,
      )
    }
  })

  it('names the court of appeals and the appeal, not the district court', async () => {
    await send({})

    expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Landsréttur - aðgangur að máli',
        html:
          'Landsréttur hefur skráð þig sem verjanda í máli 77/2026.<br /><br />' +
          'Hægt er að nálgast málið í Réttarvörslugátt.',
        to: [{ name: defender.name, address: defender.email }],
      }),
    )
  })

  // An advocate the court typed in by hand may have only an address, and the
  // address is what the mail needs.
  it('writes to an advocate the case records no name for', async () => {
    await send({ appealDefenderName: undefined })

    expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        // The base service normalises a missing name to an empty string.
        to: [{ name: '', address: defender.email }],
      }),
    )
  })

  it('writes to nobody when the court has not confirmed the advocate', async () => {
    await send({ isAppealDefenderConfirmed: false })

    expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
  })

  it('writes to nobody when no address is recorded', async () => {
    await send({ appealDefenderEmail: undefined })

    expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
  })
})
