import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'
import { ConfigType } from '@island.is/nest/config'

import {
  CaseType,
  IndictmentCaseNotificationType,
  RequestCaseNotificationType,
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

type GivenWhenThen = (theCase: Case) => Promise<Then>

describe('InternalNotificationController - Send appeal prosecutor assigned notification', () => {
  const caseId = uuid()
  const userId = uuid()
  const courtCaseNumber = 'S-123/2026'
  const { prosecutor } = createTestUsers(['prosecutor'])

  const notificationDto: CaseNotificationDto = {
    user: { id: userId } as User,
    type: IndictmentCaseNotificationType.APPEAL_PROSECUTOR_ASSIGNED as unknown as RequestCaseNotificationType,
  }

  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    courtCaseNumber,
    appealProsecutor: { name: prosecutor.name, email: prosecutor.email },
  } as unknown as Case

  let mockEmailService: EmailService
  let mockConfig: ConfigType<typeof notificationModuleConfig>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { emailService, internalNotificationController, notificationConfig } =
      await createTestingNotificationModule()

    mockEmailService = emailService
    mockConfig = notificationConfig

    givenWhenThen = async (aCase: Case) => {
      const then = {} as Then

      try {
        then.result = await internalNotificationController.sendCaseNotification(
          caseId,
          aCase,
          notificationDto,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('the appeal prosecutor is told', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase)
    })

    it('should send the email the design asked for', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: `Áfrýjun í máli ${courtCaseNumber}`,
          html: `Þér hefur verið úthlutað áfrýjunarmáli vegna dóms í máli nr. ${courtCaseNumber}.<br/><br/><a href="${mockConfig.clientUrl}/akaera/yfirlit/${caseId}">Sjá nánar á yfirlitssíðu málsins í Réttarvörslugátt.</a>`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })

    it('should tell nobody else', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
    })
  })
})
