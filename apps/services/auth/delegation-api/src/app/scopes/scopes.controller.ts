import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  ScopeService,
  ScopeTreeDTO,
  ScopeCategoryDTO,
  ScopeTagDTO,
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

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AuthScope.consents)
@ApiSecurity('ias')
@ApiTags('scopes')
@Controller({
  path: 'scopes',
  version: ['1'],
})
@Audit({ namespace })
export class ScopesController {
  constructor(private readonly scopeService: ScopeService) {}

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

  @Get('categories')
  @Scopes(...delegationScopes)
  @Documentation({
    description:
      'Returns all scope categories from CMS with their associated scopes.',
    request: {
      query: {
        lang: {
          description: 'The language to return the categories in (is or en).',
          required: false,
          type: 'string',
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
  ): Promise<ScopeCategoryDTO[]> {
    return this.scopeService.findScopeCategories(user, language || 'is')
  }

  @Get('tags')
  @Scopes(...delegationScopes)
  @Documentation({
    description:
      'Returns all scope tags (life events) from CMS with their associated scopes.',
    request: {
      query: {
        lang: {
          description: 'The language to return the tags in (is or en).',
          required: false,
          type: 'string',
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
  ): Promise<ScopeTagDTO[]> {
    return this.scopeService.findScopeTags(user, language || 'is')
  }
}
