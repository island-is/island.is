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
import { hasMatchingEmail } from '../worker.utils'

describe('UserProfileWorker', () => {
  jest.setTimeout(30000)
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

  describe('profiles being migrated exist in user_profile', () => {
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

    describe('email and phone numbers do not match', () => {
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

      describe('existing user profile was modified after the export occured', () => {
        it('should only change lastNudge=null if modified date is more recent than export date and neither email nor phone were verified', async () => {
          // Arrange
          const advaniaProfiles = new Array(10).fill(null).map((_, index) => ({
            ssn: `${index}`,
            email: `test${index}@test.local`,
            mobilePhoneNumber: `888111${index}`,
            // In the future to be more recent than modified date
            exported: addDays(new Date(), -1),
          }))

          const lastNudge = new Date(2023, 10, 1)

          const existingProfiles = advaniaProfiles.map((p) => ({
            nationalId: p.ssn,
            // Email and phone random, different from advania profile
            email: faker.internet.email(),
            emailVerified: false,
            mobilePhoneNumber: faker.phone.phoneNumber('+354-#######'),
            mobilePhoneNumberVerified: false,
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
            expect(profileAfter.lastNudge).toEqual(null)
          }
        })

        it.each([
          {
            mobilePhoneNumberVerified: true,
          },
          {
            emailVerified: true,
          },
          {
            mobilePhoneNumberVerified: true,
            emailVerified: true,
          },
        ])(
          'should only change lastNudge=modified if modified date is more recent than export date and either email or phone were verified',
          async (verifiedPart) => {
            // Arrange
            const advaniaProfiles = new Array(10)
              .fill(null)
              .map((_, index) => ({
                ssn: `${index}`,
                email: `test${index}@test.local`,
                mobilePhoneNumber: `888111${index}`,
                // In the future to be more recent than modified date
                exported: addDays(new Date(), -1),
              }))

            const lastNudge = new Date(2023, 10, 1)

            const existingProfiles = advaniaProfiles.map((p) => ({
              nationalId: p.ssn,
              // Email and phone random, different from advania profile
              email: faker.internet.email(),
              mobilePhoneNumber: faker.phone.phoneNumber('+354-#######'),
              ...verifiedPart,
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
              expect(profileAfter.lastNudge).toEqual(profileBefore.modified)
            }
          },
        )
      })
    })
  })

  describe('processProfiles', () => {
    it('should create a new profile with lastNudge=null if advania profile does not exist', async () => {
      // Arrange
      const nationalId = '1'

      // Act
      const existingUserProfileBefore = await userProfileModel.findOne({
        where: {
          nationalId,
        },
      })
      const migratedUserProfile = await userProfileAdvaniaModel.create({
        ssn: nationalId,
        email: faker.internet.email(),
        mobilePhoneNumber: faker.phone.phoneNumber('+354-#######'),
      })

      await workerService['processProfiles'](
        migratedUserProfile,
        existingUserProfileBefore,
      )

      const existingUserProfileAfter = await userProfileModel.findOne({
        where: {
          nationalId,
        },
      })

      // Assert
      expect(existingUserProfileBefore).toBe(null)
      expect(existingUserProfileAfter.nationalId).toEqual(
        migratedUserProfile.ssn,
      )
      expect(existingUserProfileAfter.email).toEqual(migratedUserProfile.email)
      expect(existingUserProfileAfter.mobilePhoneNumber).toEqual(
        migratedUserProfile.mobilePhoneNumber,
      )
      expect(existingUserProfileAfter.mobilePhoneNumber).toEqual(
        migratedUserProfile.mobilePhoneNumber,
      )
      expect(existingUserProfileAfter.lastNudge).toEqual(null)
    })

    describe('profile being migrated exists in user_profile', () => {
      it('should keep user profile as is when email and phone number match and set lastNudge=nudgeLastAsked', async () => {
        // Arrange
        const nationalId = '1'
        const nudgeLastAsked = addDays(new Date(), -10)

        // Act
        const existingUserProfileBefore = await userProfileModel.create({
          nationalId,
          email: 'email1@email.local',
          mobilePhoneNumber: '01',
        })
        const migratedUserProfile = await userProfileAdvaniaModel.create({
          ssn: nationalId,
          email: existingUserProfileBefore.email,
          mobilePhoneNumber: existingUserProfileBefore.mobilePhoneNumber,
          nudgeLastAsked,
        })

        await workerService['processProfiles'](
          migratedUserProfile,
          existingUserProfileBefore,
        )

        const existingUserProfileAfter = await userProfileModel.findOne({
          where: {
            nationalId,
          },
        })

        // Assert
        expect(existingUserProfileBefore).not.toEqual(existingUserProfileAfter)
        expect(existingUserProfileBefore.lastNudge).not.toEqual(nudgeLastAsked)
        expect(existingUserProfileAfter.nationalId).toEqual(
          migratedUserProfile.ssn,
        )
        expect(existingUserProfileAfter.email).toEqual(
          migratedUserProfile.email,
        )
        expect(existingUserProfileAfter.mobilePhoneNumber).toEqual(
          migratedUserProfile.mobilePhoneNumber,
        )
        expect(existingUserProfileAfter.lastNudge).toEqual(
          migratedUserProfile.nudgeLastAsked,
        )
      })

      describe('email and phone numbers do not match', () => {
        it('should replace existing profile data when new profile exported date > existing profile modified date', async () => {
          // Arrange
          const nationalId = '1'
          const nudgeLastAsked = addDays(new Date(), -10)
          const existingProfileEmail = 'email1@email.local'
          const existingProfilePhoneNumber = '01'
          const migratedProfileEmail = 'email2@email.local' // different email
          const migratedProfilePhoneNumber = '02' // and phone number
          const migratedProfileCanNudge = true
          // migrated in the future to be more recent than modified
          const migratedProfileDate = addDays(new Date(), 1)

          // Act
          const existingUserProfileBefore = await userProfileModel.create({
            nationalId,
            email: existingProfileEmail,
            mobilePhoneNumber: existingProfilePhoneNumber,
            documentNotifications: !migratedProfileCanNudge,
          })
          const migratedUserProfile = await userProfileAdvaniaModel.create({
            ssn: nationalId,
            email: migratedProfileEmail,
            mobilePhoneNumber: migratedProfilePhoneNumber,
            nudgeLastAsked,
            canNudge: migratedProfileCanNudge,
            exported: migratedProfileDate,
          })

          await workerService['processProfiles'](
            migratedUserProfile,
            existingUserProfileBefore,
          )

          const existingUserProfileAfter = await userProfileModel.findOne({
            where: {
              nationalId,
            },
          })

          // Assert
          expect(existingUserProfileBefore).not.toEqual(
            existingUserProfileAfter,
          )
          expect(existingUserProfileBefore.email).not.toEqual(
            migratedUserProfile.email,
          )
          expect(existingUserProfileBefore.mobilePhoneNumber).not.toEqual(
            migratedUserProfile.mobilePhoneNumber,
          )
          expect(existingUserProfileAfter.nationalId).toEqual(
            migratedUserProfile.ssn,
          )
          // Expect email and phone to match after migration
          expect(existingUserProfileAfter.email).toEqual(
            migratedUserProfile.email,
          )
          expect(existingUserProfileAfter.mobilePhoneNumber).toEqual(
            migratedUserProfile.mobilePhoneNumber,
          )
          // With last nudge set to null
          expect(existingUserProfileAfter.lastNudge).toEqual(null)
          expect(existingUserProfileAfter.documentNotifications).toEqual(
            migratedProfileCanNudge,
          )
        })

        describe('existing user profile was modified after the export occured', () => {
          it.each([
            {
              mobilePhoneNumberVerified: true,
            },
            {
              emailVerified: true,
            },
            {
              mobilePhoneNumberVerified: true,
              emailVerified: true,
            },
          ])(
            'should set lastNudge=modified when existing user profile has verified email or phone number',
            async (verifiedPart) => {
              // Arrange
              const nationalId = '1'
              const nudgeLastAsked = addDays(new Date(), -10)
              const existingProfileEmail = 'email1@email.local'
              const existingProfilePhoneNumber = '01'
              const migratedProfileEmail = 'email2@email.local' // different email
              const migratedProfilePhoneNumber = '02' // and phone number
              const migratedProfileCanNudge = true
              const migratedProfileDate = addDays(new Date(), -1) // yesterday

              // Act
              const existingUserProfileBefore = await userProfileModel.create({
                nationalId,
                email: existingProfileEmail,
                mobilePhoneNumber: existingProfilePhoneNumber,
                ...verifiedPart,
                documentNotifications: !migratedProfileCanNudge,
              })
              const migratedUserProfile = await userProfileAdvaniaModel.create({
                ssn: nationalId,
                email: migratedProfileEmail,
                mobilePhoneNumber: migratedProfilePhoneNumber,
                nudgeLastAsked,
                canNudge: migratedProfileCanNudge,
                exported: migratedProfileDate,
              })

              await workerService['processProfiles'](
                migratedUserProfile,
                existingUserProfileBefore,
              )

              const existingUserProfileAfter = await userProfileModel.findOne({
                where: {
                  nationalId,
                },
              })

              // Assert
              expect(existingUserProfileAfter.email).not.toEqual(
                migratedUserProfile.email,
              )
              expect(existingUserProfileAfter.mobilePhoneNumber).not.toEqual(
                migratedUserProfile.mobilePhoneNumber,
              )
              // With last nudge set to null
              expect(existingUserProfileAfter.lastNudge).toEqual(
                existingUserProfileBefore.modified,
              )
              expect(existingUserProfileAfter.documentNotifications).toEqual(
                existingUserProfileBefore.documentNotifications,
              )
            },
          )

          it('should set lastNudge=null if neither email nor phone is verified', async () => {
            // Arrange
            const nationalId = '1'
            const nudgeLastAsked = addDays(new Date(), -10)
            const existingProfileEmail = 'email1@email.local'
            const existingProfilePhoneNumber = '01'
            const migratedProfileEmail = 'email2@email.local' // different email
            const migratedProfilePhoneNumber = '02' // and phone number
            const migratedProfileCanNudge = true
            const migratedProfileDate = addDays(new Date(), -1) // yesterday

            // Act
            const existingUserProfileBefore = await userProfileModel.create({
              nationalId,
              email: existingProfileEmail,
              mobilePhoneNumber: existingProfilePhoneNumber,
              mobilePhoneNumberVerified: false,
              emailVerified: false,
              documentNotifications: !migratedProfileCanNudge,
            })
            const migratedUserProfile = await userProfileAdvaniaModel.create({
              ssn: nationalId,
              email: migratedProfileEmail,
              mobilePhoneNumber: migratedProfilePhoneNumber,
              nudgeLastAsked,
              canNudge: migratedProfileCanNudge,
              exported: migratedProfileDate,
            })

            await workerService['processProfiles'](
              migratedUserProfile,
              existingUserProfileBefore,
            )

            const existingUserProfileAfter = await userProfileModel.findOne({
              where: {
                nationalId,
              },
            })

            // Assert
            expect(existingUserProfileAfter.email).not.toEqual(
              migratedUserProfile.email,
            )
            expect(existingUserProfileAfter.mobilePhoneNumber).not.toEqual(
              migratedUserProfile.mobilePhoneNumber,
            )
            // With last nudge set to null
            expect(existingUserProfileAfter.lastNudge).toEqual(null)
            expect(existingUserProfileAfter.documentNotifications).toEqual(
              existingUserProfileBefore.documentNotifications,
            )
          })
        })
      })
    })
  })

  it.only('should lower case emails coming from advania', async () => {
    // Arrange
    const advaniaProfiles = new Array(10).fill(null).map((_, index) => ({
      ssn: `${index}`,
      email: `Test${index}@test.Local`,
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
          hasMatchingEmail(matchingProfile.email, p.email) &&
          matchingProfile.mobilePhoneNumber === p.mobilePhoneNumber
        )
      }),
    ).toBe(true)
  })

  afterEach(async () => {
    await app.cleanUp()
  })
})
