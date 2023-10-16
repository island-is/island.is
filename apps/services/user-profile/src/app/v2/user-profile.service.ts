import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { NoContentException } from '@island.is/nest/problem'
import { isDefined } from '@island.is/shared/utils'

import { UserProfileDto } from './dto/user-profileDto'
import { PatchUserProfileDto } from './dto/patch-user-profileDto'
import { UserProfile } from './userProfileV2.model'
import { VerificationService } from '../user-profile/verification.service'

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(UserProfile)
    private readonly userProfileModel: typeof UserProfile,
    @Inject(VerificationService)
    private readonly verificationService: VerificationService,
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
        lastNudge: null,
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
      lastNudge: userProfile.lastNudge,
    }
  }

  async patch(
    nationalId: string,
    userProfile: PatchUserProfileDto,
  ): Promise<UserProfileDto> {
    const existingUSerProfile = await this.userProfileModel.findOne({
      where: { nationalId: nationalId },
    })

    if (!existingUSerProfile) {
      throw new NoContentException()
    }

    const isEmailDefined = isDefined(userProfile.email)
    const isMobilePhoneNumberDefined = isDefined(userProfile.mobilePhoneNumber)

    const update = {
      nationalId,
      ...(isMobilePhoneNumberDefined && {
        mobilePhoneNumberVerified: false,
        mobilePhoneNumber: userProfile.mobilePhoneNumber,
      }),
      ...(isEmailDefined && {
        emailVerified: false,
        email: userProfile.email,
      }),
      lastNudge: new Date(),
    }

    await this.userProfileModel.update(update, {
      where: { nationalId: nationalId },
    })

    if (isEmailDefined && userProfile.email !== '') {
      await this.verificationService.createEmailVerification(
        nationalId,
        userProfile.email,
        3,
      )
    }

    if (isMobilePhoneNumberDefined && userProfile.mobilePhoneNumber !== '') {
      await this.verificationService.createSmsVerification(
        {
          nationalId,
          mobilePhoneNumber: userProfile.mobilePhoneNumber,
        },
        3,
      )
    }

    return update
  }

  async confirmNudge(nationalId: string): Promise<void> {
    const userProfile = await this.userProfileModel.findOne({
      where: { nationalId: nationalId },
    })

    if (!userProfile) {
      throw new NoContentException()
    }

    await this.userProfileModel.update(
      { lastNudge: new Date() },
      {
        where: { nationalId: nationalId },
      },
    )
  }

  async confirmEmail(
    nationalId: string,
    email: string,
    code: string,
  ): Promise<void> {
    const { confirmed, message } = await this.verificationService.confirmEmail(
      { email, hash: code },
      nationalId,
    )

    if (!confirmed) {
      throw new BadRequestException(message)
    }

    await this.userProfileModel.update(
      { emailVerified: true },
      {
        where: { nationalId: nationalId },
      },
    )
  }

  async confirmMobilePhoneNumber(
    nationalId: string,
    mobilePhoneNumber: string,
    code: string,
  ): Promise<void> {
    const { confirmed, message } = await this.verificationService.confirmSms(
      { mobilePhoneNumber, code },
      nationalId,
    )

    if (!confirmed) {
      throw new BadRequestException(message)
    }

    await this.userProfileModel.update(
      {
        mobilePhoneNumberVerified: true,
      },
      {
        where: { nationalId: nationalId },
      },
    )
  }
}
