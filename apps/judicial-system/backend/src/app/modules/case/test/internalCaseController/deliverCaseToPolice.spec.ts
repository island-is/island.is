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
  getRulingPdfAsString,
} from '../../../../formatters'
import { randomDate } from '../../../../test'
import { PoliceService } from '../../../police'
import { Case } from '../../models/case.model'
import { DeliverResponse } from '../../models/deliver.response'

jest.mock('../../../../formatters/courtRecordPdf')
jest.mock('../../../../formatters/rulingPdf')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver case to police', () => {
  const userId = uuid()
  const user = { id: userId } as User

  let mockPoliceService: PoliceService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      policeService,
      internalCaseController,
    } = await createTestingCaseModule()

    mockPoliceService = policeService

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
    const courtRecordPdf = 'test court record'
    const rulingPdf = 'test ruling'

    let then: Then

    beforeEach(async () => {
      const mockGetCourtRecord = getCourtRecordPdfAsString as jest.Mock
      mockGetCourtRecord.mockResolvedValueOnce(courtRecordPdf)
      const mockGetRuling = getRulingPdfAsString as jest.Mock
      mockGetRuling.mockResolvedValueOnce(rulingPdf)
      const mockUpdatePoliceCase = mockPoliceService.updatePoliceCase as jest.Mock
      mockUpdatePoliceCase.mockResolvedValueOnce(true)

      then = await givenWhenThen(caseId, theCase)
    })

    it('should generate the court record pdf', async () => {
      expect(getCourtRecordPdfAsString).toHaveBeenCalledWith(
        theCase,
        expect.any(Function),
      )
    })

    it('should generate the ruling pdf', async () => {
      expect(getRulingPdfAsString).toHaveBeenCalledWith(
        theCase,
        expect.any(Function),
      )
    })

    it('should update the police case', async () => {
      expect(mockPoliceService.updatePoliceCase).toHaveBeenCalledWith(
        user,
        caseId,
        caseType,
        caseState,
        policeCaseNumber,
        defendantNationalId,
        validToDate,
        caseConclusion,
        courtRecordPdf,
        rulingPdf,
      )
    })

    it('should return a success response', async () => {
      expect(then.result.delivered).toEqual(true)
    })
  })
})
