import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  UserIdentity,
  UserIdentitiesService,
  UserIdentityDto,
  ScopesGuard,
  Scopes,
  IdsAuthGuard,
} from '@island.is/auth-api-lib'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('user-identities')
@Controller('user-identities')
export class UserIdentitiesController {
  constructor(private readonly userIdentityService: UserIdentitiesService) {}

  @Scopes('@identityserver.api/authentication')
  @Post()
  @ApiCreatedResponse({ type: UserIdentity })
  async create(@Body() userIdentity: UserIdentityDto): Promise<UserIdentity> {
    return await this.userIdentityService.create(userIdentity)
  }

  @Scopes('@identityserver.api/authentication')
  @Get(':subjectId')
  @ApiOkResponse({ type: UserIdentity })
  async findOne(@Param('subjectId') subjectId: string): Promise<UserIdentity> {
    const userIdentity = await this.userIdentityService.findBySubjectId(
      subjectId,
    )
    if (!userIdentity) {
      throw new NotFoundException("This user identity doesn't exist")
    }

    return userIdentity
  }

  @Scopes('@identityserver.api/authentication')
  @Get('/:provider/:subjectId')
  @ApiOkResponse({ type: UserIdentity })
  async findOneByProviderSubject(
    @Param('provider') provider: string,
    @Param('subjectId') subjectId: string,
  ): Promise<UserIdentity> {
    const userIdentity = await this.userIdentityService.findByProviderSubjectId(
      provider,
      subjectId,
    )

    if (!userIdentity) {
      throw new NotFoundException("This user identity doesn't exist")
    }

    return userIdentity
  }
}
