import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { UserProfile } from '../user-profile/userProfile.model'
import { UserProfileDto } from './dto/user-profileDto'

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
        email: null,
        mobilePhoneNumber: null,
        locale: null,
        mobilePhoneNumberVerified: false,
        emailVerified: false,
        documentNotifications: true,
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
    }
  }
}
