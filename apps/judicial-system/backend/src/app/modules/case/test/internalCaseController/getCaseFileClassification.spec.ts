import { v4 as uuid } from 'uuid'

import {
  CaseFileClassification,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { Case } from '../../../repository'
import { CaseFileClassificationResponse } from '../../models/caseFileClassification.response'

interface Then {
  result: CaseFileClassificationResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Get case file classification', () => {
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
        then.result = await internalCaseController.getCaseFileClassification(
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

    it('should return CASE_FILES_RECORD', async () => {
      const then = await givenWhenThen(caseId, theCase)

      expect(mockFindLiveDescendantCase).toHaveBeenCalledWith(theCase)
      expect(then.result).toEqual({
        classification: CaseFileClassification.CASE_FILES_RECORD,
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

    it('should return ADDITIONAL_CASE_FILE', async () => {
      const then = await givenWhenThen(caseId, theCase)

      expect(then.result).toEqual({
        classification: CaseFileClassification.ADDITIONAL_CASE_FILE,
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

    it('should classify from the live draft as CASE_FILES_RECORD', async () => {
      const then = await givenWhenThen(caseId, theCase)

      expect(mockFindLiveDescendantCase).toHaveBeenCalledWith(theCase)
      expect(then.result).toEqual({
        classification: CaseFileClassification.CASE_FILES_RECORD,
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

    it('should classify from the submitted duplicate as ADDITIONAL_CASE_FILE', async () => {
      const then = await givenWhenThen(caseId, theCase)

      expect(then.result).toEqual({
        classification: CaseFileClassification.ADDITIONAL_CASE_FILE,
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

    it('should fall back to the original case as ADDITIONAL_CASE_FILE', async () => {
      // Default mock returns theCase itself (no live descendant)
      const then = await givenWhenThen(caseId, theCase)

      expect(then.result).toEqual({
        classification: CaseFileClassification.ADDITIONAL_CASE_FILE,
      })
    })
  })
})
