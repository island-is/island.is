import { Response } from 'express'
import { uuid } from 'uuidv4'

import { Logger } from '@island.is/logging'

import {
  CaseState,
  CaseType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import {
  createIndictmentCourtRecordPdf,
  getCourtRecordPdfAsBuffer,
} from '../../../../formatters'
import { AwsS3Service } from '../../../aws-s3'
import { Case } from '../../../repository'

jest.mock('../../../../formatters/courtRecordPdf')
jest.mock('../../../../formatters/indictmentCourtRecordPdf')

interface Then {
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  theCase: Case,
  res: Response,
) => Promise<Then>

describe('LimitedAccessCaseController - Get court record pdf', () => {
  let mockAwsS3Service: AwsS3Service
  let mockLogger: Logger
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, logger, limitedAccessCaseController } =
      await createTestingCaseModule()

    mockAwsS3Service = awsS3Service
    mockLogger = logger

    const mockGetGeneratedRequestCaseObject =
      mockAwsS3Service.getGeneratedRequestCaseObject as jest.Mock
    mockGetGeneratedRequestCaseObject.mockRejectedValue(new Error('Some error'))
    const getCourtRecordPdfAsBufferMock = getCourtRecordPdfAsBuffer as jest.Mock
    getCourtRecordPdfAsBufferMock.mockRejectedValue(new Error('Some error'))
    const createIndictmentCourtRecordPdfMock =
      createIndictmentCourtRecordPdf as jest.Mock
    createIndictmentCourtRecordPdfMock.mockRejectedValue(
      new Error('Some error'),
    )

    givenWhenThen = async (
      caseId: string,
      user: User,
      theCase: Case,
      res: Response,
    ) => {
      const then = {} as Then

      try {
        await limitedAccessCaseController.getCourtRecordPdf(
          caseId,
          user,
          theCase,
          res,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('AWS S3 pdf returned', () => {
    const user = {} as User
    const caseId = uuid()
    const caseType = CaseType.EXPULSION_FROM_HOME
    const caseState = CaseState.DISMISSED
    const theCase = {
      id: caseId,
      type: caseType,
      state: caseState,
      courtRecordSignatureDate: nowFactory(),
    } as Case
    const res = { end: jest.fn() } as unknown as Response
    const pdf = {}

    beforeEach(async () => {
      const mockGetGeneratedRequestCaseObject =
        mockAwsS3Service.getGeneratedRequestCaseObject as jest.Mock
      mockGetGeneratedRequestCaseObject.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, user, theCase, res)
    })

    it('should return pdf', () => {
      expect(
        mockAwsS3Service.getGeneratedRequestCaseObject,
      ).toHaveBeenCalledWith(caseType, `${caseId}/courtRecord.pdf`)
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })

  describe('AWS S3 lookup fails', () => {
    const user = {} as User
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.PSYCHIATRIC_EXAMINATION,
      state: CaseState.DISMISSED,
      courtRecordSignatureDate: nowFactory(),
    } as Case
    const res = {} as Response
    const error = new Error('Some error')

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, res)
    })

    it('should info log the failure', () => {
      expect(mockLogger.info).toHaveBeenCalledWith(
        `The court record for case ${caseId} was not found in AWS S3`,
        { error },
      )
    })
  })

  describe('generated pdf returned', () => {
    const user = {} as User
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.PHONE_TAPPING,
      state: CaseState.ACCEPTED,
      courtRecordSignatureDate: nowFactory(),
    } as Case
    const res = { end: jest.fn() } as unknown as Response
    const pdf = {}

    beforeEach(async () => {
      const getCourtRecordPdfAsBufferMock =
        getCourtRecordPdfAsBuffer as jest.Mock
      getCourtRecordPdfAsBufferMock.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, user, theCase, res)
    })

    it('should return pdf', () => {
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
      type: CaseType.VIDEO_RECORDING_EQUIPMENT,
      state: CaseState.REJECTED,
      courtRecordSignatureDate: nowFactory(),
    } as Case
    let then: Then
    const res = {} as Response

    beforeEach(async () => {
      then = await givenWhenThen(caseId, user, theCase, res)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('generated pdf returned', () => {
    const user = { role: UserRole.DEFENDER } as User
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      courtSessions: [{ endDate: nowFactory() }],
    } as Case
    const res = { end: jest.fn() } as unknown as Response
    const pdf = {}

    beforeEach(async () => {
      const createIndictmentCourtRecordPdfMock =
        createIndictmentCourtRecordPdf as jest.Mock
      createIndictmentCourtRecordPdfMock.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, user, theCase, res)
    })

    it('should return pdf', () => {
      expect(createIndictmentCourtRecordPdf).toHaveBeenCalledWith(
        theCase,
        false,
        undefined,
      )
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })
})
