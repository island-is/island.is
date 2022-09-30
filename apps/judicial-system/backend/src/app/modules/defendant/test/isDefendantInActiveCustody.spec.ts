import { Defendant } from '../models/defendant.model'
import { createTestingDefendantModule } from './createTestingDefendantModule'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = (defendants?: Defendant[]) => Promise<Then>

describe('NotificationService - sendRulingNotifications', () => {
  let then: Then
  let mockDefendantModel: typeof Defendant
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      defendantModel,
      defendantService,
    } = await createTestingDefendantModule()

    mockDefendantModel = defendantModel

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

  describe('when no defendants', () => {
    beforeEach(async () => {
      await givenWhenThen()
    })

    it('should retrun false', () => {
      expect(then.result).toEqual(false)
    })
  })

  describe('when empty list of defendants', () => {
    beforeEach(async () => {
      await givenWhenThen([])
    })

    it('should retrun false', () => {
      expect(then.result).toEqual(false)
    })
  })

  describe('when defendant has no nationalId', () => {
    const defendants = [{ noNationalId: true }] as Defendant[]
    beforeEach(async () => {
      await givenWhenThen(defendants)
    })

    it('should retrun false', () => {
      expect(then.result).toEqual(false)
    })
  })

  describe('when defendant has no nationalId', () => {
    const defendants = [{ noNationalId: false }] as Defendant[]
    beforeEach(async () => {
      const mockFindAll = mockDefendantModel.findAll as jest.Mock
      mockFindAll.mockResolvedValue([
        {
          case: { id: '123' },
        },
      ])
      await givenWhenThen(defendants)
    })

    it('should retrun true', () => {
      expect(then.result).toEqual(true)
    })
  })
})
