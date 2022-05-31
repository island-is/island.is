import { uuid } from 'uuidv4'
import { Response } from 'express'

import { Logger } from '@island.is/logging'

import { getRulingPdfAsBuffer } from '../../../../formatters'
import { createTestingCaseModule } from '../createTestingCaseModule'
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
  forceRegeneration?: boolean,
) => Promise<Then>

describe('CaseController - Get ruling pdf', () => {
  let mockAwsS3Service: AwsS3Service
  let mockLogger: Logger
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      awsS3Service,
      logger,
      caseController,
    } = await createTestingCaseModule()
    mockAwsS3Service = awsS3Service
    mockLogger = logger

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      res: Response,
      forceRegeneration?: boolean,
    ) => {
      const then = {} as Then

      try {
        await caseController.getRulingPdf(
          caseId,
          theCase,
          res,
          forceRegeneration,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('AWS S3 lookup', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const res = {} as Response

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, res)
    })

    it('should lookup pdf', () => {
      expect(mockAwsS3Service.getObject).toHaveBeenCalledWith(
        `generated/${caseId}/ruling.pdf`,
      )
    })
  })

  describe('AWS S3 pdf returned', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const res = ({ end: jest.fn() } as unknown) as Response
    const pdf = {}

    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, theCase, res)
    })

    it('should return pdf', () => {
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })

  describe('AWS S3 lookup fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const res = {} as Response
    const error = new Error('Some ignored error')

    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockRejectedValueOnce(error)

      await givenWhenThen(caseId, theCase, res)
    })

    it('should info log the failure', () => {
      expect(
        mockLogger.info,
      ).toHaveBeenCalledWith(
        `The ruling for case ${caseId} was not found in AWS S3`,
        { error },
      )
    })
  })

  describe('pdf generated', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const res = {} as Response

    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockRejectedValueOnce(new Error('Some ignored error'))

      await givenWhenThen(caseId, theCase, res)
    })

    it('should generate pdf', () => {
      expect(getRulingPdfAsBuffer).toHaveBeenCalledWith(
        theCase,
        undefined, // TODO Mock IntlService
      )
    })
  })

  describe('pdf generated', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const res = {} as Response

    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockRejectedValueOnce(new Error('Some ignored error'))

      await givenWhenThen(caseId, theCase, res)
    })

    it('should generate pdf', () => {
      expect(getRulingPdfAsBuffer).toHaveBeenCalledWith(
        theCase,
        undefined, // TODO Mock IntlService
      )
    })
  })

  describe('pdf generated when forced to do so', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const res = {} as Response
    const forceRegeneration = true

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, res, forceRegeneration)
    })

    it('should generate pdf', () => {
      expect(getRulingPdfAsBuffer).toHaveBeenCalledWith(
        theCase,
        undefined, // TODO Mock IntlService
      )
    })
  })

  describe('generated pdf returned', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const res = ({ end: jest.fn() } as unknown) as Response
    const pdf = {}

    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockRejectedValueOnce(new Error('Some ignored error'))
      const getMock = getRulingPdfAsBuffer as jest.Mock
      getMock.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, theCase, res)
    })

    it('should return pdf', () => {
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })

  describe('pdf generation fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    let then: Then
    const res = {} as Response

    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockRejectedValueOnce(new Error('Some ignored error'))
      const getMock = getRulingPdfAsBuffer as jest.Mock
      getMock.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, theCase, res)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
