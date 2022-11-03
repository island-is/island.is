import {
  Controller,
  Get,
  Query,
  UseGuards,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  DelegationDTO,
  DelegationScope,
  DelegationScopeService,
  DelegationsIncomingService,
  DelegationsService,
  DelegationType,
  MergedDelegationDTO,
} from '@island.is/auth-api-lib'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('delegations')
@Controller({
  path: 'delegations',
  version: ['1', VERSION_NEUTRAL],
})
export class DelegationsController {
  constructor(
    private readonly delegationsService: DelegationsService,
    private readonly delegationScopeService: DelegationScopeService,
    private readonly delegationsIncomingService: DelegationsIncomingService,
  ) {}

  @Scopes('@identityserver.api/authentication')
  @Get()
  @ApiOkResponse({ isArray: true })
  async findAllToV1(@CurrentUser() user: User): Promise<DelegationDTO[]> {
    return this.delegationsService.findAllIncoming(user)
  }

  @Scopes('@identityserver.api/authentication')
  @Version('2')
  @Get()
  @ApiOkResponse({ isArray: true })
  async findAllToV2(@CurrentUser() user: User): Promise<MergedDelegationDTO[]> {
    return this.delegationsIncomingService.findAllAvailable(user)
  }

  @Scopes('@identityserver.api/authentication')
  @Get('scopes')
  @ApiOkResponse({ isArray: true })
  async findAllScopesTo(
    @CurrentUser() user: User,
    @Query('fromNationalId') fromNationalId: string,
    @Query('delegationType') delegationType: Array<DelegationType>,
  ): Promise<string[]> {
    const scopePromises = []

    if (delegationType.includes(DelegationType.ProcurationHolder))
      scopePromises.push(this.delegationScopeService.findAllProcurationScopes())

    if (delegationType.includes(DelegationType.LegalGuardian))
      scopePromises.push(
        this.delegationScopeService.findAllLegalGuardianScopes(),
      )

    if (delegationType.includes(DelegationType.PersonalRepresentative))
      scopePromises.push(
        this.delegationScopeService.findPersonalRepresentativeScopes(
          user.nationalId,
          fromNationalId,
        ),
      )

    if (delegationType.includes(DelegationType.Custom))
      scopePromises.push(
        this.delegationScopeService
          .findAllValidCustomScopesTo(user.nationalId, fromNationalId)
          .then((delegationScopes: DelegationScope[]) =>
            delegationScopes.map((ds) => ds.apiScope.name),
          ),
      )

    const scopeSets = await Promise.all(scopePromises)

    let scopes = ([] as string[]).concat(...scopeSets)

    if (scopes.length > 0) {
      scopes = [
        ...scopes,
        ...(await this.delegationScopeService.findAllAutomaticScopes()),
      ]
    }

    return scopes
  }
}
