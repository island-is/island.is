import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'

import { User } from '@island.is/auth-nest-tools'
import { CmsContentfulService } from '@island.is/cms'

import { DEFAULT_DOMAIN } from '../types'
import { DelegationDirection } from '../delegations/types/delegationDirection'
import { ScopeTreeDTO } from './dto/scope-tree.dto'
import { ScopeDTO } from './dto/scope.dto'
import { ScopeCategoryDTO, ScopeTagDTO } from './dto/scope-category.dto'
import { ApiScopeGroup } from './models/api-scope-group.model'
import { ApiScope } from './models/api-scope.model'
import { ApiScopeCategory } from './models/api-scope-category.model'
import { ApiScopeTag } from './models/api-scope-tag.model'
import { IdentityResource } from './models/identity-resource.model'
import { Domain } from './models/domain.model'
import { ResourceTranslationService } from './resource-translation.service'
import { DelegationResourcesService } from './delegation-resources.service'
import { mapToScopeTree } from './utils/scope-tree.mapper'

@Injectable()
export class ScopeService {
  constructor(
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    @InjectModel(IdentityResource)
    private identityResourceModel: typeof IdentityResource,
    private resourceTranslationService: ResourceTranslationService,
    private cmsContentfulService: CmsContentfulService,
    private delegationResourcesService: DelegationResourcesService,
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

  async findScopeCategories(
    user: User,
    lang: string,
    direction?: DelegationDirection,
  ): Promise<ScopeCategoryDTO[]> {
    // Fetch categories from CMS
    const cmsCategories = await this.cmsContentfulService.getArticleCategories(
      lang,
    )

    // Fetch all scopes with their category associations
    const scopes = await this.delegationResourcesService.findScopesInternal({
      user,
      language: lang,
      direction,
      attributes: ['name', 'displayName', 'description', 'domainName', 'order'],
      additionalIncludes: [
        {
          model: ApiScopeCategory,
          as: 'categories',
          attributes: ['categoryId'],
          required: true,
        },
      ],
    })

    // Group scopes by category
    const categoryMap = new Map<string, ScopeDTO[]>()

    for (const scope of scopes) {
      const categoryIds = scope.categories?.map((c) => c.categoryId) ?? []

      for (const categoryId of categoryIds) {
        if (!categoryMap.has(categoryId)) {
          categoryMap.set(categoryId, [])
        }
        categoryMap.get(categoryId)!.push({
          name: scope.name,
          displayName: scope.displayName,
          description: scope.description || '',
          domainName: scope.domainName,
          order: scope.order || 0,
        } as ScopeDTO)
      }
    }

    // Map CMS categories to DTO with their scopes
    const result = cmsCategories
      .map((cmsCategory) => {
        const scopes = categoryMap.get(cmsCategory.id) ?? []
        return {
          id: cmsCategory.id,
          title: cmsCategory.title,
          description: cmsCategory.description,
          slug: cmsCategory.slug,
          scopes,
        }
      })
      .filter((category) => category.scopes.length > 0) // Only return categories that have scopes
      .sort((a, b) => a.title.localeCompare(b.title))

    return result
  }

  async findScopeTags(
    user: User,
    lang: string,
    direction?: DelegationDirection,
  ): Promise<ScopeTagDTO[]> {
    // Fetch tags from CMS
    const cmsTags = await this.cmsContentfulService.getDelegationScopeTags(lang)

    const scopes = await this.delegationResourcesService.findScopesInternal({
      user,
      language: lang,
      direction,
      attributes: ['name', 'displayName', 'description', 'domainName', 'order'],
      additionalIncludes: [
        {
          model: ApiScopeTag,
          as: 'tags',
          attributes: ['tagId'],
          required: true,
        },
      ],
    })

    // Group scopes by tag
    const tagMap = new Map<string, ScopeDTO[]>()

    for (const scope of scopes) {
      const tagIds = scope.tags?.map((t) => t.tagId) ?? []

      for (const tagId of tagIds) {
        if (!tagMap.has(tagId)) {
          tagMap.set(tagId, [])
        }
        tagMap.get(tagId)!.push({
          name: scope.name,
          displayName: scope.displayName,
          description: scope.description || '',
          domainName: scope.domainName,
          order: scope.order || 0,
        } as ScopeDTO)
      }
    }
    // Map CMS life events to DTO with their scopes
    return cmsTags
      .map((tag) => {
        const scopes = tagMap.get(tag.id) ?? []
        return {
          id: tag.id,
          title: tag.title,
          intro: tag.description ?? '',
          scopes,
        }
      })
      .filter((tag) => tag.scopes.length > 0) // Only return tags that have scopes
      .sort((a, b) => a.title.localeCompare(b.title))
  }
}
