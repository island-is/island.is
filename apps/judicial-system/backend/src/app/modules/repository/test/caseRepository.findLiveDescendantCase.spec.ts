import { Op } from 'sequelize'

import { InternalServerErrorException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { CaseState } from '@island.is/judicial-system/types'

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

describe('CaseRepositoryService — findLiveDescendantCase', () => {
  let caseRepositoryService: CaseRepositoryService
  let caseModel: ReturnType<typeof mockSequelizeModel>

  beforeEach(async () => {
    jest.clearAllMocks()

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
          useValue: {},
        },
        CaseRepositoryService,
      ],
    }).compile()

    caseRepositoryService = moduleRef.get(CaseRepositoryService)
  })

  it('returns the case itself when it has no non-deleted child', async () => {
    const theCase = {
      id: 'root-id',
      state: CaseState.WAITING_FOR_CANCELLATION,
    } as Case

    caseModel.findOne.mockResolvedValueOnce(null)

    const result = await caseRepositoryService.findLiveDescendantCase(theCase)

    expect(result).toBe(theCase)
    expect(caseModel.findOne).toHaveBeenCalledWith({
      where: {
        parentCaseId: 'root-id',
        state: { [Op.not]: CaseState.DELETED },
      },
      attributes: ['id', 'state'],
      order: [['created', 'DESC']],
    })
  })

  it('returns the non-deleted child when one exists', async () => {
    const theCase = {
      id: 'root-id',
      state: CaseState.WAITING_FOR_CANCELLATION,
    } as Case
    const child = { id: 'draft-id', state: CaseState.DRAFT } as Case

    caseModel.findOne
      .mockResolvedValueOnce(child)
      .mockResolvedValueOnce(null)

    const result = await caseRepositoryService.findLiveDescendantCase(theCase)

    expect(result).toBe(child)
    expect(caseModel.findOne).toHaveBeenCalledTimes(2)
    expect(caseModel.findOne).toHaveBeenNthCalledWith(2, {
      where: {
        parentCaseId: 'draft-id',
        state: { [Op.not]: CaseState.DELETED },
      },
      attributes: ['id', 'state'],
      order: [['created', 'DESC']],
    })
  })

  it('walks a multi-level parentCaseId chain to the leaf', async () => {
    const theCase = {
      id: 'root-id',
      state: CaseState.COMPLETED,
    } as Case
    const mid = {
      id: 'mid-id',
      state: CaseState.WAITING_FOR_CANCELLATION,
    } as Case
    const leaf = { id: 'leaf-id', state: CaseState.DRAFT } as Case

    caseModel.findOne
      .mockResolvedValueOnce(mid)
      .mockResolvedValueOnce(leaf)
      .mockResolvedValueOnce(null)

    const result = await caseRepositoryService.findLiveDescendantCase(theCase)

    expect(result).toBe(leaf)
    expect(caseModel.findOne).toHaveBeenCalledTimes(3)
  })

  it('skips deleted children by querying state not DELETED', async () => {
    const theCase = { id: 'root-id', state: CaseState.COMPLETED } as Case

    caseModel.findOne.mockResolvedValueOnce(null)

    await caseRepositoryService.findLiveDescendantCase(theCase)

    expect(caseModel.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          state: { [Op.not]: CaseState.DELETED },
        }),
      }),
    )
  })

  it('throws when a child ID repeats in the parentCaseId chain', async () => {
    const theCase = {
      id: 'root-id',
      state: CaseState.COMPLETED,
    } as Case
    const mid = {
      id: 'mid-id',
      state: CaseState.WAITING_FOR_CANCELLATION,
    } as Case
    const cycleBackToRoot = {
      id: 'root-id',
      state: CaseState.DRAFT,
    } as Case

    caseModel.findOne
      .mockResolvedValueOnce(mid)
      .mockResolvedValueOnce(cycleBackToRoot)

    await expect(
      caseRepositoryService.findLiveDescendantCase(theCase),
    ).rejects.toThrow(InternalServerErrorException)

    expect(caseModel.findOne).toHaveBeenCalledTimes(2)
  })
})
