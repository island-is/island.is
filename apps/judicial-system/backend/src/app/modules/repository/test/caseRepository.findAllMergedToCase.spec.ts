import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { createTestingRepositoryModule } from './createTestingRepositoryModule'

import { Case } from '../models/case.model'
import { CaseDefendantPoliceCaseNumberRepositoryService } from '../services/caseDefendantPoliceCaseNumber.repository.service'
import { CaseRepositoryService } from '../services/caseRepository.service'

describe('CaseRepositoryService - findAllMergedToCase', () => {
  const caseId = uuid()
  const transaction = {} as Transaction

  let caseRepositoryService: CaseRepositoryService
  let mockCaseModel: { findAll: jest.Mock }
  let mockResolvePoliceCaseNumbersForCases: jest.Mock

  beforeEach(async () => {
    const {
      caseRepositoryService: service,
      caseModel,
      caseDefendantPoliceCaseNumberRepositoryService,
    } = await createTestingRepositoryModule()

    caseRepositoryService = service
    mockCaseModel = caseModel as unknown as { findAll: jest.Mock }
    mockResolvePoliceCaseNumbersForCases = (
      caseDefendantPoliceCaseNumberRepositoryService as jest.Mocked<CaseDefendantPoliceCaseNumberRepositoryService>
    ).resolvePoliceCaseNumbersForCases as jest.Mock
  })

  describe('cases have been merged into the case', () => {
    const mergedCases = [{ id: uuid() }, { id: uuid() }] as Case[]
    let result: Case[]

    beforeEach(async () => {
      mockCaseModel.findAll.mockResolvedValueOnce(mergedCases)

      result = await caseRepositoryService.findAllMergedToCase(caseId, {
        transaction,
      })
    })

    it('should read them oldest merge first', () => {
      expect(mockCaseModel.findAll).toHaveBeenCalledWith({
        where: { mergeCaseId: caseId },
        order: [['created', 'ASC']],
        transaction,
      })
      expect(result).toBe(mergedCases)
    })

    // A merged case's police case numbers live in the junction table, so a
    // caller reading through the aggregate gets them without asking.
    it('should resolve their police case numbers', () => {
      expect(mockResolvePoliceCaseNumbersForCases).toHaveBeenCalledWith(
        mergedCases,
        { transaction },
      )
    })
  })

  describe('nothing has been merged into the case', () => {
    beforeEach(async () => {
      mockCaseModel.findAll.mockResolvedValueOnce([])

      await caseRepositoryService.findAllMergedToCase(caseId)
    })

    it('should not resolve police case numbers', () => {
      expect(mockResolvePoliceCaseNumbersForCases).not.toHaveBeenCalled()
    })
  })

  describe('the read fails', () => {
    const error = new Error('Some error')

    it('should rethrow', async () => {
      mockCaseModel.findAll.mockRejectedValueOnce(error)

      await expect(
        caseRepositoryService.findAllMergedToCase(caseId),
      ).rejects.toThrow(error)
    })
  })
})
