import { v4 as uuid } from 'uuid'

import {
  CaseFileCategory,
  PoliceFileTypeCode,
} from '@island.is/judicial-system/types'

import { createTestingVerdictModule } from '../createTestingVerdictModule'

import { FileService } from '../../../file'
import { PoliceService } from '../../../police'
import { Case, Defendant, Verdict } from '../../../repository'
import { DeliverDto } from '../../dto/deliver.dto'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

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

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { internalVerdictController, policeService, fileService } =
      await createTestingVerdictModule()

    mockPoliceService = policeService
    const mockCreateDocument = mockPoliceService.createDocument as jest.Mock
    mockCreateDocument.mockRejectedValue(new Error('Some error'))

    mockFileService = fileService
    const mockGetCaseFileFromS3 = mockFileService.getCaseFileFromS3 as jest.Mock
    mockGetCaseFileFromS3.mockResolvedValue(buffer)

    givenWhenThen = async (): Promise<Then> => {
      const then = {} as Then

      await internalVerdictController
        .deliverVerdictToNationalCommissionersOffice(
          caseId,
          defendantId,
          theCase,
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
          { code: 'VERDICT_COURT_CASE_NUMBER', value: courtCaseNumber },
        ],
      })
    })
  })
})
