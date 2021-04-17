import {
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
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Audit } from '@island.is/nest/audit'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('user-identities')
@Controller('user-identities')
@Audit({ namespace: '@identityserver.api/userIdentities' })
export class UserIdentitiesController {
  constructor(private readonly userIdentityService: UserIdentitiesService) {}

  /** Creates a new User Identity */
  @Scopes('@identityserver.api/authentication')
  @Audit<UserIdentity | undefined>({
    resources: (userIdentity) => userIdentity?.id,
  })
  @Post()
  @ApiCreatedResponse({ type: UserIdentity })
  async create(
    @Body() userIdentity: UserIdentityDto,
  ): Promise<UserIdentity | undefined> {
    return await this.userIdentityService.create(userIdentity)
  }

  /** Gets User identity by subjectId */
  @Scopes('@identityserver.api/authentication')
  @Audit<UserIdentity>({
    resources: (userIdentity) => userIdentity.id,
  })
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
  @Audit<UserIdentity>({
    resources: (userIdentity) => userIdentity.id,
  })
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
  @Audit<UserIdentity>({
    resources: (userIdentity) => userIdentity.id,
  })
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
}
