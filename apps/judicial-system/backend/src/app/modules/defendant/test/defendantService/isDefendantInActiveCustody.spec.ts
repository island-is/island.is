import { literal, Op } from 'sequelize'

import { CaseState, CaseType } from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import {
  Case,
  Defendant,
  DefendantRepositoryService,
} from '../../../repository'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = (defendants?: Defendant[]) => Promise<Then>

describe('DefendantService - isDefendantInActiveCustody', () => {
  let mockDefendantRepositoryService: DefendantRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { defendantRepositoryService, defendantService } =
      await createTestingDefendantModule()

    mockDefendantRepositoryService = defendantRepositoryService

    givenWhenThen = async (defendants?: Defendant[]) => {
      const then = {} as Then

      try {
        then.result = await defendantService.isDefendantInActiveCustody(
          defendants,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe.each([
    undefined,
    [],
    [{ noNationalId: true }],
    [{ noNationalId: false }],
  ])('when no defendants is missing required nationalId', (defendants) => {
    let then: Then
    beforeEach(async () => {
      then = await givenWhenThen(defendants as Defendant[] | undefined)
    })

    it('should retrun false', () => {
      expect(then.result).toEqual(false)
    })
  })

  describe('when defendant is in active custody', () => {
    let then: Then
    let mockFindAll: jest.Mock<Promise<Defendant[]>>
    const defendants = [
      { noNationalId: false, nationalId: '0000000000' },
    ] as Defendant[]

    beforeEach(async () => {
      mockFindAll = mockDefendantRepositoryService.findAll as jest.Mock
      mockFindAll.mockResolvedValue([
        {
          case: { id: '123' },
        },
      ] as Defendant[])
      then = await givenWhenThen(defendants)
    })

    it('should retrun true', () => {
      expect(mockFindAll).toBeCalledWith({
        include: [
          {
            model: Case,
            as: 'case',
            where: {
              state: CaseState.ACCEPTED,
              type: CaseType.CUSTODY,
              valid_to_date: { [Op.gte]: literal('current_date') },
            },
          },
        ],
        where: { nationalId: defendants[0].nationalId },
      })
      expect(then.result).toEqual(true)
    })
  })

  describe('when defendant is not in any active custody', () => {
    let then: Then
    let mockFindAll: jest.Mock<Promise<Defendant[]>>
    const defendants = [
      { noNationalId: false, nationalId: '0000000000' },
    ] as Defendant[]

    beforeEach(async () => {
      mockFindAll = mockDefendantRepositoryService.findAll as jest.Mock
      mockFindAll.mockResolvedValue([{}, {}, {}] as Defendant[])
      then = await givenWhenThen(defendants)
    })

    it('should retrun false', () => {
      expect(mockFindAll).toBeCalledWith({
        include: [
          {
            model: Case,
            as: 'case',
            where: {
              state: CaseState.ACCEPTED,
              type: CaseType.CUSTODY,
              valid_to_date: { [Op.gte]: literal('current_date') },
            },
          },
        ],
        where: { nationalId: defendants[0].nationalId },
      })
      expect(then.result).toEqual(false)
    })
  })

  describe('when defendant is not found', () => {
    let then: Then
    let mockFindAll: jest.Mock<Promise<Defendant[]>>
    const defendants = [
      { noNationalId: false, nationalId: '0000000000' },
    ] as Defendant[]

    beforeEach(async () => {
      mockFindAll = mockDefendantRepositoryService.findAll as jest.Mock
      mockFindAll.mockResolvedValue([] as Defendant[])
      then = await givenWhenThen(defendants)
    })

    it('should retrun false', () => {
      expect(then.result).toEqual(false)
    })
  })
})
