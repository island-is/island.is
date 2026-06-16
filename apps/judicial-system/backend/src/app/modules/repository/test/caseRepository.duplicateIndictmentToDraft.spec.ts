import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  CaseFileCategory,
  CaseFileState,
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
      caseFileModel,
      awsS3Service,
      caseDefendantPoliceCaseNumberRepositoryService,
    } = await createTestingRepositoryModule()

    const newCaseId = uuid()
    const newCase = { id: newCaseId } as Case
    const newDefendantId = uuid()
    const newIndictmentCountId = uuid()
    const newCivilClaimantId = uuid()

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
    mockCivilClaimantModel.create.mockResolvedValue({ id: newCivilClaimantId })

    const mockCaseFileModel = caseFileModel as unknown as {
      findAll: jest.Mock
      create: jest.Mock
    }
    mockCaseFileModel.findAll.mockResolvedValue([])

    const mockAwsS3Service = awsS3Service as unknown as {
      copyObject: jest.Mock
    }

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
      caseFileModel: mockCaseFileModel,
      awsS3Service: mockAwsS3Service,
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
      comments: 'Some comment',
      caseFilesComments: 'Some case files comment',
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
    // Request-case data is not carried over to the indictment draft
    expect(createdWith).not.toHaveProperty('defenderName')
    expect(createdWith).not.toHaveProperty('leadInvestigator')
    expect(createdWith).not.toHaveProperty('comments')
    expect(createdWith).not.toHaveProperty('caseFilesComments')
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
        // Prosecutor data that must be copied
        defendantPlea: 'GUILTY',
        // Court/process data that must not be copied
        punishmentType: 'IMPRISONMENT',
        defenderName: 'Defender',
        defenderChoice: 'CHOOSE',
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
        defendantPlea: 'GUILTY',
      }),
      { transaction },
    )
    const defendantCreatedWith = ctx.defendantModel.create.mock.calls[0][0]
    expect(defendantCreatedWith).not.toHaveProperty('punishmentType')
    expect(defendantCreatedWith).not.toHaveProperty('defenderName')
    expect(defendantCreatedWith).not.toHaveProperty('defenderChoice')

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

  it('copies eligible case files to a new S3 key and resets them to a draft state', async () => {
    const caseId = uuid()
    const fileId = uuid()

    const sourceCase = { id: caseId, type: CaseType.INDICTMENT } as Case

    const ctx = await setup(sourceCase)

    ctx.caseFileModel.findAll.mockResolvedValue([
      {
        id: fileId,
        key: `${caseId}/abc/document.pdf`,
        isKeyAccessible: true,
        toJSON: () => ({
          id: fileId,
          caseId,
          category: CaseFileCategory.CASE_FILE,
          key: `${caseId}/abc/document.pdf`,
          state: CaseFileState.STORED_IN_COURT,
          policeFileId: uuid(),
          hash: 'some-hash',
          hashAlgorithm: 'sha256',
        }),
      },
    ])

    await ctx.caseRepositoryService.duplicateIndictmentToDraft(caseId, {
      transaction,
    })

    // Only eligible (prosecutor uploaded) categories are queried
    expect(ctx.caseFileModel.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          caseId,
          category: expect.arrayContaining([
            CaseFileCategory.CRIMINAL_RECORD,
            CaseFileCategory.COST_BREAKDOWN,
            CaseFileCategory.CASE_FILE,
            CaseFileCategory.PROSECUTOR_CASE_FILE,
            CaseFileCategory.DEFENDANT_CASE_FILE,
            CaseFileCategory.CIVIL_CLAIM,
            CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
            CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
            CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
          ]),
        }),
      }),
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

    // A new case file record is created pointing at the new case and key, reset
    // to a draft state, with police/hash references cleared
    expect(ctx.caseFileModel.create).toHaveBeenCalledTimes(1)
    const fileCreatedWith = ctx.caseFileModel.create.mock.calls[0][0]
    expect(fileCreatedWith).toEqual(
      expect.objectContaining({
        id: undefined,
        caseId: ctx.newCaseId,
        key: copyDestKey,
        state: CaseFileState.STORED_IN_RVG,
        policeFileId: undefined,
        hash: undefined,
        hashAlgorithm: undefined,
      }),
    )
  })

  it('remaps the defendant and civil claimant references of copied files', async () => {
    const caseId = uuid()
    const oldDefendantId = uuid()
    const oldCivilClaimantId = uuid()

    const sourceCase = { id: caseId, type: CaseType.INDICTMENT } as Case

    const ctx = await setup(sourceCase)

    ctx.defendantModel.findAll.mockResolvedValue([
      { id: oldDefendantId, name: 'Accused' },
    ])
    ctx.civilClaimantModel.findAll.mockResolvedValue([
      {
        id: oldCivilClaimantId,
        defendantIds: [oldDefendantId],
        toJSON: () => ({
          id: oldCivilClaimantId,
          caseId,
          defendantIds: [oldDefendantId],
        }),
      },
    ])

    ctx.caseFileModel.findAll.mockResolvedValue([
      {
        id: uuid(),
        key: `${caseId}/abc/claim.pdf`,
        isKeyAccessible: true,
        defendantId: oldDefendantId,
        civilClaimantId: oldCivilClaimantId,
        toJSON: () => ({
          id: uuid(),
          caseId,
          category: CaseFileCategory.CIVIL_CLAIM,
          key: `${caseId}/abc/claim.pdf`,
          defendantId: oldDefendantId,
          civilClaimantId: oldCivilClaimantId,
        }),
      },
    ])

    await ctx.caseRepositoryService.duplicateIndictmentToDraft(caseId, {
      transaction,
    })

    const fileCreatedWith = ctx.caseFileModel.create.mock.calls[0][0]
    expect(fileCreatedWith.defendantId).toBe(ctx.newDefendantId)
    expect(fileCreatedWith.civilClaimantId).toBe(ctx.newCivilClaimantId)
  })

  it('skips files whose S3 object is not accessible', async () => {
    const caseId = uuid()

    const sourceCase = { id: caseId, type: CaseType.INDICTMENT } as Case

    const ctx = await setup(sourceCase)

    ctx.caseFileModel.findAll.mockResolvedValue([
      {
        id: uuid(),
        key: `${caseId}/abc/missing.pdf`,
        isKeyAccessible: false,
        toJSON: () => ({ id: uuid(), caseId }),
      },
    ])

    await ctx.caseRepositoryService.duplicateIndictmentToDraft(caseId, {
      transaction,
    })

    expect(ctx.awsS3Service.copyObject).not.toHaveBeenCalled()
    expect(ctx.caseFileModel.create).not.toHaveBeenCalled()
  })

  it('skips a file when its S3 copy fails without failing the duplication', async () => {
    const caseId = uuid()

    const sourceCase = { id: caseId, type: CaseType.INDICTMENT } as Case

    const ctx = await setup(sourceCase)

    ctx.caseFileModel.findAll.mockResolvedValue([
      {
        id: uuid(),
        key: `${caseId}/abc/broken.pdf`,
        isKeyAccessible: true,
        toJSON: () => ({ id: uuid(), caseId }),
      },
      {
        id: uuid(),
        key: `${caseId}/def/ok.pdf`,
        isKeyAccessible: true,
        toJSON: () => ({ id: uuid(), caseId }),
      },
    ])

    ctx.awsS3Service.copyObject
      .mockRejectedValueOnce(new Error('S3 copy failed'))
      .mockResolvedValueOnce(undefined)

    const result = await ctx.caseRepositoryService.duplicateIndictmentToDraft(
      caseId,
      { transaction },
    )

    // The duplication still succeeds and the second (working) file is copied
    expect(result).toBeDefined()
    expect(ctx.awsS3Service.copyObject).toHaveBeenCalledTimes(2)
    expect(ctx.caseFileModel.create).toHaveBeenCalledTimes(1)
  })
})
