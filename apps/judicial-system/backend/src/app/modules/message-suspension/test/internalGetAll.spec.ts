import { createTestingMessageSuspensionModule } from './createTestingMessageSuspensionModule'

import {
  MessageSuspension,
  MessageSuspensionRepositoryService,
} from '../../repository'
import { InternalMessageSuspensionController } from '../internalMessageSuspension.controller'

interface Then {
  result: MessageSuspension[]
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalMessageSuspensionController - Get all', () => {
  let mockRepository: MessageSuspensionRepositoryService
  let controller: InternalMessageSuspensionController
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      messageSuspensionRepositoryService,
      internalMessageSuspensionController,
    } = await createTestingMessageSuspensionModule()

    mockRepository = messageSuspensionRepositoryService
    controller = internalMessageSuspensionController

    givenWhenThen = async () => {
      const then = {} as Then

      await controller
        .getAll()
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('suspensions found', () => {
    const suspensions = [] as MessageSuspension[]
    let then: Then

    beforeEach(async () => {
      const mockFindAll = mockRepository.findAll as jest.Mock
      mockFindAll.mockResolvedValueOnce(suspensions)

      then = await givenWhenThen()
    })

    it('should request all suspensions from the repository', () => {
      expect(mockRepository.findAll).toHaveBeenCalled()
    })

    it('should return the suspensions', () => {
      expect(then.result).toBe(suspensions)
    })
  })
})
