import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  CaseFileState,
  CaseOrigin,
  indictmentCases,
  investigationCases,
  restrictionCases,
  User,
} from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { randomDate } from '../../../../test'
import { Case, CaseFile } from '../../../repository'
import { CreateFileDto } from '../../dto/createFile.dto'

interface Then {
  result: CaseFile
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  createCaseFile: CreateFileDto,
  theCase: Case,
) => Promise<Then>

describe('FileController - Create case file', () => {
  const user = { id: uuid() } as User

  let mockMessageService: MessageService
  let mockFileModel: typeof CaseFile
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { sequelize, messageService, fileModel, fileController } =
      await createTestingFileModule()

    mockMessageService = messageService
    mockFileModel = fileModel

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (
      caseId: string,
      createCaseFile: CreateFileDto,
      theCase: Case,
    ): Promise<Then> => {
      const then = {} as Then

      await fileController
        .createCaseFile(caseId, user, theCase, createCaseFile)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'case file created for %s case',
    (type) => {
      const caseId = uuid()
      const theCase = { id: caseId, type, appealCaseNumber: uuid() } as Case
      const uuId = uuid()
      const createCaseFile: CreateFileDto = {
        type: 'text/plain',
        key: `${caseId}/${uuId}/test.txt`,
        size: 99,
        category: CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
      }
      const fileId = uuid()
      const timeStamp = randomDate()
      const caseFile = {
        type: 'text/plain',
        key: `${caseId}/${uuId}/test.txt`,
        size: 99,
        category: CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
        id: fileId,
        created: timeStamp,
        modified: timeStamp,
      }
      let then: Then

      beforeEach(async () => {
        const mockCreate = mockFileModel.create as jest.Mock
        mockCreate.mockResolvedValueOnce(caseFile)

        then = await givenWhenThen(caseId, createCaseFile, theCase)
      })

      it('should create a case file', () => {
        expect(mockFileModel.create).toHaveBeenCalledWith(
          {
            type: 'text/plain',
            state: CaseFileState.STORED_IN_RVG,
            key: `${caseId}/${uuId}/test.txt`,
            size: 99,
            category: CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
            caseId,
            name: 'test.txt',
            userGeneratedFilename: 'test.txt',
          },
          { transaction },
        )
        expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
          {
            type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_CASE_FILE,
            user,
            caseId,
            elementId: fileId,
          },
        ])
        expect(then.result).toBe(caseFile)
      })
    },
  )

  describe.each(indictmentCases)('case file created for %s case', (type) => {
    const caseId = uuid()
    const theCase = { id: caseId, type } as Case
    const uuId = uuid()
    const createCaseFile: CreateFileDto = {
      type: 'text/plain',
      key: `${caseId}/${uuId}/test.txt`,
      size: 99,
    }
    const fileId = uuid()
    const timeStamp = randomDate()
    const caseFile = {
      type: 'text/plain',
      key: `${caseId}/${uuId}/test.txt`,
      size: 99,
      id: fileId,
      created: timeStamp,
      modified: timeStamp,
    }
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockFileModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(caseFile)

      then = await givenWhenThen(caseId, createCaseFile, theCase)
    })

    it('should create a case file', () => {
      expect(mockFileModel.create).toHaveBeenCalledWith(
        {
          type: 'text/plain',
          state: CaseFileState.STORED_IN_RVG,
          key: `${caseId}/${uuId}/test.txt`,
          size: 99,
          caseId,
          name: 'test.txt',
          userGeneratedFilename: 'test.txt',
        },
        { transaction },
      )
      expect(then.result).toBe(caseFile)
    })
  })

  describe.each(indictmentCases)(
    'additional case file created for %s case',
    (type) => {
      const caseId = uuid()
      const theCase = {
        id: caseId,
        type,
        origin: CaseOrigin.LOKE,
        courtCaseNumber: uuid(),
      } as Case
      const uuId = uuid()
      const createCaseFile: CreateFileDto = {
        type: 'text/plain',
        category: CaseFileCategory.PROSECUTOR_CASE_FILE,
        key: `${caseId}/${uuId}/test.txt`,
        size: 99,
      }
      const fileId = uuid()
      const timeStamp = randomDate()
      const caseFile = {
        type: 'text/plain',
        category: CaseFileCategory.PROSECUTOR_CASE_FILE,
        key: `${caseId}/${uuId}/test.txt`,
        size: 99,
        id: fileId,
        created: timeStamp,
        modified: timeStamp,
      }

      beforeEach(async () => {
        const mockCreate = mockFileModel.create as jest.Mock
        mockCreate.mockResolvedValueOnce(caseFile)

        await givenWhenThen(caseId, createCaseFile, theCase)
      })

      it('should deliver the file to court and police', () => {
        expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
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
    },
  )

  describe('malformed key', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const uuId = `-${uuid()}`
    const createCaseFile: CreateFileDto = {
      type: 'text/plain',
      key: `${caseId}/${uuId}/test.txt`,
      size: 99,
    }
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, createCaseFile, theCase)
    })

    it('should throw bad gateway exception', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        `${caseId}/${uuId}/test.txt is not a valid key for case ${caseId}`,
      )
    })
  })

  describe('database insert fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const uuId = uuid()
    const createCaseFile: CreateFileDto = {
      type: 'text/plain',
      key: `${caseId}/${uuId}/test.txt`,
      size: 99,
    }
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockFileModel.create as jest.Mock
      mockCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, createCaseFile, theCase)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
