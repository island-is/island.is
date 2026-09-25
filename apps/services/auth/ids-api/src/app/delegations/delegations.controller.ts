import {
  Body,
  Controller,
  Get,
  Inject,
  ParseArrayPipe,
  Post,
  Query,
  UseGuards,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  DelegationPreferenceDto,
  DelegationPreferenceService,
  DelegationScopeService,
  DelegationsIncomingService,
  DelegationsIndexService,
  MergedDelegationDTO,
  SetDelegationFavouriteDto,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Documentation } from '@island.is/nest/swagger'
import { AuthDelegationType } from '@island.is/shared/types'

import { DelegationVerificationResult } from './delegation-verification-result.dto'
import { DelegationVerification } from './delegation-verification.dto'

import type { Logger } from '@island.is/logging'
import type { User } from '@island.is/auth-nest-tools'
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
    private readonly delegationScopeService: DelegationScopeService,
    private readonly delegationsIncomingService: DelegationsIncomingService,
    private readonly delegationIndexService: DelegationsIndexService,
    private readonly delegationPreferenceService: DelegationPreferenceService,
  ) {}

  /**
   * What the user has chosen about the parties they can act for — which are
   * starred and when each was last used. Drives the favourites and recently
   * used lists on the delegation picker.
   */
  @Scopes('@identityserver.api/authentication')
  @Version([VERSION_NEUTRAL, '1'])
  @Get('preferences')
  @ApiOkResponse({ isArray: true })
  findPreferences(
    @CurrentUser() user: User,
  ): Promise<DelegationPreferenceDto[]> {
    return this.delegationPreferenceService.findAll(user.nationalId)
  }

  @Scopes('@identityserver.api/authentication')
  @Version([VERSION_NEUTRAL, '1'])
  @Post('preferences/favourite')
  setFavourite(
    @CurrentUser() user: User,
    @Body() dto: SetDelegationFavouriteDto,
  ): Promise<void> {
    return this.delegationPreferenceService.setFavourite(
      user.nationalId,
      dto.fromNationalId,
      dto.isFavourite,
    )
  }

  /** Recorded by the identity server when the user switches to a party. */
  @Scopes('@identityserver.api/authentication')
  @Version([VERSION_NEUTRAL, '1'])
  @Post('preferences/usage')
  recordUsage(
    @CurrentUser() user: User,
    @Body() dto: { fromNationalId: string },
  ): Promise<void> {
    return this.delegationPreferenceService.recordUsage(
      user.nationalId,
      dto.fromNationalId,
    )
  }

  @Scopes('@identityserver.api/authentication')
  @Version([VERSION_NEUTRAL, '1', '2'])
  @Get()
  @ApiOkResponse({ isArray: true })
  async findAllTo(@CurrentUser() user: User): Promise<MergedDelegationDTO[]> {
    const delegations = await this.delegationsIncomingService.findAllAvailable({
      user,
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
  findAllScopesTo(
    @CurrentUser() user: User,
    @Query('fromNationalId') fromNationalId: string,
    @Query(
      'delegationType',
      new ParseArrayPipe({ optional: true, items: String, separator: ',' }),
    )
    delegationType: Array<string>,
  ): Promise<string[]> {
    if (
      delegationType?.some(
        (dt) => dt === AuthDelegationType.PersonalRepresentative,
      )
    ) {
      // TODO: For backwards compatibility with IDS, add PersonalRepresentative:postholf type. Then remove this.
      delegationType.push(
        AuthDelegationType.PersonalRepresentative + ':postholf',
      )
    }

    return this.delegationScopeService.findAllScopesTo(
      user,
      fromNationalId,
      delegationType,
    )
  }

  @Scopes('@identityserver.api/authentication')
  @Post('verify')
  @Documentation({
    description: 'Verifies a delegation at the source.',
    response: { status: 200, type: DelegationVerificationResult },
  })
  @ApiOkResponse({ type: DelegationVerificationResult })
  async verify(
    @CurrentUser() user: User,
    @Body()
    request: DelegationVerification,
  ): Promise<DelegationVerificationResult> {
    const verified =
      await this.delegationsIncomingService.verifyDelegationAtProvider(
        user,
        request.fromNationalId,
        request.delegationTypes,
      )

    return { verified }
  }
}
