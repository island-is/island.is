import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { UserIdentity, UserIdentitiesService } from '@island.is/auth-api-lib'
import { ApiOkResponse, ApiTags, ApiOAuth2 } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

@ApiOAuth2(['@identityserver.api/read'])
// @UseGuards(AuthGuard('jwt'))
@ApiTags('user-identities')
@Controller('user-identities')
export class UserIdentitiesController {
  constructor(private readonly userIdentityService: UserIdentitiesService) {}

  @Get(':subjectId')
  @ApiOkResponse({ type: UserIdentity })
  async findOne(@Param('subjectId') subjectId: string): Promise<UserIdentity> {
    if (!subjectId) {
      throw new BadRequestException('SubjectId must be provided')
    }

    const userIdentity = await this.userIdentityService.findBySubjectId(
      subjectId,
    )

    if (!userIdentity) {
      throw new NotFoundException("This user identity doesn't exist")
    }

    return userIdentity
  }

  // TODO: Implement blacklist and whitelist user
}
