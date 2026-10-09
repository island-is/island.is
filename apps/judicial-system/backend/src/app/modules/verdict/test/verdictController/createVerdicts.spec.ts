import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import { ServiceRequirement } from '@island.is/judicial-system/types'

import { createTestingVerdictModule } from '../createTestingVerdictModule'

import { getOrCreateTransaction } from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import {
  Case,
  Defendant,
  Verdict,
  VerdictRepositoryService,
} from '../../../repository'
import { CreateVerdictDto } from '../../dto/createVerdict.dto'

interface Then {
  result: Verdict[]
  error: Error
}

type GivenWhenThen = (verdictsToCreate: CreateVerdictDto[]) => Promise<Then>

describe('VerdictController - Create verdicts', () => {
  const caseId = uuid()
  const defendantId = uuid()
  const theCase = {
    id: caseId,
    defendants: [{ id: defendantId, caseId } as Defendant],
  } as Case

  let mockVerdictRepositoryService: VerdictRepositoryService
  let mockSequelize: Sequelize
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { verdictController, sequelize, verdictRepositoryService } =
      await createTestingVerdictModule()

    mockVerdictRepositoryService = verdictRepositoryService
    mockSequelize = sequelize

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    givenWhenThen = async (verdictsToCreate) => {
      const then = {} as Then

      // The route is guarded by CaseExistsForUpdateGuard, so the request
      // transaction is already open - and holding a lock on this case row -
      // by the time the handler runs. Guards do not execute in controller
      // unit tests, so the request context and that transaction are set up
      // here instead.
      try {
        await runInRequestContext(async () => {
          await getOrCreateTransaction(mockSequelize)

          then.result = await verdictController.createVerdicts(
            caseId,
            theCase,
            verdictsToCreate,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('verdict created', () => {
    const verdictToCreate = {
      defendantId,
      serviceRequirement: ServiceRequirement.REQUIRED,
    } as CreateVerdictDto
    const createdVerdict = { id: uuid(), caseId, ...verdictToCreate } as Verdict

    let then: Then

    beforeEach(async () => {
      const mockFindLatestForDefendant =
        mockVerdictRepositoryService.findLatestForDefendant as jest.Mock
      mockFindLatestForDefendant.mockResolvedValueOnce(null)

      const mockCreate = mockVerdictRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdVerdict)

      then = await givenWhenThen([verdictToCreate])
    })

    it('should create the verdict in the transaction the guard opened, without opening another', () => {
      // Once, by the stand-in for CaseExistsForUpdateGuard above. A second
      // call would be the handler opening a transaction of its own, which
      // would block on the guard's row lock and deadlock the request.
      expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
      expect(
        mockVerdictRepositoryService.findLatestForDefendant,
      ).toHaveBeenCalledWith(defendantId, { transaction })
      expect(mockVerdictRepositoryService.create).toHaveBeenCalledWith(
        { caseId, ...verdictToCreate },
        { transaction },
      )
      expect(then.result).toEqual([createdVerdict])
    })
  })

  describe('defendant is not on the case', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen([
        {
          defendantId: uuid(),
          serviceRequirement: ServiceRequirement.REQUIRED,
        } as CreateVerdictDto,
      ])
    })

    it('should create nothing', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(mockVerdictRepositoryService.create).not.toHaveBeenCalled()
    })
  })
})
