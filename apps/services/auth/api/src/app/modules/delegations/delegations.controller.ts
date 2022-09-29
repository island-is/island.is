import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  DelegationDTO,
  DelegationScopeService,
  DelegationsService,
  DelegationType,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('delegations')
@Controller('delegations')
export class DelegationsController {
  constructor(
    private readonly delegationsService: DelegationsService,
    private readonly delegationScopeService: DelegationScopeService,
  ) {}

  @Scopes('@identityserver.api/authentication')
  @Get()
  @ApiOkResponse({ isArray: true })
  async findAllTo(@CurrentUser() user: User): Promise<DelegationDTO[]> {
    return this.delegationsService.findAllIncoming(user)
  }

  @Scopes('@identityserver.api/authentication')
  @Get('scopes')
  @ApiOkResponse({ isArray: true })
  async findAllScopesTo(
    @CurrentUser() user: User,
    @Query('fromNationalId') fromNationalId: string,
    @Query('delegationType') delegationType: DelegationType,
  ): Promise<string[]> {
    let scopes: string[] = []

    switch (delegationType) {
      case DelegationType.ProcurationHolder: {
        scopes = await this.delegationScopeService.findAllProcurationScopes()
        break
      }
      case DelegationType.LegalGuardian: {
        scopes = await this.delegationScopeService.findAllLegalGuardianScopes()
        break
      }
      case DelegationType.PersonalRepresentative: {
        scopes = await this.delegationScopeService.findPersonalRepresentativeScopes(
          user.nationalId,
          fromNationalId,
        )
        break
      }
      case DelegationType.Custom: {
        const result = await this.delegationScopeService.findAllValidCustomScopesTo(
          user.nationalId,
          fromNationalId,
        )
        scopes = result
          .filter((s) => s.apiScope || s.identityResource)
          .map((s) => s.apiScope?.name ?? s.identityResource?.name ?? '')
        break
      }
    }

    if (scopes.length > 0) {
      scopes = [
        ...scopes,
        ...(await this.delegationScopeService.findAllAutomaticScopes()),
      ]
    }

    return scopes
  }
}
