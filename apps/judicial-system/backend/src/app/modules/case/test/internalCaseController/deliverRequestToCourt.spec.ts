import { uuid } from 'uuidv4'

import {
  CaseType,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'
import { caseTypes } from '@island.is/judicial-system/formatters'

import { createTestingCaseModule } from '../createTestingCaseModule'
import { getRequestPdfAsBuffer } from '../../../../formatters'
import { CourtDocumentFolder, CourtService } from '../../../court'
import { Case } from '../../models/case.model'
import { DeliverResponse } from '../../models/deliver.response'

jest.mock('../../../../formatters/requestPdf')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver requst to court', () => {
  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const mockGet = getRequestPdfAsBuffer as jest.Mock
    mockGet.mockRejectedValue(new Error('Some error'))

    const {
      courtService,
      internalCaseController,
    } = await createTestingCaseModule()

    mockCourtService = courtService
    const mockCreateDocument = mockCourtService.createDocument as jest.Mock
    mockCreateDocument.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      await internalCaseController
        .deliverRequestToCourt(caseId, theCase)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'deliver request for %s case to court',
    (type: CaseType) => {
      const caseId = uuid()
      const courtId = uuid()
      const courtCaseNumber = uuid()
      const theCase = { id: caseId, type, courtId, courtCaseNumber } as Case
      const pdf = Buffer.from('test request')
      let then: Then

      beforeEach(async () => {
        const mockGet = getRequestPdfAsBuffer as jest.Mock
        mockGet.mockResolvedValueOnce(pdf)
        const mockCreateDocument = mockCourtService.createDocument as jest.Mock
        mockCreateDocument.mockResolvedValueOnce(uuid())

        then = await givenWhenThen(caseId, theCase)
      })

      it('should generate the request', async () => {
        expect(getRequestPdfAsBuffer).toHaveBeenCalledWith(
          theCase,
          expect.any(Function),
        )
      })

      it('should create a request at court', async () => {
        expect(mockCourtService.createDocument).toHaveBeenCalledWith(
          caseId,
          courtId,
          courtCaseNumber,
          CourtDocumentFolder.REQUEST_DOCUMENTS,
          `Krafa um ${caseTypes[type]}`,
          `Krafa um ${caseTypes[type]}.pdf`,
          'application/pdf',
          pdf,
        )
      })

      it('should return a success response', async () => {
        expect(then.result.delivered).toEqual(true)
      })
    },
  )

  describe('delivery to court fails', () => {
    const caseId = uuid()
    const courtId = uuid()
    const courtCaseNumber = uuid()
    const theCase = { id: caseId, courtId, courtCaseNumber } as Case
    const pdf = Buffer.from('test request')
    let then: Then

    beforeEach(async () => {
      const mockGet = getRequestPdfAsBuffer as jest.Mock
      mockGet.mockResolvedValueOnce(pdf)

      then = await givenWhenThen(caseId, theCase)
    })

    it('should return a failure response', async () => {
      expect(then.result.delivered).toEqual(false)
    })
  })

  describe('pdf generation fails', () => {
    const caseId = uuid()
    const courtId = uuid()
    const courtCaseNumber = uuid()
    const theCase = { id: caseId, courtId, courtCaseNumber } as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase)
    })

    it('should return a failure response', async () => {
      expect(then.result.delivered).toEqual(false)
    })
  })
})
