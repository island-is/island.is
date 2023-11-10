import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { isEmail } from 'class-validator'
import subMonths from 'date-fns/subMonths'
import { Sequelize } from 'sequelize-typescript'

import { isDefined } from '@island.is/shared/utils'
import { AttemptFailed } from '@island.is/nest/problem'
import type { User } from '@island.is/auth-nest-tools'

import { VerificationService } from '../user-profile/verification.service'
import { UserProfile } from '../user-profile/userProfile.model'
import { formatPhoneNumber } from '../utils/format-phone-number'
import { PatchUserProfileDto } from './dto/patch-user-profile.dto'
import { UserProfileDto } from './dto/user-profile.dto'
import { IslykillService } from './islykill.service'

export const NUDGE_INTERVAL = 6

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

  async findById(
    nationalId: string,
    useMaster = false,
  ): Promise<UserProfileDto> {
    const userProfile = await this.userProfileModel.findOne({
      where: { nationalId },
      useMaster,
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
        needsNudge: null,
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
      needsNudge: this.checkNeedsNudge(userProfile),
    }
  }

  async patch(
    user: User,
    userProfile: PatchUserProfileDto,
  ): Promise<UserProfileDto> {
    const { nationalId, audkenniSimNumber } = user
    const isEmailDefined = isDefined(userProfile.email)
    const isMobilePhoneNumberDefined = isDefined(userProfile.mobilePhoneNumber)

    const audkenniSimSameAsMobilePhoneNumber =
      this.checkAudkenniSameAsMobilePhoneNumber(
        audkenniSimNumber,
        userProfile.mobilePhoneNumber,
      )

    const shouldVerifyEmail = isEmailDefined && userProfile.email !== ''
    const shouldVerifyMobilePhoneNumber =
      !audkenniSimSameAsMobilePhoneNumber &&
      isMobilePhoneNumberDefined &&
      userProfile.mobilePhoneNumber !== ''

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

    const formattedPhoneNumber = isMobilePhoneNumberDefined
      ? formatPhoneNumber(userProfile.mobilePhoneNumber)
      : undefined

    await this.sequelize.transaction(async (transaction) => {
      const commonArgs = [nationalId, { transaction, maxTries: 3 }] as const

      if (shouldVerifyEmail) {
        const { confirmed, message, remainingAttempts } =
          await this.verificationService.confirmEmail(
            {
              email: userProfile.email,
              hash: userProfile.emailVerificationCode,
            },
            ...commonArgs,
          )

        if (!confirmed) {
          // Check if we should throw a BadRequest or an AttemptFailed error
          if (remainingAttempts >= 0) {
            throw new AttemptFailed(remainingAttempts, {
              emailVerificationCode: 'Verification code does not match.',
            })
          } else {
            throw new BadRequestException(message)
          }
        }
      }

      if (shouldVerifyMobilePhoneNumber) {
        const { confirmed, message, remainingAttempts } =
          await this.verificationService.confirmSms(
            {
              mobilePhoneNumber: formattedPhoneNumber,
              code: userProfile.mobilePhoneNumberVerificationCode,
            },
            ...commonArgs,
          )

        if (confirmed === false) {
          // Check if we should throw a BadRequest or an AttemptFailed error
          if (remainingAttempts >= 0) {
            throw new AttemptFailed(remainingAttempts, {
              smsVerificationCode: 'Verification code does not match.',
            })
          } else if (remainingAttempts === -1) {
            throw new AttemptFailed(0)
          } else {
            throw new BadRequestException(message)
          }
        }
      }

      const update = {
        nationalId,
        ...(isEmailDefined && {
          email: userProfile.email || null,
          emailVerified: userProfile.email !== '',
        }),
        ...(isMobilePhoneNumberDefined && {
          mobilePhoneNumber: formattedPhoneNumber || null,
          mobilePhoneNumberVerified: formattedPhoneNumber !== '',
        }),
        ...(isDefined(userProfile.locale) && {
          locale: userProfile.locale,
        }),
      }

      await this.userProfileModel.upsert(
        {
          ...update,
          lastNudge: new Date(),
        },
        { transaction },
      )

      if (isEmailDefined || isMobilePhoneNumberDefined) {
        await this.islykillService.upsertIslykillSettings({
          nationalId,
          phoneNumber: formattedPhoneNumber,
          email: userProfile.email,
        })
      }
    })

    return this.findById(nationalId, true)
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
    const formattedPhoneNumber = formatPhoneNumber(mobilePhoneNumber)

    await this.verificationService.createSmsVerification(
      {
        nationalId,
        mobilePhoneNumber: formattedPhoneNumber,
      },
      3,
    )
  }

  async confirmNudge(nationalId: string): Promise<void> {
    await this.userProfileModel.upsert({ nationalId, lastNudge: new Date() })
  }

  private checkNeedsNudge(userProfile: UserProfile): boolean | null {
    if (userProfile.lastNudge) {
      const cutOffDate = subMonths(new Date(), NUDGE_INTERVAL)

      if (!userProfile.email && !userProfile.mobilePhoneNumber) {
        return userProfile.lastNudge < cutOffDate
      }

      if (
        (userProfile.email && userProfile.emailVerified) ||
        (userProfile.mobilePhoneNumber && userProfile.mobilePhoneNumberVerified)
      ) {
        return userProfile.lastNudge < cutOffDate
      }
    } else {
      if (
        (userProfile.email && userProfile.emailVerified) ||
        (userProfile.mobilePhoneNumber && userProfile.mobilePhoneNumberVerified)
      ) {
        return true
      }
    }

    return null
  }

  /**
   * Checks if the audkenni phone number is the same as the mobile phone number to skip verification
   * @param audkenniSimNumber
   * @param mobilePhoneNumber
   */
  private checkAudkenniSameAsMobilePhoneNumber(
    audkenniSimNumber: string,
    mobilePhoneNumber: string,
  ): boolean {
    if (!audkenniSimNumber || !mobilePhoneNumber) {
      return false
    }

    /**
     * Remove dashes from mobile phone number and compare last 7 digits of mobilePhoneNumber with the audkenni Phone number
     * Removing the dashes prevents misreading string with format +354-765-4321 as 65-4321
     */
    return mobilePhoneNumber.replace(/-/g, '').slice(-7) === audkenniSimNumber
  }
}
