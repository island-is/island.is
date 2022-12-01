import { uuid } from 'uuidv4'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import { CaseFileCategory, CaseType } from '@island.is/judicial-system/types'

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
  const courtCaseNumber = uuid()
  const theCase = { id: caseId, courtCaseNumber } as Case

  let mockMessageService: MessageService
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      messageService,
      caseModel,
      caseController,
    } = await createTestingCaseModule()

    mockMessageService = messageService
    mockCaseModel = caseModel

    const mockUpdate = mockCaseModel.update as jest.Mock
    mockUpdate.mockResolvedValue([1])

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
      })
    })

    it('should return the updated case', () => {
      expect(then.result).toEqual(updatedCase)
    })
  })

  describe('court case number updated', () => {
    const courtCaseNumber = uuid()
    const caseToUpdate = { courtCaseNumber }
    const updatedCase = { ...theCase, courtCaseNumber }

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
  })

  describe('court case number updated for indictment', () => {
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
      type: CaseType.INDICTMENT,
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
  })

  describe('court case number not updated', () => {
    const caseToUpdate = { courtCaseNumber }
    const updatedCase = { ...theCase, courtCaseNumber }

    beforeEach(async () => {
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(caseId, theCase, caseToUpdate)
    })

    it('should not post to queue', () => {
      expect(mockMessageService.sendMessageToQueue).not.toHaveBeenCalled()
    })
  })
})
