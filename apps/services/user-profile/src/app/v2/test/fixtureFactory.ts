import { TestApp } from '@island.is/testing/nest'
import { UserProfile } from '../../user-profile/userProfile.model'
import { Model } from 'sequelize'
import { getModelToken } from '@nestjs/sequelize'
import { DataStatus } from '../../user-profile/types/dataStatusTypes'

export class FixtureFactory {
  constructor(private app: TestApp) {}

  get<T extends new () => Model>(model: T): T {
    return this.app.get(getModelToken(model))
  }

  async createUserProfile({
    nationalId,
    email = '',
    mobilePhoneNumber = '',
    locale = '',
    mobileStatus = DataStatus.NOT_DEFINED,
    emailStatus = DataStatus.NOT_DEFINED,
    mobilePhoneNumberVerified = false,
    emailVerified = false,
  }) {
    const userProfileModel = this.get(UserProfile)

    return userProfileModel.create({
      nationalId,
      email,
      mobilePhoneNumber,
      locale,
      mobileStatus,
      emailStatus,
      mobilePhoneNumberVerified,
      emailVerified,
    })
  }
}
