import { v4 as uuid } from 'uuid'

import {
  CaseOrigin,
  CaseState,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { randomDate } from '../../../../test'
import { PoliceService } from '../../../police'
import { Case } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver case to police', () => {
  const userId = uuid()
  const user = { id: userId } as User

  let mockPoliceService: PoliceService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { policeService, internalCaseController } =
      await createTestingCaseModule()

    mockPoliceService = policeService

    const mockUpdatePoliceCase = mockPoliceService.updatePoliceCase as jest.Mock
    mockUpdatePoliceCase.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      await internalCaseController
        .deliverCaseToPolice(caseId, theCase, { user })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('deliver case to police', () => {
    const caseId = uuid()
    const caseType = CaseType.CUSTODY
    const caseState = CaseState.ACCEPTED
    const policeCaseNumber = uuid()
    const courtCaseNumber = uuid()
    const defendantNationalId = '0123456789'
    const validToDate = randomDate()
    const caseConclusion = 'test conclusion'
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      type: caseType,
      state: caseState,
      policeCaseNumbers: [policeCaseNumber],
      courtCaseNumber,
      defendants: [{ nationalId: uuid() }],
      validToDate,
      conclusion: caseConclusion,
      policeDefendantNationalId: defendantNationalId,
    } as Case

    let then: Then

    beforeEach(async () => {
      const mockUpdatePoliceCase =
        mockPoliceService.updatePoliceCase as jest.Mock
      mockUpdatePoliceCase.mockResolvedValueOnce(true)

      then = await givenWhenThen(caseId, theCase)
    })

    it('should update the police case without delivering any documents', async () => {
      expect(mockPoliceService.updatePoliceCase).toHaveBeenCalledWith(
        user,
        caseId,
        caseType,
        caseState,
        policeCaseNumber,
        courtCaseNumber,
        defendantNationalId,
        validToDate,
        caseConclusion,
        [],
      )
      expect(then.result.delivered).toEqual(true)
    })
  })

  describe('deliver case to police fails', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      type: CaseType.CUSTODY,
      state: CaseState.ACCEPTED,
      policeCaseNumbers: [uuid()],
    } as Case

    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase)
    })

    it('should not deliver the case', async () => {
      expect(then.result.delivered).toEqual(false)
    })
  })
})
