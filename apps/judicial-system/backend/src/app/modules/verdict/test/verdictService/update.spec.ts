import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import * as MessageModule from '@island.is/judicial-system/message'
import {
  IndictmentCaseNotificationType,
  ServiceRequirement,
} from '@island.is/judicial-system/types'

import { createTestingVerdictModule } from '../createTestingVerdictModule'

import { Case, Verdict, VerdictRepositoryService } from '../../../repository'
import { UpdateVerdictDto } from '../../dto/updateVerdict.dto'

interface Then {
  result: Verdict
  error: Error
}

type GivenWhenThen = (args: {
  verdict: Verdict
  update: UpdateVerdictDto
  theCase: Case
  defendantId: string
}) => Promise<Then>

describe('VerdictService - update', () => {
  const caseId = uuid()
  const verdictId = uuid()
  const defendantId = uuid()

  let mockVerdictRepositoryService: VerdictRepositoryService
  let transaction: Transaction
  let mockAddMessagesToQueue: jest.Mock

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.resetAllMocks()

    const { verdictService, verdictRepositoryService } =
      await createTestingVerdictModule()

    mockVerdictRepositoryService = verdictRepositoryService
    transaction = {} as Transaction
    mockAddMessagesToQueue = (
      jest.requireMock(
        '@island.is/judicial-system/message',
      ) as typeof MessageModule
    ).addMessagesToQueue as jest.Mock

    givenWhenThen = async ({ verdict, update, theCase, defendantId }) => {
      const then = {} as Then

      await verdictService
        .update(verdict, update, transaction, theCase, defendantId)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('when service date is entered manually for a suspended driving license', () => {
    let then: Then
    let updatedVerdict: Verdict

    beforeEach(async () => {
      const verdict = {
        id: verdictId,
        caseId,
        defendantId,
        serviceRequirement: ServiceRequirement.REQUIRED,
        serviceDate: null,
      } as unknown as Verdict

      const update = {
        serviceDate: new Date(2025, 1, 1),
      } as UpdateVerdictDto

      const theCase = {
        id: caseId,
        defendants: [
          {
            id: defendantId,
            isDrivingLicenseSuspended: true,
          },
        ],
      } as Case

      updatedVerdict = { ...verdict, ...update } as unknown as Verdict

      const mockUpdate = mockVerdictRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedVerdict)

      then = await givenWhenThen({ verdict, update, theCase, defendantId })
    })

    it('should update verdict and enqueue driving license suspension notification', () => {
      expect(mockVerdictRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        defendantId,
        verdictId,
        {
          serviceDate: new Date(2025, 1, 1),
        },
        { transaction },
      )

      expect(mockAddMessagesToQueue).toHaveBeenCalledWith({
        type: 'INDICTMENT_CASE_NOTIFICATION',
        caseId,
        body: {
          type: IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENSION,
        },
      })

      expect(then.result).toBe(updatedVerdict)
    })
  })

  describe('when service date already exists on verdict', () => {
    let then: Then

    beforeEach(async () => {
      const verdict = {
        id: verdictId,
        caseId,
        defendantId,
        serviceRequirement: ServiceRequirement.REQUIRED,
        serviceDate: new Date(2025, 0, 1),
      } as unknown as Verdict

      const update = {
        serviceDate: new Date(2025, 1, 1),
      } as UpdateVerdictDto

      const theCase = {
        id: caseId,
        defendants: [
          {
            id: defendantId,
            isDrivingLicenseSuspended: true,
          },
        ],
      } as Case

      const updatedVerdict = { ...verdict, ...update } as unknown as Verdict

      const mockUpdate = mockVerdictRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedVerdict)

      then = await givenWhenThen({ verdict, update, theCase, defendantId })
    })

    it('should update verdict without enqueuing notification', () => {
      expect(mockVerdictRepositoryService.update).toHaveBeenCalledTimes(1)
      expect(mockAddMessagesToQueue).not.toHaveBeenCalled()
      expect(then.result).toBeDefined()
    })
  })

  describe('when service requirement is not required', () => {
    let then: Then

    beforeEach(async () => {
      const verdict = {
        id: verdictId,
        caseId,
        defendantId,
        serviceRequirement: ServiceRequirement.NOT_REQUIRED,
        serviceDate: null,
      } as unknown as Verdict

      const update = {
        serviceDate: new Date(2025, 1, 1),
      } as UpdateVerdictDto

      const theCase = {
        id: caseId,
        defendants: [
          {
            id: defendantId,
            isDrivingLicenseSuspended: true,
          },
        ],
      } as Case

      const updatedVerdict = { ...verdict, ...update } as unknown as Verdict

      const mockUpdate = mockVerdictRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedVerdict)

      then = await givenWhenThen({ verdict, update, theCase, defendantId })
    })

    it('should update verdict without enqueuing notification', () => {
      expect(mockVerdictRepositoryService.update).toHaveBeenCalledTimes(1)
      expect(mockAddMessagesToQueue).not.toHaveBeenCalled()
      expect(then.result).toBeDefined()
    })
  })
})
