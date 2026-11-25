import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import {
  CaseIndictmentRulingDecision,
  ServiceRequirement,
  VerdictAppealDecision,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

import { createTestingVerdictModule } from '../createTestingVerdictModule'

import { getOrCreateTransaction } from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import {
  Case,
  Defendant,
  Verdict,
  VerdictRepositoryService,
} from '../../../repository'
import { InternalUpdateVerdictDto } from '../../dto/internalUpdateVerdict.dto'

interface Then {
  result: Verdict
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalVerdictController - Update verdict appeal', () => {
  const caseId = uuid()
  const defendantId = uuid()
  const defendantNationalId = '0000000000'
  const verdictId = uuid()

  const verdict = {
    id: verdictId,
    caseId,
    defendantId,
    serviceRequirement: ServiceRequirement.REQUIRED,
    serviceDate: new Date(2025, 2, 2),
    serviceStatus: VerdictServiceStatus.ELECTRONICALLY,
  } as Verdict

  const defendant = {
    id: defendantId,
    nationalId: defendantNationalId,
    verdicts: [verdict],
  } as Defendant

  const theCase = {
    id: caseId,
    defendants: [defendant],
    indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
    rulingDate: new Date(2025, 1, 1),
  } as Case

  const dto = {
    appealDecision: VerdictAppealDecision.ACCEPT,
  } as InternalUpdateVerdictDto

  const now = new Date(2025, 2, 10)
  let mockVerdictRepositoryService: VerdictRepositoryService
  let mockSequelize: Sequelize
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { sequelize, internalVerdictController, verdictRepositoryService } =
      await createTestingVerdictModule()

    mockVerdictRepositoryService = verdictRepositoryService
    mockSequelize = sequelize

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    givenWhenThen = async (): Promise<Then> => {
      const then = {} as Then

      // The route is guarded by CaseExistsForUpdateGuard, so the request
      // transaction is already open - and holding a lock on this case row -
      // by the time the handler runs. Guards do not execute in controller
      // unit tests, so the request context and that transaction are set up
      // here instead.
      try {
        await runInRequestContext(async () => {
          await getOrCreateTransaction(mockSequelize)

          then.result = await internalVerdictController.updateVerdictAppeal(
            caseId,
            defendantNationalId,
            theCase,
            defendant,
            verdict,
            dto,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('verdict updated', () => {
    const updatedVerdict = { ...verdict, ...dto }

    let then: Then

    beforeEach(async () => {
      jest.spyOn(Date, 'now').mockImplementation(() => now.getTime())

      const mockUpdate = mockVerdictRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedVerdict)

      then = await givenWhenThen()
    })

    it('should update the verdict in the transaction the guard opened, without opening another', () => {
      // Once, by the stand-in for CaseExistsForUpdateGuard above. A second
      // call would be the handler opening a transaction of its own, which
      // would block on the guard's row lock and deadlock the request.
      expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
      expect(mockVerdictRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        defendantId,
        verdictId,
        dto,
        { transaction },
      )
      expect(then.result).toBe(updatedVerdict)
    })
  })
})
