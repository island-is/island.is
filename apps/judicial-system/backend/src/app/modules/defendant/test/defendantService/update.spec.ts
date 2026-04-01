import { Transaction } from 'sequelize'

import { BadRequestException } from '@nestjs/common'

import { CaseType, User } from '@island.is/judicial-system/types'

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
  defenderEmail?: null
  defenderPhoneNumber?: null
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

  describe('when defenderNationalId is set to null without clearing all defender fields', () => {
    let then: Then
    const update = {
      defenderNationalId: null,
      defenderName: null,
      defenderEmail: null,
    } as unknown as UpdateDefendantDto

    beforeEach(async () => {
      then = await givenWhenThen(
        {
          id: 'defendant-id',
          caseId: theCase.id,
          defenderNationalId: '0101302399',
          defenderName: 'Defender Name',
          defenderEmail: 'defender@example.com',
          defenderPhoneNumber: '5551234',
        } as Defendant,
        update,
      )
    })

    it('should throw a bad request exception', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error).toHaveProperty(
        'message',
        'DefenderNationalId can only be set to null when defenderName, defenderEmail, and defenderPhoneNumber are also set to null.',
      )
      expect(mockDefendantRepositoryService.update).not.toHaveBeenCalled()
    })
  })

  describe('when defenderNationalId and all related defender fields are set to null', () => {
    const defendant = {
      id: 'defendant-id',
      caseId: theCase.id,
      defenderNationalId: '0101302399',
      defenderName: 'Defender Name',
      defenderEmail: 'defender@example.com',
      defenderPhoneNumber: '5551234',
    } as Defendant
    const update = {
      defenderNationalId: null,
      defenderName: null,
      defenderEmail: null,
      defenderPhoneNumber: null,
    } as const satisfies DefenderNullUpdate
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
})
