import { Base64 } from 'js-base64'
import { v4 as uuid } from 'uuid'

import {
  CaseOrigin,
  CaseState,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { getRequestPdfAsString } from '../../../../formatters'
import { randomDate } from '../../../../test'
import { PoliceDocumentType, PoliceService } from '../../../police'
import { Case } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

jest.mock('../../../../formatters/generatedPdfs/requestPdf')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver request to police', () => {
  const userId = uuid()
  const user = { id: userId } as User

  let mockPoliceService: PoliceService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { policeService, internalCaseController } =
      await createTestingCaseModule()

    mockPoliceService = policeService

    const mockGetRequest = getRequestPdfAsString as jest.Mock
    mockGetRequest.mockRejectedValue(new Error('Some error'))
    const mockUpdatePoliceCase = mockPoliceService.updatePoliceCase as jest.Mock
    mockUpdatePoliceCase.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      await internalCaseController
        .deliverRequestToPolice(caseId, theCase, { user })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('deliver request to police', () => {
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
      validToDate,
      conclusion: caseConclusion,
      policeDefendantNationalId: defendantNationalId,
    } as Case
    const requestPdf = 'test request'

    let then: Then

    beforeEach(async () => {
      const mockGetRequest = getRequestPdfAsString as jest.Mock
      mockGetRequest.mockResolvedValueOnce(requestPdf)
      const mockUpdatePoliceCase =
        mockPoliceService.updatePoliceCase as jest.Mock
      mockUpdatePoliceCase.mockResolvedValueOnce(true)

      then = await givenWhenThen(caseId, theCase)
    })

    it('should deliver the request to police', async () => {
      expect(getRequestPdfAsString).toHaveBeenCalledWith(
        theCase,
        expect.any(Function),
      )
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
            type: PoliceDocumentType.RVKR,
            courtDocument: Base64.btoa(requestPdf),
          },
        ],
      )
      expect(then.result.delivered).toEqual(true)
    })
  })

  describe('request pdf generation fails', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      type: CaseType.CUSTODY,
      state: CaseState.ACCEPTED,
      policeCaseNumbers: [uuid()],
    } as Case

    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase)
    })

    it('should not deliver the request', async () => {
      expect(mockPoliceService.updatePoliceCase).not.toHaveBeenCalled()
      expect(then.result.delivered).toEqual(false)
    })
  })
})
