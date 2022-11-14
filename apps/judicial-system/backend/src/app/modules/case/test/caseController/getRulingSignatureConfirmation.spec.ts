import { uuid } from 'uuidv4'

import { ForbiddenException } from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'
import { MessageType, MessageService } from '@island.is/judicial-system/message'

import { Case } from '../../models/case.model'
import { SignatureConfirmationResponse } from '../../models/signatureConfirmation.response'
import { createTestingCaseModule } from '../createTestingCaseModule'
import { randomDate } from '../../../../test'
import { AwsS3Service } from '../../../aws-s3'

interface Then {
  result: SignatureConfirmationResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  theCase: Case,
  documentToken: string,
) => Promise<Then>

describe('CaseController - Get ruling signature confirmation', () => {
  let mockMessageService: MessageService
  let mockAwsS3Service: AwsS3Service
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      messageService,
      awsS3Service,
      caseModel,
      caseController,
    } = await createTestingCaseModule()

    mockCaseModel = caseModel
    mockMessageService = messageService
    mockAwsS3Service = awsS3Service

    const mockPostMessageToQueue = mockMessageService.sendMessagesToQueue as jest.Mock
    mockPostMessageToQueue.mockResolvedValue(undefined)
    const mockPutObject = mockAwsS3Service.putObject as jest.Mock
    mockPutObject.mockResolvedValue(uuid())

    givenWhenThen = async (
      caseId: string,
      user: User,
      theCase: Case,
      documentToken: string,
    ) => {
      const then = {} as Then

      try {
        then.result = await caseController.getRulingSignatureConfirmation(
          caseId,
          user,
          theCase,
          documentToken,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('database update', () => {
    const userId = uuid()
    const user = { id: userId } as User
    const caseId = uuid()
    const theCase = { id: caseId, judgeId: userId } as Case
    const documentToken = uuid()

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, documentToken)
    })

    it('should set the ruling date', () => {
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        { rulingDate: expect.any(Date) },
        { where: { id: caseId } },
      )
    })
  })

  describe('successful completion', () => {
    const userId = uuid()
    const user = { id: userId } as User
    const caseId = uuid()
    const theCase = { id: caseId, judgeId: userId } as Case
    const documentToken = uuid()
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCaseModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1, [theCase]])

      then = await givenWhenThen(caseId, user, theCase, documentToken)
    })

    it('should return success', () => {
      expect(then.result).toEqual({ documentSigned: true })
      expect(mockAwsS3Service.putObject).toHaveBeenCalled()
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        { type: MessageType.CASE_COMPLETED, caseId },
        { type: MessageType.DELIVER_COURT_RECORD_TO_COURT, caseId },
        { type: MessageType.DELIVER_SIGNED_RULING_TO_COURT, caseId },
        { type: MessageType.SEND_RULING_NOTIFICATION, caseId },
      ])
    })
  })

  describe('user is not the assigned judge', () => {
    const user = { id: uuid() } as User
    const caseId = uuid()
    const theCase = { id: caseId, judgeId: uuid() } as Case
    const documentToken = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, user, theCase, documentToken)
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toBe(
        'A ruling must be signed by the assigned judge',
      )
    })
  })

  describe('database update fails', () => {
    const userId = uuid()
    const user = { id: userId } as User
    const caseId = uuid()
    const theCase = {
      id: caseId,
      judgeId: userId,
      policeCaseNumbers: ['007-2022-1'],
    } as Case
    const documentToken = uuid()
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCaseModel.update as jest.Mock
      mockUpdate.mockRejectedValueOnce(new Error('Some error'))
      then = await givenWhenThen(caseId, user, theCase, documentToken)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('database update for modified ruling', () => {
    const caseId = uuid()
    const userId = uuid()
    const judge = {
      id: userId,
      name: 'Judge Judgesen',
      title: 'Héraðrsdómari',
    } as User
    const theCase = ({
      id: caseId,
      judgeId: userId,
      rulingDate: randomDate(),
      judge: judge,
    } as unknown) as Case
    const documentToken = uuid()

    beforeEach(async () => {
      await givenWhenThen(caseId, judge, theCase, documentToken)
    })

    it('should set the ruling date and ruling modified history', () => {
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        {
          rulingDate: expect.any(Date),
          rulingModifiedHistory: expect.any(String),
        },
        { where: { id: caseId } },
      )
    })
  })

  describe('AWS S3 upload failed', () => {
    const userId = uuid()
    const user = { id: userId } as User
    const caseId = uuid()
    const theCase = {
      id: caseId,
      judgeId: userId,
      policeCaseNumbers: ['007-2022-1'],
    } as Case
    const documentToken = uuid()
    let then: Then

    beforeEach(async () => {
      const mockPutObject = mockAwsS3Service.putObject as jest.Mock
      mockPutObject.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, user, theCase, documentToken)
    })

    it('should fail and return that the document was not signed', () => {
      expect(then.result.documentSigned).toBe(false)
      expect(then.result.message).toBeTruthy()
      expect(then.result.code).toBeUndefined()

      expect(mockCaseModel.update).not.toHaveBeenCalled()
      expect(mockMessageService.sendMessagesToQueue).not.toHaveBeenCalled()
    })
  })
})
