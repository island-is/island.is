import {
  BadRequestException,
  Controller,
  Get,
  ParseEnumPipe,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  DelegationResourcesService,
  ScopeDelegationSettingsResponseDTO,
  ScopeService,
  ScopeTreeDTO,
  ScopeCategoryDTO,
  ScopeTagDTO,
  DelegationDirection,
  RequestGrantorType,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { AuthScope, delegationScopes } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

const namespace = '@island.is/auth/delegation-api/scopes'
const MAX_SETTINGS_SCOPES = 200

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiSecurity('ias')
@ApiTags('scopes')
@Controller({
  path: 'scopes',
  version: ['1'],
})
@Audit({ namespace })
export class ScopesController {
  constructor(
    private readonly scopeService: ScopeService,
    private readonly delegationResourcesService: DelegationResourcesService,
  ) {}

  @Get('delegation-settings')
  @Documentation({
    description:
      'Returns how the given scopes can be delegated: the delegation types that give access to them and whether they can be requested from an individual or a company. Scopes that do not exist or are disabled are omitted.',
    request: {
      query: {
        scopes: {
          description: 'Scope names to look up (repeat the key for each).',
          required: true,
          type: 'string',
          isArray: true,
        },
      },
    },
    response: { status: 200, type: ScopeDelegationSettingsResponseDTO },
  })
  async findDelegationSettings(
    @CurrentUser() user: User,
    @Query('scopes') scopes?: string | string[],
  ): Promise<ScopeDelegationSettingsResponseDTO> {
    const scopeNames = ([] as string[]).concat(scopes ?? []).filter(Boolean)
    if (scopeNames.length === 0 || scopeNames.length > MAX_SETTINGS_SCOPES) {
      throw new BadRequestException(
        `Between 1 and ${MAX_SETTINGS_SCOPES} scopes must be provided.`,
      )
    }
    return {
      scopes: await this.delegationResourcesService.findScopeDelegationSettings(
        user,
        scopeNames,
      ),
    }
  }

  @Scopes(AuthScope.consents)
  @Get('scope-tree')
  @Documentation({
    description: 'Returns a sorted scope tree for the requested scopes.',
    request: {
      query: {
        lang: {
          description: 'The language to return the scopes in.',
          required: false,
          type: 'string',
        },
        requestedScopes: {
          description: 'List of scopes to return the tree for.',
          isArray: true,
          type: 'string',
        },
      },
    },
    response: { status: 200, type: [ScopeTreeDTO] },
  })
  @Audit<ScopeTreeDTO[]>({
    resources: (scopeTree) => scopeTree.map((node) => node.name),
  })
  findScopeTree(
    @Query('requestedScopes') requestedScopes: string[],
    @Query('lang') language?: string,
  ): Promise<ScopeTreeDTO[]> {
    if (!Array.isArray(requestedScopes)) requestedScopes = [requestedScopes]

    return this.scopeService.findScopeTree(requestedScopes, language)
  }

  @Scopes(...delegationScopes)
  @Get('categories')
  @Documentation({
    description:
      'Returns all scope categories from CMS with their associated scopes. Applies delegation filtering based on user permissions.',
    request: {
      query: {
        lang: {
          description: 'The language to return the categories in (is or en).',
          required: false,
          type: 'string',
        },
        direction: {
          description:
            'The direction of delegations to filter scopes by. Use OUTGOING to see scopes the user can delegate to others.',
          required: false,
          schema: {
            enum: [DelegationDirection.OUTGOING, DelegationDirection.REQUEST],
          },
        },
        requestGrantorType: {
          description:
            'When requesting a delegation (direction REQUEST), narrows the catalog to what the chosen grantor can grant: "company" or "individual".',
          required: false,
          schema: {
            enum: ['company', 'individual'],
          },
        },
      },
    },
    response: { status: 200, type: [ScopeCategoryDTO] },
  })
  @Audit<ScopeCategoryDTO[]>({
    resources: (categories) => categories.map((c) => c.id),
  })
  findCategories(
    @CurrentUser() user: User,
    @Query('lang') language?: string,
    @Query('direction') direction?: DelegationDirection,
    @Query(
      'requestGrantorType',
      new ParseEnumPipe(RequestGrantorType, { optional: true }),
    )
    requestGrantorType?: RequestGrantorType,
  ): Promise<ScopeCategoryDTO[]> {
    return this.scopeService.findScopeCategories(
      user,
      language || 'is',
      direction,
      requestGrantorType,
    )
  }

  @Scopes(...delegationScopes)
  @Get('tags')
  @Documentation({
    description:
      'Returns all scope tags (delegation scope tags) from CMS with their associated scopes. Applies delegation filtering based on user permissions.',
    request: {
      query: {
        lang: {
          description: 'The language to return the tags in (is or en).',
          required: false,
          type: 'string',
        },
        direction: {
          description:
            'The direction of delegations to filter scopes by. Use OUTGOING to see scopes the user can delegate to others.',
          required: false,
          schema: {
            enum: [DelegationDirection.OUTGOING, DelegationDirection.REQUEST],
          },
        },
        requestGrantorType: {
          description:
            'When requesting a delegation (direction REQUEST), narrows the catalog to what the chosen grantor can grant: "company" or "individual".',
          required: false,
          schema: {
            enum: ['company', 'individual'],
          },
        },
      },
    },
    response: { status: 200, type: [ScopeTagDTO] },
  })
  @Audit<ScopeTagDTO[]>({
    resources: (tags) => tags.map((t) => t.id),
  })
  findTags(
    @CurrentUser() user: User,
    @Query('lang') language?: string,
    @Query('direction') direction?: DelegationDirection,
    @Query(
      'requestGrantorType',
      new ParseEnumPipe(RequestGrantorType, { optional: true }),
    )
    requestGrantorType?: RequestGrantorType,
  ): Promise<ScopeTagDTO[]> {
    return this.scopeService.findScopeTags(
      user,
      language || 'is',
      direction,
      requestGrantorType,
    )
  }
}
