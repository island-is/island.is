import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { parsePhoneNumber } from 'libphonenumber-js'
import { isEmail } from 'class-validator'

import { isDefined } from '@island.is/shared/utils'

import { UserProfileDto } from './dto/user-profileDto'
import { PatchUserProfileDto } from './dto/patch-user-profileDto'
import { VerificationService } from '../user-profile/verification.service'
import { UserProfile } from '../user-profile/userProfile.model'
import { Sequelize } from 'sequelize-typescript'
import { IslykillService } from './islykill.service'

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
      needsNudge: this.checkNeedsNudge(userProfile.lastNudge as Date),
    }
  }

  async patch(
    nationalId: string,
    userProfile: PatchUserProfileDto,
  ): Promise<UserProfileDto> {
    const isEmailDefined = isDefined(userProfile.email)
    const isMobilePhoneNumberDefined = isDefined(userProfile.mobilePhoneNumber)

    if (
      isEmailDefined &&
      userProfile.email !== '' &&
      !isDefined(userProfile.emailVerificationCode)
    ) {
      throw new BadRequestException('Email verification code is required')
    }

    if (
      isMobilePhoneNumberDefined &&
      userProfile.mobilePhoneNumber !== '' &&
      !isDefined(userProfile.mobilePhoneNumberVerificationCode)
    ) {
      throw new BadRequestException(
        'Mobile phone number verification code is required',
      )
    }

    const { nationalNumber, parsedPhoneNumber } =
      isMobilePhoneNumberDefined &&
      userProfile.mobilePhoneNumber !== '' &&
      this.formatPhoneNumber(userProfile.mobilePhoneNumber)

    return await this.sequelize.transaction(async (transaction) => {
      if (userProfile.email !== '') {
        isEmailDefined &&
          (await this.verificationService
            .confirmEmail(
              {
                email: userProfile.email,
                hash: userProfile.emailVerificationCode,
              },
              nationalId,
              transaction,
            )
            .then((res) => {
              if (!res.confirmed) {
                throw new BadRequestException(res.message)
              }
            }))
      }

      if (userProfile.mobilePhoneNumber !== '') {
        isMobilePhoneNumberDefined &&
          (await this.verificationService
            .confirmSms(
              {
                mobilePhoneNumber: userProfile.mobilePhoneNumber,
                code: userProfile.mobilePhoneNumberVerificationCode,
              },
              nationalId,
              transaction,
            )
            .then((res) => {
              if (!res.confirmed) {
                throw new BadRequestException(res.message)
              }
            }))
      }

      const update = {
        nationalId,
        ...(isEmailDefined && {
          email: userProfile.email === '' ? null : userProfile.email,
          emailVerified: true,
        }),
        ...(isMobilePhoneNumberDefined && {
          mobilePhoneNumberVerified: true,
          mobilePhoneNumber:
            userProfile.mobilePhoneNumber === '' ? null : nationalNumber,
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

      await this.islykillService.upsertIslykillSettings({
        nationalId,
        phoneNumber: parsedPhoneNumber,
        email: userProfile.email,
      })
      return update
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
      throw new BadRequestException('Email is required')
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

  private checkNeedsNudge(lastNudge: Date | null): boolean {
    if (!lastNudge) {
      return null
    }

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
    tempPhoneNumber.country === 'IS' &&
      (nationalNumber = tempPhoneNumber.nationalNumber as string)

    return {
      nationalNumber: nationalNumber,
      parsedPhoneNumber: [
        `+${tempPhoneNumber.countryCallingCode}`,
        tempPhoneNumber.nationalNumber,
      ].join('-'),
    }
  }
}
