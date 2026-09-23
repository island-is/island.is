import { v4 as uuid } from 'uuid'

import {
  CaseFileCategory,
  PoliceFileTypeCode,
} from '@island.is/judicial-system/types'

import { createTestingVerdictModule } from '../createTestingVerdictModule'

import { EventService } from '../../../event'
import { FileService } from '../../../file'
import { PoliceService } from '../../../police'
import { Case, Defendant, Verdict } from '../../../repository'
import { DeliverDto } from '../../dto/deliver.dto'
import { InternalVerdictController } from '../../internalVerdict.controller'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseToDeliver?: Case) => Promise<Then>

describe('InternalVerdictController - Deliver verdict to national commissioners office', () => {
  const caseId = uuid()
  const defendantId = uuid()
  const verdictId = uuid()

  const courtCaseNumber = 'S-888/2025'
  const caseFiles = [
    {
      name: 'Dómur',
      created: new Date(2025, 1, 1),
      category: CaseFileCategory.RULING,
    },
  ]

  const buffer = Buffer.from('Dómur')

  const verdict = { id: verdictId } as Verdict

  const defendant = { id: defendantId, verdicts: [verdict] } as Defendant
  const theCase = {
    id: caseId,
    defendants: [defendant],
    courtCaseNumber,
    caseFiles,
  } as Case
  const user = { id: uuid() }
  const dto = { user } as DeliverDto

  let mockPoliceService: PoliceService
  let mockFileService: FileService
  let mockEventService: EventService
  let internalVerdictController: InternalVerdictController

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const testingModule = await createTestingVerdictModule()

    mockPoliceService = testingModule.policeService
    mockEventService = testingModule.eventService
    internalVerdictController = testingModule.internalVerdictController
    const mockCreateDocument = mockPoliceService.createDocument as jest.Mock
    mockCreateDocument.mockRejectedValue(new Error('Some error'))

    mockFileService = testingModule.fileService
    const mockGetCaseFileFromS3 = mockFileService.getCaseFileFromS3 as jest.Mock
    mockGetCaseFileFromS3.mockResolvedValue(buffer)

    givenWhenThen = async (caseToDeliver = theCase): Promise<Then> => {
      const then = {} as Then

      await internalVerdictController
        .deliverVerdictToNationalCommissionersOffice(
          caseToDeliver.id,
          defendantId,
          caseToDeliver,
          defendant,
          verdict,
          dto,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('verdict delivered to police central file system', () => {
    const createDocumentResponse = { externalPoliceDocumentId: uuid() }

    beforeEach(async () => {
      const mockCreateDocument = mockPoliceService.createDocument as jest.Mock
      mockCreateDocument.mockResolvedValue(createDocumentResponse)

      await givenWhenThen()
    })

    it('should call createDocument', () => {
      expect(mockPoliceService.createDocument).toHaveBeenCalledWith({
        caseId,
        defendantId,
        user,
        documentName: `Dómur í máli ${theCase.courtCaseNumber}`,
        documentFiles: [
          {
            name: 'Dómur',
            documentBase64: 'RMOzbXVy',
          },
        ],
        documentDates: [{ code: 'ORDER_BY_DATE', value: new Date(2025, 3, 1) }],
        fileTypeCode: PoliceFileTypeCode.VERDICT,
        caseSupplements: [
          { code: 'RVG_CASE_ID', value: caseId },
          { code: 'RVG_DOCUMENT_ID', value: verdictId },
          { code: 'VERDICT_COURT_CASE_NUMBER', value: courtCaseNumber },
        ],
      })
    })
  })

  describe('verdict delivered for a split case', () => {
    const originalCaseId = uuid()
    const createDocumentResponse = { externalPoliceDocumentId: uuid() }
    const splitCase = {
      ...theCase,
      splitCaseId: originalCaseId,
    } as Case

    beforeEach(async () => {
      const mockCreateDocument = mockPoliceService.createDocument as jest.Mock
      mockCreateDocument.mockResolvedValue(createDocumentResponse)

      await givenWhenThen(splitCase)
    })

    it('should send the original ancestor case id as RVG_CASE_ID', () => {
      expect(mockPoliceService.createDocument).toHaveBeenCalledWith(
        expect.objectContaining({
          caseSupplements: expect.arrayContaining([
            { code: 'RVG_CASE_ID', value: originalCaseId },
          ]),
        }),
      )
    })
  })

  describe('delivery fails', () => {
    let then: Then

    // The top-level beforeEach makes the police createDocument call reject, so
    // the delivery fails.
    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should report the failure to the Slack error channel', () => {
      expect(mockEventService.postErrorEvent).toHaveBeenCalledWith(
        'Villa við að senda dóm til RLS',
        { caseId, defendantId },
        expect.any(Error),
      )
    })

    it('should propagate the error', () => {
      expect(then.error).toBeDefined()
    })
  })
})
