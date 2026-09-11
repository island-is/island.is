import { Op, Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  CaseFileCategory,
  CaseOrigin,
  CaseType,
} from '@island.is/judicial-system/types'

import { createTestingRepositoryModule } from './createTestingRepositoryModule'

import { Case } from '../models/case.model'
import { CaseRepositoryService } from '../services/caseRepository.service'
import { CivilClaimantRepositoryService } from '../services/civilClaimantRepository.service'

describe('CaseRepositoryService — split civil claimants and files', () => {
  const transaction = {} as Transaction
  const caseId = uuid()
  const splitCaseId = uuid()
  const defendantId = uuid()
  const oldCivilClaimantId = uuid()
  const newCivilClaimantId = uuid()
  const otherCivilClaimantId = uuid()

  let caseRepositoryService: CaseRepositoryService
  let caseModel: { findByPk: jest.Mock; create: jest.Mock }
  let caseFileModel: {
    findAll: jest.Mock
    create: jest.Mock
    update: jest.Mock
  }
  let defendantModel: { update: jest.Mock }
  let subpoenaModel: { update: jest.Mock }
  let verdictModel: { update: jest.Mock }
  let defendantEventLogModel: { update: jest.Mock }
  let caseStringModel: { findOne: jest.Mock; create: jest.Mock }
  let dateLogModel: { findOne: jest.Mock }
  let eventLogModel: { findAll: jest.Mock }
  let indictmentCountModel: { findAll: jest.Mock }
  let civilClaimantRepositoryService: jest.Mocked<
    Pick<CivilClaimantRepositoryService, 'copyApplicableToCaseForDefendant'>
  >
  let policeService: {
    findUnassignedPoliceCaseNumbersForSplit: jest.Mock
    replaceUnassignedFromPoliceCaseNumbersArray: jest.Mock
    moveAssignedRowsToCaseForDefendant: jest.Mock
    resolvePoliceCaseNumbersForCases: jest.Mock
  }

  beforeEach(async () => {
    const module = await createTestingRepositoryModule()

    caseRepositoryService = module.caseRepositoryService
    caseModel = module.caseModel as unknown as typeof caseModel
    caseFileModel = module.caseFileModel as unknown as typeof caseFileModel
    defendantModel = module.defendantModel as unknown as typeof defendantModel
    subpoenaModel = module.subpoenaModel as unknown as typeof subpoenaModel
    verdictModel = module.verdictModel as unknown as typeof verdictModel
    defendantEventLogModel =
      module.defendantEventLogModel as unknown as typeof defendantEventLogModel
    caseStringModel = module.caseStringModel as unknown as typeof caseStringModel
    dateLogModel = module.dateLogModel as unknown as typeof dateLogModel
    eventLogModel = module.eventLogModel as unknown as typeof eventLogModel
    indictmentCountModel =
      module.indictmentCountModel as unknown as typeof indictmentCountModel
    civilClaimantRepositoryService =
      module.civilClaimantRepositoryService as unknown as typeof civilClaimantRepositoryService
    policeService =
      module.caseDefendantPoliceCaseNumberRepositoryService as unknown as typeof policeService

    const parentCase = {
      id: caseId,
      courtCaseNumber: 'S-1/2026',
      origin: CaseOrigin.LOKE,
      type: CaseType.INDICTMENT,
    } as Case
    const splitCase = { id: splitCaseId } as Case

    caseModel.findByPk.mockResolvedValue(parentCase)
    caseModel.create.mockResolvedValue(splitCase)

    defendantModel.update.mockResolvedValue([1])
    subpoenaModel.update.mockResolvedValue([1])
    verdictModel.update.mockResolvedValue([1])
    defendantEventLogModel.update.mockResolvedValue([1])
    caseStringModel.findOne.mockResolvedValue(null)
    caseStringModel.create.mockResolvedValue({})
    dateLogModel.findOne.mockResolvedValue(null)
    eventLogModel.findAll.mockResolvedValue([])
    indictmentCountModel.findAll.mockResolvedValue([])
    caseFileModel.findAll.mockResolvedValue([])
    caseFileModel.create.mockResolvedValue({})
    caseFileModel.update.mockResolvedValue([0])

    policeService.findUnassignedPoliceCaseNumbersForSplit.mockResolvedValue([])
    policeService.replaceUnassignedFromPoliceCaseNumbersArray.mockResolvedValue(
      undefined,
    )
    policeService.moveAssignedRowsToCaseForDefendant.mockResolvedValue(
      undefined,
    )
    policeService.resolvePoliceCaseNumbersForCases.mockResolvedValue(undefined)

    civilClaimantRepositoryService.copyApplicableToCaseForDefendant.mockResolvedValue(
      new Map([[oldCivilClaimantId, newCivilClaimantId]]),
    )
  })

  it('copies civil claimants that apply to the split defendant', async () => {
    await caseRepositoryService.split(caseId, defendantId, { transaction })

    expect(
      civilClaimantRepositoryService.copyApplicableToCaseForDefendant,
    ).toHaveBeenCalledWith(caseId, splitCaseId, defendantId, { transaction })
  })

  it('copies null-defendant files for copied claimants with remapped civilClaimantId and skips the rest', async () => {
    const copiedFile = {
      civilClaimantId: oldCivilClaimantId,
      toJSON: () => ({
        id: uuid(),
        caseId,
        category: CaseFileCategory.CIVIL_CLAIM,
        civilClaimantId: oldCivilClaimantId,
      }),
    }
    const skippedFile = {
      civilClaimantId: otherCivilClaimantId,
      toJSON: () => ({
        id: uuid(),
        caseId,
        category: CaseFileCategory.CIVIL_CLAIM,
        civilClaimantId: otherCivilClaimantId,
      }),
    }
    const unlinkedFile = {
      civilClaimantId: null,
      toJSON: () => ({
        id: uuid(),
        caseId,
        category: CaseFileCategory.CASE_FILE,
        civilClaimantId: null,
      }),
    }

    caseFileModel.findAll.mockResolvedValue([
      copiedFile,
      skippedFile,
      unlinkedFile,
    ])

    await caseRepositoryService.split(caseId, defendantId, { transaction })

    expect(caseFileModel.create).toHaveBeenCalledTimes(2)
    expect(caseFileModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: undefined,
        caseId: splitCaseId,
        civilClaimantId: newCivilClaimantId,
      }),
      { transaction },
    )
    expect(caseFileModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: undefined,
        caseId: splitCaseId,
        civilClaimantId: undefined,
      }),
      { transaction },
    )
    expect(caseFileModel.create).not.toHaveBeenCalledWith(
      expect.objectContaining({ civilClaimantId: otherCivilClaimantId }),
      expect.anything(),
    )
  })

  it('moves defendant files then remaps copied claimant ids and clears the rest', async () => {
    await caseRepositoryService.split(caseId, defendantId, { transaction })

    expect(caseFileModel.update).toHaveBeenCalledWith(
      { caseId: splitCaseId },
      expect.objectContaining({
        where: expect.objectContaining({
          caseId,
          defendantId,
        }),
        transaction,
      }),
    )

    expect(caseFileModel.update).toHaveBeenCalledWith(
      { civilClaimantId: newCivilClaimantId },
      {
        where: {
          caseId: splitCaseId,
          civilClaimantId: oldCivilClaimantId,
        },
        transaction,
      },
    )

    expect(caseFileModel.update).toHaveBeenCalledWith(
      { civilClaimantId: null },
      {
        where: {
          caseId: splitCaseId,
          civilClaimantId: { [Op.notIn]: [newCivilClaimantId] },
        },
        transaction,
      },
    )
  })

  it('clears every civilClaimantId on the split case when no claimants were copied', async () => {
    civilClaimantRepositoryService.copyApplicableToCaseForDefendant.mockResolvedValue(
      new Map(),
    )

    await caseRepositoryService.split(caseId, defendantId, { transaction })

    expect(caseFileModel.update).toHaveBeenCalledWith(
      { civilClaimantId: null },
      {
        where: {
          caseId: splitCaseId,
          civilClaimantId: { [Op.ne]: null },
        },
        transaction,
      },
    )
  })
})
