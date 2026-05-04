import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'

import { User } from '@island.is/auth-nest-tools'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
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

const VIRTUAL_MUNICIPALITY_TAG_ID = 'virtual-mitt-sveitarfelag'
const VIRTUAL_MUNICIPALITY_TAG_SLUG = 'mitt-sveitarfelag'
// Must match the Contentful delegation scope tag slug for "Sveitarfélag"
const SVEITARFELOG_CMS_SLUG = 'sveitarfelog'

// Virtual categories not backed by CMS. Scopes are assigned via
// api_scope_category using these IDs, visible to superadmins in the admin portal.
export const ISLAND_IS_CATEGORY = {
  id: 'virtual-thjonusta-island-is',
  slug: 'thjonusta-island-is',
  title: { is: 'Þjónusta ísland.is', en: 'island.is services' },
  description: {
    is: 'Ráðgjöf, vörur og þjónusta sem Stafrænt Ísland veitir fyrirtækjum og stofnunum',
    en: 'Consulting, products and services provided by Digital Iceland to companies and institutions',
  },
} as const

@Injectable()
export class ScopeService {
  private readonly logger = new Logger(ScopeService.name)

  constructor(
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    @InjectModel(IdentityResource)
    private identityResourceModel: typeof IdentityResource,
    @InjectModel(Domain)
    private domainModel: typeof Domain,
    private resourceTranslationService: ResourceTranslationService,
    private cmsContentfulService: CmsContentfulService,
    private delegationResourcesService: DelegationResourcesService,
    private nationalRegistryService: NationalRegistryV3ClientService,
  ) {}

  /**
   * Looks up the user's municipality from the National Registry and finds
   * a matching domain by comparing against Domain.displayName.
   */
  private async getUserMunicipalDomain(user: User): Promise<string | null> {
    let sveitarfelag: string | undefined

    try {
      const address = await this.nationalRegistryService.getAddress(
        user.nationalId,
      )
      sveitarfelag = address?.sveitarfelag?.trim()
    } catch {
      this.logger.warn(
        'Failed to fetch municipality, falling back to normal categories',
      )
      return null
    }

    if (!sveitarfelag) return null

    const domain = await this.domainModel.findOne({
      attributes: ['name'],
      where: { displayName: sveitarfelag },
    })

    return domain?.name ?? null
  }

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
      attributes: [
        'name',
        'displayName',
        'description',
        'order',
        'domainName',
        'allowsWrite',
      ],
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
        allowsWrite: false,
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
      attributes: [
        'name',
        'displayName',
        'description',
        'domainName',
        'order',
        'allowsWrite',
      ],
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
          allowsWrite: scope.allowsWrite ?? false,
        } as ScopeDTO)
      }
    }

    // Map CMS categories to DTO with their scopes
    const resolvedCategoryIds = new Set(cmsCategories.map((c) => c.id))
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
      .filter((category) => category.scopes.length > 0)
      .sort((a, b) => a.title.localeCompare(b.title))

    // Collect orphaned scopes whose categoryId no longer exists in CMS
    // (excluding virtual categories which are handled separately)
    const virtualCategoryIds = new Set<string>([ISLAND_IS_CATEGORY.id])
    const orphanedScopes = new Map<string, ScopeDTO>()
    for (const [categoryId, catScopes] of categoryMap.entries()) {
      if (
        !resolvedCategoryIds.has(categoryId) &&
        !virtualCategoryIds.has(categoryId)
      ) {
        for (const scope of catScopes) {
          orphanedScopes.set(scope.name, scope)
        }
      }
    }

    if (orphanedScopes.size > 0) {
      result.push({
        id: '__uncategorized__',
        title: lang === 'is' ? 'Annað' : 'Other',
        description: '',
        slug: 'uncategorized-category',
        scopes: Array.from(orphanedScopes.values()),
      })
    }

    // Virtual "Þjónusta ísland.is" category — scopes assigned to this
    // category ID in the DB won't match a CMS category, so build it here.
    const islandIsScopes = categoryMap.get(ISLAND_IS_CATEGORY.id)
    if (islandIsScopes && islandIsScopes.length > 0) {
      result.push({
        id: ISLAND_IS_CATEGORY.id,
        title: ISLAND_IS_CATEGORY.title[lang === 'en' ? 'en' : 'is'],
        description:
          ISLAND_IS_CATEGORY.description[lang === 'en' ? 'en' : 'is'],
        slug: ISLAND_IS_CATEGORY.slug,
        scopes: islandIsScopes,
      })
    }

    return result
  }

  async findScopeTags(
    user: User,
    lang: string,
    direction?: DelegationDirection,
  ): Promise<ScopeTagDTO[]> {
    // Fetch tags and scopes in parallel
    const [cmsTags, scopes] = await Promise.all([
      this.cmsContentfulService.getDelegationScopeTags(lang),
      this.delegationResourcesService.findScopesInternal({
        user,
        language: lang,
        direction,
        attributes: [
          'name',
          'displayName',
          'description',
          'domainName',
          'order',
          'allowsWrite',
        ],
        additionalIncludes: [
          {
            model: ApiScopeTag,
            as: 'tags',
            attributes: ['tagId'],
            required: true,
          },
        ],
      }),
    ])

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
          allowsWrite: scope.allowsWrite ?? false,
        } as ScopeDTO)
      }
    }
    // Map CMS life events to DTO with their scopes
    const resolvedTagIds = new Set(cmsTags.map((t) => t.id))
    let result = cmsTags
      .map((tag) => {
        const scopes = tagMap.get(tag.id) ?? []
        return {
          id: tag.id,
          title: tag.title,
          description: tag.description ?? '',
          slug: tag.slug,
          showAsCard: tag.showAsCard,
          scopes,
        }
      })
      .filter((tag) => tag.scopes.length > 0) // Only return tags that have scopes
      .sort((a, b) => a.title.localeCompare(b.title))

    // Collect orphaned scopes whose tagId no longer exists in CMS
    const orphanedScopes = new Map<string, ScopeDTO>()
    for (const [tagId, tagScopes] of tagMap.entries()) {
      if (!resolvedTagIds.has(tagId)) {
        for (const scope of tagScopes) {
          orphanedScopes.set(scope.name, scope)
        }
      }
    }

    if (orphanedScopes.size > 0) {
      result.push({
        id: '__uncategorized__',
        title: lang === 'is' ? 'Annað' : 'Other',
        description: '',
        slug: 'uncategorized-tag',
        showAsCard: true,
        scopes: Array.from(orphanedScopes.values()),
      })
    }

    // If the "Sveitarfélag" tag exists with scopes, look up the user's
    // municipality and extract matching scopes into a virtual tag.
    // Scopes remain in their original tag as well.
    const sveitarfelagTag = result.find(
      (tag) => tag.slug === SVEITARFELOG_CMS_SLUG,
    )

    if (sveitarfelagTag && sveitarfelagTag.scopes.length > 0) {
      const municipalDomainName = await this.getUserMunicipalDomain(user)

      if (municipalDomainName) {
        const municipalScopes = sveitarfelagTag.scopes.filter(
          (scope) => scope.domainName === municipalDomainName,
        )

        if (municipalScopes.length > 0) {
          result = [
            {
              id: VIRTUAL_MUNICIPALITY_TAG_ID,
              title: lang === 'en' ? 'My municipality' : 'Mitt sveitarfélag',
              description:
                lang === 'en'
                  ? 'Services from your municipality'
                  : 'Þjónusta frá þínu sveitarfélagi',
              slug: VIRTUAL_MUNICIPALITY_TAG_SLUG,
              showAsCard: true,
              scopes: municipalScopes,
            },
            ...result,
          ]
        }
      }
    }

    return result
  }
}
