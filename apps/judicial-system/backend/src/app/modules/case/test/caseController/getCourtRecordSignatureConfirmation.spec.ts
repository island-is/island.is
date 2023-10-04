import each from 'jest-each'
import { Transaction } from 'sequelize/types'
import { uuid } from 'uuidv4'

import { ForbiddenException } from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { AwsS3Service } from '../../../aws-s3'
import { Case } from '../../models/case.model'
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
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, sequelize, caseModel, caseController } =
      await createTestingCaseModule()

    mockAwsS3Service = awsS3Service
    mockCaseModel = caseModel

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

  each`
    assignedRole
    ${'judgeId'}
    ${'registrarId'}
  `.describe('given an assigned role', ({ assignedRole }) => {
    const userId = uuid()
    const role = assignedRole === 'judgeId' ? 'JUDGE' : 'REGISTRAR'
    const user = { id: userId, role: role } as User
    const caseId = uuid()
    const theCase = {
      id: caseId,
      policeCaseNumbers: [uuid()],
      judgeId: uuid(),
      registrarId: uuid(),
    } as Case
    ;(theCase as unknown as { [key: string]: string })[assignedRole] = userId
    const documentToken = uuid()

    beforeEach(() => {
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(theCase)
    })

    describe('successful completion', () => {
      let then: Then

      beforeEach(async () => {
        const mockPutObject = mockAwsS3Service.putObject as jest.Mock
        mockPutObject.mockResolvedValueOnce(Promise.resolve())
        const mockUpdate = mockCaseModel.update as jest.Mock
        mockUpdate.mockResolvedValueOnce([1, [theCase]])

        then = await givenWhenThen(caseId, user, theCase, documentToken)
      })

      it('should set the court record signatory and signature date', () => {
        expect(mockCaseModel.update).toHaveBeenCalledWith(
          {
            courtRecordSignatoryId: userId,
            courtRecordSignatureDate: expect.any(Date),
          },
          { where: { id: caseId }, transaction },
        )
      })

      it('should return success', () => {
        expect(then.result).toEqual({
          documentSigned: true,
        })
      })
    })

    describe('AWS S3 upload fails', () => {
      let then: Then

      beforeEach(async () => {
        const mockPutObject = mockAwsS3Service.putObject as jest.Mock
        mockPutObject.mockRejectedValueOnce(new Error('Some error'))

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
        const mockPutObject = mockAwsS3Service.putObject as jest.Mock
        mockPutObject.mockResolvedValueOnce(Promise.resolve())
        const mockUpdate = mockCaseModel.update as jest.Mock
        mockUpdate.mockRejectedValueOnce(new Error('Some error'))

        then = await givenWhenThen(caseId, user, theCase, documentToken)
      })

      it('should throw Error', () => {
        expect(then.error).toBeInstanceOf(Error)
        expect(then.error.message).toBe('Some error')
      })
    })
  })

  describe('user is not the assigned judge or registrar', () => {
    const user = { id: uuid() } as User
    const caseId = uuid()
    const theCase = { id: caseId, judgeId: uuid(), registrarId: uuid() } as Case
    const documentToken = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, user, theCase, documentToken)
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toBe(
        'A court record must be a judge or a registrar',
      )
    })
  })
})
