import { uuid } from 'uuidv4'

import { BadRequestException } from '@nestjs/common'

import { createTestingCaseModule } from '../createTestingCaseModule'
import { createCaseFilesRecord } from '../../../../formatters'
import { CourtDocumentFolder, CourtService } from '../../../court'
import { Case } from '../../models/case.model'
import { DeliverResponse } from '../../models/deliver.response'

jest.mock('../../../../formatters/caseFilesRecordPdf')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  policeCaseNumber: string,
  theCase: Case,
) => Promise<Then>

describe('InternalCaseController - Deliver case files record to court', () => {
  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const mockGet = createCaseFilesRecord as jest.Mock
    mockGet.mockRejectedValue(new Error('Some error'))

    const {
      courtService,
      internalCaseController,
    } = await createTestingCaseModule()

    mockCourtService = courtService
    const mockCreateDocument = mockCourtService.createDocument as jest.Mock
    mockCreateDocument.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (
      caseId: string,
      policeCaseNumber: string,
      theCase: Case,
    ) => {
      const then = {} as Then

      await internalCaseController
        .deliverCaseFilesRecordToCourt(caseId, policeCaseNumber, theCase)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('deliver case files record for %s case to court', () => {
    const caseId = uuid()
    const policeCaseNumber = uuid()
    const courtId = uuid()
    const courtCaseNumber = uuid()
    const theCase = {
      id: caseId,
      policeCaseNumbers: [policeCaseNumber],
      courtId,
      courtCaseNumber,
    } as Case
    const pdf = Buffer.from('test case files record')
    let then: Then

    beforeEach(async () => {
      const mockGet = createCaseFilesRecord as jest.Mock
      mockGet.mockResolvedValueOnce(pdf)
      const mockCreateDocument = mockCourtService.createDocument as jest.Mock
      mockCreateDocument.mockResolvedValueOnce(uuid())

      then = await givenWhenThen(caseId, policeCaseNumber, theCase)
    })

    it('should generate the case files record', async () => {
      expect(createCaseFilesRecord).toHaveBeenCalledWith(
        theCase,
        policeCaseNumber,
        [],
        expect.any(Function),
      )
    })

    it('should create a case files record at court', async () => {
      expect(mockCourtService.createDocument).toHaveBeenCalledWith(
        caseId,
        courtId,
        courtCaseNumber,
        CourtDocumentFolder.CASE_DOCUMENTS,
        `Skjalaskrá ${policeCaseNumber}`,
        `Skjalaskrá ${policeCaseNumber}.pdf`,
        'application/pdf',
        pdf,
      )
    })

    it('should return a success response', async () => {
      expect(then.result.delivered).toEqual(true)
    })
  })

  describe('police case number not in case', () => {
    const caseId = uuid()
    const policeCaseNumber = uuid()
    const courtId = uuid()
    const courtCaseNumber = uuid()
    const theCase = {
      id: caseId,
      policeCaseNumbers: [uuid(), uuid()],
      courtId,
      courtCaseNumber,
    } as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, policeCaseNumber, theCase)
    })

    it('should return BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toEqual(
        `Case ${caseId} does not include police case number ${policeCaseNumber}`,
      )
    })
  })

  describe('delivery to court fails', () => {
    const caseId = uuid()
    const policeCaseNumber = uuid()
    const courtId = uuid()
    const courtCaseNumber = uuid()
    const theCase = {
      id: caseId,
      policeCaseNumbers: [policeCaseNumber],
      courtId,
      courtCaseNumber,
    } as Case
    const pdf = Buffer.from('test case files record')
    let then: Then

    beforeEach(async () => {
      const mockGet = createCaseFilesRecord as jest.Mock
      mockGet.mockResolvedValueOnce(pdf)

      then = await givenWhenThen(caseId, policeCaseNumber, theCase)
    })

    it('should return a failure response', async () => {
      expect(then.result.delivered).toEqual(false)
    })
  })

  describe('pdf generation fails', () => {
    const caseId = uuid()
    const policeCaseNumber = uuid()
    const courtId = uuid()
    const courtCaseNumber = uuid()
    const theCase = {
      id: caseId,
      policeCaseNumbers: [policeCaseNumber],
      courtId,
      courtCaseNumber,
    } as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, policeCaseNumber, theCase)
    })

    it('should return a failure response', async () => {
      expect(then.result.delivered).toEqual(false)
    })
  })
})
