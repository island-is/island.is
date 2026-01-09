import { Base64 } from 'js-base64'
import { v4 as uuid } from 'uuid'

import {
  CaseOrigin,
  CaseState,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { randomDate } from '../../../../test'
import { AwsS3Service } from '../../../aws-s3'
import { PoliceDocumentType, PoliceService } from '../../../police'
import { Case } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver signed ruling to police', () => {
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

    const mockGetGeneratedObject =
      awsS3Service.getGeneratedRequestCaseObject as jest.Mock
    mockGetGeneratedObject.mockRejectedValue(new Error('Some error'))
    const mockUpdatePoliceCase = mockPoliceService.updatePoliceCase as jest.Mock
    mockUpdatePoliceCase.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      await internalCaseController
        .deliverSignedRulingToPolice(caseId, theCase, { user })
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
    const courtCaseNumber = uuid()
    const defendantNationalId = '0123456789'
    const validToDate = randomDate()
    const caseConclusion = 'test conclusion'
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      type: caseType,
      state: caseState,
      policeCaseNumbers: [policeCaseNumber],
      courtCaseNumber,
      defendants: [{ nationalId: defendantNationalId }],
      validToDate,
      conclusion: caseConclusion,
    } as Case
    const rulingPdf = 'test ruling'

    let then: Then

    beforeEach(async () => {
      const mockGetGeneratedObject =
        mockAwsS3Service.getGeneratedRequestCaseObject as jest.Mock
      mockGetGeneratedObject.mockResolvedValueOnce(rulingPdf)
      const mockUpdatePoliceCase =
        mockPoliceService.updatePoliceCase as jest.Mock
      mockUpdatePoliceCase.mockResolvedValueOnce(true)

      then = await givenWhenThen(caseId, theCase)
    })

    it('should update the police case', async () => {
      expect(
        mockAwsS3Service.getGeneratedRequestCaseObject,
      ).toHaveBeenCalledWith(caseType, `${caseId}/ruling.pdf`)
      expect(mockPoliceService.updatePoliceCase).toHaveBeenCalledWith(
        user,
        caseId,
        caseType,
        caseState,
        policeCaseNumber,
        courtCaseNumber,
        defendantNationalId,
        validToDate,
        caseConclusion,
        [
          {
            type: PoliceDocumentType.RVUR,
            courtDocument: Base64.btoa(rulingPdf),
          },
        ],
      )
      expect(then.result.delivered).toEqual(true)
    })
  })
})
