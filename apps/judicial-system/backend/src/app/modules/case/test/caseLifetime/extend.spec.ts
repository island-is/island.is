import addDays from 'date-fns/addDays'
import { mock, MockProxy } from 'jest-mock-extended'
import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException, NotFoundException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'

import { CaseState, CaseType } from '@island.is/judicial-system/types'

import { nowFactory } from '../../../../factories'
import { DefendantService } from '../../../defendant'
import { FileService } from '../../../file'
import { IndictmentCountService } from '../../../indictment-count'
import {
  AppealCaseRepositoryService,
  AppealDecisionRepositoryService,
  Case,
  CaseArchiveRepositoryService,
  CaseRepositoryService,
  CaseStringRepositoryService,
} from '../../../repository'
import { CaseLifetimeService } from '../../caseLifetime.service'
import { CaseLifetimeResponse } from '../../models/caseLifetime.response'

jest.mock('../../../../factories')

interface Then {
  result: CaseLifetimeResponse
  error: Error
}

describe('CaseLifetimeService - Extend', () => {
  const now = new Date()
  const caseId = uuid()
  const transaction = {} as Transaction

  let mockCaseRepositoryService: MockProxy<CaseRepositoryService>
  let mockCaseArchiveRepositoryService: MockProxy<CaseArchiveRepositoryService>
  let mockAppealCaseRepositoryService: MockProxy<AppealCaseRepositoryService>
  let mockAppealDecisionRepositoryService: MockProxy<AppealDecisionRepositoryService>
  let mockCaseStringRepositoryService: MockProxy<CaseStringRepositoryService>
  let mockDefendantService: MockProxy<DefendantService>
  let mockFileService: MockProxy<FileService>
  let mockIndictmentCountService: MockProxy<IndictmentCountService>
  let givenWhenThen: (theCase: Case | null, days: number) => Promise<Then>

  // A custody case that was accepted and whose regular lifetime ran out long
  // ago - built from the clock, so the spec does not age
  const expiredCase = (overrides: object = {}) =>
    ({
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.ACCEPTED,
      created: addDays(now, -300),
      rulingDate: addDays(now, -290),
      validToDate: addDays(now, -200),
      isArchived: false,
      ...overrides,
    } as unknown as Case)

  const expectNothingWritten = () => {
    expect(mockCaseRepositoryService.update).not.toHaveBeenCalled()
    expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
    expect(mockAppealDecisionRepositoryService.update).not.toHaveBeenCalled()
    expect(
      mockCaseStringRepositoryService.updateByIdAndCase,
    ).not.toHaveBeenCalled()
    expect(mockDefendantService.updateDatabaseDefendant).not.toHaveBeenCalled()
    expect(mockFileService.updateCaseFile).not.toHaveBeenCalled()
    expect(mockIndictmentCountService.update).not.toHaveBeenCalled()
  }

  beforeEach(() => {
    const mockNow = nowFactory as jest.Mock
    mockNow.mockReturnValue(now)

    mockCaseRepositoryService = mock<CaseRepositoryService>()
    mockCaseArchiveRepositoryService = mock<CaseArchiveRepositoryService>()
    mockAppealCaseRepositoryService = mock<AppealCaseRepositoryService>()
    mockAppealDecisionRepositoryService =
      mock<AppealDecisionRepositoryService>()
    mockCaseStringRepositoryService = mock<CaseStringRepositoryService>()
    mockDefendantService = mock<DefendantService>()
    mockFileService = mock<FileService>()
    mockIndictmentCountService = mock<IndictmentCountService>()

    const caseLifetimeService = new CaseLifetimeService(
      mockCaseRepositoryService,
      mockCaseArchiveRepositoryService,
      mockAppealCaseRepositoryService,
      mockAppealDecisionRepositoryService,
      mockCaseStringRepositoryService,
      mockDefendantService,
      mockFileService,
      mockIndictmentCountService,
      mock<Logger>(),
    )

    givenWhenThen = async (theCase: Case | null, days: number) => {
      mockCaseRepositoryService.findWithArchiveGraphByIdForUpdate.mockResolvedValueOnce(
        theCase,
      )

      const then = {} as Then

      try {
        then.result = await caseLifetimeService.extend(
          caseId,
          days,
          transaction,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('case that is not archived', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(expiredCase(), 30)
    })

    it('should read the case under a lock in the callers transaction', () => {
      expect(
        mockCaseRepositoryService.findWithArchiveGraphByIdForUpdate,
      ).toHaveBeenCalledWith(caseId, transaction)
    })

    it('should store the date the case is kept until', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        { isArchived: false, archiveNotBefore: addDays(now, 30) },
        { transaction },
      )
      expect(then.result).toEqual({
        caseId,
        archiveNotBefore: addDays(now, 30),
        caseRestored: false,
      })
    })

    it('should not read an archive', () => {
      expect(
        mockCaseArchiveRepositoryService.findLatestByCaseId,
      ).not.toHaveBeenCalled()
    })
  })

  describe('extension that ends within the regular lifetime', () => {
    let then: Then

    beforeEach(async () => {
      // The regular lifetime runs for another forty days
      then = await givenWhenThen(
        expiredCase({ validToDate: addDays(now, -50) }),
        30,
      )
    })

    it('should reject the extension', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expectNothingWritten()
    })
  })

  describe('extension that ends after the regular lifetime', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        expiredCase({ validToDate: addDays(now, -50) }),
        41,
      )
    })

    it('should store the extension', () => {
      expect(then.result.archiveNotBefore).toEqual(addDays(now, 41))
    })
  })

  describe('extension removed', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        expiredCase({ archiveNotBefore: addDays(now, 10) }),
        0,
      )
    })

    it('should clear the date', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        { archiveNotBefore: null },
        { transaction },
      )
      expect(then.result).toEqual({ caseId, caseRestored: false })
    })
  })

  describe('archived case', () => {
    const defendantId = uuid()
    const caseFileId = uuid()
    const indictmentCountId = uuid()
    const caseStringId = uuid()
    const appealCaseId = uuid()
    const appealDecisionId = uuid()
    const created = addDays(now, -300)
    const archivedCase = () =>
      expiredCase({
        isArchived: true,
        appealCase: { id: appealCaseId },
        defendants: [{ id: defendantId, created }],
        caseFiles: [{ id: caseFileId, created }],
        indictmentCounts: [{ id: indictmentCountId, displayOrder: 0, created }],
        caseStrings: [{ id: caseStringId, created }],
        appealDecisions: [{ id: appealDecisionId, created }],
      })
    const content = {
      description: 'original_description',
      ruling: 'original_ruling',
      appealCase: { appealConclusion: 'original_appeal_conclusion' },
      defendants: [{ nationalId: '0000000000', name: 'original_name' }],
      caseFiles: [{ name: 'original_file', key: 'original_key' }],
      indictmentCounts: [{ incidentDescription: 'original_incident' }],
      caseStrings: [{ value: 'original_value' }],
      appealDecisions: [{ announcement: 'original_announcement' }],
    }

    describe('archive that fits the case', () => {
      let then: Then

      beforeEach(async () => {
        mockCaseArchiveRepositoryService.findLatestByCaseId.mockResolvedValueOnce(
          { id: uuid(), created: now, content },
        )

        then = await givenWhenThen(archivedCase(), 30)
      })

      it('should read the latest archive in the callers transaction', () => {
        expect(
          mockCaseArchiveRepositoryService.findLatestByCaseId,
        ).toHaveBeenCalledWith(caseId, { transaction })
      })

      it('should restore the children', () => {
        expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
          appealCaseId,
          { appealConclusion: 'original_appeal_conclusion' },
          { transaction },
        )
        expect(
          mockDefendantService.updateDatabaseDefendant,
        ).toHaveBeenCalledWith(
          caseId,
          defendantId,
          { nationalId: '0000000000', name: 'original_name' },
          transaction,
        )
        expect(mockFileService.updateCaseFile).toHaveBeenCalledWith(
          caseId,
          caseFileId,
          { name: 'original_file', key: 'original_key' },
          transaction,
        )
        expect(mockIndictmentCountService.update).toHaveBeenCalledWith(
          caseId,
          indictmentCountId,
          { incidentDescription: 'original_incident' },
          transaction,
        )
        expect(
          mockCaseStringRepositoryService.updateByIdAndCase,
        ).toHaveBeenCalledWith(
          caseStringId,
          caseId,
          { value: 'original_value' },
          { transaction },
        )
        expect(mockAppealDecisionRepositoryService.update).toHaveBeenCalledWith(
          appealDecisionId,
          { announcement: 'original_announcement' },
          { transaction },
        )
      })

      it('should restore the case, bring it back and store the extension', () => {
        expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
          caseId,
          {
            description: 'original_description',
            ruling: 'original_ruling',
            isArchived: false,
            archiveNotBefore: addDays(now, 30),
          },
          { transaction },
        )
        expect(then.result).toEqual({
          caseId,
          archiveNotBefore: addDays(now, 30),
          caseRestored: true,
        })
      })
    })

    describe.each([
      ['no archive', null],
      [
        'an archive that cannot be decrypted',
        { id: uuid(), created: now, content: undefined },
      ],
      [
        'an archive that does not fit the tables',
        {
          id: uuid(),
          created: now,
          content: { ...content, lawsBroken: 'original_laws_broken' },
        },
      ],
      [
        'an archive that does not fit the rows',
        { id: uuid(), created: now, content: { ...content, defendants: [] } },
      ],
    ])('%s', (_, caseArchive) => {
      let then: Then

      beforeEach(async () => {
        mockCaseArchiveRepositoryService.findLatestByCaseId.mockResolvedValueOnce(
          caseArchive,
        )

        then = await givenWhenThen(archivedCase(), 30)
      })

      it('should reject the restore before anything is written', () => {
        expect(then.error).toBeInstanceOf(BadRequestException)
        expectNothingWritten()
      })
    })

    describe('zero days', () => {
      let then: Then

      beforeEach(async () => {
        then = await givenWhenThen(archivedCase(), 0)
      })

      it('should reject the restore', () => {
        expect(then.error).toBeInstanceOf(BadRequestException)
        expectNothingWritten()
      })
    })
  })

  describe.each([
    ['a deleted case', expiredCase({ state: CaseState.DELETED })],
    [
      'a deleted and archived case',
      expiredCase({ state: CaseState.DELETED, isArchived: true }),
    ],
    [
      'an indictment',
      expiredCase({ type: CaseType.INDICTMENT, state: CaseState.RECEIVED }),
    ],
    [
      'a case without a regular lifetime',
      expiredCase({ validToDate: undefined }),
    ],
  ])('%s', (_, theCase) => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, 30)
    })

    it('should reject the extension', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(
        mockCaseArchiveRepositoryService.findLatestByCaseId,
      ).not.toHaveBeenCalled()
      expectNothingWritten()
    })
  })

  describe('case that does not exist', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(null, 30)
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expectNothingWritten()
    })
  })
})
