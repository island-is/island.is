import { v4 as uuid } from 'uuid'

import { Message, MessageType } from '@island.is/judicial-system/message'
import {
  CivilClaimantNotificationType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { Case, CivilClaimant } from '../../../repository'
import { UpdateCivilClaimantDto } from '../../dto/updateCivilClaimant.dto'

interface Then {
  result: CivilClaimant
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  civilClaimantId: string,
  updateData: UpdateCivilClaimantDto,
) => Promise<Then>

describe('CivilClaimantController - Update', () => {
  const caseId = uuid()
  const courtCaseNumber = uuid()
  const user = { id: uuid() }
  const civilClaimantId = uuid()
  const theCase = { id: caseId, courtCaseNumber } as Case

  let mockQueuedMessages: Message[]
  let mockCivilClaimantModel: typeof CivilClaimant
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { queuedMessages, civilClaimantModel, civilClaimantController } =
      await createTestingDefendantModule()

    mockQueuedMessages = queuedMessages
    mockCivilClaimantModel = civilClaimantModel

    givenWhenThen = async (
      theCase: Case,
      civilClaimantId: string,
      updateData: UpdateCivilClaimantDto,
    ) => {
      const then = {} as Then

      await civilClaimantController
        .update(
          caseId,
          civilClaimantId,
          theCase,
          user as User,
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

      then = await givenWhenThen(theCase, civilClaimantId, civilClaimantUpdate)
    })

    it('should update the civil claimant', () => {
      expect(mockCivilClaimantModel.update).toHaveBeenCalledWith(
        civilClaimantUpdate,
        {
          where: { id: civilClaimantId, caseId },
          returning: true,
        },
      )
      expect(mockQueuedMessages).toEqual([])
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

      then = await givenWhenThen(theCase, civilClaimantId, civilClaimantUpdate)
    })

    it('should queue delivery and notification messages', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.DELIVERY_TO_COURT_INDICTMENT_SPOKESPERSON,
          user,
          caseId,
          elementId: civilClaimantId,
        },
        {
          type: MessageType.CIVIL_CLAIMANT_NOTIFICATION,
          caseId,
          elementId: civilClaimantId,
          body: { type: CivilClaimantNotificationType.SPOKESPERSON_ASSIGNED },
        },
        {
          type: MessageType.CIVIL_CLAIMANT_NOTIFICATION,
          caseId,
          user,
          elementId: civilClaimantId,
          body: {
            type: CivilClaimantNotificationType.SPOKESPERSON_COURT_DATE_FOLLOW_UP,
          },
        },
      ])
    })

    it('should return the updated civil claimant', () => {
      expect(then.result).toBe(updatedCivilClaimant)
    })
  })

  describe('civil claimant spokesperson confirmed without court case number', () => {
    const civilClaimantUpdate = { isSpokespersonConfirmed: true }
    const updatedCivilClaimant = {
      id: civilClaimantId,
      caseId,
      ...civilClaimantUpdate,
    }
    const caseWithoutCourtCaseNumber = { id: caseId } as Case

    beforeEach(async () => {
      const mockUpdate = mockCivilClaimantModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1, [updatedCivilClaimant]])

      await givenWhenThen(
        caseWithoutCourtCaseNumber,
        civilClaimantId,
        civilClaimantUpdate,
      )
    })

    it('should queue notifications but not delivery', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.CIVIL_CLAIMANT_NOTIFICATION,
          caseId,
          elementId: civilClaimantId,
          body: { type: CivilClaimantNotificationType.SPOKESPERSON_ASSIGNED },
        },
        {
          type: MessageType.CIVIL_CLAIMANT_NOTIFICATION,
          caseId,
          user,
          elementId: civilClaimantId,
          body: {
            type: CivilClaimantNotificationType.SPOKESPERSON_COURT_DATE_FOLLOW_UP,
          },
        },
      ])
    })
  })

  describe('civil claimant update fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCivilClaimantModel.update as jest.Mock
      mockUpdate.mockRejectedValue(new Error('Test error'))

      then = await givenWhenThen(theCase, civilClaimantId, {})
    })

    it('should throw an error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toEqual('Test error')
    })
  })
})
