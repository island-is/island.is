import { Transaction } from 'sequelize'
import { uuid } from 'uuidv4'

import {
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
) => Promise<Then>

describe('CaseController - Get court record signature confirmation', () => {
  let mockAwsS3Service: AwsS3Service
  let transaction: Transaction
  let mockCaseRepositoryService: CaseRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, sequelize, caseRepositoryService, caseController } =
      await createTestingCaseModule()

    mockAwsS3Service = awsS3Service
    mockCaseRepositoryService = caseRepositoryService

    const mockPutGeneratedObject =
      mockAwsS3Service.putGeneratedRequestCaseObject as jest.Mock
    mockPutGeneratedObject.mockRejectedValue(new Error('Some error'))
    const mockUpdate = mockCaseRepositoryService.update as jest.Mock
    mockUpdate.mockRejectedValue(new Error('Some error'))
    const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
    mockFindOne.mockRejectedValue(new Error('Some error'))

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
    ) => {
      const then = {} as Then

      try {
        then.result = await caseController.getCourtRecordSignatureConfirmation(
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
      const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(theCase)
    })

    describe('successful completion', () => {
      let then: Then

      beforeEach(async () => {
        const mockPutGeneratedObject =
          mockAwsS3Service.putGeneratedRequestCaseObject as jest.Mock
        mockPutGeneratedObject.mockResolvedValueOnce(Promise.resolve())
        const mockUpdate = mockCaseRepositoryService.update as jest.Mock
        mockUpdate.mockResolvedValueOnce(theCase)
        const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
        mockFindOne.mockResolvedValueOnce(theCase)

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
