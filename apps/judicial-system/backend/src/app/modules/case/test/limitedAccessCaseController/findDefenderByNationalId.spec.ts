import { uuid } from 'uuidv4'

import { NotFoundException } from '@nestjs/common'

import {
  indictmentCases,
  investigationCases,
  restrictionCases,
  UserRole,
} from '@island.is/judicial-system/types'

import { nowFactory, uuidFactory } from '../../../../factories'
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

  describe.each([...restrictionCases, ...investigationCases])(
    'defender found for %s case',
    (type) => {
      const caseId = uuid()
      const nationalId = '1234567890'
      const name = 'John Doe'
      const phoneNumber = '1234567'
      const email = 'dummy@dummy.dy'
      const theCase = {
        id: caseId,
        type,
        defenderNationalId: nationalId,
        defenderName: name,
        defenderPhoneNumber: phoneNumber,
        defenderEmail: email,
      } as Case
      const date = randomDate()
      let then: Then

      beforeEach(() => {
        const mockToday = nowFactory as jest.Mock
        mockToday.mockReturnValueOnce(date)
        const mockId = uuidFactory as jest.Mock
        mockId.mockReturnValueOnce('defender')

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
    },
  )

  describe.each([...indictmentCases])('defender found for %s case', (type) => {
    const caseId = uuid()
    const nationalId = '1234567890'
    const name = 'John Doe'
    const phoneNumber = '1234567'
    const email = 'dummy@dummy.dy'
    const theCase = {
      id: caseId,
      type,
      defendants: [
        {
          defenderNationalId: nationalId,
          defenderName: name,
          defenderPhoneNumber: phoneNumber,
          defenderEmail: email,
        },
      ],
    } as Case
    const date = randomDate()
    let then: Then

    beforeEach(() => {
      const mockToday = nowFactory as jest.Mock
      mockToday.mockReturnValueOnce(date)
      const mockId = uuidFactory as jest.Mock
      mockId.mockReturnValueOnce('defender')

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

  describe.each([
    ...restrictionCases,
    ...investigationCases,
    ...indictmentCases,
  ])('defender not found for %s case', (type) => {
    const caseId = uuid()
    const theCase = { id: caseId, type } as Case
    const nationalId = '1234567890'
    let then: Then

    beforeEach(() => {
      then = givenWhenThen(caseId, theCase, nationalId)
    })

    it('should throw an error', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(`Defender not found`)
    })
  })
})
