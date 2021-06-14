import {
  DelegationsService,
  DelegationDTO,
  DelegationType,
  DelegationScopeService,
} from '@island.is/auth-api-lib'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { environment } from '../../../environments'

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
    const wards = await this.delegationsService.findAllWardsTo(
      user,
      environment.nationalRegistry.xroad.clientId ?? '',
    )

    const companies = await this.delegationsService.findAllCompaniesTo(
      user.nationalId,
    )

    const custom = await this.delegationsService.findAllValidCustomTo(
      user.nationalId,
    )

    return [...wards, ...companies, ...custom]
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
      case DelegationType.Custom: {
        const result = await this.delegationScopeService.findAllValidCustomScopesTo(
          user.nationalId,
          fromNationalId,
        )
        scopes = result.map((s) => s.scopeName ?? s.identityResourceName)
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
