import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { Message, MessageType } from '@island.is/judicial-system/message'
import {
  CaseOrigin,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { AwsS3Service } from '../../../aws-s3'
import { Case, CaseRepositoryService } from '../../../repository'
import { SignatureConfirmationResponse } from '../../models/signatureConfirmation.response'

interface Then {
  result: SignatureConfirmationResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  theCase: Case,
  documentToken: string,
  method?: 'audkenni' | 'mobile',
) => Promise<Then>

describe('CaseController - Get court record signature confirmation', () => {
  let mockQueuedMessages: Message[]
  let mockAwsS3Service: AwsS3Service
  let transaction: Transaction
  let mockCaseRepositoryService: CaseRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      queuedMessages,
      awsS3Service,
      sequelize,
      caseRepositoryService,
      caseController,
    } = await createTestingCaseModule()

    mockQueuedMessages = queuedMessages
    mockAwsS3Service = awsS3Service
    mockCaseRepositoryService = caseRepositoryService

    const mockPutGeneratedObject =
      mockAwsS3Service.putGeneratedRequestCaseObject as jest.Mock
    mockPutGeneratedObject.mockRejectedValue(new Error('Some error'))
    const mockUpdate = mockCaseRepositoryService.update as jest.Mock
    mockUpdate.mockRejectedValue(new Error('Some error'))
    const mockFindLiveById = mockCaseRepositoryService.findLiveById as jest.Mock
    mockFindLiveById.mockRejectedValue(new Error('Some error'))

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (
      caseId: string,
      user: User,
      theCase: Case,
      documentToken: string,
      method?: 'audkenni' | 'mobile',
    ) => {
      const then = {} as Then

      try {
        then.result = await caseController.getCourtRecordSignatureConfirmation(
          caseId,
          user,
          theCase,
          documentToken,
          method,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('confirm signature', () => {
    const userId = uuid()
    const user = {
      id: userId,
      role: UserRole.DISTRICT_COURT_REGISTRAR,
      institution: { type: InstitutionType.DISTRICT_COURT },
    } as User
    const caseId = uuid()
    const theCase = {
      id: caseId,
      policeCaseNumbers: [uuid()],
      judgeId: uuid(),
      registrarId: uuid(),
    } as Case
    const documentToken = uuid()

    beforeEach(() => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(theCase)
    })

    describe('successful completion', () => {
      let then: Then

      beforeEach(async () => {
        const mockPutGeneratedObject =
          mockAwsS3Service.putGeneratedRequestCaseObject as jest.Mock
        mockPutGeneratedObject.mockResolvedValueOnce(Promise.resolve())
        const mockUpdate = mockCaseRepositoryService.update as jest.Mock
        mockUpdate.mockResolvedValueOnce(theCase)
        const mockFindLiveById =
          mockCaseRepositoryService.findLiveById as jest.Mock
        mockFindLiveById.mockResolvedValueOnce(theCase)

        then = await givenWhenThen(caseId, user, theCase, documentToken)
      })

      it('should return success after setting the court record signatory and signature date', () => {
        expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
          caseId,
          {
            courtRecordSignatoryId: userId,
            courtRecordSignatureDate: expect.any(Date),
          },
          { transaction },
        )
        expect(then.result).toEqual({
          documentSigned: true,
        })
      })

      it('should queue the signed court record for the court', () => {
        expect(mockQueuedMessages).toEqual([
          {
            type: MessageType.DELIVERY_TO_COURT_SIGNED_COURT_RECORD,
            user,
            caseId,
          },
        ])
      })
    })

    describe('successful completion of LÖKE case', () => {
      const givenSignedLokeCase = async (type: CaseType) => {
        const lokeCase = { ...theCase, origin: CaseOrigin.LOKE, type } as Case

        const mockPutGeneratedObject =
          mockAwsS3Service.putGeneratedRequestCaseObject as jest.Mock
        mockPutGeneratedObject.mockResolvedValueOnce(Promise.resolve())
        const mockUpdate = mockCaseRepositoryService.update as jest.Mock
        mockUpdate.mockResolvedValueOnce(lokeCase)
        const mockFindLiveById =
          mockCaseRepositoryService.findLiveById as jest.Mock
        mockFindLiveById.mockResolvedValueOnce(lokeCase)

        await givenWhenThen(caseId, user, lokeCase, documentToken)
      }

      describe('investigation case', () => {
        beforeEach(() => givenSignedLokeCase(CaseType.SEARCH_WARRANT))

        it('should queue the signed court record for the police as well', () => {
          expect(mockQueuedMessages).toEqual([
            {
              type: MessageType.DELIVERY_TO_POLICE_SIGNED_COURT_RECORD,
              user,
              caseId,
            },
            {
              type: MessageType.DELIVERY_TO_COURT_SIGNED_COURT_RECORD,
              user,
              caseId,
            },
          ])
        })
      })

      describe('restriction case', () => {
        beforeEach(() => givenSignedLokeCase(CaseType.CUSTODY))

        it('should queue the signed court record for the court only', () => {
          expect(mockQueuedMessages).toEqual([
            {
              type: MessageType.DELIVERY_TO_COURT_SIGNED_COURT_RECORD,
              user,
              caseId,
            },
          ])
        })
      })
    })

    describe('AWS S3 upload fails', () => {
      let then: Then

      beforeEach(async () => {
        then = await givenWhenThen(caseId, user, theCase, documentToken)
      })

      it('return failure', () => {
        expect(then.result).toEqual({
          documentSigned: false,
          message: 'Failed to upload to S3',
        })
      })
    })

    describe('database update fails', () => {
      let then: Then

      beforeEach(async () => {
        const mockPutGeneratedObject =
          mockAwsS3Service.putGeneratedRequestCaseObject as jest.Mock
        mockPutGeneratedObject.mockResolvedValueOnce(Promise.resolve())

        then = await givenWhenThen(caseId, user, theCase, documentToken)
      })

      it('should throw Error', () => {
        expect(then.error).toBeInstanceOf(Error)
        expect(then.error.message).toBe('Some error')
      })
    })
  })
})
