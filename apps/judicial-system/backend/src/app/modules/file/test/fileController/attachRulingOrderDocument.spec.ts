import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import { Message, MessageType } from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  CaseOrigin,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { getOrCreateTransaction } from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import { Case, CaseFile, CaseFileRepositoryService } from '../../../repository'
import { AttachRulingOrderDocumentDto } from '../../dto/attachRulingOrderDocument.dto'

interface Then {
  result: CaseFile
  error: Error
}

// A ruling order pronounced orally has no document until the district court
// writes it up. The upload fills in the ruling that already exists rather than
// creating a new file, so the court record, the appeal decisions and any appeal
// keep pointing at it - and it keeps the name it was pronounced under.
describe('FileController - Attach ruling order document', () => {
  const caseId = uuid()
  const fileId = uuid()
  const user = { id: uuid(), name: 'Dómritarinn' } as User
  const key = `${caseId}/${uuid()}/urskurdur.pdf`

  let mockCaseFileRepositoryService: CaseFileRepositoryService
  let queuedMessagesAfterCommit: Message[]
  let mockTransaction: jest.Mock
  let transaction: Transaction
  let givenWhenThen: (
    theCase: Case,
    caseFile: CaseFile,
    attachDocument?: Partial<AttachRulingOrderDocumentDto>,
  ) => Promise<Then>

  beforeEach(async () => {
    const {
      caseFileRepositoryService,
      fileController,
      sequelize,
      queuedMessagesAfterCommit: messages,
    } = await createTestingFileModule()

    mockCaseFileRepositoryService = caseFileRepositoryService
    queuedMessagesAfterCommit = messages

    mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    givenWhenThen = async (theCase, caseFile, attachDocument) => {
      const then = {} as Then

      const mockUpdate =
        mockCaseFileRepositoryService.updateByIdAndCaseWithoutDocument as jest.Mock
      mockUpdate.mockResolvedValueOnce({
        numberOfAffectedRows: 1,
        caseFiles: [{ ...caseFile, key }],
      })

      // The route is guarded by CaseExistsForUpdateGuard, so the request
      // transaction is already open - and holding a lock on this case row -
      // by the time the handler runs. Guards do not execute in controller
      // unit tests, so the request context and that transaction are set up
      // here instead.
      try {
        then.result = await runInRequestContext(async () => {
          await getOrCreateTransaction(sequelize)

          return fileController.attachRulingOrderDocument(
            caseId,
            fileId,
            user,
            theCase,
            caseFile,
            {
              type: 'application/pdf',
              key,
              size: 1234,
              ...attachDocument,
            } as AttachRulingOrderDocumentDto,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  const makeCase = (overrides: Partial<Case> = {}): Case =>
    ({
      id: caseId,
      type: CaseType.INDICTMENT,
      origin: CaseOrigin.LOKE,
      courtCaseNumber: 'S-123/2026',
      ...overrides,
    } as Case)

  const pronouncedOrally = {
    id: fileId,
    caseId,
    category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
    isPronouncedOrally: true,
    key: '',
    userGeneratedFilename: 'S-123/2026 Úrskurður 12.11.2026',
  } as CaseFile

  describe('document attached', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(makeCase(), pronouncedOrally)
    })

    it('should fill in the document in the transaction the guard opened, keeping the pronounced name', () => {
      // Once, by the stand-in for the guard above. A second call would be the
      // handler opening a transaction of its own, which would block on the
      // guard's row lock and deadlock the request.
      expect(mockTransaction).toHaveBeenCalledTimes(1)
      expect(
        mockCaseFileRepositoryService.updateByIdAndCaseWithoutDocument,
      ).toHaveBeenCalledWith(
        fileId,
        caseId,
        {
          key,
          size: 1234,
          type: 'application/pdf',
          name: 'urskurdur.pdf',
        },
        { transaction },
      )
    })

    it('should deliver the ruling to the police and the court', () => {
      expect(queuedMessagesAfterCommit).toEqual([
        {
          type: MessageType.DELIVERY_TO_POLICE_CASE_FILE,
          user,
          caseId,
          elementId: fileId,
        },
        {
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          user,
          caseId,
          elementId: fileId,
        },
      ])
    })

    it('should return the updated case file', () => {
      expect(then.result.key).toBe(key)
    })
  })

  describe('document attached under a new name', () => {
    beforeEach(async () => {
      await givenWhenThen(makeCase(), pronouncedOrally, {
        userGeneratedFilename: 'S-123/2026 Úrskurður um frávísun',
      })
    })

    it('should rename the ruling', () => {
      expect(
        mockCaseFileRepositoryService.updateByIdAndCaseWithoutDocument,
      ).toHaveBeenCalledWith(
        fileId,
        caseId,
        expect.objectContaining({
          userGeneratedFilename: 'S-123/2026 Úrskurður um frávísun',
        }),
        expect.any(Object),
      )
    })
  })

  // The pre-check reads a ruling that had no document at the time; only the
  // update can settle a race between two uploads, and the loser matches no rows.
  describe('another upload wrote the ruling up first', () => {
    let then: Then

    beforeEach(async () => {
      const mockUpdate =
        mockCaseFileRepositoryService.updateByIdAndCaseWithoutDocument as jest.Mock
      mockUpdate.mockReset()
      mockUpdate.mockResolvedValueOnce({
        numberOfAffectedRows: 0,
        caseFiles: [],
      })

      then = await givenWhenThen(makeCase(), pronouncedOrally)
    })

    it('should be rejected without delivering anything', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        'The ruling order has already been written up',
      )
      expect(queuedMessagesAfterCommit).toHaveLength(0)
    })
  })

  describe('ruling order has already been written up', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(makeCase(), {
        ...pronouncedOrally,
        key: `${caseId}/${uuid()}/written-up.pdf`,
      } as CaseFile)
    })

    it('should be rejected', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        'Only a ruling order that was pronounced orally and has not been written up can have a document attached',
      )
      expect(
        mockCaseFileRepositoryService.updateByIdAndCaseWithoutDocument,
      ).not.toHaveBeenCalled()
    })
  })

  describe('file was not pronounced orally', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(makeCase(), {
        ...pronouncedOrally,
        isPronouncedOrally: undefined,
      } as CaseFile)
    })

    it('should be rejected', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(
        mockCaseFileRepositoryService.updateByIdAndCaseWithoutDocument,
      ).not.toHaveBeenCalled()
    })
  })

  describe('key belongs to another case', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(makeCase(), pronouncedOrally, {
        key: `${uuid()}/${uuid()}/urskurdur.pdf`,
      })
    })

    it('should be rejected', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(
        mockCaseFileRepositoryService.updateByIdAndCaseWithoutDocument,
      ).not.toHaveBeenCalled()
    })
  })
})
