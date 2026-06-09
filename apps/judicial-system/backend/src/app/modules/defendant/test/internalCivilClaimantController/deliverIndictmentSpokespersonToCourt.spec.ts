import { v4 as uuid } from 'uuid'

import { CaseType, User } from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { CourtService } from '../../../court'
import { Case, CivilClaimant } from '../../../repository'
import { DeliverDto } from '../../dto/deliver.dto'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result?: DeliverResponse
  error?: Error
}

type GivenWhenThen = (
  caseId: string,
  civilClaimantId: string,
  theCase: Case,
  civilClaimant: CivilClaimant,
  body: DeliverDto,
) => Promise<Then>

describe('InternalCivilClaimantController - Deliver indictment spokesperson to court', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const civilClaimantId = uuid()
  const courtName = 'Héraðsdómur Reykjavíkur'
  const courtCaseNumber = 'S-123/2026'

  const civilClaimant = {
    id: civilClaimantId,
    caseId,
    name: 'Brotaþoli Brotaþolason',
    nationalId: '1234567890',
    hasSpokesperson: true,
    spokespersonIsLawyer: true,
    spokespersonNationalId: '0987654321',
    spokespersonName: 'Lögmaður Lögmanns',
    spokespersonEmail: 'logmadur@test.is',
  } as CivilClaimant

  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    court: { name: courtName },
    courtCaseNumber,
  } as Case

  let mockCourtService: jest.Mocked<CourtService>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { courtService, internalCivilClaimantController } =
      await createTestingDefendantModule()

    mockCourtService = courtService as jest.Mocked<CourtService>
    mockCourtService.updateIndictmentCaseWithSpokespersonInfo.mockResolvedValue(
      uuid(),
    )

    givenWhenThen = async (
      caseId: string,
      civilClaimantId: string,
      theCase: Case,
      civilClaimant: CivilClaimant,
      body: DeliverDto,
    ) => {
      const then = {} as Then

      await internalCivilClaimantController
        .deliverIndictmentSpokespersonToCourt(
          caseId,
          civilClaimantId,
          theCase,
          civilClaimant,
          body,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  it('should deliver the spokesperson information to court', async () => {
    const then = await givenWhenThen(
      caseId,
      civilClaimantId,
      theCase,
      civilClaimant,
      { user },
    )

    expect(
      mockCourtService.updateIndictmentCaseWithSpokespersonInfo,
    ).toHaveBeenCalledWith(
      user,
      caseId,
      courtName,
      courtCaseNumber,
      civilClaimant.nationalId,
      civilClaimant.name,
      civilClaimant.spokespersonNationalId,
      civilClaimant.spokespersonIsLawyer,
    )

    expect(then.result).toEqual({ delivered: true })
    expect(then.error).toBeUndefined()
  })

  it('should return delivered false if court service fails', async () => {
    mockCourtService.updateIndictmentCaseWithSpokespersonInfo.mockRejectedValueOnce(
      new Error('Court service error'),
    )

    const then = await givenWhenThen(
      caseId,
      civilClaimantId,
      theCase,
      civilClaimant,
      { user },
    )

    expect(then.result).toEqual({ delivered: false })
    expect(then.error).toBeUndefined()
  })
})
