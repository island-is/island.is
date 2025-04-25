import { Model } from 'sequelize'
import { getModelToken } from '@nestjs/sequelize'

import { TestApp } from '@island.is/testing/nest'

import { EmailVerification } from '../src/app/user-profile/emailVerification.model'
import { SmsVerification } from '../src/app/user-profile/smsVerification.model'
import { UserProfile } from '../src/app/user-profile/userProfile.model'
import { UserDeviceTokens } from '../src/app/user-profile/userDeviceTokens.model'
import { DataStatus } from '../src/app/user-profile/types/dataStatusTypes'
import { ActorProfile } from '../src/app/v2/models/actor-profile.model'
import { Emails } from '../src/app/v2/models/emails.model'
import { uuid } from 'uuidv4'

export class FixtureFactory {
  constructor(private app: TestApp) {}

  get<T extends new () => Model>(model: T): T {
    return this.app.get(getModelToken(model))
  }

  async createUserProfile({
    nationalId,
    emails = [],
    mobilePhoneNumber = null,
    locale = null,
    mobilePhoneNumberVerified = false,
    lastNudge = null,
    nextNudge = null,
    mobileStatus = DataStatus.NOT_DEFINED,
  }: {
    nationalId: string
    emails?: Array<{
      email: string | null
      primary?: boolean
      emailStatus?: DataStatus
    }>
    mobilePhoneNumber?: string | null
    locale?: string | null
    mobilePhoneNumberVerified?: boolean
    lastNudge?: Date | null
    nextNudge?: Date | null
    emailStatus?: DataStatus
    mobileStatus?: DataStatus
  }) {
    const userProfileModel = this.get(UserProfile)

    return await userProfileModel
      .create<UserProfile>(
        {
          nationalId,
          mobilePhoneNumber,
          locale,
          mobilePhoneNumberVerified,
          mobileStatus,
          lastNudge: lastNudge && lastNudge.toISOString(),
          nextNudge: nextNudge && nextNudge.toISOString(),
          emails:
            emails?.map(({ email, primary, emailStatus }) => ({
              id: uuid(),
              email: email ? email : null,
              primary: primary ? primary : false,
              emailStatus: emailStatus ? emailStatus : DataStatus.NOT_DEFINED,
              nationalId,
            })) ?? [],
        },
        {
          include: [
            {
              model: Emails,
              as: 'emails',
            },
          ],
        },
      )
      .catch((err) => {
        console.error('Error creating user profile:', err)
        throw err
      })
  }

  async createEmail({
    nationalId,
    email,
    primary = false,
    emailStatus = DataStatus.NOT_DEFINED,
  }: {
    nationalId: string
    email?: string | null
    primary?: boolean
    emailStatus?: DataStatus
  }) {
    const emailModel = this.get(Emails)

    return await emailModel
      .create<Emails>({
        id: uuid(),
        nationalId,
        email: email ? email : undefined,
        primary,
        emailStatus,
      })
      .catch((err) => {
        console.error('Error creating email:', err)
        throw err
      })
  }

  async createEmailVerification({
    nationalId,
    email,
    hash,
    tries = 0,
  }: {
    nationalId: string
    email: string
    hash: string
    tries?: number
  }) {
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
  }: {
    nationalId: string
    mobilePhoneNumber: string
    smsCode: string
    tries?: number
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

  async createUserDeviceToken({
    nationalId,
    deviceToken,
  }: {
    nationalId: string
    deviceToken: string
  }) {
    const userDeviceTokenModel = this.get(UserDeviceTokens)

    return userDeviceTokenModel.create<UserDeviceTokens>({
      nationalId,
      deviceToken,
    })
  }

  async createActorProfile({
    toNationalId,
    fromNationalId,
    emailNotifications,
    emailsId,
  }: {
    toNationalId: string
    fromNationalId: string
    emailNotifications: boolean
    emailsId?: string
  }) {
    const actorProfileModel = this.get(ActorProfile)

    return actorProfileModel.create<ActorProfile>({
      toNationalId,
      fromNationalId,
      emailNotifications,
      emailsId,
    })
  }
}
