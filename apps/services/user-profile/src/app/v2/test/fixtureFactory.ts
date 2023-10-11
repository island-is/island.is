import { TestApp } from '@island.is/testing/nest'
import { UserProfile } from '../../user-profile/userProfile.model'
import { Model } from 'sequelize'
import { getModelToken } from '@nestjs/sequelize'
import { DataStatus } from '../../user-profile/types/dataStatusTypes'
import { EmailVerification } from '../../user-profile/emailVerification.model'
import { SmsVerification } from '../../user-profile/smsVerification.model'

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

    return await userProfileModel.create({
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

  async createEmailVerification({ nationalId, email, hash }) {
    const verificationModel = this.get(EmailVerification)

    return await verificationModel.create({
      nationalId,
      email,
      hash,
      confirmed: false,
    })
  }

  async createMobileVerification({ nationalId, mobilePhoneNumber, smsCode }) {
    const verificationModel = this.get(SmsVerification)

    return await verificationModel.create({
      nationalId,
      mobilePhoneNumber,
      smsCode,
      confirmed: false,
    })
  }
}
