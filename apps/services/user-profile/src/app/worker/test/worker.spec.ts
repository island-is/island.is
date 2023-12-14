import pick from 'lodash/pick'
import addDays from 'date-fns/addDays'
import faker from 'faker'
import { getModelToken } from '@nestjs/sequelize'

import { TestApp, testServer, useDatabase } from '@island.is/testing/nest'

import { SequelizeConfigService } from '../../sequelizeConfig.service'

import { UserProfileWorkerModule } from '../worker.module'
import { UserProfileWorkerService } from '../worker.service'
import { UserProfileAdvania } from '../userProfileAdvania.model'

import { UserProfile } from '../../user-profile/userProfile.model'

import { ProcessedStatus } from '../types'

describe('UserProfileWorker', () => {
  jest.setTimeout(60000)
  let app: TestApp
  let workerService: UserProfileWorkerService
  let userProfileModel: typeof UserProfile
  let userProfileAdvaniaModel: typeof UserProfileAdvania

  beforeEach(async () => {
    app = await testServer({
      appModule: UserProfileWorkerModule,
      hooks: [
        useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
      ],
    })
    workerService = app.get(UserProfileWorkerService)
    userProfileModel = app.get(getModelToken(UserProfile))
    userProfileAdvaniaModel = app.get(getModelToken(UserProfileAdvania))
  })

  it('should import new profiles', async () => {
    // Arrange
    const advaniaProfiles = new Array(10).fill(null).map((_, index) => ({
      ssn: `${index}`,
      email: `test${index}@test.local`,
      mobilePhoneNumber: `888111${index}`,
      exported: new Date(2023, 10, 1),
    }))

    // Act
    await userProfileAdvaniaModel.bulkCreate(advaniaProfiles)
    const advaniaProfilesBeforeMigration =
      await userProfileAdvaniaModel.findAll()
    const userProfilesBeforeMigration = await userProfileModel.findAll()
    await workerService.run()
    const advaniaProfilesAfterMigration =
      await userProfileAdvaniaModel.findAll()
    const userProfilesAfterMigration = await userProfileModel.findAll()

    // Assert
    expect(
      advaniaProfilesBeforeMigration.every(
        (p) => p.status === ProcessedStatus.PENDING,
      ),
    ).toBe(true)
    expect(userProfilesBeforeMigration.length).toBe(0)
    expect(
      advaniaProfilesAfterMigration.every(
        (p) => p.status === ProcessedStatus.DONE,
      ),
    ).toBe(true)
    expect(
      userProfilesAfterMigration.every((p) => {
        const matchingProfile = advaniaProfilesAfterMigration.find(
          (ap) => ap.ssn === p.nationalId,
        )

        return (
          matchingProfile.email === p.email &&
          matchingProfile.mobilePhoneNumber === p.mobilePhoneNumber
        )
      }),
    ).toBe(true)
  })

  it('should keep profiles as is if email and phone numbers match but set nudge to nudgeLastAsked', async () => {
    // Arrange
    const advaniaProfiles = new Array(10).fill(null).map((_, index) => ({
      ssn: `${index}`,
      email: `test${index}@test.local`,
      mobilePhoneNumber: `888111${index}`,
      exported: new Date(2023, 10, 1),
      nudgeLastAsked: new Date(2023, 10, 5),
    }))

    const existingProfiles = advaniaProfiles.map((p) => ({
      nationalId: p.ssn,
      email: p.email,
      mobilePhoneNumber: p.mobilePhoneNumber,
      modified: new Date(2023, 0, 1),
      lastNudge: new Date(), // not null
    }))

    // Act
    await userProfileAdvaniaModel.bulkCreate(advaniaProfiles)
    await userProfileModel.bulkCreate(existingProfiles)

    const userProfilesBeforeMigration = await userProfileModel.findAll()

    await workerService.run()

    const userProfilesAfterMigration = await userProfileModel.findAll()

    // Assert
    const fieldsToCompare = ['nationalId', 'email', 'mobilePhoneNumber']

    expect(userProfilesBeforeMigration.length).toBe(
      userProfilesAfterMigration.length,
    )

    for (let i = 0; i < userProfilesBeforeMigration.length; i += 1) {
      const profileBefore = userProfilesBeforeMigration[i]
      const profileAfter = userProfilesAfterMigration[i]
      const advaniaProfile = advaniaProfiles[i]

      expect(pick(profileBefore, fieldsToCompare)).toEqual(
        pick(profileAfter, fieldsToCompare),
      )
      expect(profileAfter.lastNudge).toEqual(advaniaProfile.nudgeLastAsked)
    }
  })

  it('should override user profile when modified date is older than export date', async () => {
    // Arrange
    const advaniaProfiles = new Array(10).fill(null).map((_, index) => ({
      ssn: `${index}`,
      email: `test${index}@test.local`,
      mobilePhoneNumber: `888111${index}`,
      exported: new Date(2023, 10, 1),
    }))

    const existingProfiles = advaniaProfiles.map((p) => ({
      nationalId: p.ssn,
      // Modified date is older than the exported date
      modified: addDays(p.exported, -1),
      // Email and phone random, different from advania profile
      email: faker.internet.email(),
      mobilePhoneNumber: faker.phone.phoneNumber('+354-#######'),
    }))

    // Act
    await userProfileAdvaniaModel.bulkCreate(advaniaProfiles)
    await userProfileModel.bulkCreate(existingProfiles)

    const userProfilesBeforeMigration = await userProfileModel.findAll()

    await workerService.run()

    const userProfilesAfterMigration = await userProfileModel.findAll()

    // Assert
    for (let i = 0; i < userProfilesBeforeMigration.length; i += 1) {
      const profileBefore = userProfilesBeforeMigration[i]
      const profileAfter = userProfilesAfterMigration[i]

      expect(profileBefore.email).not.toBe(profileAfter.email)
      expect(profileBefore.mobilePhoneNumber).not.toBe(
        profileAfter.mobilePhoneNumber,
      )
      expect(profileAfter.lastNudge).toBe(null)
    }
  })

  it('should not do anything to user profile if date is older than export date', async () => {
    // Arrange
    const advaniaProfiles = new Array(10).fill(null).map((_, index) => ({
      ssn: `${index}`,
      email: `test${index}@test.local`,
      mobilePhoneNumber: `888111${index}`,
      exported: new Date(2023, 10, 1),
    }))

    const lastNudge = new Date(2023, 10, 1)

    const existingProfiles = advaniaProfiles.map((p) => ({
      nationalId: p.ssn,
      // Modified date is more recent than exported date
      modified: addDays(p.exported, 1),
      // Email and phone random, different from advania profile
      email: faker.internet.email(),
      mobilePhoneNumber: faker.phone.phoneNumber('+354-#######'),
      lastNudge,
    }))

    // Act
    await userProfileAdvaniaModel.bulkCreate(advaniaProfiles)
    await userProfileModel.bulkCreate(existingProfiles)

    const userProfilesBeforeMigration = await userProfileModel.findAll()

    await workerService.run()

    const userProfilesAfterMigration = await userProfileModel.findAll()

    // Assert
    for (let i = 0; i < userProfilesBeforeMigration.length; i += 1) {
      const profileBefore = userProfilesBeforeMigration[i]
      const profileAfter = userProfilesAfterMigration[i]

      expect(profileBefore.email).toBe(profileAfter.email)
      expect(profileBefore.mobilePhoneNumber).toBe(
        profileAfter.mobilePhoneNumber,
      )
      expect(profileAfter.lastNudge).toEqual(lastNudge)
    }
  })

  afterEach(async () => {
    await app.cleanUp()
  })
})
