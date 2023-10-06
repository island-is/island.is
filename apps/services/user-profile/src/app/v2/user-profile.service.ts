import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UserProfileDto } from './dto/user-profileDto'
import { NoContentException } from '@island.is/nest/problem'
import { PatchUserProfileDto } from './dto/patch-user-profileDto'
import { DataStatus } from '../user-profile/types/dataStatusTypes'
import { isDefined } from '@island.is/shared/utils'
import { UserProfile } from './userProfileV2.model'

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
      lastNudge: resp.lastNudge,
    } as UserProfileDto
  }

  async patch(nationalId: string, userProfile: PatchUserProfileDto) {
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

    return update
  }

  async confirmNudge(nationalId: string) {
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
