import { uuid } from 'uuidv4'
import { Transaction } from 'sequelize/types'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  CaseFileState,
  CaseState,
  indictmentCases,
  investigationCases,
  restrictionCases,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { UserService } from '../../../user'
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
  user: User,
  theCase: Case,
  caseToUpdate: UpdateCaseDto,
) => Promise<Then>

describe('CaseController - Update', () => {
  const userId = uuid()
  const user = { id: userId } as User
  const defendantId1 = uuid()
  const defendantId2 = uuid()
  const caseId = uuid()
  const policeCaseNumber = uuid()
  const courtCaseNumber = uuid()
  const policeCaseNumbers = [uuid(), policeCaseNumber, uuid()]
  const caseFileId = uuid()
  const caseFile = { id: caseFileId, caseId, policeCaseNumber }
  const theCase = {
    id: caseId,
    defendants: [{ id: defendantId1 }, { id: defendantId2 }],
    policeCaseNumbers,
    caseFiles: [caseFile],
    courtCaseNumber,
  } as Case

  let mockMessageService: MessageService
  let mockUserService: UserService
  let mockFileService: FileService
  let transaction: Transaction
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      messageService,
      userService,
      fileService,
      sequelize,
      caseModel,
      caseController,
    } = await createTestingCaseModule()

    mockMessageService = messageService
    mockUserService = userService
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
      user: User,
      theCase: Case,
      caseToUpdate: UpdateCaseDto,
    ) => {
      const then = {} as Then

      try {
        then.result = await caseController.update(
          caseId,
          user,
          theCase,
          caseToUpdate,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('case updated', () => {
    const caseToUpdate = { field1: uuid(), field2: uuid() } as UpdateCaseDto
    const updatedCase = {
      ...theCase,
      ...caseToUpdate,
    } as Case
    let then: Then

    beforeEach(async () => {
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(updatedCase)

      then = await givenWhenThen(caseId, user, theCase, caseToUpdate)
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

  describe('court case number added', () => {
    const caseToUpdate = {
      state: CaseState.RECEIVED,
      courtCaseNumber: 'R-2020-1234',
    } as UpdateCaseDto

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, caseToUpdate)
    })

    it('should transition the case from SUBMITTED to RECEIVED', () => {
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        {
          courtCaseNumber: caseToUpdate.courtCaseNumber,
          state: CaseState.RECEIVED,
        },
        { where: { id: caseId }, transaction },
      )
    })
  })

  describe('police case number removed', () => {
    const caseToUpdate = {
      policeCaseNumbers: [policeCaseNumbers[0], policeCaseNumbers[2]],
    } as UpdateCaseDto

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, caseToUpdate)
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
      await givenWhenThen(caseId, user, theCase, caseToUpdate)
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

        await givenWhenThen(caseId, user, theCase, caseToUpdate)
      })

      it('should post to queue', () => {
        expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
          {
            type: MessageType.DELIVER_REQUEST_TO_COURT,
            caseId,
          },
          {
            type: MessageType.DELIVER_PROSECUTOR_TO_COURT,
            caseId,
            userId: user.id,
          },
          {
            type: MessageType.DELIVER_DEFENDANT_TO_COURT,
            caseId,
            defendantId: defendantId1,
            userId: user.id,
          },
          {
            type: MessageType.DELIVER_DEFENDANT_TO_COURT,
            caseId,
            defendantId: defendantId2,
            userId: user.id,
          },
        ])
      })
    },
  )

  describe.each([...restrictionCases, ...investigationCases])(
    'defender email updated for %s case',
    (type) => {
      const defenderEmail = uuid()
      const caseToUpdate = { defenderEmail }
      const updatedCase = { ...theCase, type, defenderEmail }

      beforeEach(async () => {
        const mockFindOne = mockCaseModel.findOne as jest.Mock
        mockFindOne.mockResolvedValueOnce(updatedCase)

        await givenWhenThen(caseId, user, theCase, caseToUpdate)
      })

      it('should post to queue', () => {
        expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
          {
            type: MessageType.DELIVER_DEFENDANT_TO_COURT,
            caseId,
            defendantId: defendantId1,
            userId: user.id,
          },
          {
            type: MessageType.DELIVER_DEFENDANT_TO_COURT,
            caseId,
            defendantId: defendantId2,
            userId: user.id,
          },
        ])
      })
    },
  )

  describe('prosecutor updated for case', () => {
    const prosecutorId = uuid()
    const caseToUpdate = { prosecutorId }
    const updatedCase = { ...theCase, prosecutorId }

    beforeEach(async () => {
      const mockFindById = mockUserService.findById as jest.Mock
      mockFindById.mockResolvedValueOnce({
        id: prosecutorId,
        role: UserRole.PROSECUTOR,
      })
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(caseId, user, theCase, caseToUpdate)
    })

    it('should post to queue', () => {
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        {
          type: MessageType.DELIVER_PROSECUTOR_TO_COURT,
          caseId,
          userId: user.id,
        },
      ])
    })
  })

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
      const uncategorisedId = uuid()
      const updatedCase = {
        ...theCase,
        type,
        policeCaseNumbers: [policeCaseNumber1, policeCaseNumber2],
        caseFiles: [
          {
            id: coverLetterId,
            key: uuid(),
            state: CaseFileState.STORED_IN_RVG,
            category: CaseFileCategory.COVER_LETTER,
          },
          {
            id: indictmentId,
            key: uuid(),
            state: CaseFileState.STORED_IN_RVG,
            category: CaseFileCategory.INDICTMENT,
          },
          {
            id: criminalRecordId,
            key: uuid(),
            state: CaseFileState.STORED_IN_RVG,
            category: CaseFileCategory.CRIMINAL_RECORD,
          },
          {
            id: costBreakdownId,
            key: uuid(),
            state: CaseFileState.STORED_IN_RVG,
            category: CaseFileCategory.COST_BREAKDOWN,
          },
          {
            id: uncategorisedId,
            key: uuid(),
            state: CaseFileState.STORED_IN_RVG,
            category: CaseFileCategory.CASE_FILE,
          },
          {
            id: uuid(),
            key: uuid(),
            state: CaseFileState.STORED_IN_COURT,
            category: CaseFileCategory.CASE_FILE,
          },
        ],
        courtCaseNumber,
      }

      beforeEach(async () => {
        const mockFindOne = mockCaseModel.findOne as jest.Mock
        mockFindOne.mockResolvedValueOnce(updatedCase)

        await givenWhenThen(caseId, user, theCase, caseToUpdate)
      })

      it('should post to queue', () => {
        expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
          {
            type: MessageType.DELIVER_PROSECUTOR_TO_COURT,
            caseId,
            userId: user.id,
          },
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
          {
            type: MessageType.DELIVER_CASE_FILE_TO_COURT,
            caseId,
            caseFileId: uncategorisedId,
          },
        ])
      })
    },
  )

  describe('neither court case number nor defender email nor prosecutorId updated', () => {
    const caseToUpdate = { courtCaseNumber }

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, caseToUpdate)
    })

    it('should not post to queue', () => {
      expect(mockMessageService.sendMessageToQueue).not.toHaveBeenCalled()
    })
  })

  describe('validToDate is updated', () => {
    const caseToUdate = { validToDate: new Date() } as Case
    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, caseToUdate)
    })

    it('should post modified notification to queue', async () => {
      expect(mockMessageService.sendMessageToQueue).toHaveBeenCalledWith({
        type: MessageType.SEND_MODIFIED_NOTIFICATION,
        caseId,
        userId: user.id,
      })
    })
  })

  describe('isolationDate is updated', () => {
    const caseToUdate = { isolationToDate: new Date() } as Case
    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, caseToUdate)
    })

    it('should post modified notification to queue', async () => {
      expect(mockMessageService.sendMessageToQueue).toHaveBeenCalledWith({
        type: MessageType.SEND_MODIFIED_NOTIFICATION,
        caseId,
        userId: user.id,
      })
    })
  })

  describe('case modified explanation is updated', () => {
    const caseToUdate = { caseModifiedExplanation: 'some explanation' } as Case
    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, caseToUdate)
    })

    it('should post modified notification to queue', async () => {
      expect(mockMessageService.sendMessageToQueue).toHaveBeenCalledWith({
        type: MessageType.SEND_MODIFIED_NOTIFICATION,
        caseId,
        userId: user.id,
      })
    })
  })
})
