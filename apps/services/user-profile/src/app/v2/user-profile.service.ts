import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { parsePhoneNumber } from 'libphonenumber-js'
import { isEmail } from 'class-validator'
import pick from 'lodash/pick'

import { isDefined } from '@island.is/shared/utils'

import { UserProfileDto } from './dto/user-profileDto'
import { PatchUserProfileDto } from './dto/patch-user-profileDto'
import { VerificationService } from '../user-profile/verification.service'
import { UserProfile } from '../user-profile/userProfile.model'
import { IslykillService } from './islykill.service'
import { Sequelize } from 'sequelize-typescript'

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(UserProfile)
    private readonly userProfileModel: typeof UserProfile,
    @Inject(VerificationService)
    private readonly verificationService: VerificationService,
    private readonly islykillService: IslykillService,
    private sequelize: Sequelize,
  ) {}

  async findById(nationalId: string): Promise<UserProfileDto> {
    const userProfile = await this.userProfileModel.findOne({
      where: { nationalId },
    })

    if (!userProfile) {
      return {
        nationalId,
        email: null,
        mobilePhoneNumber: null,
        locale: null,
        mobilePhoneNumberVerified: false,
        emailVerified: false,
        documentNotifications: true,
        needsNudge: true,
      }
    }

    return {
      nationalId: userProfile.nationalId,
      email: userProfile.email,
      mobilePhoneNumber: userProfile.mobilePhoneNumber,
      locale: userProfile.locale,
      mobilePhoneNumberVerified: userProfile.mobilePhoneNumberVerified,
      emailVerified: userProfile.emailVerified,
      documentNotifications: userProfile.documentNotifications,
      needsNudge:
        userProfile.lastNudge !== null
          ? this.checkNeedsNudge(userProfile.lastNudge)
          : null,
    }
  }

  async patch(
    nationalId: string,
    userProfile: PatchUserProfileDto,
  ): Promise<UserProfileDto> {
    const isEmailDefined = userProfile.email !== undefined
    const isMobilePhoneNumberDefined =
      userProfile.mobilePhoneNumber !== undefined

    const shouldVerifyEmail = isEmailDefined && userProfile.email !== null
    const shouldVerifyMobilePhoneNumber =
      isMobilePhoneNumberDefined && userProfile.mobilePhoneNumber !== null

    if (shouldVerifyEmail && !isDefined(userProfile.emailVerificationCode)) {
      throw new BadRequestException('Email verification code is required')
    }

    if (
      shouldVerifyMobilePhoneNumber &&
      !isDefined(userProfile.mobilePhoneNumberVerificationCode)
    ) {
      throw new BadRequestException(
        'Mobile phone number verification code is required',
      )
    }

    const { nationalNumber, parsedPhoneNumber } =
      isMobilePhoneNumberDefined &&
      userProfile.mobilePhoneNumber !== null &&
      this.formatPhoneNumber(userProfile.mobilePhoneNumber)

    return await this.sequelize.transaction(async (transaction) => {
      const commonArgs = [nationalId, { transaction, maxTries: 3 }] as const

      const promises = await Promise.all(
        [
          shouldVerifyEmail &&
            (await this.verificationService.confirmEmail(
              {
                email: userProfile.email,
                hash: userProfile.emailVerificationCode,
              },
              ...commonArgs,
            )),

          shouldVerifyMobilePhoneNumber &&
            (await this.verificationService.confirmSms(
              {
                mobilePhoneNumber: userProfile.mobilePhoneNumber,
                code: userProfile.mobilePhoneNumberVerificationCode,
              },
              ...commonArgs,
            )),
        ].filter(Boolean),
      )

      promises.map(({ confirmed, message, remainingAttempts }) => {
        if (confirmed === false) {
          throw new BadRequestException({
            message,
            remainingAttempts,
          })
        }
      })

      const update = {
        nationalId,
        ...(isEmailDefined && {
          email: userProfile.email,
          emailVerified: userProfile.email !== null,
        }),
        ...(isMobilePhoneNumberDefined && {
          mobilePhoneNumberVerified: userProfile.mobilePhoneNumber !== null,
          mobilePhoneNumber:
            userProfile.mobilePhoneNumber === null ? null : nationalNumber,
        }),
        ...(isDefined(userProfile.locale) && {
          locale: userProfile.locale,
        }),
      }

      const [userProfileUpdated] = await this.userProfileModel.upsert(
        {
          ...update,
          lastNudge: new Date(),
        },
        { transaction },
      )

      await this.islykillService.updateIslykillSettings({
        nationalId,
        phoneNumber: parsedPhoneNumber,
        email: userProfile.email,
      })

      return pick(userProfileUpdated, Object.keys(update)) as typeof update
    })
  }

  async createEmailVerification({
    nationalId,
    email,
  }: {
    nationalId: string
    email: string
  }) {
    if (!isEmail(email)) {
      throw new BadRequestException('Email is invalid')
    }
    await this.verificationService.createEmailVerification(nationalId, email, 3)
  }

  async createSmsVerification({
    nationalId,
    mobilePhoneNumber,
  }: {
    nationalId: string
    mobilePhoneNumber: string
  }) {
    const { nationalNumber } = this.formatPhoneNumber(mobilePhoneNumber)

    await this.verificationService.createSmsVerification(
      {
        nationalId,
        mobilePhoneNumber: nationalNumber,
      },
      3,
    )
  }

  async confirmNudge(nationalId: string): Promise<void> {
    await this.userProfileModel.upsert({ nationalId, lastNudge: new Date() })
  }

  private checkNeedsNudge(lastNudge: NonNullable<Date>): boolean {
    const sixMonthsAgoDate = new Date()
    sixMonthsAgoDate.setMonth(sixMonthsAgoDate.getMonth() - 6)

    return new Date(lastNudge) < sixMonthsAgoDate
  }

  private formatPhoneNumber(phoneNumber: string): {
    nationalNumber: string
    parsedPhoneNumber: string
  } {
    if (phoneNumber === '') {
      return null
    }

    let nationalNumber = phoneNumber
    const tempPhoneNumber = parsePhoneNumber(phoneNumber, 'IS')
    if (tempPhoneNumber.country === 'IS') {
      nationalNumber = tempPhoneNumber.nationalNumber as string
    }

    return {
      nationalNumber,
      parsedPhoneNumber: [
        `+${tempPhoneNumber.countryCallingCode}`,
        tempPhoneNumber.nationalNumber,
      ].join('-'),
    }
  }
}
