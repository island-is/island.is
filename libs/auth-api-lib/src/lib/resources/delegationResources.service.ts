import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { ApiScopeTreeDTO } from './dto/api-scope-tree.dto'
import { ApiScopeGroup } from './models/api-scope-group.model'
import { ApiScope } from './models/api-scope.model'

@Injectable()
export class DelegationResourcesService {
  constructor(
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
  ) {}

  async findScopeTree(domainName: string): Promise<ApiScopeTreeDTO[]> {
    const scopes = await this.apiScopeModel.findAll({
      where: {
        //domainName,
        allowExplicitDelegationGrant: true,
      },
      include: [ApiScopeGroup],
      order: [
        ['group_id', 'ASC NULL FIRST'],
        ['order', 'ASC'],
      ],
    })

    const scopeTree: Record<string, ApiScopeTreeDTO> = {}

    for (const scope of scopes) {
      if (scope.group) {
        if (!scopeTree[scope.group.name]) {
          scopeTree[scope.group.name] = {
            ...ApiScopeTreeDTO.fromModel(scope.group),
            children: [],
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        scopeTree[scope.group.name].children!.push(
          ApiScopeTreeDTO.fromModel(scope),
        )
      } else {
        scopeTree[scope.name] = ApiScopeTreeDTO.fromModel(scope)
      }
    }

    return Object.values(scopeTree).sort((a, b) => b.order - a.order)
  }
}
