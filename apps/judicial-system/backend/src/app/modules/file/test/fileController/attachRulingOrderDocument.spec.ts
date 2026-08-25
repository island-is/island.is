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

import { Case, CaseFile } from '../../../repository'
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

  let mockFileModel: typeof CaseFile
  let queuedMessages: Message[]
  let transaction: Transaction
  let givenWhenThen: (
    theCase: Case,
    caseFile: CaseFile,
    attachDocument?: Partial<AttachRulingOrderDocumentDto>,
  ) => Promise<Then>

  beforeEach(async () => {
    const {
      fileModel,
      fileController,
      sequelize,
      queuedMessages: messages,
    } = await createTestingFileModule()

    mockFileModel = fileModel
    queuedMessages = messages

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (theCase, caseFile, attachDocument) => {
      const then = {} as Then

      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1, [{ ...caseFile, key }]])

      await fileController
        .attachRulingOrderDocument(caseId, fileId, user, theCase, caseFile, {
          type: 'application/pdf',
          key,
          size: 1234,
          ...attachDocument,
        } as AttachRulingOrderDocumentDto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

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

    it('should fill in the document, keeping the pronounced name', () => {
      expect(mockFileModel.update).toHaveBeenCalledWith(
        {
          key,
          size: 1234,
          type: 'application/pdf',
          name: 'urskurdur.pdf',
        },
        { where: { id: fileId, caseId }, returning: true, transaction },
      )
    })

    it('should deliver the ruling to the police and the court', () => {
      expect(queuedMessages).toEqual([
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
      expect(mockFileModel.update).toHaveBeenCalledWith(
        expect.objectContaining({
          userGeneratedFilename: 'S-123/2026 Úrskurður um frávísun',
        }),
        expect.any(Object),
      )
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
      expect(mockFileModel.update).not.toHaveBeenCalled()
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
      expect(mockFileModel.update).not.toHaveBeenCalled()
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
      expect(mockFileModel.update).not.toHaveBeenCalled()
    })
  })
})
