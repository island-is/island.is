import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { NoContentException } from '@island.is/nest/problem'

import { UserProfile } from '../user-profile/userProfile.model'
import { UserProfileDto } from './dto/user-profileDto'
import { DataStatus } from '../user-profile/types/dataStatusTypes'

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(UserProfile)
    private readonly userProfileModel: typeof UserProfile,
  ) {}

  async findById(nationalId: string): Promise<UserProfileDto> {
    const userProfile = await this.userProfileModel.findOne({
      where: { nationalId },
    })

    if (!userProfile) {
      return {
        nationalId,
        email: '',
        mobilePhoneNumber: '',
        locale: '',
        mobileStatus: DataStatus.NOT_DEFINED,
        emailStatus: DataStatus.NOT_DEFINED,
        mobilePhoneNumberVerified: false,
        emailVerified: false,
      }
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
    }
  }
}
