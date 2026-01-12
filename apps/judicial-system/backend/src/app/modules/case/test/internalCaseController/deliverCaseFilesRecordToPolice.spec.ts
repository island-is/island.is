import { Base64 } from 'js-base64'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import { CaseState, CaseType, User } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { createCaseFilesRecord } from '../../../../formatters'
import { randomDate } from '../../../../test'
import { AwsS3Service } from '../../../aws-s3'
import { PoliceDocumentType, PoliceService } from '../../../police'
import { Case } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

jest.mock('../../../../factories')
jest.mock('../../../../formatters/caseFilesRecordPdf')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  policeCaseNumber: string,
  theCase: Case,
) => Promise<Then>

describe('InternalCaseController - Deliver case files record to police', () => {
  const date = randomDate()
  const user = { id: uuid() } as User
  const caseId = uuid()
  const caseType = CaseType.INDICTMENT
  const caseState = CaseState.COMPLETED
  const policeCaseNumber = uuid()
  const defendantNationalId = '0123456789'
  const courtId = uuid()
  const courtCaseNumber = uuid()
  const theCase = {
    id: caseId,
    type: caseType,
    state: caseState,
    policeCaseNumbers: [policeCaseNumber],
    defendants: [{ nationalId: defendantNationalId }],
    courtId,
    courtCaseNumber,
  } as Case
  const pdf = Buffer.from('test case files record')

  let mockAwsS3Service: AwsS3Service
  let mockPoliceService: PoliceService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const mockGet = createCaseFilesRecord as jest.Mock
    mockGet.mockRejectedValue(new Error('Some error'))

    const { awsS3Service, policeService, internalCaseController } =
      await createTestingCaseModule()

    mockAwsS3Service = awsS3Service
    mockPoliceService = policeService

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValueOnce(date)
    const mockGetObject = mockAwsS3Service.getObject as jest.Mock
    mockGetObject.mockRejectedValue(new Error('Some error'))
    const mockPutObject = mockAwsS3Service.putObject as jest.Mock
    mockPutObject.mockRejectedValue(new Error('Some error'))
    const mockCreateCaseFilesRecord = createCaseFilesRecord as jest.Mock
    mockCreateCaseFilesRecord.mockRejectedValue(new Error('Some error'))
    const mockUpdatePoliceCase = mockPoliceService.updatePoliceCase as jest.Mock
    mockUpdatePoliceCase.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (
      caseId: string,
      policeCaseNumber: string,
      theCase: Case,
    ) => {
      const then = {} as Then

      await internalCaseController
        .deliverCaseFilesRecordToPolice(caseId, policeCaseNumber, theCase, {
          user,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('case files record delivered', () => {
    let then: Then

    beforeEach(async () => {
      const mockCreateCaseFilesRecord = createCaseFilesRecord as jest.Mock
      mockCreateCaseFilesRecord.mockResolvedValueOnce(pdf)
      const mockUpdatePoliceCase =
        mockPoliceService.updatePoliceCase as jest.Mock
      mockUpdatePoliceCase.mockResolvedValueOnce(true)

      then = await givenWhenThen(caseId, policeCaseNumber, theCase)
    })

    it('should update the police case', () => {
      expect(mockAwsS3Service.getObject).toHaveBeenCalledWith(
        caseType,
        `${theCase.id}/${policeCaseNumber}/caseFilesRecord.pdf`,
      )
      expect(createCaseFilesRecord).toHaveBeenCalledWith(
        theCase,
        policeCaseNumber,
        [],
        expect.any(Function),
      )
      expect(mockAwsS3Service.putObject).toHaveBeenCalledWith(
        theCase.type,
        `${theCase.id}/${policeCaseNumber}/caseFilesRecord.pdf`,
        pdf.toString(),
      )
      expect(mockPoliceService.updatePoliceCase).toHaveBeenCalledWith(
        user,
        caseId,
        caseType,
        caseState,
        policeCaseNumber,
        courtCaseNumber,
        defendantNationalId,
        date,
        '',
        [
          {
            type: PoliceDocumentType.RVMG,
            courtDocument: Base64.btoa(pdf.toString('binary')),
          },
        ],
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('pdf returned from AWS S3', () => {
    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, policeCaseNumber, theCase)
    })

    it('should use the AWS S3 pdf', () => {
      expect(mockPoliceService.updatePoliceCase).toHaveBeenCalledWith(
        user,
        caseId,
        caseType,
        caseState,
        policeCaseNumber,
        courtCaseNumber,
        defendantNationalId,
        date,
        '',
        [
          {
            type: PoliceDocumentType.RVMG,
            courtDocument: Base64.btoa(pdf.toString('binary')),
          },
        ],
      )
    })
  })

  describe('police case number not in case', () => {
    const policeCaseNumber = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, policeCaseNumber, theCase)
    })

    it('should return BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toEqual(
        `Case ${caseId} does not include police case number ${policeCaseNumber}`,
      )
    })
  })

  describe('delivery to police fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockCreateCaseFilesRecord = createCaseFilesRecord as jest.Mock
      mockCreateCaseFilesRecord.mockResolvedValueOnce(pdf)

      then = await givenWhenThen(caseId, policeCaseNumber, theCase)
    })

    it('should return a failure response', async () => {
      expect(then.result.delivered).toEqual(false)
    })
  })

  describe('pdf generation fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, policeCaseNumber, theCase)
    })

    it('should return a failure response', async () => {
      expect(then.result.delivered).toEqual(false)
    })
  })
})
