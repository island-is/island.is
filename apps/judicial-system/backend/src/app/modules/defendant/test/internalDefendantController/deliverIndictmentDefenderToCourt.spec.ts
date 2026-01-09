import { v4 as uuid } from 'uuid'

import { CaseType, User } from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { CourtService } from '../../../court'
import { Case, Defendant } from '../../../repository'
import { DeliverDto } from '../../dto/deliver.dto'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result?: DeliverResponse
  error?: Error
}

type GivenWhenThen = (
  caseId: string,
  defendantId: string,
  theCase: Case,
  defendant: Defendant,
  body: DeliverDto,
) => Promise<Then>

describe('InternalDefendantController - Deliver indictment defender to court', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const defendantId = uuid()
  const courtName = uuid()
  const courtCaseNumber = uuid()

  const defendant = {
    id: defendantId,
    name: 'Test Ákærði',
    nationalId: '1234567890',
    defenderNationalId: '1234567899',
    defenderName: 'Test Verjandi',
    defenderEmail: 'defenderEmail',
  } as Defendant
  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    court: { name: courtName },
    courtCaseNumber,
    defendants: [defendant],
  } as Case

  let mockCourtService: jest.Mocked<CourtService>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { courtService, internalDefendantController } =
      await createTestingDefendantModule()

    mockCourtService = courtService as jest.Mocked<CourtService>
    mockCourtService.updateIndictmentCaseWithDefenderInfo.mockResolvedValue(
      uuid(),
    )

    givenWhenThen = async (
      caseId: string,
      defendantId: string,
      theCase: Case,
      defendant: Defendant,
      body: DeliverDto,
    ) => {
      const then = {} as Then

      await internalDefendantController
        .deliverIndictmentDefenderToCourt(
          caseId,
          defendantId,
          theCase,
          defendant,
          body,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  it('should deliver the defender information to court', async () => {
    const then = await givenWhenThen(caseId, defendantId, theCase, defendant, {
      user,
    })

    expect(
      mockCourtService.updateIndictmentCaseWithDefenderInfo,
    ).toHaveBeenCalledWith(
      user,
      caseId,
      courtName,
      courtCaseNumber,
      defendant.nationalId,
      defendant.defenderName,
      defendant.defenderEmail,
    )

    expect(then.result).toEqual({ delivered: true })
    expect(then.error).toBeUndefined()
  })

  it('should handle not deliver if error occurs', async () => {
    const error = new Error('Service error')
    mockCourtService.updateIndictmentCaseWithDefenderInfo.mockRejectedValueOnce(
      error,
    )

    const then = await givenWhenThen(caseId, defendantId, theCase, defendant, {
      user,
    })

    expect(then.result).toEqual({ delivered: false })
  })
})
