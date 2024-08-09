import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'

import { NotificationType } from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { InternalCaseService } from '../../../case'
import { UserService } from '../../../user'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalNotificationController - Send indictments waiting for confirmation notifications', () => {
  const prosecutorName1 = uuid()
  const prosecutorEmail1 = uuid()
  const prosecutorName2 = uuid()
  const prosecutorEmail2 = uuid()
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
    } = await createTestingNotificationModule()

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
        .sendNotification({
          type: NotificationType.INDICTMENTS_WAITING_FOR_CONFIRMATION,
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
        { name: prosecutorName1, email: prosecutorEmail1 },
        { name: prosecutorName2, email: prosecutorEmail2 },
      ])

      then = await givenWhenThen()
    })

    it('should not send messages', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutorName1, address: prosecutorEmail1 }],
          subject: 'Ákærur bíða staðfestingar',
          html: 'Í Réttarvörslugátt bíða 2 ákærur staðfestingar.<br /><br />Hægt er að nálgast yfirlit og staðfesta ákærur í <a href="https://rettarvorslugatt.island.is">Réttarvörslugátt</a>.',
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutorName2, address: prosecutorEmail2 }],
          subject: 'Ákærur bíða staðfestingar',
          html: 'Í Réttarvörslugátt bíða 2 ákærur staðfestingar.<br /><br />Hægt er að nálgast yfirlit og staðfesta ákærur í <a href="https://rettarvorslugatt.island.is">Réttarvörslugátt</a>.',
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
