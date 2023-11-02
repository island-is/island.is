import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'

import { DEFAULT_DOMAIN } from '../types'
import { ScopeTreeDTO } from './dto/scope-tree.dto'
import { ScopeDTO } from './dto/scope.dto'
import { ApiScopeGroup } from './models/api-scope-group.model'
import { ApiScope } from './models/api-scope.model'
import { IdentityResource } from './models/identity-resource.model'
import { ResourceTranslationService } from './resource-translation.service'
import { mapToScopeTree } from './utils/scope-tree.mapper'

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
  ): Promise<ScopeTreeDTO[]> {
    const scopes = await this.findScopesInternal({
      requestedScopes,
      language,
    })

    return mapToScopeTree(scopes)
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
