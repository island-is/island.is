import { v4 as uuid } from 'uuid'

import { CaseType, User } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { CourtService } from '../../../court'
import { AppealCase, Case } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalCaseController - Deliver assigned roles to court of appeals', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const appealCaseId = uuid()
  const appealCaseNumber = uuid()
  const appealAssistantId = uuid()
  const appealJudge1Id = uuid()
  const appealJudge2Id = uuid()
  const appealJudge3Id = uuid()
  const appealAssistantNationalId = uuid()
  const appealAssistantName = uuid()
  const appealJudge1NationalId = uuid()
  const appealJudge1Name = uuid()
  const appealJudge2NationalId = uuid()
  const appealJudge2Name = uuid()
  const appealJudge3NationalId = uuid()
  const appealJudge3Name = uuid()

  const theCase = {
    id: caseId,
    type: CaseType.CUSTODY,
  } as Case

  // The bench is stored in order; the robot gets the first three, presiding
  // judge first, so a fourth judge is not delivered.
  const appealCase = {
    id: appealCaseId,
    appealCaseNumber,
    appealAssistantId,
    appealAssistant: {
      nationalId: appealAssistantNationalId,
      name: appealAssistantName,
    },
    appealJudges: [
      {
        displayOrder: 2,
        userId: appealJudge3Id,
        user: { nationalId: appealJudge3NationalId, name: appealJudge3Name },
      },
      {
        displayOrder: 0,
        userId: appealJudge1Id,
        user: { nationalId: appealJudge1NationalId, name: appealJudge1Name },
      },
      {
        displayOrder: 1,
        userId: appealJudge2Id,
        user: { nationalId: appealJudge2NationalId, name: appealJudge2Name },
      },
      {
        displayOrder: 3,
        userId: uuid(),
        user: { nationalId: uuid(), name: uuid() },
      },
    ],
  } as unknown as AppealCase

  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { courtService, internalCaseController } =
      await createTestingCaseModule()

    mockCourtService = courtService
    const mockUpdateAppealCaseWithAssignedRoles =
      mockCourtService.updateAppealCaseWithAssignedRoles as jest.Mock
    mockUpdateAppealCaseWithAssignedRoles.mockResolvedValue(uuid())

    givenWhenThen = async () => {
      const then = {} as Then

      await internalCaseController
        .deliverAssignedRolesToCourtOfAppeals(
          caseId,
          appealCaseId,
          theCase,
          appealCase,
          {
            user,
          },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('assigned roles delivered', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should return success', () => {
      expect(
        mockCourtService.updateAppealCaseWithAssignedRoles,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        appealCaseNumber,
        appealAssistantNationalId,
        appealAssistantName,
        appealJudge1NationalId,
        appealJudge1Name,
        appealJudge2NationalId,
        appealJudge2Name,
        appealJudge3NationalId,
        appealJudge3Name,
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
