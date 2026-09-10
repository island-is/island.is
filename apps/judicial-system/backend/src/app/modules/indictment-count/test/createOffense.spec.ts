import { v4 as uuid } from 'uuid'

import { IndictmentCountOffense } from '@island.is/judicial-system/types'

import { createTestingIndictmentCountModule } from './createTestingIndictmentCountModule'

import { Offense, OffenseRepositoryService } from '../../repository'

interface Then {
  result: Offense
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  indictmentCountId: string,
  offense: IndictmentCountOffense,
) => Promise<Then>

describe('IndictmentCountController - Create offense', () => {
  let mockOffenseRepositoryService: OffenseRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { offenseRepositoryService, indictmentCountController } =
      await createTestingIndictmentCountModule()

    mockOffenseRepositoryService = offenseRepositoryService

    givenWhenThen = async (
      caseId: string,
      indictmentCountId: string,
      offense: IndictmentCountOffense,
    ) => {
      const then = {} as Then

      try {
        then.result = await indictmentCountController.createOffense(
          caseId,
          indictmentCountId,
          { offense },
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('offense created', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    const offense = IndictmentCountOffense.DRIVING_WITHOUT_LICENCE
    const createdOffense = { id: uuid(), indictmentCountId, offense }
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockOffenseRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdOffense)

      then = await givenWhenThen(caseId, indictmentCountId, offense)
    })

    it('should create an offense', () => {
      expect(mockOffenseRepositoryService.create).toHaveBeenCalledWith(
        indictmentCountId,
        offense,
      )
      expect(then.result).toBe(createdOffense)
    })
  })

  describe('offense creation fails', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    const offense = IndictmentCountOffense.DRIVING_WITHOUT_LICENCE

    let then: Then

    beforeEach(async () => {
      const mockCreate = mockOffenseRepositoryService.create as jest.Mock
      mockCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, indictmentCountId, offense)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
