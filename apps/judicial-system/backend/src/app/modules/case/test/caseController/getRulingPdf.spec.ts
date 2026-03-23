import { Response } from 'express'
import { v4 as uuid } from 'uuid'

import { Logger } from '@island.is/logging'

import { CaseState, CaseType } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { getRulingPdfAsBuffer } from '../../../../formatters'
import { AwsS3Service } from '../../../aws-s3'
import { Case } from '../../../repository'

jest.mock('../../../../formatters/rulingPdf')

interface Then {
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  res: Response,
) => Promise<Then>

describe('CaseController - Get ruling pdf', () => {
  let mockAwsS3Service: AwsS3Service
  let mockLogger: Logger
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, logger, caseController } =
      await createTestingCaseModule()

    mockAwsS3Service = awsS3Service
    mockLogger = logger

    const mockGetGeneratedObject =
      mockAwsS3Service.getGeneratedRequestCaseObject as jest.Mock
    mockGetGeneratedObject.mockRejectedValue(new Error('Some error'))
    const getMock = getRulingPdfAsBuffer as jest.Mock
    getMock.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (caseId: string, theCase: Case, res: Response) => {
      const then = {} as Then

      try {
        await caseController.getRulingPdf(caseId, theCase, res)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('AWS S3 pdf returned', () => {
    const caseId = uuid()
    const caseType = CaseType.EXPULSION_FROM_HOME
    const caseState = CaseState.REJECTED
    const theCase = {
      id: caseId,
      type: caseType,
      state: caseState,
      rulingSignatureDate: nowFactory(),
    } as Case
    const res = { end: jest.fn() } as unknown as Response
    const pdf = {}

    beforeEach(async () => {
      const mockGetGeneratedObject =
        mockAwsS3Service.getGeneratedRequestCaseObject as jest.Mock
      mockGetGeneratedObject.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, theCase, res)
    })

    it('should return pdf', () => {
      expect(
        mockAwsS3Service.getGeneratedRequestCaseObject,
      ).toHaveBeenCalledWith(caseType, `${caseId}/ruling.pdf`)
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

  describe('pdf generated when forced to do so', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const res = {} as Response

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, res)
    })

    it('should generate pdf', () => {
      expect(getRulingPdfAsBuffer).toHaveBeenCalledWith(
        theCase,
        expect.any(Function),
      )
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
