import { Transaction } from 'sequelize'

import {
  CaseType,
  DefenderChoice,
  User,
} from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import {
  Case,
  Defendant,
  DefendantRepositoryService,
} from '../../../repository'
import { UpdateDefendantDto } from '../../dto/updateDefendant.dto'

interface Then {
  result?: Defendant
  error?: Error
}

type GivenWhenThen = (
  defendant: Defendant,
  update: UpdateDefendantDto,
) => Promise<Then>

type DefenderNullUpdate = {
  defenderNationalId: null
  defenderName?: null
}

describe('DefendantService - update', () => {
  const theCase = { id: 'case-id', type: CaseType.CUSTODY } as Case
  const user = { id: 'user-id' } as User
  const transaction = {} as Transaction

  let mockDefendantRepositoryService: DefendantRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { defendantRepositoryService, defendantService } =
      await createTestingDefendantModule()

    mockDefendantRepositoryService = defendantRepositoryService

    givenWhenThen = async (
      defendant: Defendant,
      update: UpdateDefendantDto,
    ) => {
      const then: Then = {}

      try {
        then.result = await defendantService.update(
          theCase,
          defendant,
          update,
          user,
          transaction,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('when defenderChoice is DELAY and defenderNationalId is null', () => {
    const defendant = {
      id: 'defendant-id',
      caseId: theCase.id,
      defenderNationalId: '0101302399',
      defenderName: 'Defender Name',
    } as Defendant
    const update = {
      defenderChoice: DefenderChoice.DELAY,
      defenderNationalId: null,
    } as unknown as UpdateDefendantDto
    const updatedDefendant = {
      ...defendant,
      defenderChoice: DefenderChoice.DELAY,
    } as unknown as Defendant
    let then: Then

    beforeEach(async () => {
      ;(
        mockDefendantRepositoryService.update as jest.Mock
      ).mockResolvedValueOnce(updatedDefendant)

      then = await givenWhenThen(defendant, update)
    })

    it('should update the defendant without defenderNationalId', () => {
      expect(mockDefendantRepositoryService.update).toHaveBeenCalledWith(
        theCase.id,
        defendant.id,
        { defenderChoice: DefenderChoice.DELAY },
        { transaction },
      )
      expect(then.result).toEqual(updatedDefendant)
    })
  })

  describe('when defenderName is set and defenderNationalId and defenderName are both set to null', () => {
    const defendant = {
      id: 'defendant-id',
      caseId: theCase.id,
      defenderNationalId: '0101302399',
      defenderName: 'Defender Name',
      defenderEmail: 'defender@example.com',
      defenderPhoneNumber: '5551234',
    } as Defendant
    const update: DefenderNullUpdate = {
      defenderNationalId: null,
      defenderName: null,
    }
    const defendantUpdate = update as unknown as UpdateDefendantDto
    const updatedDefendant = { ...defendant, ...update } as unknown as Defendant
    let then: Then

    beforeEach(async () => {
      ;(
        mockDefendantRepositoryService.update as jest.Mock
      ).mockResolvedValueOnce(updatedDefendant)

      then = await givenWhenThen(defendant, defendantUpdate)
    })

    it('should update the defendant', () => {
      expect(mockDefendantRepositoryService.update).toHaveBeenCalledWith(
        theCase.id,
        defendant.id,
        defendantUpdate,
        { transaction },
      )
      expect(then.result).toEqual(updatedDefendant)
    })
  })

  describe('when defenderName is not set and defenderNationalId is set to null', () => {
    const defendant = {
      id: 'defendant-id',
      caseId: theCase.id,
      defenderNationalId: '0101302399',
    } as Defendant
    const update = {
      defenderNationalId: null,
    } as unknown as UpdateDefendantDto
    const updatedDefendant = {
      ...defendant,
      defenderNationalId: null,
    } as unknown as Defendant
    let then: Then

    beforeEach(async () => {
      ;(
        mockDefendantRepositoryService.update as jest.Mock
      ).mockResolvedValueOnce(updatedDefendant)

      then = await givenWhenThen(defendant, update)
    })

    it('should update the defendant', () => {
      expect(mockDefendantRepositoryService.update).toHaveBeenCalledWith(
        theCase.id,
        defendant.id,
        update,
        { transaction },
      )
      expect(then.result).toEqual(updatedDefendant)
    })
  })
})
