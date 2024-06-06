import {
  Controller,
  Get,
  Inject,
  ParseArrayPipe,
  Query,
  UseGuards,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  DelegationDTO,
  DelegationScope,
  DelegationScopeService,
  DelegationsIncomingService,
  DelegationsService,
  MergedDelegationDTO,
  DelegationsIndexService,
} from '@island.is/auth-api-lib'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { AuthDelegationType } from 'delegation'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('delegations')
@Controller({
  path: 'delegations',
  version: ['1', VERSION_NEUTRAL],
})
export class DelegationsController {
  constructor(
    @Inject(LOGGER_PROVIDER)
    protected readonly logger: Logger,
    private readonly delegationsService: DelegationsService,
    private readonly delegationScopeService: DelegationScopeService,
    private readonly delegationsIncomingService: DelegationsIncomingService,
    private readonly delegationIndexService: DelegationsIndexService,
  ) {}

  @Scopes('@identityserver.api/authentication')
  @Get()
  @ApiOkResponse({ isArray: true })
  async findAllToV1(@CurrentUser() user: User): Promise<DelegationDTO[]> {
    const delegations = await this.delegationsService.findAllIncoming(user)

    // don't fail the request if indexing fails
    try {
      void this.delegationIndexService.indexDelegations(user)
    } catch {
      this.logger.error('Failed to index delegations')
    }

    return delegations
  }

  @Scopes('@identityserver.api/authentication')
  @Version('2')
  @Get()
  @ApiOkResponse({ isArray: true })
  async findAllToV2(
    @CurrentUser() user: User,
    @Query(
      'requestedScopes',
      new ParseArrayPipe({ optional: true, items: String, separator: ',' }),
    )
    requestedScopes: Array<string>,
  ): Promise<MergedDelegationDTO[]> {
    const delegations = await this.delegationsIncomingService.findAllAvailable({
      user,
      requestedScopes,
    })

    // don't fail the request if indexing fails
    try {
      void this.delegationIndexService.indexDelegations(user)
    } catch {
      this.logger.error('Failed to index delegations')
    }

    return delegations
  }

  @Scopes('@identityserver.api/authentication')
  @Get('scopes')
  @ApiOkResponse({ isArray: true })
  async findAllScopesTo(
    @CurrentUser() user: User,
    @Query('fromNationalId') fromNationalId: string,
    @Query(
      'delegationType',
      new ParseArrayPipe({ optional: true, items: String, separator: ',' }),
    )
    delegationType: Array<AuthDelegationType>,
  ): Promise<string[]> {
    const scopePromises = []

    if (delegationType.includes(AuthDelegationType.ProcurationHolder))
      scopePromises.push(this.delegationScopeService.findAllProcurationScopes())

    if (delegationType.includes(AuthDelegationType.LegalGuardian))
      scopePromises.push(
        this.delegationScopeService.findAllLegalGuardianScopes(),
      )

    if (delegationType.includes(AuthDelegationType.PersonalRepresentative))
      scopePromises.push(
        this.delegationScopeService.findPersonalRepresentativeScopes(
          user.nationalId,
          fromNationalId,
        ),
      )

    if (delegationType.includes(AuthDelegationType.Custom))
      scopePromises.push(
        this.delegationScopeService
          .findAllValidCustomScopesTo(user.nationalId, fromNationalId)
          .then((delegationScopes: DelegationScope[]) =>
            delegationScopes.map((ds) => ds.scopeName),
          ),
      )

    const scopeSets = await Promise.all(scopePromises)

    let scopes = ([] as string[]).concat(...scopeSets)

    if (
      scopes.length > 0 ||
      delegationType.includes(AuthDelegationType.ProcurationHolder) ||
      delegationType.includes(AuthDelegationType.LegalGuardian)
    ) {
      scopes = [
        ...scopes,
        ...(await this.delegationScopeService.findAllAutomaticScopes()),
      ]
    }

    return [...new Set(scopes)]
  }
}
