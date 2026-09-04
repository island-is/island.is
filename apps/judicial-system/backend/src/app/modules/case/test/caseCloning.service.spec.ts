import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { InternalServerErrorException } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  CaseOrigin,
  CaseState,
  CaseType,
  StringType,
} from '@island.is/judicial-system/types'

import { AwsS3Service } from '../../aws-s3'
import {
  Case,
  CaseDefendantPoliceCaseNumberRepositoryService,
  CaseFile,
  CaseFileRepositoryService,
  CaseRepositoryService,
  CaseStringRepositoryService,
  CivilClaimantRepositoryService,
  DefendantRepositoryService,
  IndictmentCountRepositoryService,
  OffenseRepositoryService,
  VictimRepositoryService,
} from '../../repository'
import { CaseCloningService } from '../caseCloning.service'

describe('CaseCloningService — duplicateIndictmentToDraft', () => {
  const transaction = {} as Transaction

  const setup = async (sourceCase: Partial<Case> | null) => {
    const newCaseId = uuid()
    const newCase = { id: newCaseId } as Case
    const oldDefendantId = uuid()
    const newDefendantId = uuid()
    const oldIndictmentCountId = uuid()
    const newIndictmentCountId = uuid()
    const oldCivilClaimantId = uuid()
    const newCivilClaimantId = uuid()

    const caseRepositoryService = {
      findById: jest.fn().mockResolvedValue(sourceCase),
      create: jest.fn().mockResolvedValue(newCase),
    }
    const policeService = {
      findDistinctPoliceCaseNumbersByCaseIds: jest
        .fn()
        .mockResolvedValue(new Map()),
      findAssignedLinksByCaseId: jest.fn().mockResolvedValue([]),
      assignDefendantPoliceCaseNumbers: jest.fn().mockResolvedValue([]),
      resolvePoliceCaseNumbersForCases: jest.fn().mockResolvedValue(undefined),
    }
    const defendantRepositoryService = {
      copyProsecutorEnteredToCase: jest
        .fn()
        .mockResolvedValue(new Map([[oldDefendantId, newDefendantId]])),
    }
    const indictmentCountRepositoryService = {
      copyAllToCase: jest
        .fn()
        .mockResolvedValue(
          new Map([[oldIndictmentCountId, newIndictmentCountId]]),
        ),
    }
    const offenseRepositoryService = {
      copyAllForIndictmentCounts: jest.fn().mockResolvedValue(undefined),
    }
    const victimRepositoryService = {
      copyAllToCase: jest.fn().mockResolvedValue(undefined),
    }
    const caseStringRepositoryService = {
      copyByTypesToCase: jest.fn().mockResolvedValue(undefined),
    }
    const civilClaimantRepositoryService = {
      copyAllToCase: jest
        .fn()
        .mockResolvedValue(new Map([[oldCivilClaimantId, newCivilClaimantId]])),
    }
    const caseFileRepositoryService = {
      findAllByCaseAndCategories: jest.fn().mockResolvedValue([]),
      copyToCase: jest.fn().mockResolvedValue({}),
    }
    const awsS3Service = {
      copyObject: jest.fn().mockResolvedValue(undefined),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: CaseRepositoryService, useValue: caseRepositoryService },
        {
          provide: CaseDefendantPoliceCaseNumberRepositoryService,
          useValue: policeService,
        },
        {
          provide: DefendantRepositoryService,
          useValue: defendantRepositoryService,
        },
        {
          provide: IndictmentCountRepositoryService,
          useValue: indictmentCountRepositoryService,
        },
        {
          provide: OffenseRepositoryService,
          useValue: offenseRepositoryService,
        },
        { provide: VictimRepositoryService, useValue: victimRepositoryService },
        {
          provide: CaseStringRepositoryService,
          useValue: caseStringRepositoryService,
        },
        {
          provide: CivilClaimantRepositoryService,
          useValue: civilClaimantRepositoryService,
        },
        {
          provide: CaseFileRepositoryService,
          useValue: caseFileRepositoryService,
        },
        { provide: AwsS3Service, useValue: awsS3Service },
        CaseCloningService,
      ],
    }).compile()

    return {
      service: moduleRef.get(CaseCloningService),
      caseRepositoryService,
      policeService,
      defendantRepositoryService,
      indictmentCountRepositoryService,
      offenseRepositoryService,
      victimRepositoryService,
      caseStringRepositoryService,
      civilClaimantRepositoryService,
      caseFileRepositoryService,
      awsS3Service,
      newCase,
      newCaseId,
      oldDefendantId,
      newDefendantId,
      oldIndictmentCountId,
      newIndictmentCountId,
      oldCivilClaimantId,
      newCivilClaimantId,
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
      comments: 'Some comment',
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
      // Request-case data that must NOT be copied to an indictment
      defenderName: 'Defender',
      leadInvestigator: 'Investigator',
      caseFilesComments: 'Some case files comment',
    } as Case

    const ctx = await setup(sourceCase)

    const result = await ctx.service.duplicateIndictmentToDraft(caseId, {
      transaction,
      prosecutorId,
      prosecutorsOfficeId,
    })

    expect(ctx.caseRepositoryService.findById).toHaveBeenCalledWith(caseId, {
      transaction,
    })
    expect(ctx.caseRepositoryService.create).toHaveBeenCalledTimes(1)
    const [createdWith, createOptions] =
      ctx.caseRepositoryService.create.mock.calls[0]
    expect(createOptions).toEqual({ transaction })

    // Prosecutor data is copied
    expect(createdWith).toEqual(
      expect.objectContaining({
        origin: CaseOrigin.LOKE,
        type: CaseType.INDICTMENT,
        description: 'Some description',
        courtId,
        comments: 'Some comment',
        indictmentIntroduction: 'Intro',
        hasCivilClaims: true,
        state: CaseState.DRAFT,
        withCourtSessions: true,
        creatingProsecutorId: prosecutorId,
        prosecutorId,
        prosecutorsOfficeId,
        // The new draft links back to the original case so police system (LÖKE)
        // communication can resolve the original ancestor
        parentCaseId: caseId,
      }),
    )

    // Court data is not copied
    expect(createdWith).not.toHaveProperty('courtCaseNumber')
    expect(createdWith).not.toHaveProperty('indictmentRulingDecision')
    expect(createdWith).not.toHaveProperty('judgeId')
    expect(createdWith).not.toHaveProperty('registrarId')
    expect(createdWith).not.toHaveProperty('rulingDate')
    // Request-case data is not carried over to the indictment draft
    expect(createdWith).not.toHaveProperty('defenderName')
    expect(createdWith).not.toHaveProperty('leadInvestigator')
    expect(createdWith).not.toHaveProperty('caseFilesComments')
    // The source's own parent link is not carried over - the new draft points
    // at the case it was duplicated from
    expect(createdWith.parentCaseId).toBe(caseId)

    // The new case is returned with its police case numbers resolved
    expect(
      ctx.policeService.resolvePoliceCaseNumbersForCases,
    ).toHaveBeenCalledWith([ctx.newCase], { transaction })
    expect(result).toBe(ctx.newCase)
  })

  it('throws when the case to duplicate does not exist', async () => {
    const caseId = uuid()

    const ctx = await setup(null)

    await expect(
      ctx.service.duplicateIndictmentToDraft(caseId, { transaction }),
    ).rejects.toBeInstanceOf(InternalServerErrorException)

    expect(ctx.caseRepositoryService.create).not.toHaveBeenCalled()
  })

  it('copies police case numbers, defendants, indictment counts, offenses, victims, case strings and civil claimants in one transaction', async () => {
    const caseId = uuid()

    const sourceCase = { id: caseId, type: CaseType.INDICTMENT } as Case

    const ctx = await setup(sourceCase)

    ctx.policeService.findDistinctPoliceCaseNumbersByCaseIds.mockResolvedValue(
      new Map([[caseId, ['007-2026-1']]]),
    )
    ctx.policeService.findAssignedLinksByCaseId.mockResolvedValue([
      { defendantId: ctx.oldDefendantId, policeCaseNumber: '007-2026-1' },
      // A link to a defendant that was not copied is dropped
      { defendantId: uuid(), policeCaseNumber: '007-2026-2' },
    ])

    await ctx.service.duplicateIndictmentToDraft(caseId, { transaction })

    // Police case numbers are seeded on the new case as part of its creation
    expect(
      ctx.policeService.findDistinctPoliceCaseNumbersByCaseIds,
    ).toHaveBeenCalledWith([caseId], { transaction })
    expect(ctx.caseRepositoryService.create).toHaveBeenCalledWith(
      expect.objectContaining({ policeCaseNumbers: ['007-2026-1'] }),
      { transaction },
    )

    // Defendants are copied with prosecutor data only
    expect(
      ctx.defendantRepositoryService.copyProsecutorEnteredToCase,
    ).toHaveBeenCalledWith(caseId, ctx.newCaseId, { transaction })

    // Per-defendant police case number assignments are recreated against the
    // new defendants
    expect(ctx.policeService.findAssignedLinksByCaseId).toHaveBeenCalledWith(
      caseId,
      { transaction },
    )
    expect(
      ctx.policeService.assignDefendantPoliceCaseNumbers,
    ).toHaveBeenCalledWith(
      ctx.newCaseId,
      [{ defendantId: ctx.newDefendantId, policeCaseNumber: '007-2026-1' }],
      { transaction },
    )

    // Indictment counts are copied and their offenses follow them by the
    // returned id map
    expect(
      ctx.indictmentCountRepositoryService.copyAllToCase,
    ).toHaveBeenCalledWith(caseId, ctx.newCaseId, { transaction })
    expect(
      ctx.offenseRepositoryService.copyAllForIndictmentCounts,
    ).toHaveBeenCalledWith(
      new Map([[ctx.oldIndictmentCountId, ctx.newIndictmentCountId]]),
      { transaction },
    )

    // Victims are copied
    expect(ctx.victimRepositoryService.copyAllToCase).toHaveBeenCalledWith(
      caseId,
      ctx.newCaseId,
      { transaction },
    )

    // Only the prosecutor entered case strings are copied
    expect(
      ctx.caseStringRepositoryService.copyByTypesToCase,
    ).toHaveBeenCalledWith(
      caseId,
      ctx.newCaseId,
      [StringType.CIVIL_DEMANDS, StringType.PENALTIES],
      { transaction },
    )

    // Civil claimants are copied with the defendant map for remapping their
    // defendant references
    expect(
      ctx.civilClaimantRepositoryService.copyAllToCase,
    ).toHaveBeenCalledWith(
      caseId,
      ctx.newCaseId,
      new Map([[ctx.oldDefendantId, ctx.newDefendantId]]),
      { transaction },
    )
  })

  it('copies eligible case files to a new S3 key', async () => {
    const caseId = uuid()
    const fileId = uuid()

    const sourceCase = { id: caseId, type: CaseType.INDICTMENT } as Case

    const ctx = await setup(sourceCase)

    const file = {
      id: fileId,
      key: `${caseId}/abc/document.pdf`,
      isKeyAccessible: true,
    } as CaseFile
    ctx.caseFileRepositoryService.findAllByCaseAndCategories.mockResolvedValue([
      file,
    ])

    await ctx.service.duplicateIndictmentToDraft(caseId, { transaction })

    // Only eligible (prosecutor uploaded) categories are queried
    expect(
      ctx.caseFileRepositoryService.findAllByCaseAndCategories,
    ).toHaveBeenCalledWith(
      caseId,
      [
        CaseFileCategory.CRIMINAL_RECORD,
        CaseFileCategory.COST_BREAKDOWN,
        CaseFileCategory.CASE_FILE,
        CaseFileCategory.CASE_FILE_RECORD,
        CaseFileCategory.PROSECUTOR_CASE_FILE,
        CaseFileCategory.DEFENDANT_CASE_FILE,
        CaseFileCategory.CIVIL_CLAIM,
        CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
        CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
        CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
      ],
      { transaction },
    )

    // The S3 object is copied to a new key under the new case
    expect(ctx.awsS3Service.copyObject).toHaveBeenCalledTimes(1)
    const [copyCaseType, copySourceKey, copyDestKey] =
      ctx.awsS3Service.copyObject.mock.calls[0]
    expect(copyCaseType).toBe(CaseType.INDICTMENT)
    expect(copySourceKey).toBe(`${caseId}/abc/document.pdf`)
    expect(copyDestKey).toMatch(
      new RegExp(`^${ctx.newCaseId}/[0-9a-f-]+/document\\.pdf$`),
    )

    // The row for the copy points at the new case and the new key, and carries
    // no defendant or civil claimant reference as the original had none
    expect(ctx.caseFileRepositoryService.copyToCase).toHaveBeenCalledTimes(1)
    expect(ctx.caseFileRepositoryService.copyToCase).toHaveBeenCalledWith(
      file,
      ctx.newCaseId,
      { key: copyDestKey, defendantId: undefined, civilClaimantId: undefined },
      { transaction },
    )
  })

  it('remaps the defendant and civil claimant references of copied files', async () => {
    const caseId = uuid()

    const sourceCase = { id: caseId, type: CaseType.INDICTMENT } as Case

    const ctx = await setup(sourceCase)

    const file = {
      id: uuid(),
      key: `${caseId}/abc/claim.pdf`,
      isKeyAccessible: true,
      defendantId: ctx.oldDefendantId,
      civilClaimantId: ctx.oldCivilClaimantId,
    } as CaseFile
    ctx.caseFileRepositoryService.findAllByCaseAndCategories.mockResolvedValue([
      file,
    ])

    await ctx.service.duplicateIndictmentToDraft(caseId, { transaction })

    expect(ctx.caseFileRepositoryService.copyToCase).toHaveBeenCalledWith(
      file,
      ctx.newCaseId,
      expect.objectContaining({
        defendantId: ctx.newDefendantId,
        civilClaimantId: ctx.newCivilClaimantId,
      }),
      { transaction },
    )
  })

  it('skips files whose S3 object is not accessible', async () => {
    const caseId = uuid()

    const sourceCase = { id: caseId, type: CaseType.INDICTMENT } as Case

    const ctx = await setup(sourceCase)

    ctx.caseFileRepositoryService.findAllByCaseAndCategories.mockResolvedValue([
      {
        id: uuid(),
        key: `${caseId}/abc/missing.pdf`,
        isKeyAccessible: false,
      } as CaseFile,
      { id: uuid(), key: '', isKeyAccessible: true } as CaseFile,
    ])

    await ctx.service.duplicateIndictmentToDraft(caseId, { transaction })

    expect(ctx.awsS3Service.copyObject).not.toHaveBeenCalled()
    expect(ctx.caseFileRepositoryService.copyToCase).not.toHaveBeenCalled()
  })

  it('skips a file when its S3 copy fails without failing the duplication', async () => {
    const caseId = uuid()

    const sourceCase = { id: caseId, type: CaseType.INDICTMENT } as Case

    const ctx = await setup(sourceCase)

    const okFile = {
      id: uuid(),
      key: `${caseId}/def/ok.pdf`,
      isKeyAccessible: true,
    } as CaseFile
    ctx.caseFileRepositoryService.findAllByCaseAndCategories.mockResolvedValue([
      {
        id: uuid(),
        key: `${caseId}/abc/broken.pdf`,
        isKeyAccessible: true,
      } as CaseFile,
      okFile,
    ])

    ctx.awsS3Service.copyObject
      .mockRejectedValueOnce(new Error('S3 copy failed'))
      .mockResolvedValueOnce(undefined)

    const result = await ctx.service.duplicateIndictmentToDraft(caseId, {
      transaction,
    })

    // The duplication still succeeds and the second (working) file is copied
    expect(result).toBe(ctx.newCase)
    expect(ctx.awsS3Service.copyObject).toHaveBeenCalledTimes(2)
    expect(ctx.caseFileRepositoryService.copyToCase).toHaveBeenCalledTimes(1)
    expect(ctx.caseFileRepositoryService.copyToCase).toHaveBeenCalledWith(
      okFile,
      ctx.newCaseId,
      expect.objectContaining({
        key: expect.stringMatching(
          new RegExp(`^${ctx.newCaseId}/[0-9a-f-]+/ok\\.pdf$`),
        ),
      }),
      { transaction },
    )
  })

  it('does not duplicate anything else when a copy step fails', async () => {
    const caseId = uuid()

    const sourceCase = { id: caseId, type: CaseType.INDICTMENT } as Case

    const ctx = await setup(sourceCase)

    ctx.indictmentCountRepositoryService.copyAllToCase.mockRejectedValue(
      new Error('Some error'),
    )

    await expect(
      ctx.service.duplicateIndictmentToDraft(caseId, { transaction }),
    ).rejects.toThrow('Some error')

    expect(ctx.victimRepositoryService.copyAllToCase).not.toHaveBeenCalled()
    expect(
      ctx.policeService.resolvePoliceCaseNumbersForCases,
    ).not.toHaveBeenCalled()
  })
})
