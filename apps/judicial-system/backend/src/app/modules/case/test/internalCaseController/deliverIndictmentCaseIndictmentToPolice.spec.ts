import { Base64 } from 'js-base64'
import { uuid } from 'uuidv4'

import {
  CaseFileCategory,
  CaseOrigin,
  CaseState,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { createIndictment } from '../../../../formatters'
import { randomDate } from '../../../../test'
import { AwsS3Service } from '../../../aws-s3'
import { CourtDocumentType, PoliceService } from '../../../police'
import { Case } from '../../models/case.model'
import { DeliverResponse } from '../../models/deliver.response'

jest.mock('../../../../factories')
jest.mock('../../../../formatters/indictmentPdf')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver indictment case indictment to police', () => {
  const date = randomDate()
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

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValueOnce(date)
    const mockGetObject = awsS3Service.getObject as jest.Mock
    mockGetObject.mockRejectedValue(new Error('Some error'))
    const mockCreateIndictment = createIndictment as jest.Mock
    mockCreateIndictment.mockRejectedValue(new Error('Some error'))
    const mockUpdatePoliceCase = mockPoliceService.updatePoliceCase as jest.Mock
    mockUpdatePoliceCase.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      await internalCaseController
        .deliverIndictmentCaseIndictmentToPolice(caseId, theCase, {
          user,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('deliver indictment case files to police', () => {
    const caseId = uuid()
    const caseType = CaseType.INDICTMENT
    const caseState = CaseState.ACCEPTED
    const policeCaseNumber = uuid()
    const defendantNationalId = '0123456789'
    const indictmentKey = uuid()
    const indictmentPdf = 'test indictment'
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      type: caseType,
      state: caseState,
      policeCaseNumbers: [policeCaseNumber],
      defendants: [{ nationalId: defendantNationalId }],
      caseFiles: [
        { key: indictmentKey, category: CaseFileCategory.INDICTMENT },
      ],
    } as Case

    let then: Then

    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(indictmentPdf)
      const mockUpdatePoliceCase =
        mockPoliceService.updatePoliceCase as jest.Mock
      mockUpdatePoliceCase.mockResolvedValueOnce(true)

      then = await givenWhenThen(caseId, theCase)
    })

    it('should update the police case', async () => {
      expect(mockAwsS3Service.getObject).toHaveBeenCalledWith(indictmentKey)
      expect(mockPoliceService.updatePoliceCase).toHaveBeenCalledWith(
        user,
        caseId,
        caseType,
        caseState,
        policeCaseNumber,
        defendantNationalId,
        date,
        '',
        [
          {
            type: CourtDocumentType.RVAS,
            courtDocument: Base64.btoa(indictmentPdf),
          },
        ],
      )
      expect(then.result.delivered).toEqual(true)
    })
  })

  describe('deliver generated indictment pdf to police', () => {
    const caseId = uuid()
    const caseType = CaseType.INDICTMENT
    const caseState = CaseState.ACCEPTED
    const policeCaseNumber = uuid()
    const defendantNationalId = '0123456789'
    const indictmentPdf = 'test indictment'
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      type: caseType,
      state: caseState,
      policeCaseNumbers: [policeCaseNumber],
      defendants: [{ nationalId: defendantNationalId }],
    } as Case

    let then: Then

    beforeEach(async () => {
      const mockCreateIndictment = createIndictment as jest.Mock
      mockCreateIndictment.mockResolvedValueOnce(indictmentPdf)
      const mockUpdatePoliceCase =
        mockPoliceService.updatePoliceCase as jest.Mock
      mockUpdatePoliceCase.mockResolvedValueOnce(true)

      then = await givenWhenThen(caseId, theCase)
    })

    it('should update the police case', async () => {
      expect(createIndictment).toHaveBeenCalledWith(
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
        date,
        '',
        [
          {
            type: CourtDocumentType.RVAS,
            courtDocument: Base64.btoa(indictmentPdf),
          },
        ],
      )
      expect(then.result.delivered).toEqual(true)
    })
  })
})
