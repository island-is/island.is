import { uuid } from 'uuidv4'

import { CaseType, User } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { CourtService } from '../../../court'
import { DeliverDto } from '../../dto/deliver.dto'
import { Case } from '../../models/case.model'
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

describe('InternalCaseController - Deliver indictment defender info to court', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const courtCaseNumber = uuid()

  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    courtCaseNumber,
    defendants: [
      {
        name: 'Test Ákærði',
        nationalId: '1234567890',
        defenderNationalId: '1234567899',
        defenderName: 'Test Verjandi',
        defenderEmail: 'defenderEmail',
      },
      {
        name: 'Test Ákærði 2',
        nationalId: '1234567891',
        defenderNationalId: '1234567898',
        defenderName: 'Test Verjandi 2',
        defenderEmail: 'defenderEmail2',
      },
    ],
  } as Case

  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { courtService, internalCaseController } =
      await createTestingCaseModule()

    mockCourtService = courtService
    const mockUpdateIndictmentCaseWithIndictmentInfo =
      mockCourtService.updateIndictmentWithDefenderInfo as jest.Mock
    mockUpdateIndictmentCaseWithIndictmentInfo.mockResolvedValue(uuid())

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      await internalCaseController
        .deliverIndictmentDefenderInfoToCourt(caseId, theCase, { user })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('deliver indictment defender to court', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase, { user })
    })

    it('should deliver the defender information to court', () => {
      expect(
        mockCourtService.updateIndictmentWithDefenderInfo,
      ).toHaveBeenCalledWith(
        user,
        theCase.id,
        theCase.courtCaseNumber,
        theCase.defendants,
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })
})
