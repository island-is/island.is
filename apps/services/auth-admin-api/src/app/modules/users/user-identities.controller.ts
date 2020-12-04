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

  @Get(':id/:type')
  @ApiOkResponse({ type: UserIdentity })
  async findByNationalIdOrSubjectId(
    @Param('id') id: string,
    @Param('type') type: string,
  ): Promise<UserIdentity[]> {
    type = type.toLowerCase()

    if (type !== 'nationalid' && type !== 'subjectid') {
      throw new BadRequestException(
        'Types supported are [nationalId] and [subjectId]',
      )
    }

    if (!id) {
      throw new BadRequestException('id must be provided')
    }

    if (type === 'nationalid') {
      const userIdentities = await this.userIdentityService.findByNationalReg(
        id,
      )

      if (!userIdentities) {
        throw new NotFoundException("This user identity doesn't exist")
      }

      return userIdentities
    }

    // Find by subjectId
    const userIdentitiesBySubject = await this.userIdentityService.findBySubjectId(
      id,
    )

    if (!userIdentitiesBySubject) {
      throw new NotFoundException("This user identity doesn't exist")
    }

    return [userIdentitiesBySubject]
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
