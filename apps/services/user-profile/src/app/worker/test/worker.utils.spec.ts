import faker from 'faker'
import addDays from 'date-fns/addDays'

import { UserProfile } from '../../user-profile/userProfile.model'
import { UserProfileAdvania } from '../userProfileAdvania.model'
import { shouldReplaceExistingUserProfile } from '../worker.utils'

let currentNationalId = 0

const getSomeNationalId = () => `${currentNationalId++}`

const createExistingUserProfile = ({
  nationalId = getSomeNationalId(),
  mobilePhoneNumber = faker.phone.phoneNumber('+354-#######'),
  email = faker.internet.email(),
  modified = new Date(),
}: {
  nationalId?: string
  email?: string
  mobilePhoneNumber?: string
  modified?: Date
}) =>
  ({
    nationalId,
    mobilePhoneNumber,
    email,
    modified: modified ?? new Date(),
  } as UserProfile)

const createMigrationUserProfile = ({
  ssn = getSomeNationalId(),
  email = faker.internet.email(),
  mobilePhoneNumber = faker.phone.phoneNumber('+354-#######'),
  exported = new Date(),
}: {
  ssn?: string
  email?: string
  mobilePhoneNumber?: string
  exported?: Date
}) =>
  ({
    ssn,
    mobilePhoneNumber,
    email,
    exported: exported ?? new Date(),
  } as UserProfileAdvania)

describe('shouldReplaceExistingUserProfile', () => {
  // Does profile exist?
  // -> no
  it('should replace non-existent user profiles with new', () => {
    const existingUserProfile = undefined
    const migratedUserProfile = createMigrationUserProfile({})

    expect(
      shouldReplaceExistingUserProfile(
        migratedUserProfile,
        existingUserProfile,
      ),
    ).toBe(true)
  })

  // -> yes
  // Does the email and mobilePhoneNumber match?
  //  -> yes
  it('should not replace user profile data when email and mobile phone number match', () => {
    const nationalId = '1'
    const mobilePhoneNumber = '2'
    const email = 'test@test.local'

    const existingUserProfile = createExistingUserProfile({
      nationalId,
      mobilePhoneNumber,
      email,
    })
    const migratedUserProfile = createMigrationUserProfile({
      ssn: nationalId,
      mobilePhoneNumber,
      email,
    })

    expect(
      shouldReplaceExistingUserProfile(
        migratedUserProfile,
        existingUserProfile,
      ),
    ).toBe(false)
  })

  //  -> no
  // Is existing profile modified date older than exported profile date?
  //   -> yes
  it('should replace existing profile data when new profile export date is > existing profile modified date', () => {
    const nationalId = '1'
    const mobilePhoneNumber = '2'

    const now = new Date()
    const yesterday = addDays(now, -1)

    const existingUserProfile = createExistingUserProfile({
      nationalId,
      mobilePhoneNumber,
      modified: yesterday,
    })

    const migratedUserProfile = createMigrationUserProfile({
      ssn: nationalId,
      mobilePhoneNumber,
      exported: now,
    })

    expect(
      shouldReplaceExistingUserProfile(
        migratedUserProfile,
        existingUserProfile,
      ),
    ).toBe(true)
  })

  //   -> no
  it('should not replace existing profile data when new profile export date is < existing profile modified date', () => {
    const nationalId = '1'
    const mobilePhoneNumber = '2'

    const now = new Date()
    const yesterday = addDays(now, -1)

    const existingUserProfile = createExistingUserProfile({
      nationalId,
      mobilePhoneNumber,
      modified: now,
    })

    const migratedUserProfile = createMigrationUserProfile({
      ssn: nationalId,
      mobilePhoneNumber,
      exported: yesterday,
    })

    expect(
      shouldReplaceExistingUserProfile(
        migratedUserProfile,
        existingUserProfile,
      ),
    ).toBe(false)
  })
})
