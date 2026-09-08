import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@nestjs/common'

import {
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  CaseOrigin,
  CaseState,
  CaseType,
  StringType,
  User as TUser,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { AwsS3Service } from '../../../aws-s3'
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
} from '../../../repository'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: TUser,
  theCase: Case,
) => Promise<Then>

describe('CaseController - Duplicate', () => {
  const caseId = uuid()
  const userId = uuid()
  const prosecutorsOfficeId = uuid()
  const user = { id: userId, institution: { id: prosecutorsOfficeId } } as TUser

  // The case the route's guard resolved. What actually gets copied is read from
  // the database inside the duplication, so the source case is its own fixture.
  const revokedIndictment = {
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.COMPLETED,
    indictmentRulingDecision: CaseIndictmentRulingDecision.WITHDRAWAL,
  } as Case

  let transaction: Transaction
  let newCase: Case
  let newCaseId: string
  let oldDefendantId: string
  let newDefendantId: string
  let oldIndictmentCountId: string
  let newIndictmentCountId: string
  let oldCivilClaimantId: string
  let newCivilClaimantId: string

  let mockCaseRepositoryService: jest.Mocked<CaseRepositoryService>
  let mockPoliceCaseNumberRepositoryService: jest.Mocked<CaseDefendantPoliceCaseNumberRepositoryService>
  let mockDefendantRepositoryService: jest.Mocked<DefendantRepositoryService>
  let mockIndictmentCountRepositoryService: jest.Mocked<IndictmentCountRepositoryService>
  let mockOffenseRepositoryService: jest.Mocked<OffenseRepositoryService>
  let mockVictimRepositoryService: jest.Mocked<VictimRepositoryService>
  let mockCaseStringRepositoryService: jest.Mocked<CaseStringRepositoryService>
  let mockCivilClaimantRepositoryService: jest.Mocked<CivilClaimantRepositoryService>
  let mockCaseFileRepositoryService: jest.Mocked<CaseFileRepositoryService>
  let mockAwsS3Service: jest.Mocked<AwsS3Service>

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      sequelize,
      caseRepositoryService,
      caseDefendantPoliceCaseNumberRepositoryService,
      defendantRepositoryService,
      indictmentCountRepositoryService,
      offenseRepositoryService,
      victimRepositoryService,
      caseStringRepositoryService,
      civilClaimantRepositoryService,
      caseFileRepositoryService,
      awsS3Service,
      caseController,
    } = await createTestingCaseModule()

    mockCaseRepositoryService =
      caseRepositoryService as jest.Mocked<CaseRepositoryService>
    mockPoliceCaseNumberRepositoryService =
      caseDefendantPoliceCaseNumberRepositoryService as jest.Mocked<CaseDefendantPoliceCaseNumberRepositoryService>
    mockDefendantRepositoryService =
      defendantRepositoryService as jest.Mocked<DefendantRepositoryService>
    mockIndictmentCountRepositoryService =
      indictmentCountRepositoryService as jest.Mocked<IndictmentCountRepositoryService>
    mockOffenseRepositoryService =
      offenseRepositoryService as jest.Mocked<OffenseRepositoryService>
    mockVictimRepositoryService =
      victimRepositoryService as jest.Mocked<VictimRepositoryService>
    mockCaseStringRepositoryService =
      caseStringRepositoryService as jest.Mocked<CaseStringRepositoryService>
    mockCivilClaimantRepositoryService =
      civilClaimantRepositoryService as jest.Mocked<CivilClaimantRepositoryService>
    mockCaseFileRepositoryService =
      caseFileRepositoryService as jest.Mocked<CaseFileRepositoryService>
    mockAwsS3Service = awsS3Service as jest.Mocked<AwsS3Service>

    newCaseId = uuid()
    newCase = { id: newCaseId } as Case
    oldDefendantId = uuid()
    newDefendantId = uuid()
    oldIndictmentCountId = uuid()
    newIndictmentCountId = uuid()
    oldCivilClaimantId = uuid()
    newCivilClaimantId = uuid()

    // Nothing hangs off the case by default, so each test only sets up the
    // part it is about
    mockCaseRepositoryService.create.mockResolvedValue(newCase)
    mockPoliceCaseNumberRepositoryService.findDistinctPoliceCaseNumbersByCaseIds.mockResolvedValue(
      new Map(),
    )
    mockPoliceCaseNumberRepositoryService.findAssignedLinksByCaseId.mockResolvedValue(
      [],
    )
    mockPoliceCaseNumberRepositoryService.assignDefendantPoliceCaseNumbers.mockResolvedValue(
      [],
    )
    mockDefendantRepositoryService.copyProsecutorEnteredToCase.mockResolvedValue(
      new Map([[oldDefendantId, newDefendantId]]),
    )
    mockIndictmentCountRepositoryService.copyAllToCase.mockResolvedValue(
      new Map([[oldIndictmentCountId, newIndictmentCountId]]),
    )
    mockCivilClaimantRepositoryService.copyAllToCase.mockResolvedValue(
      new Map([[oldCivilClaimantId, newCivilClaimantId]]),
    )
    mockCaseFileRepositoryService.findAllByCaseAndCategories.mockResolvedValue(
      [],
    )
    mockCaseFileRepositoryService.copyToCase.mockResolvedValue({} as CaseFile)

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (caseId: string, user: TUser, theCase: Case) => {
      const then = {} as Then

      try {
        then.result = await caseController.duplicate(caseId, user, theCase)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe.each([
    CaseIndictmentRulingDecision.WITHDRAWAL,
    CaseIndictmentRulingDecision.CANCELLATION,
  ])('revoked indictment duplicated (%s)', (indictmentRulingDecision) => {
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
      indictmentRulingDecision,
    } as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should duplicate the case into a new draft owned by the current prosecutor', () => {
      expect(mockCaseRepositoryService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          state: CaseState.DRAFT,
          creatingProsecutorId: userId,
          prosecutorId: userId,
          prosecutorsOfficeId,
        }),
        { transaction },
      )
      expect(then.result).toBe(newCase)
    })
  })

  describe('waiting for cancellation indictment duplicated', () => {
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.WAITING_FOR_CANCELLATION,
    } as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should duplicate the case into a new draft owned by the current prosecutor', () => {
      expect(mockCaseRepositoryService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          state: CaseState.DRAFT,
          creatingProsecutorId: userId,
          prosecutorId: userId,
          prosecutorsOfficeId,
        }),
        { transaction },
      )
      expect(then.result).toBe(newCase)
    })
  })

  describe('non-revoked completed indictment', () => {
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
    } as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should throw ForbiddenException and not duplicate', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(mockCaseRepositoryService.create).not.toHaveBeenCalled()
    })
  })

  describe('non-revoked active indictment', () => {
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.RECEIVED,
    } as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should throw ForbiddenException and not duplicate', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(mockCaseRepositoryService.create).not.toHaveBeenCalled()
    })
  })

  describe('prosecutor entered case data copied', () => {
    const courtId = uuid()
    let createdWith: Partial<Case>

    beforeEach(async () => {
      // The route's case is what gets copied, so it is passed in rather than
      // read again inside the duplication
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

      await givenWhenThen(caseId, user, sourceCase)
      ;[createdWith] = mockCaseRepositoryService.create.mock.calls[0]
    })

    it('should copy the prosecutor entered fields into a draft with court sessions', () => {
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
        }),
      )
    })

    it('should not copy court or request-case data', () => {
      expect(createdWith).not.toHaveProperty('courtCaseNumber')
      expect(createdWith).not.toHaveProperty('indictmentRulingDecision')
      expect(createdWith).not.toHaveProperty('judgeId')
      expect(createdWith).not.toHaveProperty('registrarId')
      expect(createdWith).not.toHaveProperty('rulingDate')
      expect(createdWith).not.toHaveProperty('defenderName')
      expect(createdWith).not.toHaveProperty('leadInvestigator')
      expect(createdWith).not.toHaveProperty('caseFilesComments')
    })

    it('should link the draft back to the case it was duplicated from', () => {
      // The source's own parent link is not carried over - the new draft points
      // at the case it was duplicated from, so that police system (LÖKE)
      // communication resolves the original ancestor
      expect(createdWith.parentCaseId).toBe(caseId)
    })
  })

  describe('case content copied', () => {
    beforeEach(async () => {
      mockPoliceCaseNumberRepositoryService.findDistinctPoliceCaseNumbersByCaseIds.mockResolvedValue(
        new Map([[caseId, ['007-2026-1']]]),
      )
      mockPoliceCaseNumberRepositoryService.findAssignedLinksByCaseId.mockResolvedValue(
        [
          { defendantId: oldDefendantId, policeCaseNumber: '007-2026-1' },
          // A link to a defendant that was not copied is dropped
          { defendantId: uuid(), policeCaseNumber: '007-2026-2' },
        ],
      )

      await givenWhenThen(caseId, user, revokedIndictment)
    })

    it('should seed the police case numbers of the original on the new case', () => {
      expect(
        mockPoliceCaseNumberRepositoryService.findDistinctPoliceCaseNumbersByCaseIds,
      ).toHaveBeenCalledWith([caseId], { transaction })
      expect(mockCaseRepositoryService.create).toHaveBeenCalledWith(
        expect.objectContaining({ policeCaseNumbers: ['007-2026-1'] }),
        { transaction },
      )
    })

    it('should copy the defendants and reassign their police case numbers', () => {
      expect(
        mockDefendantRepositoryService.copyProsecutorEnteredToCase,
      ).toHaveBeenCalledWith(caseId, newCaseId, { transaction })
      expect(
        mockPoliceCaseNumberRepositoryService.assignDefendantPoliceCaseNumbers,
      ).toHaveBeenCalledWith(
        newCaseId,
        [{ defendantId: newDefendantId, policeCaseNumber: '007-2026-1' }],
        { transaction },
      )
    })

    it('should copy the indictment counts and put their offenses on the copies', () => {
      expect(
        mockIndictmentCountRepositoryService.copyAllToCase,
      ).toHaveBeenCalledWith(caseId, newCaseId, { transaction })
      expect(
        mockOffenseRepositoryService.copyAllForIndictmentCounts,
      ).toHaveBeenCalledWith(
        new Map([[oldIndictmentCountId, newIndictmentCountId]]),
        { transaction },
      )
    })

    it('should copy the victims', () => {
      expect(mockVictimRepositoryService.copyAllToCase).toHaveBeenCalledWith(
        caseId,
        newCaseId,
        { transaction },
      )
    })

    it('should copy only the prosecutor entered case strings', () => {
      expect(
        mockCaseStringRepositoryService.copyByTypesToCase,
      ).toHaveBeenCalledWith(
        caseId,
        newCaseId,
        [StringType.CIVIL_DEMANDS, StringType.PENALTIES],
        { transaction },
      )
    })

    it('should copy the civil claimants against the copied defendants', () => {
      expect(
        mockCivilClaimantRepositoryService.copyAllToCase,
      ).toHaveBeenCalledWith(
        caseId,
        newCaseId,
        new Map([[oldDefendantId, newDefendantId]]),
        { transaction },
      )
    })

    it('should resolve the police case numbers of the returned case', () => {
      expect(
        mockPoliceCaseNumberRepositoryService.resolvePoliceCaseNumbersForCases,
      ).toHaveBeenCalledWith([newCase], { transaction })
    })
  })

  describe('case files copied', () => {
    const fileId = uuid()
    const file = {
      id: fileId,
      key: `${caseId}/abc/document.pdf`,
      isKeyAccessible: true,
    } as CaseFile
    let destinationKey: string

    beforeEach(async () => {
      mockCaseFileRepositoryService.findAllByCaseAndCategories.mockResolvedValue(
        [file],
      )

      await givenWhenThen(caseId, user, revokedIndictment)
      ;[, , destinationKey] = mockAwsS3Service.copyObject.mock.calls[0]
    })

    it('should look up only the prosecutor uploaded categories', () => {
      expect(
        mockCaseFileRepositoryService.findAllByCaseAndCategories,
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
    })

    it('should copy the S3 object to a new key under the new case', () => {
      expect(mockAwsS3Service.copyObject).toHaveBeenCalledTimes(1)
      const [caseType, sourceKey] = mockAwsS3Service.copyObject.mock.calls[0]
      expect(caseType).toBe(CaseType.INDICTMENT)
      expect(sourceKey).toBe(`${caseId}/abc/document.pdf`)
      // The filename is kept, under a fresh uuid on the new case
      expect(destinationKey).toMatch(
        new RegExp(`^${newCaseId}/[0-9a-f-]+/document\\.pdf$`),
      )
    })

    it('should create the copy at the new key with no references to carry over', () => {
      expect(mockCaseFileRepositoryService.copyToCase).toHaveBeenCalledWith(
        file,
        newCaseId,
        {
          key: destinationKey,
          defendantId: undefined,
          civilClaimantId: undefined,
        },
        { transaction },
      )
    })
  })

  describe('case file references remapped', () => {
    let file: CaseFile

    beforeEach(async () => {
      file = {
        id: uuid(),
        key: `${caseId}/abc/claim.pdf`,
        isKeyAccessible: true,
        defendantId: oldDefendantId,
        civilClaimantId: oldCivilClaimantId,
      } as CaseFile
      mockCaseFileRepositoryService.findAllByCaseAndCategories.mockResolvedValue(
        [file],
      )

      await givenWhenThen(caseId, user, revokedIndictment)
    })

    it('should point the copied file at the copied defendant and civil claimant', () => {
      expect(mockCaseFileRepositoryService.copyToCase).toHaveBeenCalledWith(
        file,
        newCaseId,
        expect.objectContaining({
          defendantId: newDefendantId,
          civilClaimantId: newCivilClaimantId,
        }),
        { transaction },
      )
    })
  })

  describe('case files without an accessible object', () => {
    beforeEach(async () => {
      mockCaseFileRepositoryService.findAllByCaseAndCategories.mockResolvedValue(
        [
          {
            id: uuid(),
            key: `${caseId}/abc/missing.pdf`,
            isKeyAccessible: false,
          } as CaseFile,
          { id: uuid(), key: '', isKeyAccessible: true } as CaseFile,
        ],
      )

      await givenWhenThen(caseId, user, revokedIndictment)
    })

    it('should skip them', () => {
      expect(mockAwsS3Service.copyObject).not.toHaveBeenCalled()
      expect(mockCaseFileRepositoryService.copyToCase).not.toHaveBeenCalled()
    })
  })

  describe('case file whose S3 copy fails', () => {
    const workingFile = {
      id: uuid(),
      key: `${caseId}/def/ok.pdf`,
      isKeyAccessible: true,
    } as CaseFile
    let then: Then

    beforeEach(async () => {
      mockCaseFileRepositoryService.findAllByCaseAndCategories.mockResolvedValue(
        [
          {
            id: uuid(),
            key: `${caseId}/abc/broken.pdf`,
            isKeyAccessible: true,
          } as CaseFile,
          workingFile,
        ],
      )
      mockAwsS3Service.copyObject
        .mockRejectedValueOnce(new Error('S3 copy failed'))
        .mockResolvedValueOnce(undefined)

      then = await givenWhenThen(caseId, user, revokedIndictment)
    })

    it('should skip it and still duplicate the rest', () => {
      expect(then.result).toBe(newCase)
      expect(mockAwsS3Service.copyObject).toHaveBeenCalledTimes(2)
      expect(mockCaseFileRepositoryService.copyToCase).toHaveBeenCalledTimes(1)
      expect(mockCaseFileRepositoryService.copyToCase).toHaveBeenCalledWith(
        workingFile,
        newCaseId,
        expect.objectContaining({
          key: expect.stringMatching(
            new RegExp(`^${newCaseId}/[0-9a-f-]+/ok\\.pdf$`),
          ),
        }),
        { transaction },
      )
    })
  })

  describe('copy step fails', () => {
    let then: Then

    beforeEach(async () => {
      mockIndictmentCountRepositoryService.copyAllToCase.mockRejectedValue(
        new Error('Some error'),
      )

      then = await givenWhenThen(caseId, user, revokedIndictment)
    })

    it('should abort the duplication', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
      expect(mockVictimRepositoryService.copyAllToCase).not.toHaveBeenCalled()
      expect(
        mockPoliceCaseNumberRepositoryService.resolvePoliceCaseNumbersForCases,
      ).not.toHaveBeenCalled()
    })
  })
})
