import {
  MessageSuspensionCategory,
  type User,
} from '@island.is/judicial-system/types'

import { createTestingMessageSuspensionModule } from './createTestingMessageSuspensionModule'

import {
  MessageSuspension,
  MessageSuspensionRepositoryService,
} from '../../repository'
import { UpdateMessageSuspensionDto } from '../dto/updateMessageSuspension.dto'
import { MessageSuspensionController } from '../messageSuspension.controller'

interface Then {
  result: MessageSuspension
  error: Error
}

type GivenWhenThen = (
  category: MessageSuspensionCategory,
  user: User,
  update: UpdateMessageSuspensionDto,
) => Promise<Then>

describe('MessageSuspensionController - Update', () => {
  const user = { nationalId: '1234567890' } as User
  const category = MessageSuspensionCategory.POLICE

  let mockRepository: MessageSuspensionRepositoryService
  let controller: MessageSuspensionController
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { messageSuspensionRepositoryService, messageSuspensionController } =
      await createTestingMessageSuspensionModule()

    mockRepository = messageSuspensionRepositoryService
    controller = messageSuspensionController

    givenWhenThen = async (category, user, update) => {
      const then = {} as Then

      await controller
        .update(category, user, update)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('suspension updated', () => {
    const update: UpdateMessageSuspensionDto = {
      suspended: true,
      delaySeconds: 300,
    }
    const updated = { category, ...update } as MessageSuspension
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockRepository.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updated)

      then = await givenWhenThen(category, user, update)
    })

    it('should stamp the acting user and forward to the repository', () => {
      expect(mockRepository.update).toHaveBeenCalledWith(category, {
        ...update,
        modifiedBy: user.nationalId,
      })
    })

    it('should return the updated suspension', () => {
      expect(then.result).toBe(updated)
    })
  })
})
