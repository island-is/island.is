import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CaseOrigin,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'

import { AppealCase } from '../models/appealCase.model'
import { Case } from '../models/case.model'
import { CaseFile } from '../models/caseFile.model'
import { CaseString } from '../models/caseString.model'
import { DateLog } from '../models/dateLog.model'
import { Defendant } from '../models/defendant.model'
import { DefendantEventLog } from '../models/defendantEventLog.model'
import { EventLog } from '../models/eventLog.model'
import { IndictmentCount } from '../models/indictmentCount.model'
import { Subpoena } from '../models/subpoena.model'
import { Verdict } from '../models/verdict.model'
import { Victim } from '../models/victim.model'
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

describe('CaseRepositoryService — police case number junction sync', () => {
  const transaction = { id: 'tx' } as never

  const replaceUnassigned = jest.fn().mockResolvedValue(undefined)
  const moveAssignedRowsToCaseForDefendant = jest
    .fn()
    .mockResolvedValue(undefined)

  let caseRepositoryService: CaseRepositoryService
  let caseModel: ReturnType<typeof mockSequelizeModel>
  let defendantModel: ReturnType<typeof mockSequelizeModel>
  let subpoenaModel: ReturnType<typeof mockSequelizeModel>
  let verdictModel: ReturnType<typeof mockSequelizeModel>
  let defendantEventLogModel: ReturnType<typeof mockSequelizeModel>
  let caseStringModel: ReturnType<typeof mockSequelizeModel>
  let dateLogModel: ReturnType<typeof mockSequelizeModel>
  let eventLogModel: ReturnType<typeof mockSequelizeModel>
  let victimModel: ReturnType<typeof mockSequelizeModel>
  let indictmentCountModel: ReturnType<typeof mockSequelizeModel>
  let caseFileModel: ReturnType<typeof mockSequelizeModel>

  beforeEach(async () => {
    jest.clearAllMocks()

    caseModel = mockSequelizeModel()
    defendantModel = mockSequelizeModel()
    subpoenaModel = mockSequelizeModel()
    verdictModel = mockSequelizeModel()
    defendantEventLogModel = mockSequelizeModel()
    caseStringModel = mockSequelizeModel()
    dateLogModel = mockSequelizeModel()
    eventLogModel = mockSequelizeModel()
    victimModel = mockSequelizeModel()
    indictmentCountModel = mockSequelizeModel()
    caseFileModel = mockSequelizeModel()

    defendantModel.update.mockResolvedValue([0])
    subpoenaModel.update.mockResolvedValue([0])
    verdictModel.update.mockResolvedValue([0])
    defendantEventLogModel.update.mockResolvedValue([0])
    caseFileModel.update.mockResolvedValue([0])
    caseStringModel.findOne.mockResolvedValue(null)
    caseStringModel.create.mockResolvedValue({})
    dateLogModel.findOne.mockResolvedValue(null)
    eventLogModel.findAll.mockResolvedValue([])
    victimModel.findAll.mockResolvedValue([])
    indictmentCountModel.findAll.mockResolvedValue([])
    caseFileModel.findAll.mockResolvedValue([])

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(Case), useValue: caseModel },
        { provide: getModelToken(Defendant), useValue: defendantModel },
        { provide: getModelToken(Subpoena), useValue: subpoenaModel },
        { provide: getModelToken(Verdict), useValue: verdictModel },
        {
          provide: getModelToken(DefendantEventLog),
          useValue: defendantEventLogModel,
        },
        { provide: getModelToken(CaseString), useValue: caseStringModel },
        { provide: getModelToken(DateLog), useValue: dateLogModel },
        { provide: getModelToken(EventLog), useValue: eventLogModel },
        { provide: getModelToken(Victim), useValue: victimModel },
        {
          provide: getModelToken(IndictmentCount),
          useValue: indictmentCountModel,
        },
        { provide: getModelToken(CaseFile), useValue: caseFileModel },
        { provide: getModelToken(AppealCase), useValue: mockSequelizeModel() },
        {
          provide: CaseDefendantPoliceCaseNumberRepositoryService,
          useValue: {
            replaceUnassignedFromPoliceCaseNumbersArray: replaceUnassigned,
            moveAssignedRowsToCaseForDefendant,
          },
        },
        CaseRepositoryService,
      ],
    }).compile()

    caseRepositoryService = moduleRef.get(CaseRepositoryService)
  })

  describe('create', () => {
    it('calls replaceUnassigned with created case id and policeCaseNumbers', async () => {
      const created = {
        id: 'new-case-id',
        policeCaseNumbers: ['007-2024-10', '007-2024-11'],
      } as Case

      caseModel.create.mockResolvedValue(created)

      await caseRepositoryService.create(
        {
          type: CaseType.CUSTODY,
          origin: CaseOrigin.RVG,
          policeCaseNumbers: created.policeCaseNumbers,
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

    it('calls replaceUnassigned with empty array when result has no policeCaseNumbers', async () => {
      const created = { id: 'new-case-id' } as Case
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
      const updatedRow = {
        id: 'case-id',
        policeCaseNumbers: ['007-2024-99'],
      } as Case

      caseModel.update.mockResolvedValue([1, [updatedRow]])

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
      const updatedRow = { id: 'case-id' } as Case
      caseModel.update.mockResolvedValue([1, [updatedRow]])

      await caseRepositoryService.update(
        'case-id',
        { description: 'x' },
        { transaction },
      )

      expect(replaceUnassigned).not.toHaveBeenCalled()
    })
  })

  describe('split', () => {
    it('syncs unassigned rows for the new case and moves assigned rows for the split defendant', async () => {
      const parentCase = {
        id: 'parent-case-id',
        policeCaseNumbers: ['007-2024-1', '007-2024-2'],
        courtCaseNumber: 'R-100',
        origin: CaseOrigin.LOKE,
        type: CaseType.INDICTMENT,
      } as Case

      const splitCase = {
        id: 'split-case-id',
        policeCaseNumbers: ['007-2024-1', '007-2024-2'],
      } as Case

      caseModel.findByPk.mockResolvedValue(parentCase)
      caseModel.create.mockResolvedValue(splitCase)

      await caseRepositoryService.split('parent-case-id', 'defendant-id', {
        transaction,
      })

      expect(replaceUnassigned).toHaveBeenCalledWith(
        'split-case-id',
        ['007-2024-1', '007-2024-2'],
        { transaction },
      )

      expect(moveAssignedRowsToCaseForDefendant).toHaveBeenCalledWith(
        'parent-case-id',
        'split-case-id',
        'defendant-id',
        { transaction },
      )
    })
  })
})
