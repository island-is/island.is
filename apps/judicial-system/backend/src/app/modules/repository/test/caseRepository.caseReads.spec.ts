import { IncludeOptions, Op } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { CaseState, CaseType } from '@island.is/judicial-system/types'

import { createTestingRepositoryModule } from './createTestingRepositoryModule'

import { Case } from '../models/case.model'
import { Defendant } from '../models/defendant.model'
import { CaseDefendantPoliceCaseNumberRepositoryService } from '../services/caseDefendantPoliceCaseNumber.repository.service'
import { CaseRepositoryService } from '../services/caseRepository.service'
import {
  caseInclude,
  getLimitedAccessCaseInclude,
  limitedAccessCaseAttributes,
} from '../types/caseRepository.types'

// The node of an include graph that reads a given association
const included = (include: unknown, as: string): IncludeOptions | undefined =>
  (include as IncludeOptions[]).find((node) => node.as === as)

describe('CaseRepositoryService - case reads', () => {
  const caseId = uuid()
  const cases = [{ id: uuid() }, { id: uuid() }] as Case[]
  const theCase = { id: caseId } as Case

  let caseRepositoryService: CaseRepositoryService
  let mockCaseModel: { findOne: jest.Mock; findAll: jest.Mock }
  let mockResolvePoliceCaseNumbersForCases: jest.Mock

  // The options the one read was made with
  const findAllOptions = () => mockCaseModel.findAll.mock.calls[0][0]
  const findOneOptions = () => mockCaseModel.findOne.mock.calls[0][0]

  beforeEach(async () => {
    const {
      caseRepositoryService: service,
      caseModel,
      caseDefendantPoliceCaseNumberRepositoryService,
    } = await createTestingRepositoryModule()

    caseRepositoryService = service
    mockCaseModel = caseModel as unknown as {
      findOne: jest.Mock
      findAll: jest.Mock
    }
    mockResolvePoliceCaseNumbersForCases = (
      caseDefendantPoliceCaseNumberRepositoryService as jest.Mocked<CaseDefendantPoliceCaseNumberRepositoryService>
    ).resolvePoliceCaseNumbersForCases as jest.Mock

    mockCaseModel.findAll.mockResolvedValue(cases)
    mockCaseModel.findOne.mockResolvedValue(theCase)
  })

  describe('findLiveById', () => {
    const transaction = {} as never
    let result: Case | null

    beforeEach(async () => {
      result = await caseRepositoryService.findLiveById(caseId, { transaction })
    })

    it('should read the whole case graph in the callers transaction', () => {
      expect(findOneOptions()).toEqual({
        include: caseInclude,
        where: {
          id: caseId,
          state: { [Op.not]: CaseState.DELETED },
          isArchived: false,
        },
        transaction,
      })
      expect(result).toBe(theCase)
    })

    it('should resolve the police case numbers in the same transaction', () => {
      expect(mockResolvePoliceCaseNumbersForCases).toHaveBeenCalledWith(
        [theCase],
        { transaction },
      )
    })

    describe('no live case', () => {
      beforeEach(async () => {
        mockCaseModel.findOne.mockReset()
        mockResolvePoliceCaseNumbersForCases.mockClear()
        mockCaseModel.findOne.mockResolvedValue(null)

        result = await caseRepositoryService.findLiveById(caseId)
      })

      it('should resolve nothing', () => {
        expect(result).toBeNull()
        expect(mockResolvePoliceCaseNumbersForCases).not.toHaveBeenCalled()
      })
    })

    describe('deleted cases allowed', () => {
      beforeEach(async () => {
        mockCaseModel.findOne.mockClear()

        await caseRepositoryService.findLiveById(caseId, {
          allowDeleted: true,
        })
      })

      it('should drop the deleted filter but keep hiding archived cases', () => {
        expect(findOneOptions().where).toEqual({
          id: caseId,
          isArchived: false,
        })
      })
    })
  })

  describe('findLiveMinimalById', () => {
    let result: Case | null

    beforeEach(async () => {
      result = await caseRepositoryService.findLiveMinimalById(caseId)
    })

    it('should read the live case row without any of its associations', () => {
      expect(findOneOptions()).toEqual({
        where: {
          id: caseId,
          state: { [Op.not]: CaseState.DELETED },
          isArchived: false,
        },
      })
      expect(findOneOptions().include).toBeUndefined()
      expect(result).toBe(theCase)
    })

    it('should still resolve the police case numbers', () => {
      expect(mockResolvePoliceCaseNumbersForCases).toHaveBeenCalledWith(
        [theCase],
        { transaction: undefined },
      )
    })
  })

  describe('findLimitedAccessById', () => {
    const transaction = {} as never

    describe('any user', () => {
      let result: Case | null

      beforeEach(async () => {
        result = await caseRepositoryService.findLimitedAccessById(caseId, {
          transaction,
        })
      })

      it('should read the live case restricted to the limited access shape', () => {
        expect(findOneOptions()).toEqual({
          attributes: limitedAccessCaseAttributes,
          include: getLimitedAccessCaseInclude(),
          where: {
            id: caseId,
            state: { [Op.not]: CaseState.DELETED },
            isArchived: false,
          },
          transaction,
        })
        expect(result).toBe(theCase)
      })

      it('should resolve the police case numbers in the same transaction', () => {
        expect(mockResolvePoliceCaseNumbersForCases).toHaveBeenCalledWith(
          [theCase],
          { transaction },
        )
      })

      it('should not narrow the parties on the linked cases', () => {
        const include = findOneOptions().include

        expect(
          included(included(include, 'mergeCase')?.include, 'defendants')
            ?.where,
        ).toBeUndefined()
        expect(
          included(included(include, 'mergedCases')?.include, 'civilClaimants')
            ?.where,
        ).toBeUndefined()
      })
    })

    describe('defence user', () => {
      beforeEach(async () => {
        await caseRepositoryService.findLimitedAccessById(caseId, {
          // National ids are stored without a separator
          defenceUserNationalId: '123456-7890',
        })
      })

      it('should only read the parties the defence user acts for', () => {
        const include = findOneOptions().include

        const mergeCase = included(include, 'mergeCase')?.include
        const mergedCases = included(include, 'mergedCases')?.include

        expect(included(mergeCase, 'defendants')?.where).toEqual({
          defenderNationalId: '1234567890',
          isDefenderChoiceConfirmed: true,
        })
        expect(included(mergeCase, 'civilClaimants')?.where).toEqual({
          hasSpokesperson: true,
          spokespersonNationalId: '1234567890',
          isSpokespersonConfirmed: true,
        })
        expect(included(mergedCases, 'defendants')?.where).toEqual({
          defenderNationalId: '1234567890',
          isDefenderChoiceConfirmed: true,
        })
        expect(included(mergedCases, 'civilClaimants')?.where).toEqual({
          hasSpokesperson: true,
          spokespersonNationalId: '1234567890',
          isSpokespersonConfirmed: true,
        })
      })

      it('should read the linked case defendants the same way as before', () => {
        const include = findOneOptions().include

        const mergeCaseDefendants = included(
          included(include, 'mergeCase')?.include,
          'defendants',
        )
        const mergedCaseDefendants = included(
          included(include, 'mergedCases')?.include,
          'defendants',
        )

        expect(mergeCaseDefendants?.attributes).toEqual([
          'id',
          'defenderNationalId',
          'isDefenderChoiceConfirmed',
        ])
        expect(mergeCaseDefendants?.separate).toBeUndefined()
        expect(mergedCaseDefendants?.attributes).toEqual([
          'id',
          'defenderNationalId',
          'isDefenderChoiceConfirmed',
          'isSentToPrisonAdmin',
        ])
        expect(mergedCaseDefendants?.separate).toBe(true)
        expect(
          included(mergedCaseDefendants?.include, 'subpoenas'),
        ).toBeDefined()
      })
    })
  })

  describe('findConnectedIndictmentCases', () => {
    const defendantCase = {
      id: caseId,
      defendants: [
        { nationalId: '1234567890' },
        { noNationalId: true, nationalId: '0000000000', name: 'Some Name' },
      ] as Defendant[],
    } as Case
    let result: Case[]

    beforeEach(async () => {
      result = await caseRepositoryService.findConnectedIndictmentCases(
        defendantCase,
      )
    })

    it('should only read other received indictment cases', () => {
      expect(findAllOptions().where).toEqual({
        [Op.and]: {
          isArchived: false,
          type: CaseType.INDICTMENT,
          state: [CaseState.RECEIVED],
          id: { [Op.ne]: caseId },
        },
      })
      expect(findAllOptions().attributes).toEqual(['id', 'courtCaseNumber'])
      expect(result).toBe(cases)
    })

    it('should match a defendant by name as well when they have no national id', () => {
      const defendants = included(findAllOptions().include, 'defendants')

      expect(defendants?.where).toEqual({
        [Op.or]: [
          { nationalId: '1234567890' },
          { nationalId: '0000000000', name: 'Some Name' },
        ],
      })
      expect(defendants?.required).toBe(true)
      expect(defendants?.attributes).toEqual([
        'id',
        'noNationalId',
        'nationalId',
        'name',
      ])
    })

    it('should read the court the connected case is at', () => {
      expect(included(findAllOptions().include, 'court')?.attributes).toEqual([
        'id',
        'name',
      ])
    })

    it('should leave the police case numbers unresolved', () => {
      expect(mockResolvePoliceCaseNumbersForCases).not.toHaveBeenCalled()
    })

    describe('no defendants to match', () => {
      beforeEach(async () => {
        mockCaseModel.findAll.mockClear()

        result = await caseRepositoryService.findConnectedIndictmentCases({
          id: caseId,
          defendants: [],
        } as unknown as Case)
      })

      it('should not read anything', () => {
        expect(mockCaseModel.findAll).not.toHaveBeenCalled()
        expect(result).toEqual([])
      })
    })
  })

  describe('findCandidateMergeCases', () => {
    const courtId = uuid()
    const defendantCase = {
      id: caseId,
      courtId,
      defendants: [
        { nationalId: '1234567890' },
        { noNationalId: true, nationalId: '0000000000', name: 'Some Name' },
      ] as Defendant[],
    } as Case
    let result: Case[]

    beforeEach(async () => {
      result = await caseRepositoryService.findCandidateMergeCases(
        defendantCase,
      )
    })

    it('should only read other received indictment cases at the same court', () => {
      expect(findAllOptions().where).toEqual({
        [Op.and]: {
          isArchived: false,
          id: { [Op.ne]: caseId },
          type: CaseType.INDICTMENT,
          state: CaseState.RECEIVED,
          courtId,
        },
      })
      expect(findAllOptions().attributes).toEqual(['id', 'courtCaseNumber'])
      expect(result).toBe(cases)
    })

    it('should require every defendant to match, not just one', () => {
      expect(findAllOptions().group).toEqual(['Case.id'])
      expect(findAllOptions().having.val).toBe(
        'COUNT(DISTINCT "defendants"."id") = 2',
      )
    })

    it('should match the defendants without reading them', () => {
      const defendants = included(findAllOptions().include, 'defendants')

      expect(defendants?.where).toEqual({
        [Op.or]: [
          { nationalId: '1234567890' },
          { nationalId: '0000000000', name: 'Some Name' },
        ],
      })
      expect(defendants?.required).toBe(true)
      expect(defendants?.attributes).toEqual([])
    })

    it('should leave the police case numbers unresolved', () => {
      expect(mockResolvePoliceCaseNumbersForCases).not.toHaveBeenCalled()
    })

    describe('no defendants to match', () => {
      beforeEach(async () => {
        mockCaseModel.findAll.mockClear()

        result = await caseRepositoryService.findCandidateMergeCases({
          id: caseId,
          courtId,
        } as Case)
      })

      it('should not read anything', () => {
        expect(mockCaseModel.findAll).not.toHaveBeenCalled()
        expect(result).toEqual([])
      })
    })
  })
})
