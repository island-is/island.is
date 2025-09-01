import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'
import { ConfigType } from '@island.is/nest/config'

import { DEFENDER_ROUTE } from '@island.is/judicial-system/consts'
import {
  CaseNotificationType,
  CaseType,
  DateType,
  User,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../createTestingNotificationModule'

import { Case } from '../../../repository'
import { CaseNotificationDto } from '../../dto/caseNotification.dto'
import { DeliverResponse } from '../../models/deliver.response'
import { notificationModuleConfig } from '../../notification.config'

jest.mock('../../../../factories')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  notificationDto: CaseNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send defender assigned notifications', () => {
  const userId = uuid()

  const { defender } = createTestUsers(['defender'])

  const court = { name: 'Héraðsdómur Reykjavíkur' } as Case['court']

  let mockEmailService: EmailService
  let mockConfig: ConfigType<typeof notificationModuleConfig>
  let givenWhenThen: GivenWhenThen
  let notificationDTO: CaseNotificationDto

  beforeEach(async () => {
    const { emailService, notificationConfig, internalNotificationController } =
      await createTestingNotificationModule()

    notificationDTO = {
      user: { id: userId } as User,
      type: CaseNotificationType.ADVOCATE_ASSIGNED,
    }

    mockEmailService = emailService
    mockConfig = notificationConfig

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      notificationDto: CaseNotificationDto,
    ) => {
      const then = {} as Then

      try {
        then.result = await internalNotificationController.sendCaseNotification(
          caseId,
          theCase,
          notificationDto,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('when sending assigned defender notifications in a restriction case', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.ADMISSION_TO_FACILITY,
      court,
      courtCaseNumber: 'R-123/2022',
      defenderEmail: defender.email,
      defenderName: defender.name,
      defenderNationalId: '1234567890',
      dateLogs: [{ date: new Date(), dateType: DateType.ARRAIGNMENT_DATE }],
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, notificationDTO)
    })

    it('should send email with link', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        from: {
          name: mockConfig.email.fromName,
          address: mockConfig.email.fromEmail,
        },
        to: [
          {
            name: theCase.defenderName,
            address: theCase.defenderEmail,
          },
        ],
        replyTo: {
          name: mockConfig.email.replyToName,
          address: mockConfig.email.replyToEmail,
        },
        attachments: undefined,
        subject: `Yfirlit máls ${theCase.courtCaseNumber}`,
        text: expect.anything(),
        html: `Héraðsdómur Reykjavíkur hefur skráð þig sem verjanda/talsmann sakbornings í máli ${theCase.courtCaseNumber}.<br /><br />Þú getur nálgast yfirlit málsins á <a href="${mockConfig.clientUrl}${DEFENDER_ROUTE}/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
      })
    })
  })

  describe('when sending assigned defender without national id notifications in a restriction case', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.ADMISSION_TO_FACILITY,
      court,
      courtCaseNumber: 'R-123/2022',
      defenderEmail: defender.email,
      defenderName: defender.name,
      dateLogs: [{ date: new Date(), dateType: DateType.ARRAIGNMENT_DATE }],
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, notificationDTO)
    })

    it('should send an email without a link', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        from: {
          name: mockConfig.email.fromName,
          address: mockConfig.email.fromEmail,
        },
        to: [
          {
            name: theCase.defenderName,
            address: theCase.defenderEmail,
          },
        ],
        replyTo: {
          name: mockConfig.email.replyToName,
          address: mockConfig.email.replyToEmail,
        },
        attachments: undefined,
        subject: `Yfirlit máls ${theCase.courtCaseNumber}`,
        text: expect.anything(),
        html: `Héraðsdómur Reykjavíkur hefur skráð þig sem verjanda/talsmann sakbornings í máli ${theCase.courtCaseNumber}.<br /><br />Þú getur nálgast yfirlit málsins hjá Héraðsdómi Reykjavíkur ef það hefur ekki þegar verið afhent.`,
      })
    })
  })

  describe('when sending notifications in an investigation case', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.PHONE_TAPPING,
      court,
      courtCaseNumber: 'R-123/2022',
      defenderEmail: defender.email,
      defenderName: defender.name,
      dateLogs: [{ date: new Date(), dateType: DateType.ARRAIGNMENT_DATE }],
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, notificationDTO)
    })

    it('should not send email', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(0)
    })
  })
})
