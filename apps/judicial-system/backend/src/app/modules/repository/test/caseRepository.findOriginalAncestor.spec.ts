import { InternalServerErrorException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { Case } from '../models/case.model'
import { CaseDefendantPoliceCaseNumberRepositoryService } from '../services/caseDefendantPoliceCaseNumber.repository.service'
import { CaseRepositoryService } from '../services/caseRepository.service'

describe('CaseRepositoryService — findOriginalAncestor', () => {
  let caseRepositoryService: CaseRepositoryService
  let findOriginalAncestorId: jest.SpyInstance
  let findById: jest.SpyInstance

  beforeEach(async () => {
    jest.clearAllMocks()

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(Case), useValue: {} },
        {
          provide: CaseDefendantPoliceCaseNumberRepositoryService,
          useValue: {},
        },
        CaseRepositoryService,
      ],
    }).compile()

    caseRepositoryService = moduleRef.get(CaseRepositoryService)
    findOriginalAncestorId = jest.spyOn(
      caseRepositoryService,
      'findOriginalAncestorId',
    )
    findById = jest.spyOn(caseRepositoryService, 'findById')
  })

  it('returns the case itself when it is its own original ancestor', async () => {
    const theCase = { id: 'case-id' } as Case
    findOriginalAncestorId.mockResolvedValueOnce('case-id')

    const result = await caseRepositoryService.findOriginalAncestor(theCase)

    expect(findOriginalAncestorId).toHaveBeenCalledWith(theCase)
    expect(result).toBe(theCase)
    expect(findById).not.toHaveBeenCalled()
  })

  it('loads the original ancestor when the case descends from another case', async () => {
    const theCase = { id: 'child-id' } as Case
    const originalAncestor = { id: 'origin-id' } as Case
    findOriginalAncestorId.mockResolvedValueOnce('origin-id')
    findById.mockResolvedValueOnce(originalAncestor)

    const result = await caseRepositoryService.findOriginalAncestor(theCase)

    expect(findById).toHaveBeenCalledWith('origin-id')
    expect(result).toBe(originalAncestor)
  })

  it('throws when the original ancestor cannot be loaded', async () => {
    const theCase = { id: 'child-id' } as Case
    findOriginalAncestorId.mockResolvedValueOnce('origin-id')
    findById.mockResolvedValueOnce(null)

    await expect(
      caseRepositoryService.findOriginalAncestor(theCase),
    ).rejects.toThrow(
      new InternalServerErrorException(
        'Original ancestor of case child-id not found',
      ),
    )
  })
})
