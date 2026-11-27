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
  const appealJudge4Id = uuid()
  const appealAssistantNationalId = uuid()
  const appealAssistantName = uuid()
  const appealJudge1NationalId = uuid()
  const appealJudge1Name = uuid()
  const appealJudge2NationalId = uuid()
  const appealJudge2Name = uuid()
  const appealJudge3NationalId = uuid()
  const appealJudge3Name = uuid()
  const appealJudge4NationalId = uuid()
  const appealJudge4Name = uuid()

  const theCase = {
    id: caseId,
    type: CaseType.CUSTODY,
  } as Case

  // The bench is stored in order; the robot gets every judge, presiding first.
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
        userId: appealJudge4Id,
        user: { nationalId: appealJudge4NationalId, name: appealJudge4Name },
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

    it('should deliver every seated judge in display order', () => {
      expect(
        mockCourtService.updateAppealCaseWithAssignedRoles,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        appealCaseNumber,
        appealAssistantNationalId,
        appealAssistantName,
        [
          {
            nationalId: appealJudge1NationalId,
            name: appealJudge1Name,
          },
          {
            nationalId: appealJudge2NationalId,
            name: appealJudge2Name,
          },
          {
            nationalId: appealJudge3NationalId,
            name: appealJudge3Name,
          },
          {
            nationalId: appealJudge4NationalId,
            name: appealJudge4Name,
          },
        ],
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
