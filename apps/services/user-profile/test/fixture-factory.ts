import { Model } from 'sequelize'
import { getModelToken } from '@nestjs/sequelize'

import { TestApp } from '@island.is/testing/nest'

import { EmailVerification } from '../src/app/user-profile/emailVerification.model'
import { SmsVerification } from '../src/app/user-profile/smsVerification.model'
import { UserProfile } from '../src/app/user-profile/userProfile.model'
import { UserDeviceTokens } from '../src/app/user-profile/userDeviceTokens.model'

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

  async createEmailVerification({ nationalId, email, hash, tries = 0 }) {
    const verificationModel = this.get(EmailVerification)

    return await verificationModel.create<EmailVerification>({
      nationalId,
      email,
      hash,
      confirmed: false,
      tries: tries,
    })
  }

  async createSmsVerification({
    nationalId,
    mobilePhoneNumber,
    smsCode,
    tries = 0,
  }) {
    const verificationModel = this.get(SmsVerification)

    return verificationModel.create<SmsVerification>({
      nationalId,
      mobilePhoneNumber,
      smsCode,
      confirmed: false,
      tries: tries,
    })
  }

  async createUserDeviceToken({ nationalId, deviceToken }) {
    const userDeviceTokenModel = this.get(UserDeviceTokens)

    return userDeviceTokenModel.create<UserDeviceTokens>({
      nationalId,
      deviceToken,
    })
  }
}
