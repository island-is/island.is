import { Transaction } from 'sequelize/types'
import { uuid } from 'uuidv4'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  CaseFileState,
  CaseNotificationType,
  CaseOrigin,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { randomDate } from '../../../../test'
import { AwsS3Service } from '../../../aws-s3'
import { Case } from '../../../repository'
import { SignatureConfirmationResponse } from '../../models/signatureConfirmation.response'

jest.mock('../../../../factories')

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
  const date = randomDate()
  const userId = uuid()
  const user = { id: userId } as User

  let mockMessageService: MessageService
  let mockAwsS3Service: AwsS3Service
  let transaction: Transaction
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      messageService,
      awsS3Service,
      sequelize,
      caseModel,
      caseController,
    } = await createTestingCaseModule()

    mockCaseModel = caseModel
    mockMessageService = messageService
    mockAwsS3Service = awsS3Service

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValueOnce(date)
    const mockPutGeneratedObject =
      mockAwsS3Service.putGeneratedRequestCaseObject as jest.Mock
    mockPutGeneratedObject.mockResolvedValue(uuid())
    const mockUpdate = mockCaseModel.update as jest.Mock
    mockUpdate.mockResolvedValue([1])
    const mockPostMessageToQueue =
      mockMessageService.sendMessagesToQueue as jest.Mock
    mockPostMessageToQueue.mockResolvedValue(undefined)

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

  describe('successful completion', () => {
    const caseFileId = uuid()
    const caseId = uuid()
    const theCase = {
      id: caseId,
      caseFiles: [
        {
          id: caseFileId,
          key: uuid(),
          state: CaseFileState.STORED_IN_RVG,
        },
        {
          id: uuid(),
          key: uuid(),
          state: CaseFileState.STORED_IN_COURT,
        },
      ],
      judgeId: userId,
    } as Case
    const documentToken = uuid()
    let then: Then

    beforeEach(async () => {
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(theCase)

      then = await givenWhenThen(caseId, user, theCase, documentToken)
    })

    it('should return success', () => {
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        { rulingSignatureDate: date },
        { where: { id: caseId }, transaction },
      )
      expect(mockAwsS3Service.putGeneratedRequestCaseObject).toHaveBeenCalled()
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        { type: MessageType.DELIVERY_TO_COURT_SIGNED_RULING, user, caseId },
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: { type: CaseNotificationType.RULING },
        },
      ])
      expect(then.result).toEqual({ documentSigned: true })
    })
  })

  describe('successful completion of LÖKE case', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      judgeId: userId,
    } as Case
    const documentToken = uuid()
    let then: Then

    beforeEach(async () => {
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(theCase)

      then = await givenWhenThen(caseId, user, theCase, documentToken)
    })

    it('should set the ruling signature date', () => {
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        { rulingSignatureDate: date },
        { where: { id: caseId }, transaction },
      )
      expect(mockAwsS3Service.putGeneratedRequestCaseObject).toHaveBeenCalled()
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        { type: MessageType.DELIVERY_TO_COURT_SIGNED_RULING, user, caseId },
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: { type: CaseNotificationType.RULING },
        },
        { type: MessageType.DELIVERY_TO_POLICE_SIGNED_RULING, user, caseId },
      ])
      expect(then.result).toEqual({ documentSigned: true })
    })
  })

  describe('successful completion of extended LÖKE case', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      judgeId: userId,
      parentCaseId: uuid(),
    } as Case
    const documentToken = uuid()

    beforeEach(async () => {
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(theCase)

      await givenWhenThen(caseId, user, theCase, documentToken)
    })

    it('should return success', () => {
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        { type: MessageType.DELIVERY_TO_COURT_SIGNED_RULING, user, caseId },
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: { type: CaseNotificationType.RULING },
        },
        { type: MessageType.DELIVERY_TO_POLICE_SIGNED_RULING, user, caseId },
      ])
    })
  })
  describe('database update fails', () => {
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

  describe('AWS S3 upload failed', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      judgeId: userId,
      policeCaseNumbers: ['007-2022-1'],
    } as Case
    const documentToken = uuid()
    let then: Then

    beforeEach(async () => {
      const mockPutGeneratedObject =
        mockAwsS3Service.putGeneratedRequestCaseObject as jest.Mock
      mockPutGeneratedObject.mockRejectedValueOnce(new Error('Some error'))

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
