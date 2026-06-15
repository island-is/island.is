import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  CaseIndictmentRulingDecision,
  CaseOrigin,
  CaseState,
  CaseType,
  Gender,
} from '@island.is/judicial-system/types'

import { createTestingRepositoryModule } from './createTestingRepositoryModule'

import { Case } from '../models/case.model'

describe('CaseRepositoryService — duplicateIndictmentToDraft', () => {
  const transaction = {} as Transaction

  const setup = async (sourceCase: Partial<Case>) => {
    const {
      caseRepositoryService,
      caseModel,
      defendantModel,
      indictmentCountModel,
      offenseModel,
      victimModel,
      civilClaimantModel,
      caseDefendantPoliceCaseNumberRepositoryService,
    } = await createTestingRepositoryModule()

    const newCaseId = uuid()
    const newCase = { id: newCaseId } as Case
    const newDefendantId = uuid()
    const newIndictmentCountId = uuid()

    const mockCaseModel = caseModel as unknown as {
      findByPk: jest.Mock
      create: jest.Mock
    }
    mockCaseModel.findByPk.mockResolvedValue(sourceCase as Case)
    mockCaseModel.create.mockResolvedValue(newCase)

    const mockDefendantModel = defendantModel as unknown as {
      findAll: jest.Mock
      create: jest.Mock
    }
    mockDefendantModel.findAll.mockResolvedValue([])
    mockDefendantModel.create.mockResolvedValue({ id: newDefendantId })

    const mockIndictmentCountModel = indictmentCountModel as unknown as {
      findAll: jest.Mock
      create: jest.Mock
    }
    mockIndictmentCountModel.findAll.mockResolvedValue([])
    mockIndictmentCountModel.create.mockResolvedValue({
      id: newIndictmentCountId,
    })

    const mockOffenseModel = offenseModel as unknown as {
      findAll: jest.Mock
      create: jest.Mock
    }
    mockOffenseModel.findAll.mockResolvedValue([])

    const mockVictimModel = victimModel as unknown as {
      findAll: jest.Mock
      create: jest.Mock
    }
    mockVictimModel.findAll.mockResolvedValue([])

    const mockCivilClaimantModel = civilClaimantModel as unknown as {
      findAll: jest.Mock
      create: jest.Mock
    }
    mockCivilClaimantModel.findAll.mockResolvedValue([])

    return {
      caseRepositoryService,
      caseModel: mockCaseModel,
      defendantModel: mockDefendantModel,
      indictmentCountModel: mockIndictmentCountModel,
      offenseModel: offenseModel as unknown as {
        findAll: jest.Mock
        create: jest.Mock
      },
      victimModel: victimModel as unknown as {
        findAll: jest.Mock
        create: jest.Mock
      },
      civilClaimantModel: civilClaimantModel as unknown as {
        findAll: jest.Mock
        create: jest.Mock
      },
      policeService:
        caseDefendantPoliceCaseNumberRepositoryService as unknown as {
          findDistinctPoliceCaseNumbersByCaseIds: jest.Mock
          replaceUnassignedFromPoliceCaseNumbersArray: jest.Mock
          findAssignedLinksByCaseId: jest.Mock
          assignDefendantPoliceCaseNumbers: jest.Mock
        },
      newCaseId,
      newDefendantId,
      newIndictmentCountId,
    }
  }

  it('creates a draft case with prosecutor data only and no court data', async () => {
    const caseId = uuid()
    const courtId = uuid()
    const prosecutorId = uuid()
    const prosecutorsOfficeId = uuid()

    const sourceCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      type: CaseType.INDICTMENT,
      description: 'Some description',
      courtId,
      indictmentIntroduction: 'Intro',
      hasCivilClaims: true,
      // Court data that must NOT be copied
      state: CaseState.COMPLETED,
      courtCaseNumber: 'S-1/2026',
      indictmentRulingDecision: CaseIndictmentRulingDecision.WITHDRAWAL,
      judgeId: uuid(),
      registrarId: uuid(),
      rulingDate: new Date(),
      parentCaseId: uuid(),
    } as Case

    const ctx = await setup(sourceCase)

    await ctx.caseRepositoryService.duplicateIndictmentToDraft(caseId, {
      transaction,
      prosecutorId,
      prosecutorsOfficeId,
    })

    expect(ctx.caseModel.create).toHaveBeenCalledTimes(1)
    const createdWith = ctx.caseModel.create.mock.calls[0][0]

    // Prosecutor data is copied
    expect(createdWith).toEqual(
      expect.objectContaining({
        origin: CaseOrigin.LOKE,
        type: CaseType.INDICTMENT,
        description: 'Some description',
        courtId,
        indictmentIntroduction: 'Intro',
        hasCivilClaims: true,
        state: CaseState.DRAFT,
        withCourtSessions: true,
        creatingProsecutorId: prosecutorId,
        prosecutorId,
        prosecutorsOfficeId,
      }),
    )

    // Court data is not copied
    expect(createdWith).not.toHaveProperty('courtCaseNumber')
    expect(createdWith).not.toHaveProperty('indictmentRulingDecision')
    expect(createdWith).not.toHaveProperty('judgeId')
    expect(createdWith).not.toHaveProperty('registrarId')
    expect(createdWith).not.toHaveProperty('rulingDate')
    // No lineage link to the original case
    expect(createdWith).not.toHaveProperty('parentCaseId')
  })

  it('copies police case numbers, defendants, indictment counts, offenses, victims and civil claimants', async () => {
    const caseId = uuid()
    const oldDefendantId = uuid()
    const oldIndictmentCountId = uuid()

    const sourceCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
    } as Case

    const ctx = await setup(sourceCase)

    ctx.policeService.findDistinctPoliceCaseNumbersByCaseIds.mockResolvedValue(
      new Map([[caseId, ['007-2026-1']]]),
    )
    ctx.policeService.findAssignedLinksByCaseId.mockResolvedValue([
      { defendantId: oldDefendantId, policeCaseNumber: '007-2026-1' },
    ])

    ctx.defendantModel.findAll.mockResolvedValue([
      {
        id: oldDefendantId,
        nationalId: '0000000000',
        name: 'Accused',
        gender: Gender.MALE,
        // Court/process data that must not be copied
        punishmentType: 'IMPRISONMENT',
        defendantPlea: 'GUILTY',
      },
    ])

    ctx.indictmentCountModel.findAll.mockResolvedValue([
      {
        id: oldIndictmentCountId,
        toJSON: () => ({
          id: oldIndictmentCountId,
          caseId,
          incidentDescription: 'Did something',
        }),
      },
    ])
    ctx.offenseModel.findAll.mockResolvedValue([
      {
        toJSON: () => ({ id: uuid(), indictmentCountId: oldIndictmentCountId }),
      },
    ])
    ctx.victimModel.findAll.mockResolvedValue([
      { toJSON: () => ({ id: uuid(), caseId, name: 'Victim' }) },
    ])
    ctx.civilClaimantModel.findAll.mockResolvedValue([
      {
        defendantIds: [oldDefendantId],
        toJSON: () => ({
          id: uuid(),
          caseId,
          name: 'Claimant',
          defendantIds: [oldDefendantId],
        }),
      },
    ])

    await ctx.caseRepositoryService.duplicateIndictmentToDraft(caseId, {
      transaction,
    })

    // Police case numbers are seeded on the new case
    expect(
      ctx.policeService.replaceUnassignedFromPoliceCaseNumbersArray,
    ).toHaveBeenCalledWith(ctx.newCaseId, ['007-2026-1'], { transaction })

    // Defendant is copied with prosecutor data only
    expect(ctx.defendantModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        caseId: ctx.newCaseId,
        nationalId: '0000000000',
        name: 'Accused',
        gender: Gender.MALE,
      }),
      { transaction },
    )
    const defendantCreatedWith = ctx.defendantModel.create.mock.calls[0][0]
    expect(defendantCreatedWith).not.toHaveProperty('punishmentType')
    expect(defendantCreatedWith).not.toHaveProperty('defendantPlea')

    // Per-defendant police case number assignment is recreated for the new
    // defendant
    expect(
      ctx.policeService.assignDefendantPoliceCaseNumbers,
    ).toHaveBeenCalledWith(
      ctx.newCaseId,
      [{ defendantId: ctx.newDefendantId, policeCaseNumber: '007-2026-1' }],
      { transaction },
    )

    // Indictment count is copied to the new case
    expect(ctx.indictmentCountModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ id: undefined, caseId: ctx.newCaseId }),
      { transaction },
    )

    // Offense is re-pointed to the new indictment count
    expect(ctx.offenseModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: undefined,
        indictmentCountId: ctx.newIndictmentCountId,
      }),
      { transaction },
    )

    // Victim is copied
    expect(ctx.victimModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ id: undefined, caseId: ctx.newCaseId }),
      { transaction },
    )

    // Civil claimant is copied with remapped defendant references
    expect(ctx.civilClaimantModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: undefined,
        caseId: ctx.newCaseId,
        defendantIds: [ctx.newDefendantId],
      }),
      { transaction },
    )
  })
})
