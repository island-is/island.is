import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'

import {
  CaseType,
  CourtSessionType,
  DateType,
  DefendantNotificationType,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../../createTestingNotificationModule'

import { Case, DateLog, Defendant, Notification } from '../../../../repository'
import { DefendantNotificationDto } from '../../../dto/defendantNotification.dto'
import { DeliverResponse } from '../../../models/deliver.response'

jest.mock('../../../../../factories')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  defendantId: string,
  theCase: Case,
  defendant: Defendant,
  notificationDto: DefendantNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send defender court date follow up notifications', () => {
  const caseId = uuid()
  const defendantId = uuid()

  const { defender, prosecutor } = createTestUsers(['defender', 'prosecutor'])
  const court = { name: 'Héraðsdómur Reykjavíkur' } as Case['court']

  const futureDate = new Date(Date.now() + 100 * 60 * 1000)
  const pastDate = new Date(Date.now() - 100 * 60 * 1000)

  let mockEmailService: EmailService
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  let defendantNotificationDTO: DefendantNotificationDto

  const buildCase = (dateLogs: DateLog[]): Case =>
    ({
      id: caseId,
      court,
      courtCaseNumber: 'R-123-456/2024',
      type: CaseType.INDICTMENT,
      courtSessionType: CourtSessionType.MAIN_HEARING,
      prosecutor,
      dateLogs,
    } as Case)

  const confirmedDefendant = {
    id: defendantId,
    defenderNationalId: '1234567890',
    defenderName: defender.name,
    defenderEmail: defender.email,
    isDefenderChoiceConfirmed: true,
  } as Defendant

  beforeEach(async () => {
    const { emailService, internalNotificationController, notificationModel } =
      await createTestingNotificationModule()

    defendantNotificationDTO = {
      type: DefendantNotificationType.DEFENDER_COURT_DATE_FOLLOW_UP,
      user: prosecutor as DefendantNotificationDto['user'],
    }

    mockEmailService = emailService
    mockNotificationModel = notificationModel

    givenWhenThen = async (
      caseId: string,
      defendantId: string,
      theCase: Case,
      defendant: Defendant,
      notificationDto: DefendantNotificationDto,
    ) => {
      const then = {} as Then

      try {
        then.result =
          await internalNotificationController.sendDefendantNotification(
            caseId,
            defendantId,
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

  describe('when a regular court session is scheduled in the future', () => {
    const theCase = buildCase([
      { dateType: DateType.COURT_DATE, date: futureDate } as DateLog,
    ])

    beforeEach(async () => {
      await givenWhenThen(
        caseId,
        defendantId,
        theCase,
        confirmedDefendant,
        defendantNotificationDTO,
      )
    })

    it('should send a court session invitation with a calendar invite', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: confirmedDefendant.defenderName,
              address: confirmedDefendant.defenderEmail,
            },
          ],
          subject: 'Nýtt þinghald í máli R-123-456/2024',
          attachments: [
            expect.objectContaining({ filename: 'court-date.ics' }),
          ],
        }),
      )
    })

    it('should record the follow up notification', () => {
      expect(mockNotificationModel.create).toHaveBeenCalledTimes(1)
      expect(mockNotificationModel.create).toHaveBeenCalledWith({
        caseId,
        type: DefendantNotificationType.DEFENDER_COURT_DATE_FOLLOW_UP,
        recipients: [
          { address: confirmedDefendant.defenderEmail, success: true },
        ],
      })
    })
  })

  describe('when only an arraignment is scheduled in the future', () => {
    const theCase = buildCase([
      { dateType: DateType.ARRAIGNMENT_DATE, date: futureDate } as DateLog,
    ])

    beforeEach(async () => {
      await givenWhenThen(
        caseId,
        defendantId,
        theCase,
        confirmedDefendant,
        defendantNotificationDTO,
      )
    })

    it('should send an arraignment invitation', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: confirmedDefendant.defenderName,
              address: confirmedDefendant.defenderEmail,
            },
          ],
          subject: 'Þingfesting í máli: R-123-456/2024',
        }),
      )
    })

    it('should record the follow up notification', () => {
      expect(mockNotificationModel.create).toHaveBeenCalledWith({
        caseId,
        type: DefendantNotificationType.DEFENDER_COURT_DATE_FOLLOW_UP,
        recipients: [
          { address: confirmedDefendant.defenderEmail, success: true },
        ],
      })
    })
  })

  describe('when both a court session and an arraignment are in the future', () => {
    const theCase = buildCase([
      { dateType: DateType.ARRAIGNMENT_DATE, date: futureDate } as DateLog,
      { dateType: DateType.COURT_DATE, date: futureDate } as DateLog,
    ])

    beforeEach(async () => {
      await givenWhenThen(
        caseId,
        defendantId,
        theCase,
        confirmedDefendant,
        defendantNotificationDTO,
      )
    })

    it('should prefer the arraignment invitation', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Þingfesting í máli: R-123-456/2024',
        }),
      )
    })
  })

  describe('when no court session or arraignment is scheduled in the future', () => {
    const theCase = buildCase([
      { dateType: DateType.COURT_DATE, date: pastDate } as DateLog,
    ])

    beforeEach(async () => {
      await givenWhenThen(
        caseId,
        defendantId,
        theCase,
        confirmedDefendant,
        defendantNotificationDTO,
      )
    })

    it('should not send a notification', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
    })

    it('should not record a notification', () => {
      expect(mockNotificationModel.create).not.toHaveBeenCalled()
    })
  })

  describe('when the defender choice is not confirmed', () => {
    const unconfirmedDefendant = {
      id: defendantId,
      defenderNationalId: '1234567890',
      defenderName: defender.name,
      defenderEmail: defender.email,
      isDefenderChoiceConfirmed: false,
    } as Defendant

    const theCase = buildCase([
      { dateType: DateType.COURT_DATE, date: futureDate } as DateLog,
    ])

    beforeEach(async () => {
      await givenWhenThen(
        caseId,
        defendantId,
        theCase,
        unconfirmedDefendant,
        defendantNotificationDTO,
      )
    })

    it('should not send a notification', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
    })
  })
})
