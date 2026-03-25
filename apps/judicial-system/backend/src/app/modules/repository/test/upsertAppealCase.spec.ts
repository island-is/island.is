import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { CaseAppealState } from '@island.is/judicial-system/types'

import { createTestingRepositoryModule } from './createTestingRepositoryModule'

import { AppealCase } from '../models/appealCase.model'
import { CaseRepositoryService } from '../services/caseRepository.service'
import { UpdateAppealCase } from '../types/caseRepository.types'

interface Then {
  result: AppealCase
  error: Error
}

type GivenWhenThen = (caseId: string, data: UpdateAppealCase) => Promise<Then>

describe('CaseRepositoryService - upsertAppealCase', () => {
  const transaction = {} as Transaction
  const options = { transaction }

  let mockAppealCaseModel: typeof AppealCase
  let caseRepositoryService: CaseRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseRepositoryService: service, appealCaseModel } =
      await createTestingRepositoryModule()

    caseRepositoryService = service
    mockAppealCaseModel = appealCaseModel

    givenWhenThen = async (caseId: string, data: UpdateAppealCase) => {
      const then = {} as Then

      await caseRepositoryService
        .upsertAppealCase(caseId, data, options)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('when upsert succeeds', () => {
    const caseId = uuid()
    const appealCaseId = uuid()
    const data: UpdateAppealCase = {
      appealState: CaseAppealState.APPEALED,
      appealCaseNumber: undefined,
      appealReceivedByCourtDate: undefined,
      prosecutorStatementDate: undefined,
      defendantStatementDate: undefined,
      appealAssistantId: undefined,
      appealJudge1Id: undefined,
      appealJudge2Id: undefined,
      appealJudge3Id: undefined,
      appealRulingDecision: undefined,
      appealConclusion: undefined,
      appealRulingModifiedHistory: undefined,
      requestAppealRulingNotToBePublished: undefined,
      appealValidToDate: undefined,
      isAppealCustodyIsolation: undefined,
      appealIsolationToDate: undefined,
    }
    const upsertedAppealCase = {
      id: appealCaseId,
      caseId,
      ...data,
    } as AppealCase
    let then: Then

    beforeEach(async () => {
      const mockUpsert = mockAppealCaseModel.upsert as jest.Mock
      mockUpsert.mockResolvedValueOnce([upsertedAppealCase, true])

      then = await givenWhenThen(caseId, data)
    })

    it('should call upsert with correct arguments', () => {
      expect(mockAppealCaseModel.upsert).toHaveBeenCalledWith(
        { ...data, caseId },
        { transaction, returning: true, conflictFields: ['case_id'] },
      )
    })

    it('should return the upserted appeal case', () => {
      expect(then.result).toBe(upsertedAppealCase)
    })
  })

  describe('when upsert throws', () => {
    const caseId = uuid()
    const data: UpdateAppealCase = {
      appealState: CaseAppealState.COMPLETED,
      appealCaseNumber: undefined,
      appealReceivedByCourtDate: undefined,
      prosecutorStatementDate: undefined,
      defendantStatementDate: undefined,
      appealAssistantId: undefined,
      appealJudge1Id: undefined,
      appealJudge2Id: undefined,
      appealJudge3Id: undefined,
      appealRulingDecision: undefined,
      appealConclusion: undefined,
      appealRulingModifiedHistory: undefined,
      requestAppealRulingNotToBePublished: undefined,
      appealValidToDate: undefined,
      isAppealCustodyIsolation: undefined,
      appealIsolationToDate: undefined,
    }
    let then: Then

    beforeEach(async () => {
      const mockUpsert = mockAppealCaseModel.upsert as jest.Mock
      mockUpsert.mockRejectedValueOnce(new Error('Database error'))

      then = await givenWhenThen(caseId, data)
    })

    it('should throw the error', () => {
      expect(then.error).toBeInstanceOf(Error)
    })
  })
})
