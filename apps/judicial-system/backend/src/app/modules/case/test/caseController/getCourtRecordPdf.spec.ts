import { Response } from 'express'
import { v4 as uuid } from 'uuid'

import { Logger } from '@island.is/logging'

import {
  CaseState,
  CaseType,
  InstitutionType,
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

describe('CaseController - Get court record pdf', () => {
  let mockAwsS3Service: AwsS3Service
  let mockLogger: Logger
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, logger, caseController } =
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
        await caseController.getCourtRecordPdf(caseId, user, theCase, res)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('AWS S3 pdf returned for request case', () => {
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
      const mockGetGeneratedRequestCaseObject =
        mockAwsS3Service.getGeneratedRequestCaseObject as jest.Mock
      mockGetGeneratedRequestCaseObject.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, user, theCase, res)
    })

    it('should lookup pdf', () => {
      expect(
        mockAwsS3Service.getGeneratedRequestCaseObject,
      ).toHaveBeenCalledWith(caseType, `${caseId}/courtRecord.pdf`)
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })

  describe('generated pdf returned for request case', () => {
    const user = {} as User
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      courtRecordSignatureDate: nowFactory(),
    } as Case
    const error = new Error('Some error')
    const res = { end: jest.fn() } as unknown as Response
    const pdf = uuid()

    beforeEach(async () => {
      const getCourtRecordPdfAsBufferMock =
        getCourtRecordPdfAsBuffer as jest.Mock
      getCourtRecordPdfAsBufferMock.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, user, theCase, res)
    })

    it('should return the generated pdf', () => {
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

  describe('pdf generation fails for request case', () => {
    const user = {} as User
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION,
      courtRecordSignatureDate: nowFactory(),
    } as Case
    let then: Then
    const res = {} as Response

    beforeEach(async () => {
      const getCourtRecordPdfAsBufferMock =
        getCourtRecordPdfAsBuffer as jest.Mock
      getCourtRecordPdfAsBufferMock.mockRejectedValueOnce(
        new Error('Some error'),
      )

      then = await givenWhenThen(caseId, user, theCase, res)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('generated pdf returned for indictment case', () => {
    const user = {
      role: UserRole.PROSECUTOR,
      institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
    } as User
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      withCourtSessions: true,
      courtSessions: [{ isConfirmed: true }],
    } as Case
    const res = { end: jest.fn() } as unknown as Response
    const pdf = uuid()

    beforeEach(async () => {
      const createIndictmentCourtRecordPdfMock =
        createIndictmentCourtRecordPdf as jest.Mock
      createIndictmentCourtRecordPdfMock.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, user, theCase, res)
    })

    it('should return the generated pdf', () => {
      expect(createIndictmentCourtRecordPdf).toHaveBeenCalledWith(
        theCase,
        false,
        undefined,
      )
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })
})
