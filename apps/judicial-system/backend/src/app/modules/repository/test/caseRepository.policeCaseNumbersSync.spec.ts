import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CaseOrigin,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'
import { CaseDefendantPoliceCaseNumberRepositoryService } from '../services/caseDefendantPoliceCaseNumber.repository.service'
import { CaseRepositoryService } from '../services/caseRepository.service'

const mockSequelizeModel = () => ({
  findOne: jest.fn(),
  findAll: jest.fn(),
  findAndCountAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  upsert: jest.fn(),
  destroy: jest.fn(),
  count: jest.fn(),
})

const stubCase = (id: string, policeCaseNumbers: string[]): Case => {
  let numbers = [...policeCaseNumbers]
  return {
    id,
    get policeCaseNumbers() {
      return numbers
    },
    setDataValue(key: string, val: unknown) {
      if (key === 'policeCaseNumbers') {
        numbers = val as string[]
      }
    },
  } as unknown as Case
}

describe('CaseRepositoryService — police case number junction sync', () => {
  const transaction = { id: 'tx' } as never

  const replaceUnassigned = jest.fn().mockResolvedValue(undefined)
  const findDistinctPoliceCaseNumbersByCaseIds = jest
    .fn()
    .mockResolvedValue(new Map())

  const resolvePoliceCaseNumbersForCases = jest.fn()

  let caseRepositoryService: CaseRepositoryService
  let caseModel: ReturnType<typeof mockSequelizeModel>

  beforeEach(async () => {
    jest.clearAllMocks()
    findDistinctPoliceCaseNumbersByCaseIds.mockResolvedValue(new Map())
    resolvePoliceCaseNumbersForCases.mockImplementation(
      async (
        cases: Case[],
        opts?: { transaction?: unknown },
      ): Promise<void> => {
        if (cases.length === 0) {
          return
        }
        const map = await findDistinctPoliceCaseNumbersByCaseIds(
          cases.map((c) => c.id),
          opts,
        )
        for (const c of cases) {
          const fromJunction = map.get(c.id) ?? []
          c.setDataValue('policeCaseNumbers', fromJunction)
        }
      },
    )

    caseModel = mockSequelizeModel()

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(Case), useValue: caseModel },
        {
          provide: CaseDefendantPoliceCaseNumberRepositoryService,
          useValue: {
            replaceUnassignedFromPoliceCaseNumbersArray: replaceUnassigned,
            findDistinctPoliceCaseNumbersByCaseIds,
            resolvePoliceCaseNumbersForCases,
          },
        },
        CaseRepositoryService,
      ],
    }).compile()

    caseRepositoryService = moduleRef.get(CaseRepositoryService)
  })

  describe('findById', () => {
    it('overwrites policeCaseNumbers from junction rows when present', async () => {
      const built = stubCase('c1', ['legacy'])

      caseModel.findByPk.mockResolvedValue(built)
      findDistinctPoliceCaseNumbersByCaseIds.mockResolvedValue(
        new Map([['c1', ['007-2024-a', '007-2024-z']]]),
      )

      const res = await caseRepositoryService.findById('c1')

      expect(resolvePoliceCaseNumbersForCases).toHaveBeenCalledWith([built], {
        transaction: undefined,
      })
      expect(findDistinctPoliceCaseNumbersByCaseIds).toHaveBeenCalledWith(
        ['c1'],
        { transaction: undefined },
      )
      expect(res?.policeCaseNumbers).toEqual(['007-2024-a', '007-2024-z'])
    })

    it('sets policeCaseNumbers to [] when junction has no rows', async () => {
      const built = stubCase('c1', ['should-not-remain'])

      caseModel.findByPk.mockResolvedValue(built)
      findDistinctPoliceCaseNumbersByCaseIds.mockResolvedValue(new Map())

      const res = await caseRepositoryService.findById('c1')

      expect(res?.policeCaseNumbers).toEqual([])
    })
  })

  describe('findOne', () => {
    it('does not load junction when policeCaseNumbers is not in attributes', async () => {
      const built = stubCase('c1', ['x'])

      caseModel.findOne.mockResolvedValue(built)

      await caseRepositoryService.findOne({
        where: { id: 'c1' },
        attributes: ['id'],
      })

      expect(resolvePoliceCaseNumbersForCases).not.toHaveBeenCalled()
      expect(findDistinctPoliceCaseNumbersByCaseIds).not.toHaveBeenCalled()
      expect(built.policeCaseNumbers).toEqual(['x'])
    })

    it('resolves policeCaseNumbers for included merged cases', async () => {
      const mergedCase = stubCase('merged-case-id', ['legacy-merged'])
      const rootCase = stubCase('root-case-id', ['legacy-root'])
      Object.assign(rootCase, {
        mergedCases: [mergedCase],
      })

      caseModel.findOne.mockResolvedValue(rootCase)
      findDistinctPoliceCaseNumbersByCaseIds.mockResolvedValue(
        new Map([
          ['root-case-id', ['007-2024-root']],
          ['merged-case-id', ['007-2024-merged']],
        ]),
      )

      await caseRepositoryService.findOne({
        where: { id: 'root-case-id' },
      })

      expect(resolvePoliceCaseNumbersForCases).toHaveBeenCalledWith(
        expect.arrayContaining([rootCase, mergedCase]),
        { transaction: undefined },
      )
      expect(rootCase.policeCaseNumbers).toEqual(['007-2024-root'])
      expect(mergedCase.policeCaseNumbers).toEqual(['007-2024-merged'])
    })
  })

  describe('create', () => {
    it('calls replaceUnassigned with created case id and policeCaseNumbers', async () => {
      const created = stubCase('new-case-id', [])

      caseModel.create.mockResolvedValue(created)

      await caseRepositoryService.create(
        {
          type: CaseType.CUSTODY,
          origin: CaseOrigin.RVG,
          policeCaseNumbers: ['007-2024-10', '007-2024-11'],
          state: CaseState.NEW,
        } as Partial<Case>,
        { transaction },
      )

      expect(replaceUnassigned).toHaveBeenCalledWith(
        'new-case-id',
        ['007-2024-10', '007-2024-11'],
        { transaction },
      )
    })

    it('calls replaceUnassigned with empty array when data has no policeCaseNumbers', async () => {
      const created = stubCase('new-case-id', [])
      caseModel.create.mockResolvedValue(created)

      await caseRepositoryService.create(
        {
          type: CaseType.CUSTODY,
          origin: CaseOrigin.RVG,
          state: CaseState.NEW,
        } as Partial<Case>,
        { transaction },
      )

      expect(replaceUnassigned).toHaveBeenCalledWith('new-case-id', [], {
        transaction,
      })
    })
  })

  describe('update', () => {
    it('calls replaceUnassigned when update payload owns policeCaseNumbers', async () => {
      const existing = stubCase('case-id', [])

      caseModel.findByPk.mockResolvedValue(existing)

      await caseRepositoryService.update(
        'case-id',
        { policeCaseNumbers: ['007-2024-99'] },
        { transaction },
      )

      expect(replaceUnassigned).toHaveBeenCalledWith(
        'case-id',
        ['007-2024-99'],
        { transaction },
      )
    })

    it('does not call replaceUnassigned when policeCaseNumbers is not on the payload', async () => {
      const updatedRow = stubCase('case-id', [])
      caseModel.update.mockResolvedValue([1, [updatedRow]])

      await caseRepositoryService.update(
        'case-id',
        { description: 'x' },
        { transaction },
      )

      expect(replaceUnassigned).not.toHaveBeenCalled()
    })
  })
})
