import { uuid } from 'uuidv4'

import { CaseType, User, UserRole } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { CourtService } from '../../../court'
import { Case } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  nationalId: string,
) => Promise<Then>

describe('InternalCaseController - Deliver assigned roles for indictment case to court', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const courtName = uuid()
  const courtCaseNumber = uuid()

  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    court: { name: courtName },
    courtCaseNumber,
    judge: {
      name: 'Test Dómari',
      nationalId: '0101010101',
      role: UserRole.DISTRICT_COURT_JUDGE,
    },
    registrar: { name: 'Test Ritari', nationalId: '0202020202' },
  } as Case

  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeAll(async () => {
    const { courtService, internalCaseController } =
      await createTestingCaseModule()

    mockCourtService = courtService
    const mockUpdateIndictmentCaseWithAssignedRoles =
      mockCourtService.updateIndictmentCaseWithAssignedRoles as jest.Mock
    mockUpdateIndictmentCaseWithAssignedRoles.mockResolvedValue(uuid())

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      nationalId: string,
    ) => {
      const then = {} as Then

      await internalCaseController
        .deliverIndictmentAssignedRoleToCourt(
          caseId,
          theCase,
          { user },
          nationalId,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('deliver assigned roles in indictment case to court', () => {
    let then: Then

    beforeAll(async () => {
      then = await givenWhenThen(caseId, theCase, '0101010101')
    })

    it('should deliver the assigned roles to the court', () => {
      expect(
        mockCourtService.updateIndictmentCaseWithAssignedRoles,
      ).toHaveBeenCalledWith(user, caseId, courtName, courtCaseNumber, {
        name: theCase.judge?.name,
        role: UserRole.DISTRICT_COURT_JUDGE,
      })

      expect(then.result).toEqual({ delivered: true })
    })
  })
})
