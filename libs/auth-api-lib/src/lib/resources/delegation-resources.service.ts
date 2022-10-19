import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { ApiScopeTreeDTO } from './dto/api-scope-tree.dto'
import { ApiScopeGroup } from './models/api-scope-group.model'
import { ApiScope } from './models/api-scope.model'
import { ResourceTranslationService } from './resource-translation.service'

@Injectable()
export class DelegationResourcesService {
  constructor(
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    private resourceTranslationService: ResourceTranslationService,
  ) {}

  async findScopeTree(
    domainName: string,
    language?: string,
  ): Promise<ApiScopeTreeDTO[]> {
    const scopes = await this.apiScopeModel.findAll({
      where: {
        domainName,
        allowExplicitDelegationGrant: true,
        enabled: true,
      },
      include: [ApiScopeGroup],
      order: [
        ['group_id', 'ASC NULLS FIRST'],
        ['order', 'ASC'],
      ],
    })

    if (language) {
      await this.resourceTranslationService.translateApiScopes(scopes, language)
    }

    const groupChildren = new Map<string, ApiScopeTreeDTO[]>()
    const scopeTree: Array<ApiScope | ApiScopeGroup> = []

    for (const scope of scopes) {
      if (scope.group) {
        let children = groupChildren.get(scope.group.name)
        if (!children) {
          scopeTree.push(scope.group)
          children = []
          groupChildren.set(scope.group.name, children)
        }
        children.push(new ApiScopeTreeDTO(scope))
      } else {
        scopeTree.push(scope)
      }
    }

    return scopeTree
      .sort((a, b) => a.order - b.order)
      .map((node) => ({
        ...new ApiScopeTreeDTO(node),
        children: groupChildren.get(node.name),
      }))
  }
}
