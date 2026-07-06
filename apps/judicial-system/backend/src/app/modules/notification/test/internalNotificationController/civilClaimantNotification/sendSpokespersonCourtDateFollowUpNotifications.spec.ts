import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'

import {
  CaseType,
  CivilClaimantNotificationType,
  CourtSessionType,
  DateType,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../../createTestingNotificationModule'

import {
  Case,
  CivilClaimant,
  DateLog,
  Notification,
} from '../../../../repository'
import { CivilClaimantNotificationDto } from '../../../dto/civilClaimantNotification.dto'
import { DeliverResponse } from '../../../models/deliver.response'

jest.mock('../../../../../factories')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  civilClaimantId: string,
  theCase: Case,
  civilClaimant: CivilClaimant,
  notificationDto: CivilClaimantNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send spokesperson court date follow up notifications', () => {
  const caseId = uuid()
  const civilClaimantId = uuid()

  const { spokesperson, prosecutor } = createTestUsers([
    'spokesperson',
    'prosecutor',
  ])
  const court = { name: 'Héraðsdómur Reykjavíkur' } as Case['court']

  const futureDate = new Date(Date.now() + 100 * 60 * 1000)
  const pastDate = new Date(Date.now() - 100 * 60 * 1000)

  let mockEmailService: EmailService
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  let civilClaimantNotificationDTO: CivilClaimantNotificationDto

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

  const confirmedCivilClaimant = {
    id: civilClaimantId,
    caseId,
    isSpokespersonConfirmed: true,
    spokespersonIsLawyer: true,
    spokespersonNationalId: '1234567890',
    spokespersonName: spokesperson.name,
    spokespersonEmail: spokesperson.email,
  } as CivilClaimant

  beforeEach(async () => {
    const { emailService, internalNotificationController, notificationModel } =
      await createTestingNotificationModule()

    civilClaimantNotificationDTO = {
      type: CivilClaimantNotificationType.SPOKESPERSON_COURT_DATE_FOLLOW_UP,
      user: prosecutor as CivilClaimantNotificationDto['user'],
    }

    mockEmailService = emailService
    mockNotificationModel = notificationModel

    givenWhenThen = async (
      caseId: string,
      civilClaimantId: string,
      theCase: Case,
      civilClaimant: CivilClaimant,
      notificationDto: CivilClaimantNotificationDto,
    ) => {
      const then = {} as Then

      try {
        then.result =
          await internalNotificationController.sendCivilClaimantNotification(
            caseId,
            civilClaimantId,
            theCase,
            civilClaimant,
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
        civilClaimantId,
        theCase,
        confirmedCivilClaimant,
        civilClaimantNotificationDTO,
      )
    })

    it('should send a court session invitation with a calendar invite', () => {
      expect(mockEmailService.sendEmail).toBeCalledTimes(1)
      expect(mockEmailService.sendEmail).toBeCalledWith(
        expect.objectContaining({
          to: [
            {
              name: confirmedCivilClaimant.spokespersonName,
              address: confirmedCivilClaimant.spokespersonEmail,
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
        type: CivilClaimantNotificationType.SPOKESPERSON_COURT_DATE_FOLLOW_UP,
        recipients: [
          { address: confirmedCivilClaimant.spokespersonEmail, success: true },
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
        civilClaimantId,
        theCase,
        confirmedCivilClaimant,
        civilClaimantNotificationDTO,
      )
    })

    it('should send an arraignment invitation', () => {
      expect(mockEmailService.sendEmail).toBeCalledTimes(1)
      expect(mockEmailService.sendEmail).toBeCalledWith(
        expect.objectContaining({
          to: [
            {
              name: confirmedCivilClaimant.spokespersonName,
              address: confirmedCivilClaimant.spokespersonEmail,
            },
          ],
          subject: 'Þingfesting í máli: R-123-456/2024',
        }),
      )
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
        civilClaimantId,
        theCase,
        confirmedCivilClaimant,
        civilClaimantNotificationDTO,
      )
    })

    it('should prefer the arraignment invitation', () => {
      expect(mockEmailService.sendEmail).toBeCalledTimes(1)
      expect(mockEmailService.sendEmail).toBeCalledWith(
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
        civilClaimantId,
        theCase,
        confirmedCivilClaimant,
        civilClaimantNotificationDTO,
      )
    })

    it('should not send a notification', () => {
      expect(mockEmailService.sendEmail).not.toBeCalled()
    })

    it('should not record a notification', () => {
      expect(mockNotificationModel.create).not.toHaveBeenCalled()
    })
  })

  describe('when the spokesperson is not confirmed', () => {
    const unconfirmedCivilClaimant = {
      ...confirmedCivilClaimant,
      isSpokespersonConfirmed: false,
    } as CivilClaimant

    const theCase = buildCase([
      { dateType: DateType.COURT_DATE, date: futureDate } as DateLog,
    ])

    beforeEach(async () => {
      await givenWhenThen(
        caseId,
        civilClaimantId,
        theCase,
        unconfirmedCivilClaimant,
        civilClaimantNotificationDTO,
      )
    })

    it('should not send a notification', () => {
      expect(mockEmailService.sendEmail).not.toBeCalled()
    })
  })
})
