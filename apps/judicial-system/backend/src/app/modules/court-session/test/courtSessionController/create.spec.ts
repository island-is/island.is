import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CourtSessionStringType,
  EventType,
} from '@island.is/judicial-system/types'

import { createTestingCourtSessionModule } from '../createTestingCourtSessionModule'

import {
  Case,
  CaseRepositoryService,
  CourtDocumentRepositoryService,
  CourtSession,
  CourtSessionRepositoryService,
  CourtSessionStringRepositoryService,
  EventLog,
  EventLogRepositoryService,
} from '../../../repository'

interface Then {
  result: CourtSession | null
  error: Error
}

type GivenWhenThen = (caseId: string) => Promise<Then>

// A new court session takes in everything the case has waiting for one: its
// own unfiled court documents, then the documents of each case merged into it.
// A case merged in while an earlier session was open already has its copies
// here and filing takes them back in; one merged in with no session open is
// copied in now. Every merged case with documents in the session gets its
// ENTRIES text - the court's record of why the cases were joined.
describe('CourtSessionController - Create', () => {
  const caseId = uuid()
  const courtSessionId = uuid()
  const createdCourtSession = { id: courtSessionId, caseId } as CourtSession

  let transaction: Transaction
  let mockCourtSessionRepositoryService: CourtSessionRepositoryService
  let mockCourtDocumentRepositoryService: CourtDocumentRepositoryService
  let mockCaseRepositoryService: CaseRepositoryService
  let mockEventLogRepositoryService: EventLogRepositoryService
  let mockCourtSessionStringRepositoryService: CourtSessionStringRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      sequelize,
      courtSessionRepositoryService,
      courtDocumentRepositoryService,
      caseRepositoryService,
      eventLogRepositoryService,
      courtSessionStringRepositoryService,
      courtSessionController,
    } = await createTestingCourtSessionModule()

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    mockCourtSessionRepositoryService = courtSessionRepositoryService
    mockCourtDocumentRepositoryService = courtDocumentRepositoryService
    mockCaseRepositoryService = caseRepositoryService
    mockEventLogRepositoryService = eventLogRepositoryService
    mockCourtSessionStringRepositoryService =
      courtSessionStringRepositoryService

    const mockCreate = mockCourtSessionRepositoryService.create as jest.Mock
    mockCreate.mockResolvedValue(createdCourtSession)
    const mockCopyMergedCaseCourtDocuments =
      mockCourtDocumentRepositoryService.copyMergedCaseCourtDocumentsIntoCourtSession as jest.Mock
    mockCopyMergedCaseCourtDocuments.mockResolvedValue(false)
    const mockFindMergedCaseIds =
      mockCourtDocumentRepositoryService.findMergedCaseIdsFiledInCourtSession as jest.Mock
    mockFindMergedCaseIds.mockResolvedValue([])
    const mockFindLatestForCaseAndTypes =
      mockEventLogRepositoryService.findLatestForCaseAndTypes as jest.Mock
    mockFindLatestForCaseAndTypes.mockResolvedValue(null)

    givenWhenThen = async (caseId: string) => {
      const then = {} as Then

      try {
        then.result = await courtSessionController.create(caseId, {
          id: caseId,
          courtSessions: [{ id: uuid() }],
        } as Case)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('court session created', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId)
    })

    it('should create a court session', () => {
      expect(mockCourtSessionRepositoryService.create).toHaveBeenCalledWith(
        caseId,
        { transaction },
      )
      expect(then.result).toBe(createdCourtSession)
    })

    it('should file the available court documents in the new session', () => {
      expect(
        mockCourtDocumentRepositoryService.fileAllAvailableCourtDocumentsInCourtSession,
      ).toHaveBeenCalledWith(caseId, courtSessionId, { transaction })
    })

    it('should look for cases merged into the case', () => {
      expect(
        mockCaseRepositoryService.findAllMergedToCase,
      ).toHaveBeenCalledWith(caseId, { transaction })
    })

    it('should record no merged case when there is none', () => {
      expect(
        mockCourtDocumentRepositoryService.copyMergedCaseCourtDocumentsIntoCourtSession,
      ).not.toHaveBeenCalled()
      expect(
        mockCourtSessionStringRepositoryService.create,
      ).not.toHaveBeenCalled()
    })
  })

  describe('cases have been merged into the case', () => {
    const olderMergedCase = {
      id: uuid(),
      courtCaseNumber: 'S-1/2026',
    } as Case
    const newerMergedCase = {
      id: uuid(),
      courtCaseNumber: 'S-2/2026',
    } as Case
    const indictmentConfirmed = new Date('2026-02-03T10:00:00.000Z')

    beforeEach(async () => {
      const mockFindAllMergedToCase =
        mockCaseRepositoryService.findAllMergedToCase as jest.Mock
      mockFindAllMergedToCase.mockResolvedValue([
        olderMergedCase,
        newerMergedCase,
      ])
      // The older case is copied in now; the newer one's copies were already
      // in the case and the filing above took them back into the session.
      const mockCopyMergedCaseCourtDocuments =
        mockCourtDocumentRepositoryService.copyMergedCaseCourtDocumentsIntoCourtSession as jest.Mock
      mockCopyMergedCaseCourtDocuments.mockImplementation(
        async ({ mergedCaseId }: { mergedCaseId: string }) =>
          mergedCaseId === olderMergedCase.id,
      )
      const mockFindMergedCaseIds =
        mockCourtDocumentRepositoryService.findMergedCaseIdsFiledInCourtSession as jest.Mock
      mockFindMergedCaseIds.mockResolvedValue([
        olderMergedCase.id,
        newerMergedCase.id,
      ])
      const mockFindLatestForCaseAndTypes =
        mockEventLogRepositoryService.findLatestForCaseAndTypes as jest.Mock
      mockFindLatestForCaseAndTypes.mockResolvedValue({
        created: indictmentConfirmed,
      } as EventLog)

      await givenWhenThen(caseId)
    })

    it('should copy each merged case into the new session, oldest merge first', () => {
      expect(
        mockCourtDocumentRepositoryService.copyMergedCaseCourtDocumentsIntoCourtSession,
      ).toHaveBeenNthCalledWith(1, {
        parentCaseId: caseId,
        parentCaseCourtSessionId: courtSessionId,
        mergedCaseId: olderMergedCase.id,
        transaction,
      })
      expect(
        mockCourtDocumentRepositoryService.copyMergedCaseCourtDocumentsIntoCourtSession,
      ).toHaveBeenNthCalledWith(2, {
        parentCaseId: caseId,
        parentCaseCourtSessionId: courtSessionId,
        mergedCaseId: newerMergedCase.id,
        transaction,
      })
    })

    it('should date the entries by when the merged case was confirmed or sent to court', () => {
      expect(
        mockEventLogRepositoryService.findLatestForCaseAndTypes,
      ).toHaveBeenCalledWith(
        olderMergedCase.id,
        [EventType.CASE_SENT_TO_COURT, EventType.INDICTMENT_CONFIRMED],
        { transaction },
      )
    })

    // Both merged cases have documents in the session - the one copied in now
    // and the one whose copies were filed back in - so both are written up.
    it('should record every merged case in the session in the entries', () => {
      expect(
        mockCourtDocumentRepositoryService.findMergedCaseIdsFiledInCourtSession,
      ).toHaveBeenCalledWith(caseId, courtSessionId, { transaction })
      expect(
        mockCourtSessionStringRepositoryService.create,
      ).toHaveBeenCalledTimes(2)
      expect(
        mockCourtSessionStringRepositoryService.create,
      ).toHaveBeenNthCalledWith(
        1,
        {
          caseId,
          courtSessionId,
          mergedCaseId: olderMergedCase.id,
          stringType: CourtSessionStringType.ENTRIES,
          value: `Mál nr. S-1/2026 sem var höfðað á hendur ákærða með ákæru útgefinni ${formatDate(
            indictmentConfirmed,
            'PPP',
          )}, er nú einnig tekið fyrir og það sameinað þessu máli, sbr. heimild í 1. mgr. 169. gr. laga nr. 88/2008 um meðferð sakamála, og verða þau eftirleiðis rekin undir málsnúmeri þessa máls.`,
        },
        { transaction },
      )
      expect(
        mockCourtSessionStringRepositoryService.create,
      ).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ mergedCaseId: newerMergedCase.id }),
        { transaction },
      )
    })

    it('should file the case documents before the merged cases', () => {
      const fileAll =
        mockCourtDocumentRepositoryService.fileAllAvailableCourtDocumentsInCourtSession as jest.Mock
      const copyMerged =
        mockCourtDocumentRepositoryService.copyMergedCaseCourtDocumentsIntoCourtSession as jest.Mock

      expect(fileAll.mock.invocationCallOrder[0]).toBeLessThan(
        copyMerged.mock.invocationCallOrder[0],
      )
    })
  })

  // A merged case can have nothing to bring in - every document was removed
  // from the record, or it never had one. It gets no section and no entries.
  describe('a merged case has no documents in the session', () => {
    const emptyMergedCase = { id: uuid(), courtCaseNumber: 'S-4/2026' } as Case

    beforeEach(async () => {
      const mockFindAllMergedToCase =
        mockCaseRepositoryService.findAllMergedToCase as jest.Mock
      mockFindAllMergedToCase.mockResolvedValue([emptyMergedCase])

      await givenWhenThen(caseId)
    })

    it('should not add entries for it', () => {
      expect(
        mockEventLogRepositoryService.findLatestForCaseAndTypes,
      ).not.toHaveBeenCalled()
      expect(
        mockCourtSessionStringRepositoryService.create,
      ).not.toHaveBeenCalled()
    })
  })

  describe('a merged case has no confirmation or sending event', () => {
    const mergedCase = { id: uuid(), courtCaseNumber: 'S-3/2026' } as Case

    beforeEach(async () => {
      const mockFindAllMergedToCase =
        mockCaseRepositoryService.findAllMergedToCase as jest.Mock
      mockFindAllMergedToCase.mockResolvedValue([mergedCase])
      const mockCopyMergedCaseCourtDocuments =
        mockCourtDocumentRepositoryService.copyMergedCaseCourtDocumentsIntoCourtSession as jest.Mock
      mockCopyMergedCaseCourtDocuments.mockResolvedValue(true)
      const mockFindMergedCaseIds =
        mockCourtDocumentRepositoryService.findMergedCaseIdsFiledInCourtSession as jest.Mock
      mockFindMergedCaseIds.mockResolvedValue([mergedCase.id])

      await givenWhenThen(caseId)
    })

    it('should record the merged case without a date', () => {
      expect(
        mockCourtSessionStringRepositoryService.create,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          mergedCaseId: mergedCase.id,
          value:
            'Mál nr. S-3/2026 sem var höfðað á hendur ákærða, er nú einnig tekið fyrir og það sameinað þessu máli, sbr. heimild í 1. mgr. 169. gr. laga nr. 88/2008 um meðferð sakamála, og verða þau eftirleiðis rekin undir málsnúmeri þessa máls.',
        }),
        { transaction },
      )
    })
  })

  describe('court session creation fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCourtSessionRepositoryService.create as jest.Mock
      mockCreate.mockRejectedValue(new Error('Failed to create court session'))

      then = await givenWhenThen(caseId)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Failed to create court session')
    })

    it('should file nothing', () => {
      expect(
        mockCourtDocumentRepositoryService.fileAllAvailableCourtDocumentsInCourtSession,
      ).not.toHaveBeenCalled()
    })
  })
})
