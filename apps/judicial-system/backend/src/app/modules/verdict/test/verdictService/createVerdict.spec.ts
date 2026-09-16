import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { createTestingVerdictModule } from '../createTestingVerdictModule'

import { Verdict, VerdictRepositoryService } from '../../../repository'
import { CreateVerdictDto } from '../../dto/createVerdict.dto'

interface Then {
  result: Verdict
  error: Error
}

type GivenWhenThen = (verdict: CreateVerdictDto) => Promise<Then>

describe('VerdictService - createVerdict', () => {
  const caseId = uuid()
  const defendantId = uuid()

  let mockVerdictRepositoryService: VerdictRepositoryService
  let transaction: Transaction

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.resetAllMocks()

    const { verdictService, verdictRepositoryService } =
      await createTestingVerdictModule()

    mockVerdictRepositoryService = verdictRepositoryService
    transaction = {} as Transaction

    givenWhenThen = async (verdict) => {
      const then = {} as Then

      await verdictService
        .createVerdict(caseId, verdict, transaction)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('defendant has no verdict yet', () => {
    const verdict = { defendantId, isDefaultJudgement: true }
    const createdVerdict = { id: uuid() } as Verdict
    let then: Then

    beforeEach(async () => {
      const mockFindLatest =
        mockVerdictRepositoryService.findLatestForDefendant as jest.Mock
      mockFindLatest.mockResolvedValueOnce(null)

      const mockCreate = mockVerdictRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdVerdict)

      then = await givenWhenThen(verdict)
    })

    it('creates a verdict for the defendant in the case', () => {
      expect(
        mockVerdictRepositoryService.findLatestForDefendant,
      ).toHaveBeenCalledWith(defendantId, { transaction })
      expect(mockVerdictRepositoryService.create).toHaveBeenCalledWith(
        { caseId, ...verdict },
        { transaction },
      )
      expect(then.result).toBe(createdVerdict)
    })
  })

  describe('defendant already has a verdict', () => {
    const verdict = { defendantId }
    const currentVerdict = { id: uuid() } as Verdict
    let then: Then

    beforeEach(async () => {
      const mockFindLatest =
        mockVerdictRepositoryService.findLatestForDefendant as jest.Mock
      mockFindLatest.mockResolvedValueOnce(currentVerdict)

      then = await givenWhenThen(verdict)
    })

    it('keeps the existing verdict and creates none', () => {
      expect(mockVerdictRepositoryService.create).not.toHaveBeenCalled()
      expect(then.result).toBe(currentVerdict)
    })
  })
})
