import { v4 as uuid } from 'uuid'

import {
  CaseType,
  EventType,
  IndictmentSubtype,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { randomDate } from '../../../../test'
import { CourtService } from '../../../court'
import { Case } from '../../../repository'
import { DeliverDto } from '../../dto/deliver.dto'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  body: DeliverDto,
) => Promise<Then>

describe('InternalCaseController - Deliver indictment info to court', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const courtName = uuid()
  const policeCaseNumber = uuid()
  const policeCaseNumber2 = uuid()
  const courtCaseNumber = uuid()
  const receivedDate = randomDate()
  const indictmentDate = randomDate()

  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    policeCaseNumbers: [policeCaseNumber, policeCaseNumber2],
    indictmentSubtypes: {
      [policeCaseNumber]: [
        IndictmentSubtype.TRAFFIC_VIOLATION,
        IndictmentSubtype.COVER_UP,
      ],
      [policeCaseNumber2]: [IndictmentSubtype.THEFT],
    },
    court: { name: courtName },
    courtCaseNumber,
    eventLogs: [
      { eventType: EventType.CASE_RECEIVED_BY_COURT, created: receivedDate },
      { eventType: EventType.INDICTMENT_CONFIRMED, created: indictmentDate },
    ],
    defendants: [{ name: 'Test Ákærði', nationalId: '1234567890' }],
    prosecutor: {
      name: 'Test Sækjandi',
      nationalId: '0101010101',
      email: 'prosecutor@omnitrix.is',
    },
  } as Case

  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { courtService, internalCaseController } =
      await createTestingCaseModule()

    mockCourtService = courtService
    const mockUpdateIndictmentCaseWithIndictmentInfo =
      mockCourtService.updateIndictmentCaseWithIndictmentInfo as jest.Mock
    mockUpdateIndictmentCaseWithIndictmentInfo.mockResolvedValue(uuid())

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      await internalCaseController
        .deliverIndictmentInfoToCourt(caseId, theCase, { user })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('deliver indictment info to court', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase, { user })
    })

    it('should deliver the indictment info', () => {
      expect(
        mockCourtService.updateIndictmentCaseWithIndictmentInfo,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        courtName,
        courtCaseNumber,
        indictmentDate,
        indictmentDate,
        policeCaseNumber,
        ['Umferðarlagabrot', 'Hylming', 'Þjófnaður'],
        theCase.defendants,
        theCase.prosecutor,
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })
})
