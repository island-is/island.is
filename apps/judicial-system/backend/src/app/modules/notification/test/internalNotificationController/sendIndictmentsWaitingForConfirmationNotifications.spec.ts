import { v4 as uuid } from 'uuid'

import { ConfigType } from '@nestjs/config'

import { EmailService } from '@island.is/email-service'

import { InstitutionNotificationType } from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../createTestingNotificationModule'

import { InternalCaseService } from '../../../case'
import { UserService } from '../../../user'
import { DeliverResponse } from '../../models/deliver.response'
import { notificationModuleConfig } from '../../notification.config'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalNotificationController - Send indictments waiting for confirmation notifications', () => {
  const { prosecutor1, prosecutor2 } = createTestUsers([
    'prosecutor1',
    'prosecutor2',
  ])

  let mockConfig: ConfigType<typeof notificationModuleConfig>

  const prosecutorsOfficeId = uuid()
  let mockUserService: UserService
  let mockInternalCaseService: InternalCaseService
  let mockEmailService: EmailService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      userService,
      internalCaseService,
      emailService,
      internalNotificationController,
      notificationConfig,
    } = await createTestingNotificationModule()

    mockConfig = notificationConfig
    mockUserService = userService
    mockInternalCaseService = internalCaseService
    mockEmailService = emailService

    const mockGetUsersWhoCanConfirmIndictments =
      userService.getUsersWhoCanConfirmIndictments as jest.Mock
    mockGetUsersWhoCanConfirmIndictments.mockRejectedValue(
      new Error('Some error'),
    )

    const mockCountIndictmentsWaitingForConfirmation =
      mockInternalCaseService.countIndictmentsWaitingForConfirmation as jest.Mock
    mockCountIndictmentsWaitingForConfirmation.mockRejectedValue(
      new Error('Some error'),
    )

    givenWhenThen = async () => {
      const then = {} as Then

      await internalNotificationController
        .sendInstitutionNotification({
          type: InstitutionNotificationType.INDICTMENTS_WAITING_FOR_CONFIRMATION,
          prosecutorsOfficeId,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('no indictments waiting for confirmation', () => {
    let then: Then

    beforeEach(async () => {
      const mockCountIndictmentsWaitingForConfirmation =
        mockInternalCaseService.countIndictmentsWaitingForConfirmation as jest.Mock
      mockCountIndictmentsWaitingForConfirmation.mockResolvedValueOnce(0)

      then = await givenWhenThen()
    })

    it('should not send messages', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('no users who can confirm indictments', () => {
    let then: Then

    beforeEach(async () => {
      const mockCountIndictmentsWaitingForConfirmation =
        mockInternalCaseService.countIndictmentsWaitingForConfirmation as jest.Mock
      mockCountIndictmentsWaitingForConfirmation.mockResolvedValueOnce(2)

      const mockGetUsersWhoCanConfirmIndictments =
        mockUserService.getUsersWhoCanConfirmIndictments as jest.Mock
      mockGetUsersWhoCanConfirmIndictments.mockResolvedValueOnce([])

      then = await givenWhenThen()
    })

    it('should not send messages', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notifications sent', () => {
    let then: Then

    beforeEach(async () => {
      const mockCountIndictmentsWaitingForConfirmation =
        mockInternalCaseService.countIndictmentsWaitingForConfirmation as jest.Mock
      mockCountIndictmentsWaitingForConfirmation.mockResolvedValueOnce(2)

      const mockGetUsersWhoCanConfirmIndictments =
        mockUserService.getUsersWhoCanConfirmIndictments as jest.Mock
      mockGetUsersWhoCanConfirmIndictments.mockResolvedValueOnce([
        { name: prosecutor1.name, email: prosecutor1.email },
        { name: prosecutor2.name, email: prosecutor2.email },
      ])

      then = await givenWhenThen()
    })

    it('should send messages', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor1.name, address: prosecutor1.email }],
          subject: 'Ákærur bíða staðfestingar',
          html: `Í Réttarvörslugátt bíða 2 ákærur staðfestingar.<br /><br />Hægt er að nálgast yfirlit og staðfesta ákærur í <a href="${mockConfig.clientUrl}">Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor2.name, address: prosecutor2.email }],
          subject: 'Ákærur bíða staðfestingar',
          html: `Í Réttarvörslugátt bíða 2 ákærur staðfestingar.<br /><br />Hægt er að nálgast yfirlit og staðfesta ákærur í <a href="${mockConfig.clientUrl}">Réttarvörslugátt</a>.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
