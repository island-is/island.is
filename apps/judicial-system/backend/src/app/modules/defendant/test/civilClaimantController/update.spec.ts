import { uuid } from 'uuidv4'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import { CivilClaimantNotificationType } from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { CivilClaimant } from '../../../repository'
import { UpdateCivilClaimantDto } from '../../dto/updateCivilClaimant.dto'

interface Then {
  result: CivilClaimant
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  civilClaimantId: string,
  updateData: UpdateCivilClaimantDto,
) => Promise<Then>

describe('CivilClaimantController - Update', () => {
  const caseId = uuid()
  const civilClaimantId = uuid()

  let mockMessageService: MessageService
  let mockCivilClaimantModel: typeof CivilClaimant
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { messageService, civilClaimantModel, civilClaimantController } =
      await createTestingDefendantModule()

    mockMessageService = messageService
    mockCivilClaimantModel = civilClaimantModel

    givenWhenThen = async (
      caseId: string,
      civilClaimantId: string,
      updateData: UpdateCivilClaimantDto,
    ) => {
      const then = {} as Then

      await civilClaimantController
        .update(
          caseId,
          civilClaimantId,
          { id: civilClaimantId } as CivilClaimant,
          updateData,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('civil claimant updated', () => {
    const civilClaimantUpdate = { name: 'Updated Name' }
    const updatedCivilClaimant = {
      id: civilClaimantId,
      caseId,
      ...civilClaimantUpdate,
    }
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCivilClaimantModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1, [updatedCivilClaimant]])

      then = await givenWhenThen(caseId, civilClaimantId, civilClaimantUpdate)
    })

    it('should update the civil claimant', () => {
      expect(mockCivilClaimantModel.update).toHaveBeenCalledWith(
        civilClaimantUpdate,
        {
          where: { id: civilClaimantId, caseId },
          returning: true,
        },
      )
      expect(mockMessageService.sendMessagesToQueue).not.toHaveBeenCalled()
    })

    it('should return the updated civil claimant', () => {
      expect(then.result).toBe(updatedCivilClaimant)
    })
  })

  describe('civil claimant spokesperson confirmed', () => {
    const civilClaimantUpdate = { isSpokespersonConfirmed: true }
    const updatedCivilClaimant = {
      id: civilClaimantId,
      caseId,
      ...civilClaimantUpdate,
    }
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCivilClaimantModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1, [updatedCivilClaimant]])

      then = await givenWhenThen(caseId, civilClaimantId, civilClaimantUpdate)
    })

    it('should queue spokesperson assigned message', () => {
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        {
          type: MessageType.CIVIL_CLAIMANT_NOTIFICATION,
          caseId,
          elementId: civilClaimantId,
          body: {
            type: CivilClaimantNotificationType.SPOKESPERSON_ASSIGNED,
          },
        },
      ])
    })

    it('should return the updated civil claimant', () => {
      expect(then.result).toBe(updatedCivilClaimant)
    })
  })

  describe('civil claimant update fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCivilClaimantModel.update as jest.Mock
      mockUpdate.mockRejectedValue(new Error('Test error'))

      then = await givenWhenThen(caseId, civilClaimantId, {})
    })

    it('should throw an error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toEqual('Test error')
    })
  })
})
