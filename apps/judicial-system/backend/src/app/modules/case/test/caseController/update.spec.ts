import { uuid } from 'uuidv4'
import { Transaction } from 'sequelize/types'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { FileService } from '../../../file'
import { UpdateCaseDto } from '../../dto/updateCase.dto'
import { Case } from '../../models/case.model'
import { createTestingCaseModule } from '../createTestingCaseModule'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  caseToUpdate: UpdateCaseDto,
) => Promise<Then>

describe('CaseController - Update', () => {
  const caseId = uuid()
  const policeCaseNumber = uuid()
  const courtCaseNumber = uuid()
  const policeCaseNumbers = [uuid(), policeCaseNumber, uuid()]
  const caseFileId = uuid()
  const caseFile = { id: caseFileId, caseId, policeCaseNumber }
  const theCase = {
    id: caseId,
    policeCaseNumbers,
    caseFiles: [caseFile],
    courtCaseNumber,
  } as Case

  let mockMessageService: MessageService
  let mockFileService: FileService
  let transaction: Transaction
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      messageService,
      fileService,
      sequelize,
      caseModel,
      caseController,
    } = await createTestingCaseModule()

    mockMessageService = messageService
    mockFileService = fileService
    mockCaseModel = caseModel

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockUpdate = mockCaseModel.update as jest.Mock
    mockUpdate.mockResolvedValue([1])
    const mockFindOne = mockCaseModel.findOne as jest.Mock
    mockFindOne.mockResolvedValue(theCase)

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      caseToUpdate: UpdateCaseDto,
    ) => {
      const then = {} as Then

      try {
        then.result = await caseController.update(caseId, theCase, caseToUpdate)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('case updated', () => {
    const caseToUpdate = { field1: uuid(), field2: uuid() } as UpdateCaseDto
    const updatedCase = { ...theCase, ...caseToUpdate } as Case
    let then: Then

    beforeEach(async () => {
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(updatedCase)

      then = await givenWhenThen(caseId, theCase, caseToUpdate)
    })

    it('should update the case', () => {
      expect(mockCaseModel.update).toHaveBeenCalledWith(caseToUpdate, {
        where: { id: caseId },
        transaction,
      })
    })

    it('should return the updated case', () => {
      expect(then.result).toEqual(updatedCase)
    })
  })

  describe('police case number removed', () => {
    const caseToUpdate = {
      policeCaseNumbers: [policeCaseNumbers[0], policeCaseNumbers[2]],
    } as UpdateCaseDto

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, caseToUpdate)
    })

    it('should delete a case file', () => {
      expect(mockFileService.deleteCaseFile).toHaveBeenCalledWith(
        caseFile,
        transaction,
      )
    })
  })

  describe('police case number changed', () => {
    const newPoliceCaseNumber = uuid()
    const caseToUpdate = {
      policeCaseNumbers: [
        policeCaseNumbers[0],
        newPoliceCaseNumber,
        policeCaseNumbers[2],
      ],
    } as UpdateCaseDto

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, caseToUpdate)
    })

    it('should update a case file', () => {
      expect(mockFileService.updateCaseFile).toHaveBeenCalledWith(
        caseId,
        caseFileId,
        { policeCaseNumber: newPoliceCaseNumber },
        transaction,
      )
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'court case number updated for %s case',
    (type) => {
      const courtCaseNumber = uuid()
      const caseToUpdate = { courtCaseNumber }
      const updatedCase = { ...theCase, type, courtCaseNumber }

      beforeEach(async () => {
        const mockFindOne = mockCaseModel.findOne as jest.Mock
        mockFindOne.mockResolvedValueOnce(updatedCase)

        await givenWhenThen(caseId, theCase, caseToUpdate)
      })

      it('should post to queue', () => {
        expect(mockMessageService.sendMessageToQueue).toHaveBeenCalledWith({
          type: MessageType.DELIVER_REQUEST_TO_COURT,
          caseId,
        })
      })
    },
  )

  describe.each(indictmentCases)(
    'court case number updated for %s case',
    (type) => {
      const courtCaseNumber = uuid()
      const caseToUpdate = { courtCaseNumber }
      const policeCaseNumber1 = uuid()
      const policeCaseNumber2 = uuid()
      const coverLetterId = uuid()
      const indictmentId = uuid()
      const criminalRecordId = uuid()
      const costBreakdownId = uuid()
      const updatedCase = {
        ...theCase,
        type,
        policeCaseNumbers: [policeCaseNumber1, policeCaseNumber2],
        caseFiles: [
          { id: coverLetterId, category: CaseFileCategory.COVER_LETTER },
          { id: indictmentId, category: CaseFileCategory.INDICTMENT },
          { id: criminalRecordId, category: CaseFileCategory.CRIMINAL_RECORD },
          { id: costBreakdownId, category: CaseFileCategory.COST_BREAKDOWN },
        ],
        courtCaseNumber,
      }

      beforeEach(async () => {
        const mockFindOne = mockCaseModel.findOne as jest.Mock
        mockFindOne.mockResolvedValueOnce(updatedCase)

        await givenWhenThen(caseId, theCase, caseToUpdate)
      })

      it('should post to queue', () => {
        expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
          {
            type: MessageType.DELIVER_CASE_FILES_RECORD_TO_COURT,
            caseId,
            policeCaseNumber: policeCaseNumber1,
          },
          {
            type: MessageType.DELIVER_CASE_FILES_RECORD_TO_COURT,
            caseId,
            policeCaseNumber: policeCaseNumber2,
          },
          {
            type: MessageType.DELIVER_CASE_FILE_TO_COURT,
            caseId,
            caseFileId: coverLetterId,
          },
          {
            type: MessageType.DELIVER_CASE_FILE_TO_COURT,
            caseId,
            caseFileId: indictmentId,
          },
          {
            type: MessageType.DELIVER_CASE_FILE_TO_COURT,
            caseId,
            caseFileId: criminalRecordId,
          },
          {
            type: MessageType.DELIVER_CASE_FILE_TO_COURT,
            caseId,
            caseFileId: costBreakdownId,
          },
        ])
      })
    },
  )

  describe('court case number not updated', () => {
    const caseToUpdate = { courtCaseNumber }

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, caseToUpdate)
    })

    it('should not post to queue', () => {
      expect(mockMessageService.sendMessageToQueue).not.toHaveBeenCalled()
    })
  })
})
