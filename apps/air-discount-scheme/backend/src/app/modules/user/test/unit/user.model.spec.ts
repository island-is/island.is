import { NationalRegistryUser } from '../../../nationalRegistry'
import {
  AirlineUser,
  CachedUser,
  restoreCachedUser,
  User,
} from '../../user.model'

const fund = { credit: 0, used: 0, total: 6 }

const registryUser = (
  givenName: string,
  fullName: string,
): NationalRegistryUser => ({
  nationalId: '0000000000',
  givenName,
  fullName,
  gender: 'kk',
  address: 'Bessastaðir 1',
  postalcode: 225,
  city: 'Álftanes',
})

describe('AirlineUser', () => {
  it.each([
    ['Jón Gunnar Jónsson', 'Jón Gunnar', 'Jón', 'Gunnar', 'Jónsson'],
    ['Jón Gunnar Hólm Jónsson', 'Jón Gunnar', 'Jón', 'Gunnar Hólm', 'Jónsson'],
    ['Jón Jónsson', 'Jón', 'Jón', '', 'Jónsson'],
  ])(
    'splits fullName %s into airline name fields',
    (fullName, givenName, firstName, middleName, lastName) => {
      const airlineUser = new AirlineUser(
        registryUser(givenName, fullName),
        fund,
      )

      expect(airlineUser.firstName).toBe(firstName)
      expect(airlineUser.middleName).toBe(middleName)
      expect(airlineUser.lastName).toBe(lastName)
      expect(
        [airlineUser.firstName, airlineUser.middleName, airlineUser.lastName]
          .filter(Boolean)
          .join(' '),
      ).toBe(fullName)
      expect(airlineUser).not.toHaveProperty('givenName')
      expect(airlineUser).not.toHaveProperty('fullName')
      expect(airlineUser.nationalId).toBe('000000xxx0')
    },
  )
})

describe('User', () => {
  it('carries givenName and fullName and no airline name fields', () => {
    const user = new User(
      registryUser('Jón Gunnar', 'Jón Gunnar Jónsson'),
      fund,
    )

    expect(user.givenName).toBe('Jón Gunnar')
    expect(user.fullName).toBe('Jón Gunnar Jónsson')
    expect(user).not.toHaveProperty('firstName')
    expect(user).not.toHaveProperty('middleName')
    expect(user).not.toHaveProperty('lastName')
  })
})

describe('restoreCachedUser', () => {
  it('derives names from a legacy cached user', () => {
    const legacy: CachedUser = {
      firstName: 'Jón',
      middleName: 'Gunnar',
      lastName: 'Jónsson',
      fund,
      address: 'Bessastaðir 1',
      postalcode: 225,
      city: 'Álftanes',
      gender: 'kk',
      nationalId: '0000000000',
    }

    const restored = restoreCachedUser(legacy)

    expect(restored).toEqual({
      givenName: 'Jón Gunnar',
      fullName: 'Jón Gunnar Jónsson',
      address: 'Bessastaðir 1',
      postalcode: 225,
      city: 'Álftanes',
      gender: 'kk',
      nationalId: '0000000000',
    })
    expect(restored).not.toHaveProperty('fund')
    expect(restored).not.toHaveProperty('firstName')
    expect(restored).not.toHaveProperty('middleName')
    expect(restored).not.toHaveProperty('lastName')
  })

  it('keeps givenName and fullName of a current cached user', () => {
    const current: CachedUser = {
      givenName: 'Jón Gunnar',
      fullName: 'Jón Gunnar Hólm Jónsson',
      fund,
      address: 'Bessastaðir 1',
      postalcode: 225,
      city: 'Álftanes',
      gender: 'kk',
      nationalId: '0000000000',
    }

    expect(restoreCachedUser(current)).toEqual({
      givenName: 'Jón Gunnar',
      fullName: 'Jón Gunnar Hólm Jónsson',
      address: 'Bessastaðir 1',
      postalcode: 225,
      city: 'Álftanes',
      gender: 'kk',
      nationalId: '0000000000',
    })
  })
})
