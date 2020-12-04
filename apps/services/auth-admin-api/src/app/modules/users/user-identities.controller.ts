import {
  UserIdentitiesService,
  UserIdentity,
  ActiveDTO,
} from '@island.is/auth-api-lib'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOAuth2,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'

@ApiOAuth2(['@identityserver.api/read'])
// @UseGuards(AuthGuard('jwt'))
@ApiTags('user-identities')
@Controller('user-identities')
export class UserIdentitiesController {
  constructor(private readonly userIdentityService: UserIdentitiesService) {}

  @Get(':nrid')
  @ApiOkResponse({ type: UserIdentity })
  async findOne(@Param('nrid') nrid: string): Promise<UserIdentity> {
    if (!nrid) {
      throw new BadRequestException('nrid must be provided')
    }

    const userIdentity = await this.userIdentityService.findByNationalReg(nrid)

    if (!userIdentity) {
      throw new NotFoundException("This user identity doesn't exist")
    }

    return userIdentity
  }

  @Patch(':subjectId')
  @ApiCreatedResponse({ type: UserIdentity })
  async setActive(
    @Param('subjectId') subjectId: string,
    @Body() req: ActiveDTO,
  ): Promise<UserIdentity | null> {
    if (!subjectId) {
      throw new BadRequestException('Id must be provided')
    }

    return await this.userIdentityService.setActive(subjectId, req.active)
  }
}
