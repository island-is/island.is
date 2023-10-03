import { uuid } from 'uuidv4'

import { BadRequestException } from '@nestjs/common'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { AwsS3Service } from '../../../aws-s3'
import { Case } from '../../models/case.model'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  policeCaseNumber: string,
  policeCaseNumbers: string[],
) => Promise<Then>

describe('InternalCaseController - Archive case files record', () => {
  const caseId = uuid()
  const policeCaseNumber = uuid()

  let mockawsS3Service: AwsS3Service
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, internalCaseController } =
      await createTestingCaseModule()

    mockawsS3Service = awsS3Service
    const mockCopyObject = mockawsS3Service.copyObject as jest.Mock
    mockCopyObject.mockRejectedValue(new Error('Some error'))
    const mockDeleteObject = mockawsS3Service.deleteObject as jest.Mock
    mockDeleteObject.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (
      policeCaseNumber: string,
      policeCaseNumbers: string[],
    ) => {
      const then = {} as Then

      await internalCaseController
        .archiveCaseFilesRecord(caseId, policeCaseNumber, {
          id: caseId,
          policeCaseNumbers,
        } as Case)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('case files record archived', () => {
    let then: Then

    beforeEach(async () => {
      const mockCopyObject = mockawsS3Service.copyObject as jest.Mock
      mockCopyObject.mockResolvedValueOnce(uuid())

      then = await givenWhenThen(policeCaseNumber, [
        uuid(),
        policeCaseNumber,
        uuid(),
      ])
    })

    it('should copy the case files record to the AWS S3 indictment completed folder', () => {
      expect(mockawsS3Service.copyObject).toHaveBeenCalledWith(
        `indictments/${caseId}/${policeCaseNumber}/caseFilesRecord.pdf`,
        `indictments/completed/${caseId}/${policeCaseNumber}/caseFilesRecord.pdf`,
      )
    })

    it('should delete the case files record from the AWS S3 indictment folder', () => {
      expect(mockawsS3Service.deleteObject).toHaveBeenCalledWith(
        `indictments/${caseId}/${policeCaseNumber}/caseFilesRecord.pdf`,
      )
    })

    it('should return a success response', () => {
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('police case number not in case', () => {
    const policeCaseNumber = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(policeCaseNumber, [uuid(), uuid()])
    })

    it('should return BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toEqual(
        `Case ${caseId} does not include police case number ${policeCaseNumber}`,
      )
    })
  })
})
