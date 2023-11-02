import { uuid } from 'uuidv4'

import {
  CaseOrigin,
  CaseState,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import {
  getCourtRecordPdfAsString,
  getCustodyNoticePdfAsString,
  getRequestPdfAsString,
} from '../../../../formatters'
import { randomDate } from '../../../../test'
import { AwsS3Service } from '../../../aws-s3'
import { PoliceService } from '../../../police'
import { Case } from '../../models/case.model'
import { DeliverResponse } from '../../models/deliver.response'

jest.mock('../../../../formatters/requestPdf')
jest.mock('../../../../formatters/courtRecordPdf')
jest.mock('../../../../formatters/custodyNoticePdf')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver case to police', () => {
  const userId = uuid()
  const user = { id: userId } as User

  let mockAwsS3Service: AwsS3Service
  let mockPoliceService: PoliceService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, policeService, internalCaseController } =
      await createTestingCaseModule()

    mockAwsS3Service = awsS3Service
    mockPoliceService = policeService

    const mockGetRequest = getRequestPdfAsString as jest.Mock
    mockGetRequest.mockRejectedValue(new Error('Some error'))
    const mockGetCourtRecord = getCourtRecordPdfAsString as jest.Mock
    mockGetCourtRecord.mockRejectedValue(new Error('Some error'))
    const mockGetCustodyNotice = getCustodyNoticePdfAsString as jest.Mock
    mockGetCustodyNotice.mockRejectedValue(new Error('Some error'))
    const mockGetObject = awsS3Service.getObject as jest.Mock
    mockGetObject.mockRejectedValue(new Error('Some error'))
    const mockUpdatePoliceCase = mockPoliceService.updatePoliceCase as jest.Mock
    mockUpdatePoliceCase.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      await internalCaseController
        .deliverCaseToPolice(caseId, theCase, { user })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('deliver case to police', () => {
    const caseId = uuid()
    const caseType = CaseType.CUSTODY
    const caseState = CaseState.ACCEPTED
    const policeCaseNumber = uuid()
    const defendantNationalId = '0123456789'
    const validToDate = randomDate()
    const caseConclusion = 'test conclusion'
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      type: caseType,
      state: caseState,
      policeCaseNumbers: [policeCaseNumber],
      defendants: [{ nationalId: defendantNationalId }],
      validToDate,
      conclusion: caseConclusion,
    } as Case
    const requestPdf = 'test request'
    const courtRecordPdf = 'test court record'
    const rulingPdf = 'test ruling'
    const custodyNoticePdf = 'test custody notice'

    let then: Then

    beforeEach(async () => {
      const mockGetRequest = getRequestPdfAsString as jest.Mock
      mockGetRequest.mockResolvedValueOnce(requestPdf)
      const mockGetCourtRecord = getCourtRecordPdfAsString as jest.Mock
      mockGetCourtRecord.mockResolvedValueOnce(courtRecordPdf)
      const mockGetCustodyNotice = getCustodyNoticePdfAsString as jest.Mock
      mockGetCustodyNotice.mockResolvedValueOnce(custodyNoticePdf)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(rulingPdf)
      const mockUpdatePoliceCase =
        mockPoliceService.updatePoliceCase as jest.Mock
      mockUpdatePoliceCase.mockResolvedValueOnce(true)

      then = await givenWhenThen(caseId, theCase)
    })
    it('should update the police case', async () => {
      expect(getRequestPdfAsString).toHaveBeenCalledWith(
        theCase,
        expect.any(Function),
      )
      expect(getCourtRecordPdfAsString).toHaveBeenCalledWith(
        theCase,
        expect.any(Function),
      )
      expect(mockAwsS3Service.getObject).toHaveBeenCalledWith(
        `generated/${caseId}/ruling.pdf`,
      )
      expect(getCustodyNoticePdfAsString).toHaveBeenCalledWith(
        theCase,
        expect.any(Function),
      )
      expect(mockPoliceService.updatePoliceCase).toHaveBeenCalledWith(
        user,
        caseId,
        caseType,
        caseState,
        policeCaseNumber,
        defendantNationalId,
        validToDate,
        caseConclusion,
        requestPdf,
        courtRecordPdf,
        rulingPdf,
        custodyNoticePdf,
        undefined,
      )
      expect(then.result.delivered).toEqual(true)
    })
  })
})
