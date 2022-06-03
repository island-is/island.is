import { uuid } from 'uuidv4'

import { NotFoundException } from '@nestjs/common'

import { UserRole } from '@island.is/judicial-system/types'

import { nowFactory } from '../../../../factories'
import { randomDate } from '../../../../test'
import { User } from '../../../user'
import { Case } from '../../models/case.model'
import { createTestingCaseModule } from '../createTestingCaseModule'

jest.mock('../../../factories')

interface Then {
  result: User
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case, nationalId: string) => Then

describe('LimitedAccessCaseController - Find defender by national id', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { limitedAccessCaseController } = await createTestingCaseModule()

    givenWhenThen = (caseId: string, theCase: Case, nationalId: string) => {
      const then = {} as Then

      try {
        then.result = limitedAccessCaseController.findDefenderByNationalId(
          caseId,
          theCase,
          nationalId,
        )
      } catch (error) {
        then.error = error as Error
      }
      return then
    }
  })

  describe('defender found', () => {
    const caseId = uuid()
    const nationalId = '1234567890'
    const name = 'John Doe'
    const phoneNumber = '1234567'
    const email = 'dummyœdummy.dy'
    const theCase = {
      id: caseId,
      defenderNationalId: nationalId,
      defenderName: name,
      defenderPhoneNumber: phoneNumber,
      defenderEmail: email,
    } as Case
    const date = randomDate()
    let then: Then

    beforeEach(async () => {
      const mockToday = nowFactory as jest.Mock
      mockToday.mockReturnValueOnce(date)

      then = givenWhenThen(caseId, theCase, nationalId)
    })

    it('should return the user', () => {
      expect(then.result).toEqual({
        id: 'defender',
        created: date,
        modified: date,
        nationalId,
        name,
        title: 'verjandi',
        mobileNumber: phoneNumber,
        email,
        role: UserRole.DEFENDER,
        active: true,
      })
    })
  })

  describe('defender not found', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const nationalId = '1234567890'
    let then: Then

    beforeEach(() => {
      then = givenWhenThen(caseId, theCase, nationalId)
    })

    it('should throw an error', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(`Defendant not found`)
    })
  })
})
