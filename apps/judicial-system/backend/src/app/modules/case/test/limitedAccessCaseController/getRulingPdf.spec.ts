import { Response } from 'express'
import { uuid } from 'uuidv4'

import { Logger } from '@island.is/logging'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { getRulingPdfAsBuffer } from '../../../../formatters'
import { AwsS3Service } from '../../../aws-s3'
import { Case } from '../../models/case.model'

jest.mock('../../../../formatters/rulingPdf')

interface Then {
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  res: Response,
) => Promise<Then>

describe('LimitedAccessCaseController - Get ruling pdf', () => {
  let mockAwsS3Service: AwsS3Service
  let mockLogger: Logger
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, logger, limitedAccessCaseController } =
      await createTestingCaseModule()

    mockAwsS3Service = awsS3Service
    mockLogger = logger

    const mockGetGeneratedRequestCaseObject =
      mockAwsS3Service.getRequestObject as jest.Mock
    mockGetGeneratedRequestCaseObject.mockRejectedValue(new Error('Some error'))
    const getMock = getRulingPdfAsBuffer as jest.Mock
    getMock.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (caseId: string, theCase: Case, res: Response) => {
      const then = {} as Then

      try {
        await limitedAccessCaseController.getRulingPdf(caseId, theCase, res)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('AWS S3 pdf returned', () => {
    const caseId = uuid()
    const theCase = { id: caseId, rulingSignatureDate: nowFactory() } as Case
    const res = { end: jest.fn() } as unknown as Response
    const pdf = {}

    beforeEach(async () => {
      const mockGetGeneratedRequestCaseObject =
        mockAwsS3Service.getRequestObject as jest.Mock
      mockGetGeneratedRequestCaseObject.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, theCase, res)
    })

    it('should return pdf', () => {
      expect(mockAwsS3Service.getRequestObject).toHaveBeenCalledWith(
        `${caseId}/ruling.pdf`,
      )
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })

  describe('AWS S3 lookup fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId, rulingSignatureDate: nowFactory() } as Case
    const res = {} as Response
    const error = new Error('Some error')

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, res)
    })

    it('should info log the failure', () => {
      expect(mockLogger.info).toHaveBeenCalledWith(
        `The ruling for case ${caseId} was not found in AWS S3`,
        { error },
      )
    })
  })

  describe('generated pdf returned', () => {
    const caseId = uuid()
    const theCase = { id: caseId, rulingSignatureDate: nowFactory() } as Case
    const res = { end: jest.fn() } as unknown as Response
    const pdf = {}

    beforeEach(async () => {
      const getMock = getRulingPdfAsBuffer as jest.Mock
      getMock.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, theCase, res)
    })

    it('should return pdf', () => {
      expect(getRulingPdfAsBuffer).toHaveBeenCalledWith(
        theCase,
        expect.any(Function),
      )
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })

  describe('pdf generation fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId, rulingSignatureDate: nowFactory() } as Case
    let then: Then
    const res = {} as Response

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase, res)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
