import { uuid } from 'uuidv4'

import { BadRequestException } from '@nestjs/common'

import { CaseState, CaseType } from '@island.is/judicial-system/types'

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
  const caseType = CaseType.INDICTMENT
  const caseState = CaseState.COMPLETED
  const policeCaseNumber = uuid()

  let mockawsS3Service: AwsS3Service
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, internalCaseController } =
      await createTestingCaseModule()

    mockawsS3Service = awsS3Service
    const mockArchiveObject = mockawsS3Service.archiveObject as jest.Mock
    mockArchiveObject.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (
      policeCaseNumber: string,
      policeCaseNumbers: string[],
    ) => {
      const then = {} as Then

      await internalCaseController
        .archiveCaseFilesRecord(caseId, policeCaseNumber, {
          id: caseId,
          type: caseType,
          state: caseState,
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
      const mockArchiveObject = mockawsS3Service.archiveObject as jest.Mock
      mockArchiveObject.mockResolvedValueOnce(uuid())

      then = await givenWhenThen(policeCaseNumber, [
        uuid(),
        policeCaseNumber,
        uuid(),
      ])
    })

    it('should archive the case files record', () => {
      expect(mockawsS3Service.archiveObject).toHaveBeenCalledWith(
        caseType,
        caseState,
        `${caseId}/${policeCaseNumber}/caseFilesRecord.pdf`,
      )
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
