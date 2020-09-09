import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags, ApiOAuth2 } from '@nestjs/swagger'
import { UserProfile } from './user-profile.model'
import { UserProfilesService } from './user-profiles.service'
import { AuthGuard } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'

@ApiOAuth2(['openid:profile']) // add OAuth restriction to this controller
@UseGuards(AuthGuard('jwt'))
@ApiTags('user-profiles')
@Controller('user-profiles')
export class UserProfilesController {
  constructor(
    private readonly userProfilesService: UserProfilesService,
    // private readonly config: ConfigService
  ) {}

  @Get(':subjectId')
  @ApiOkResponse({ type: UserProfile })
  async findOne(@Param('subjectId') subjectId: string): Promise<UserProfile> {
    const userProfile = await this.userProfilesService.findBySubjectId(
      subjectId,
    )

    if (!userProfile) {
      throw new NotFoundException("This user profile doesn't exist")
    }

    return userProfile
  }
}

