import { uuid } from 'uuidv4'

import { CaseType, User } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { CourtService } from '../../../court'
import { Case } from '../../models/case.model'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  withCourtCaseNumber: boolean,
) => Promise<Then>

describe('InternalCaseController - Deliver indictment cancellation notice to court', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const courtName = uuid()
  const courtCaseNumber = uuid()
  const prosecutorsOffice = uuid()

  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    creatingProsecutor: { institution: { name: prosecutorsOffice } },
    court: { name: courtName },
    courtCaseNumber,
  } as Case

  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeAll(async () => {
    const { courtService, internalCaseController } =
      await createTestingCaseModule()

    mockCourtService = courtService
    const mockUpdateIndictmentCaseWithCancellationNotice =
      mockCourtService.updateIndictmentCaseWithCancellationNotice as jest.Mock
    mockUpdateIndictmentCaseWithCancellationNotice.mockResolvedValue(uuid())

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      withCourtCaseNumber: boolean,
    ) => {
      const then = {} as Then

      await internalCaseController
        .deliverIndictmentCancellationNoticeToCourt(caseId, theCase, {
          user,
          withCourtCaseNumber,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('deliver cancellation notice with court case number', () => {
    let then: Then

    beforeAll(async () => {
      then = await givenWhenThen(caseId, theCase, true)
    })

    it('should deliver the cancellation notice', () => {
      expect(
        mockCourtService.updateIndictmentCaseWithCancellationNotice,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        courtName,
        courtCaseNumber,
        `Ákæra afturkölluð í máli ${courtCaseNumber}`,
        `${prosecutorsOffice} hefur afturkallað ákæru í máli ${courtCaseNumber}. Hægt er að nálgast yfirlitssíðu málsins á rettarvorslugatt.island.is.`,
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('deliver cancellation notice without court case number', () => {
    let then: Then

    beforeAll(async () => {
      then = await givenWhenThen(caseId, theCase, false)
    })

    it('should deliver the cancellation notice', () => {
      expect(
        mockCourtService.updateIndictmentCaseWithCancellationNotice,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        courtName,
        courtCaseNumber,
        'Ákæra afturkölluð',
        `${prosecutorsOffice} hefur afturkallað ákæru í máli sem ekki hefur enn fengið málsnúmer. Hægt er að nálgast yfirlitssíðu málsins á rettarvorslugatt.island.is.`,
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })
})
