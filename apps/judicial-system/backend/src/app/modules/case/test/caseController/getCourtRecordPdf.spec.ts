import { Response } from 'express'
import { uuid } from 'uuidv4'

import { Logger } from '@island.is/logging'

import { CaseState, CaseType, User } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { getCourtRecordPdfAsBuffer } from '../../../../formatters'
import { AwsS3Service } from '../../../aws-s3'
import { Case } from '../../../repository'

jest.mock('../../../../formatters/courtRecordPdf')

interface Then {
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  theCase: Case,
  res: Response,
) => Promise<Then>

describe('CaseController - Get court record pdf', () => {
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
    const getMock = getCourtRecordPdfAsBuffer as jest.Mock
    getMock.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (
      caseId: string,
      user: User,
      theCase: Case,
      res: Response,
    ) => {
      const then = {} as Then

      try {
        await caseController.getCourtRecordPdf(caseId, user, theCase, res)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('AWS S3 pdf returned', () => {
    const user = { id: uuid() } as User
    const caseId = uuid()
    const caseType = CaseType.PAROLE_REVOCATION
    const caseSate = CaseState.ACCEPTED
    const theCase = {
      id: caseId,
      type: caseType,
      state: caseSate,
      courtRecordSignatureDate: nowFactory(),
    } as Case
    const res = { end: jest.fn() } as unknown as Response
    const pdf = uuid()

    beforeEach(async () => {
      const mockGetGeneratedObject =
        mockAwsS3Service.getGeneratedRequestCaseObject as jest.Mock
      mockGetGeneratedObject.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, user, theCase, res)
    })

    it('should lookup pdf', () => {
      expect(
        mockAwsS3Service.getGeneratedRequestCaseObject,
      ).toHaveBeenCalledWith(caseType, `${caseId}/courtRecord.pdf`)
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })

  describe('generated pdf returned', () => {
    const user = {} as User
    const caseId = uuid()
    const theCase = {
      id: caseId,
      courtRecordSignatureDate: nowFactory(),
    } as Case
    const error = new Error('Some error')
    const res = { end: jest.fn() } as unknown as Response
    const pdf = uuid()

    beforeEach(async () => {
      const getMock = getCourtRecordPdfAsBuffer as jest.Mock
      getMock.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, user, theCase, res)
    })

    it('should info log the failure', () => {
      expect(mockLogger.info).toHaveBeenCalledWith(
        `The court record for case ${caseId} was not found in AWS S3`,
        { error },
      )
      expect(getCourtRecordPdfAsBuffer).toHaveBeenCalledWith(
        theCase,
        expect.any(Function),
        user,
      )
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })

  describe('pdf generation fails', () => {
    const user = {} as User
    const caseId = uuid()
    const theCase = {
      id: caseId,
      courtRecordSignatureDate: nowFactory(),
    } as Case
    let then: Then
    const res = {} as Response

    beforeEach(async () => {
      const getMock = getCourtRecordPdfAsBuffer as jest.Mock
      getMock.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, user, theCase, res)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
