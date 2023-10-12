import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common'
import { UserProfile } from '../userProfile.model'
import { UserProfileService } from '../userProfile.service'

@Injectable()
export class UserProfileByNationalIdPipe
  implements PipeTransform<string, Promise<UserProfile>>
{
  constructor(private readonly userProfileService: UserProfileService) {}

  async transform(nationalId: string): Promise<UserProfile> {
    const userProfile = await this.userProfileService.findByNationalId(
      nationalId,
    )
    if (!userProfile) {
      throw new NotFoundException(
        `A user profile with nationalId ${nationalId} does not exist`,
      )
    }
    return userProfile
  }
}
