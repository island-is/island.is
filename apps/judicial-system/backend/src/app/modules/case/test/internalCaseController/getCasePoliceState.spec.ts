import { v4 as uuid } from 'uuid'

import {
  CasePoliceState,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { Case } from '../../../repository'
import { CasePoliceStateResponse } from '../../models/casePoliceState.response'

interface Then {
  result: CasePoliceStateResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Get case police state', () => {
  let givenWhenThen: GivenWhenThen
  let mockFindLiveDescendantCase: jest.Mock

  beforeEach(async () => {
    const { internalCaseController, caseRepositoryService } =
      await createTestingCaseModule()

    mockFindLiveDescendantCase =
      caseRepositoryService.findLiveDescendantCase as jest.Mock

    givenWhenThen = async (caseId, theCase) => {
      const then = {} as Then

      try {
        then.result = await internalCaseController.getCasePoliceState(
          caseId,
          theCase,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('indictment draft', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.DRAFT,
    } as Case

    it('should return DRAFT', async () => {
      const then = await givenWhenThen(caseId, theCase)

      expect(mockFindLiveDescendantCase).toHaveBeenCalledWith(theCase)
      expect(then.result).toEqual({
        state: CasePoliceState.DRAFT,
      })
    })
  })

  describe('indictment submitted', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.SUBMITTED,
    } as Case

    it('should return SUBMITTED', async () => {
      const then = await givenWhenThen(caseId, theCase)

      expect(then.result).toEqual({
        state: CasePoliceState.SUBMITTED,
      })
    })
  })

  describe('withdrawn indictment with live duplicate draft', () => {
    const caseId = uuid()
    const draftId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.WAITING_FOR_CANCELLATION,
    } as Case
    const liveDraft = {
      id: draftId,
      state: CaseState.DRAFT,
    } as Case

    beforeEach(() => {
      mockFindLiveDescendantCase.mockResolvedValueOnce(liveDraft)
    })

    it('should map from the live draft as DRAFT', async () => {
      const then = await givenWhenThen(caseId, theCase)

      expect(mockFindLiveDescendantCase).toHaveBeenCalledWith(theCase)
      expect(then.result).toEqual({
        state: CasePoliceState.DRAFT,
      })
    })
  })

  describe('withdrawn indictment with submitted duplicate', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.WAITING_FOR_CANCELLATION,
    } as Case
    const submittedDuplicate = {
      id: uuid(),
      state: CaseState.SUBMITTED,
    } as Case

    beforeEach(() => {
      mockFindLiveDescendantCase.mockResolvedValueOnce(submittedDuplicate)
    })

    it('should map from the submitted duplicate as SUBMITTED', async () => {
      const then = await givenWhenThen(caseId, theCase)

      expect(then.result).toEqual({
        state: CasePoliceState.SUBMITTED,
      })
    })
  })

  describe('withdrawn indictment with deleted duplicate (fallback)', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
    } as Case

    it('should fall back to the original case as SUBMITTED', async () => {
      // Default mock returns theCase itself (no live descendant)
      const then = await givenWhenThen(caseId, theCase)

      expect(then.result).toEqual({
        state: CasePoliceState.SUBMITTED,
      })
    })
  })
})
