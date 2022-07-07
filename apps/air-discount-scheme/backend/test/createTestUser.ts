import { Fund, User } from '@island.is/air-discount-scheme/types'

export function createTestUser(
  postalCode = 600,
  fund: Fund = {
    credit: 6,
    total: 6,
    used: 0,
  },
  nationalId = '0101302399',
): User {
  return {
    postalcode: postalCode,
    address: 'Testvík 2',
    city: 'Prufuborg',
    firstName: 'Prófi',
    fund,
    gender: 'kk',
    lastName: 'Prófsson',
    middleName: 'Júnitt',
    nationalId: nationalId,
  }
}
