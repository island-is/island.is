import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'

import {
  ApiScope,
  ApiScopeGroup,
  DEFAULT_DOMAIN,
  IdentityResource,
  ResourceTranslationService,
} from '@island.is/auth-api-lib'

import { ScopeGroupDTO } from './scope-group.dto'
import { ScopeNodeDTO } from './scope-node.dto'
import { ScopeDTO } from './scope.dto'

@Injectable()
export class ScopeService {
  constructor(
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    @InjectModel(IdentityResource)
    private identityResourceModel: typeof IdentityResource,
    private resourceTranslationService: ResourceTranslationService,
  ) {}

  async findScopeTree(
    requestedScopes: string[],
    language?: string,
  ): Promise<ScopeNodeDTO[]> {
    const scopes = await this.findScopesInternal({
      requestedScopes,
      language,
    })
    const groupChildren = new Map<string, ScopeNodeDTO[]>()
    const scopeTree: Array<ScopeDTO | ScopeGroupDTO> = []

    for (const scope of scopes) {
      if (scope.group) {
        let children = groupChildren.get(scope.group.name)
        if (!children) {
          scopeTree.push(scope.group)
          children = []
          groupChildren.set(scope.group.name, children)
        }
        children.push(new ScopeNodeDTO(scope))
      } else {
        scopeTree.push(scope)
      }
    }

    return scopeTree
      .sort((a, b) => a.order - b.order)
      .map((node) => ({
        ...new ScopeNodeDTO(node),
        children: groupChildren.get(node.name),
      }))
  }

  private async findScopesInternal({
    requestedScopes,
    language,
  }: {
    requestedScopes: string[]
    language?: string
  }): Promise<ScopeDTO[]> {
    const apiScopes = await this.apiScopeModel.findAll({
      attributes: ['name', 'displayName', 'description', 'order', 'domainName'],
      where: {
        name: {
          [Op.in]: requestedScopes,
        },
      },
      include: [ApiScopeGroup],
      order: [
        ['group_id', 'ASC NULLS FIRST'],
        ['order', 'ASC'],
      ],
    })

    if (language) {
      await this.resourceTranslationService.translateApiScopes(
        apiScopes,
        language,
      )
    }

    const identityResources = await this.identityResourceModel.findAll({
      attributes: ['name', 'displayName', 'description'],
      where: {
        name: {
          [Op.in]: requestedScopes,
        },
      },
    })

    if (language) {
      await this.resourceTranslationService.translateIdentityResources(
        identityResources,
        language,
      )
    }

    return [
      ...apiScopes,
      ...identityResources.map((r) => ({
        name: r.name,
        displayName: r.displayName,
        description: r.description,
        order: 0,
        domainName: DEFAULT_DOMAIN,
      })),
    ]
  }
}
