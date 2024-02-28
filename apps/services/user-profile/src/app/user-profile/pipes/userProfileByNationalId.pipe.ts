import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { Injectable, Inject, PipeTransform } from '@nestjs/common'
import { UserProfile } from '../userProfile.model'
import { UserProfileService } from '../userProfile.service'

@Injectable()
export class UserProfileByNationalIdPipe
  implements PipeTransform<string, Promise<UserProfile>>
{
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly userProfileService: UserProfileService,
  ) {}

  async transform(nationalId: string): Promise<UserProfile> {
    const userProfile = await this.userProfileService.findByNationalId(
      nationalId,
    )
    if (!userProfile) {
      this.logger.info(
        `A user profile with nationalId ${nationalId} does not exist`,
      )
    } else {
      this.logger.info(`Found user profile with nationalId ${nationalId}`)
    }
    return userProfile
  }
}
