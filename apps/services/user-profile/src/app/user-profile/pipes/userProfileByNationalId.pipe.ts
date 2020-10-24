import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common'
import { UserProfile } from '../userProfile.model'
import { UserProfileService } from '../userProfile.service'

@Injectable()
export class UserProfileByNationalIdPipe
  implements PipeTransform<string, Promise<UserProfile>> {
  constructor(private readonly userProfileService: UserProfileService) { console.log('init transfomr') }

  async transform(nationalId: string): Promise<UserProfile> {
    console.log('sadkfjaældkfj')
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
