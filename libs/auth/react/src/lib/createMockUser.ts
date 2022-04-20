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
      delegationType: ['Custom'],
      ...user?.profile,
    },
    expired: false,
    expires_in: 9999,
    scopes: [],
    dateOfBirth: new Date('2000-01-01'),
    ...user,
  } as User)
