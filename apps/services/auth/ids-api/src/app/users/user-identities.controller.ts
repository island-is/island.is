import {
  ClaimDto,
  UserIdentitiesService,
  UserIdentity,
  UserIdentityDto,
} from '@island.is/auth-api-lib'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('user-identities')
@Controller({
  path: 'user-identities',
  version: ['1', VERSION_NEUTRAL],
})
export class UserIdentitiesController {
  constructor(private readonly userIdentityService: UserIdentitiesService) {}

  /** Creates a new User Identity */
  @Scopes('@identityserver.api/authentication')
  @Post()
  @ApiCreatedResponse({ type: UserIdentity })
  async create(
    @Body() userIdentity: UserIdentityDto,
  ): Promise<UserIdentity | undefined> {
    return await this.userIdentityService.create(userIdentity)
  }

  /** Gets User identity by subjectId */
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

  /** Gets User Identity by provider and subject id */
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

  /** Gets Delegation User Identity by provider, subject id and actor subject id */
  @Scopes('@identityserver.api/authentication')
  @Get('/delegation/:provider/:subjectId/:actorSubjectId')
  @ApiOkResponse({ type: UserIdentity })
  async findDelegationIdentity(
    @Param('provider') provider: string,
    @Param('subjectId') subjectId: string,
    @Param('actorSubjectId') actorSubjectId: string,
  ): Promise<UserIdentity> {
    const userIdentity = await this.userIdentityService.findDelegationIdentity(
      provider,
      subjectId,
      actorSubjectId,
    )

    if (!userIdentity) {
      throw new NotFoundException("This delegation identity doesn't exist")
    }

    return userIdentity
  }

  @Scopes('@identityserver.api/authentication')
  @Put(':subjectId/claims')
  @ApiOkResponse({ type: [ClaimDto] })
  async updateClaims(
    @Param('subjectId') subjectId: string,
    @Body() claims: ClaimDto[],
  ): Promise<ClaimDto[]> {
    return this.userIdentityService.updateClaims(subjectId, claims)
  }
}
