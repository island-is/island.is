import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { Defendant, DefendantRepositoryService } from '../../../repository'

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

    it('should return false without asking the repository', () => {
      expect(
        mockDefendantRepositoryService.existsInActiveCustody,
      ).not.toHaveBeenCalled()
      expect(then.result).toEqual(false)
    })
  })

  describe('when defendant is in active custody', () => {
    let then: Then
    const defendants = [
      { noNationalId: false, nationalId: '0000000000' },
    ] as Defendant[]

    beforeEach(async () => {
      const mockExistsInActiveCustody =
        mockDefendantRepositoryService.existsInActiveCustody as jest.Mock
      mockExistsInActiveCustody.mockResolvedValueOnce(true)

      then = await givenWhenThen(defendants)
    })

    it('should return true', () => {
      expect(
        mockDefendantRepositoryService.existsInActiveCustody,
      ).toHaveBeenCalledWith(defendants[0].nationalId)
      expect(then.result).toEqual(true)
    })
  })

  describe('when defendant is not in any active custody', () => {
    let then: Then
    const defendants = [
      { noNationalId: false, nationalId: '0000000000' },
    ] as Defendant[]

    beforeEach(async () => {
      const mockExistsInActiveCustody =
        mockDefendantRepositoryService.existsInActiveCustody as jest.Mock
      mockExistsInActiveCustody.mockResolvedValueOnce(false)

      then = await givenWhenThen(defendants)
    })

    it('should return false', () => {
      expect(
        mockDefendantRepositoryService.existsInActiveCustody,
      ).toHaveBeenCalledWith(defendants[0].nationalId)
      expect(then.result).toEqual(false)
    })
  })
})
