import addDays from 'date-fns/addDays'
import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'

import {
  PROSECUTION_INDICTMENT_CASE_OVERVIEW_ROUTE,
  PROSECUTION_INDICTMENTS_TO_REVIEW,
} from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { InstitutionNotificationType } from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../createTestingNotificationModule'

import { nowFactory } from '../../../../factories'
import { InternalCaseService } from '../../../case'
import { Case } from '../../../repository'
import { UserService } from '../../../user'
import { DeliverResponse } from '../../models/deliver.response'

jest.mock('../../../../factories')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalNotificationController - Send public prosecutor verdict appeal deadline reminder notifications', () => {
  const { prosecutor1, prosecutor2 } = createTestUsers([
    'prosecutor1',
    'prosecutor2',
  ])
  const prosecutorsOfficeId = uuid()
  const now = new Date()

  let mockEmailService: EmailService
  let mockUserService: UserService
  let mockInternalCaseService: InternalCaseService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const mockNowFactory = nowFactory as jest.Mock
    mockNowFactory.mockReturnValue(now)

    const {
      emailService,
      userService,
      internalCaseService,
      internalNotificationController,
    } = await createTestingNotificationModule()

    mockEmailService = emailService
    mockUserService = userService
    mockInternalCaseService = internalCaseService
    ;(mockUserService.getProsecutorUsers as jest.Mock).mockRejectedValue(
      new Error('Some error'),
    )
    ;(
      mockInternalCaseService.getIndictmentCasesWithVerdictAppealDeadlineOnTargetDate as jest.Mock
    ).mockRejectedValue(new Error('Some error'))

    givenWhenThen = async () => {
      const then = {} as Then

      await internalNotificationController
        .sendInstitutionNotification({
          type: InstitutionNotificationType.PUBLIC_PROSECUTOR_VERDICT_APPEAL_DEADLINE_REMINDER,
          prosecutorsOfficeId,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('no prosecutor users', () => {
    let then: Then

    beforeEach(async () => {
      ;(mockUserService.getProsecutorUsers as jest.Mock).mockResolvedValueOnce(
        [],
      )

      then = await givenWhenThen()
    })

    it('should not send any emails', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('prosecutor user has no cases with approaching deadline', () => {
    let then: Then

    beforeEach(async () => {
      ;(mockUserService.getProsecutorUsers as jest.Mock).mockResolvedValueOnce([
        {
          id: prosecutor1.id,
          name: prosecutor1.name,
          email: prosecutor1.email,
        },
      ])
      ;(
        mockInternalCaseService.getIndictmentCasesWithVerdictAppealDeadlineOnTargetDate as jest.Mock
      ).mockResolvedValueOnce([])

      then = await givenWhenThen()
    })

    it('should not send email', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('prosecutor user has one case with approaching deadline', () => {
    const caseId = uuid()
    const courtCaseNumber = 'S-123/2024'
    let then: Then

    beforeEach(async () => {
      ;(mockUserService.getProsecutorUsers as jest.Mock).mockResolvedValueOnce([
        {
          id: prosecutor1.id,
          name: prosecutor1.name,
          email: prosecutor1.email,
        },
      ])
      ;(
        mockInternalCaseService.getIndictmentCasesWithVerdictAppealDeadlineOnTargetDate as jest.Mock
      ).mockResolvedValueOnce([{ id: caseId, courtCaseNumber } as Case])

      then = await givenWhenThen()
    })

    it('should send email with single-case link', () => {
      const targetDate = addDays(now, 7)

      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor1.name, address: prosecutor1.email }],
          subject: 'Áminning um yfirlestur',
          html: expect.stringContaining(
            `${PROSECUTION_INDICTMENT_CASE_OVERVIEW_ROUTE}/${caseId}`,
          ),
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining(formatDate(targetDate) as string),
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('prosecutor user has multiple cases with approaching deadline', () => {
    const caseId1 = uuid()
    const caseId2 = uuid()
    const courtCaseNumber1 = 'S-123/2024'
    const courtCaseNumber2 = 'S-456/2024'
    let then: Then

    beforeEach(async () => {
      ;(mockUserService.getProsecutorUsers as jest.Mock).mockResolvedValueOnce([
        {
          id: prosecutor1.id,
          name: prosecutor1.name,
          email: prosecutor1.email,
        },
      ])
      ;(
        mockInternalCaseService.getIndictmentCasesWithVerdictAppealDeadlineOnTargetDate as jest.Mock
      ).mockResolvedValueOnce([
        { id: caseId1, courtCaseNumber: courtCaseNumber1 } as Case,
        { id: caseId2, courtCaseNumber: courtCaseNumber2 } as Case,
      ])

      then = await givenWhenThen()
    })

    it('should send email with review list link and both case numbers', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor1.name, address: prosecutor1.email }],
          subject: 'Áminning um yfirlestur',
          html: expect.stringContaining(PROSECUTION_INDICTMENTS_TO_REVIEW),
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining(courtCaseNumber1),
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining(courtCaseNumber2),
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('multiple prosecutor users each with cases', () => {
    let then: Then

    beforeEach(async () => {
      ;(mockUserService.getProsecutorUsers as jest.Mock).mockResolvedValueOnce([
        {
          id: prosecutor1.id,
          name: prosecutor1.name,
          email: prosecutor1.email,
        },
        {
          id: prosecutor2.id,
          name: prosecutor2.name,
          email: prosecutor2.email,
        },
      ])
      ;(
        mockInternalCaseService.getIndictmentCasesWithVerdictAppealDeadlineOnTargetDate as jest.Mock
      )
        .mockResolvedValueOnce([
          { id: uuid(), courtCaseNumber: 'S-1/2024' } as Case,
        ])
        .mockResolvedValueOnce([
          { id: uuid(), courtCaseNumber: 'S-2/2024' } as Case,
        ])

      then = await givenWhenThen()
    })

    it('should send one email per user', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor1.name, address: prosecutor1.email }],
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor2.name, address: prosecutor2.email }],
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
