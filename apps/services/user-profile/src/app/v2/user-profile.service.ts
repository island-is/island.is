import { Injectable } from '@nestjs/common'
import { UserProfile } from '../user-profile/userProfile.model'
import { InjectModel } from '@nestjs/sequelize'
import { UserProfileDto } from './dto/user-profileDto'
import { NoContentException } from '@island.is/nest/problem'

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(UserProfile)
    private readonly userProfileModel: typeof UserProfile,
  ) {}

  async findById(nationalId: string) {
    const resp = await this.userProfileModel.findOne({
      where: { nationalId: nationalId },
    })

    if (!resp) {
      throw new NoContentException()
    }

    return {
      nationalId: resp.nationalId,
      email: resp.email,
      mobilePhoneNumber: resp.mobilePhoneNumber,
      locale: resp.locale,
      mobileStatus: resp.mobileStatus,
      emailStatus: resp.emailStatus,
      mobilePhoneNumberVerified: resp.mobilePhoneNumberVerified,
      emailVerified: resp.emailVerified,
    } as UserProfileDto
  }
}
