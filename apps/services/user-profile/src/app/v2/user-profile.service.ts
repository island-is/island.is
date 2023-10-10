import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { NoContentException } from '@island.is/nest/problem'
import { isDefined } from '@island.is/shared/utils'

import { UserProfileDto } from './dto/user-profileDto'
import { PatchUserProfileDto } from './dto/patch-user-profileDto'
import { DataStatus } from '../user-profile/types/dataStatusTypes'
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
      where: { nationalId: nationalId },
    })

    if (!userProfile) {
      throw new NoContentException()
    }

    return {
      nationalId: userProfile.nationalId,
      email: userProfile.email,
      mobilePhoneNumber: userProfile.mobilePhoneNumber,
      locale: userProfile.locale,
      mobileStatus: DataStatus[userProfile.mobileStatus],
      emailStatus: DataStatus[userProfile.emailStatus],
      mobilePhoneNumberVerified: userProfile.mobilePhoneNumberVerified,
      emailVerified: userProfile.emailVerified,
      lastNudge: userProfile.lastNudge,
    }
  }

  async patch(
    nationalId: string,
    userProfile: PatchUserProfileDto,
  ): Promise<UserProfileDto> {
    const resp = await this.userProfileModel.findOne({
      where: { nationalId: nationalId },
    })

    if (!resp) {
      throw new NoContentException()
    }

    const isEmailDefined = isDefined(userProfile.email)
    const isMobilePhoneNumberDefined = isDefined(userProfile.mobilePhoneNumber)

    const update = {
      ...(isMobilePhoneNumberDefined && {
        mobileStatus: DataStatus.NOT_VERIFIED,
        mobilePhoneNumberVerified: false,
        mobilePhoneNumber: userProfile.mobilePhoneNumber,
      }),
      ...(isEmailDefined && {
        emailStatus: DataStatus.NOT_VERIFIED,
        emailVerified: false,
        email: userProfile.email,
      }),
    }

    await this.userProfileModel.update(update, {
      where: { nationalId: nationalId },
    })

    if (isEmailDefined) {
      await this.verificationService.createEmailVerification(
        nationalId,
        userProfile.email,
        3,
      )
    }

    if (isMobilePhoneNumberDefined) {
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
    const resp = await this.userProfileModel.findOne({
      where: { nationalId: nationalId },
    })

    if (!resp) {
      throw new NoContentException()
    }

    await this.userProfileModel.update(
      { lastNudge: new Date(Date.now()).toISOString() },
      {
        where: { nationalId: nationalId },
      },
    )
  }
}
