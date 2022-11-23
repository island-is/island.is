import {
  checkDelegation,
  isCompanyDelegation,
  isPersonDelegation,
} from './isDelegation'
import { User } from '@island.is/shared/types'

export interface MockUser extends Partial<Omit<User, 'profile'>> {
  profile?: Partial<User['profile']>
}

export const createMockUser = (user?: MockUser) =>
  ({
    profile: {
      name: 'Mock',
      locale: 'is',
      nationalId: '0000000000',
      ...user?.profile,
    },
    expired: false,
    expires_in: 9999,
    scopes: [],
    ...user,
  } as User)

describe('Delegation utilities', () => {
  describe('checkDelegation', () => {
    it('should return false when not in delegation', () => {
      const user = createMockUser()
      const isDelegation = checkDelegation(user)
      expect(isDelegation).toBe(false)
    })

    it('should return true when in delegation', () => {
      const user = createMockUser({
        profile: {
          actor: {
            nationalId: '1111111111',
            name: 'Mock name',
          },
        },
      })
      const isDelegation = checkDelegation(user)
      expect(isDelegation).toBe(true)
    })
  })
  describe('isCompanyDelegation', () => {
    it('should return true when in company delegation', () => {
      const user = createMockUser({
        profile: {
          subjectType: 'legalEntity',
          actor: {
            nationalId: '1111111111',
            name: 'Mock Company',
          },
        },
      })
      const isCompany = isCompanyDelegation(user)
      expect(isCompany).toBe(true)
    })

    it('should return false when not in company delegation', () => {
      const user = createMockUser({
        profile: {
          subjectType: 'person',
          actor: {
            nationalId: '1111111111',
            name: 'Mock Person',
          },
        },
      })
      const isCompany = isCompanyDelegation(user)
      expect(isCompany).toBe(false)
    })
  })

  describe('isPersonDelegation', () => {
    it('should return true when in person delegation', () => {
      const user = createMockUser({
        profile: {
          subjectType: 'person',
          actor: {
            nationalId: '1111111111',
            name: 'Mock Person',
          },
        },
      })
      const isPerson = isPersonDelegation(user)
      expect(isPerson).toBe(true)
    })

    it('should return false when not in person delegation', () => {
      const user = createMockUser({
        profile: {
          subjectType: 'legalEntity',
          actor: {
            nationalId: '1111111111',
            name: 'Mock Company',
          },
        },
      })
      const isPerson = isPersonDelegation(user)
      expect(isPerson).toBe(false)
    })
  })
})
