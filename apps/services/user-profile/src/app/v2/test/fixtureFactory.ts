import { Model } from 'sequelize'
import { getModelToken } from '@nestjs/sequelize'

import { TestApp } from '@island.is/testing/nest'

import { EmailVerification } from '../../user-profile/emailVerification.model'
import { SmsVerification } from '../../user-profile/smsVerification.model'
import { UserProfile } from '../../user-profile/userProfile.model'

export class FixtureFactory {
  constructor(private app: TestApp) {}

  get<T extends new () => Model>(model: T): T {
    return this.app.get(getModelToken(model))
  }

  createUserProfile({
    nationalId,
    email = null,
    mobilePhoneNumber = null,
    locale = null,
    mobilePhoneNumberVerified = false,
    emailVerified = false,
    lastNudge = null,
  }) {
    const userProfileModel = this.get(UserProfile)

    return userProfileModel.create<UserProfile>({
      nationalId,
      email,
      mobilePhoneNumber,
      locale,
      mobilePhoneNumberVerified,
      emailVerified,
      lastNudge: lastNudge && lastNudge.toISOString(),
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

  async createSmsVerification({ nationalId, mobilePhoneNumber, smsCode }) {
    const verificationModel = this.get(SmsVerification)

    return await verificationModel.create({
      nationalId,
      mobilePhoneNumber,
      smsCode,
      confirmed: false,
    })
  }
}
