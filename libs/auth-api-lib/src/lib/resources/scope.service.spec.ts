import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'

import { CmsContentfulService } from '@island.is/cms'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'

import { ScopeService, ISLAND_IS_CATEGORY } from './scope.service'
import { ResourceTranslationService } from './resource-translation.service'
import { DelegationResourcesService } from './delegation-resources.service'
import { ApiScope } from './models/api-scope.model'
import { IdentityResource } from './models/identity-resource.model'
import { Domain } from './models/domain.model'

const mockUser = {
  nationalId: '0101302399',
  scope: ['@island.is/auth/delegations:write'],
  authorization: '',
  client: '',
} as any

function makeScope(
  name: string,
  domainName: string,
  overrides?: Partial<{ displayName: string; description: string }>,
) {
  return {
    name,
    displayName: overrides?.displayName ?? name,
    description: overrides?.description ?? '',
    domainName,
    order: 0,
    allowsWrite: false,
  }
}

describe('ScopeService', () => {
  let service: ScopeService
  let mockCms: {
    getArticleCategories: jest.Mock
    getDelegationScopeTags: jest.Mock
  }
  let mockDelegationResources: { findScopesInternal: jest.Mock }
  let mockNationalRegistry: { getAddress: jest.Mock }
  let mockDomainModel: { findOne: jest.Mock }

  beforeEach(async () => {
    mockCms = {
      getArticleCategories: jest.fn().mockResolvedValue([]),
      getDelegationScopeTags: jest.fn().mockResolvedValue([]),
    }
    mockDelegationResources = {
      findScopesInternal: jest.fn().mockResolvedValue([]),
    }
    mockNationalRegistry = {
      getAddress: jest.fn().mockResolvedValue(null),
    }
    mockDomainModel = {
      findOne: jest.fn().mockResolvedValue(null),
    }

    const module = await Test.createTestingModule({
      providers: [
        ScopeService,
        { provide: getModelToken(ApiScope), useValue: { findAll: jest.fn() } },
        {
          provide: getModelToken(IdentityResource),
          useValue: { findAll: jest.fn() },
        },
        { provide: getModelToken(Domain), useValue: mockDomainModel },
        {
          provide: ResourceTranslationService,
          useValue: {
            translateApiScopes: jest.fn(),
            translateIdentityResources: jest.fn(),
          },
        },
        { provide: CmsContentfulService, useValue: mockCms },
        {
          provide: DelegationResourcesService,
          useValue: mockDelegationResources,
        },
        {
          provide: NationalRegistryV3ClientService,
          useValue: mockNationalRegistry,
        },
      ],
    }).compile()

    service = module.get(ScopeService)
  })

  describe('findScopeCategories', () => {
    it('should map CMS categories to scopes', async () => {
      mockCms.getArticleCategories.mockResolvedValue([
        { id: 'cat-1', title: 'Fjármál', slug: 'fjarmal', description: 'desc' },
      ])
      mockDelegationResources.findScopesInternal.mockResolvedValue([
        {
          ...makeScope('@island.is/finance:overview', '@island.is'),
          categories: [{ categoryId: 'cat-1' }],
        },
      ])

      const result = await service.findScopeCategories(mockUser, 'is')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('cat-1')
      expect(result[0].scopes).toHaveLength(1)
      expect(result[0].scopes[0].name).toBe('@island.is/finance:overview')
    })

    it('should build virtual "Þjónusta ísland.is" category from DB-assigned scopes', async () => {
      mockCms.getArticleCategories.mockResolvedValue([
        { id: 'cat-1', title: 'Fjármál', slug: 'fjarmal', description: '' },
      ])
      mockDelegationResources.findScopesInternal.mockResolvedValue([
        {
          ...makeScope('@island.is/finance:overview', '@island.is'),
          categories: [{ categoryId: 'cat-1' }],
        },
        {
          ...makeScope('@island.is/documents', '@island.is'),
          categories: [{ categoryId: ISLAND_IS_CATEGORY.id }],
        },
      ])

      const result = await service.findScopeCategories(mockUser, 'is')

      const virtualCat = result.find((c) => c.id === ISLAND_IS_CATEGORY.id)
      expect(virtualCat).toBeDefined()
      expect(virtualCat!.title).toBe('Þjónusta ísland.is')
      expect(virtualCat!.description).toBe(ISLAND_IS_CATEGORY.description.is)
      expect(virtualCat!.scopes).toHaveLength(1)
      expect(virtualCat!.scopes[0].name).toBe('@island.is/documents')
    })

    it('should return english title for virtual category when lang is en', async () => {
      mockCms.getArticleCategories.mockResolvedValue([])
      mockDelegationResources.findScopesInternal.mockResolvedValue([
        {
          ...makeScope('@island.is/documents', '@island.is'),
          categories: [{ categoryId: ISLAND_IS_CATEGORY.id }],
        },
      ])

      const result = await service.findScopeCategories(mockUser, 'en')

      expect(result[0].title).toBe('island.is services')
    })

    it('should not create virtual category when no scopes are assigned to it', async () => {
      mockCms.getArticleCategories.mockResolvedValue([
        { id: 'cat-1', title: 'Fjármál', slug: 'fjarmal', description: '' },
      ])
      mockDelegationResources.findScopesInternal.mockResolvedValue([
        {
          ...makeScope('@island.is/finance:overview', '@island.is'),
          categories: [{ categoryId: 'cat-1' }],
        },
      ])

      const result = await service.findScopeCategories(mockUser, 'is')

      expect(result.find((c) => c.id === ISLAND_IS_CATEGORY.id)).toBeUndefined()
    })

    it('should not put virtual category scopes into orphaned/uncategorized', async () => {
      mockCms.getArticleCategories.mockResolvedValue([])
      mockDelegationResources.findScopesInternal.mockResolvedValue([
        {
          ...makeScope('@island.is/documents', '@island.is'),
          categories: [{ categoryId: ISLAND_IS_CATEGORY.id }],
        },
      ])

      const result = await service.findScopeCategories(mockUser, 'is')

      const uncategorized = result.find((c) => c.id === '__uncategorized__')
      expect(uncategorized).toBeUndefined()
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(ISLAND_IS_CATEGORY.id)
    })

    it('should put truly orphaned scopes into uncategorized', async () => {
      mockCms.getArticleCategories.mockResolvedValue([])
      mockDelegationResources.findScopesInternal.mockResolvedValue([
        {
          ...makeScope('@island.is/something', '@island.is'),
          categories: [{ categoryId: 'deleted-cms-id' }],
        },
      ])

      const result = await service.findScopeCategories(mockUser, 'is')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('__uncategorized__')
      expect(result[0].scopes[0].name).toBe('@island.is/something')
    })
  })

  describe('findScopeTags', () => {
    it('should map CMS tags to scopes', async () => {
      mockCms.getDelegationScopeTags.mockResolvedValue([
        { id: 'tag-1', title: 'Eignir', slug: 'eignir', description: 'desc' },
      ])
      mockDelegationResources.findScopesInternal.mockResolvedValue([
        {
          ...makeScope('@island.is/assets', '@island.is'),
          tags: [{ tagId: 'tag-1' }],
        },
      ])

      const result = await service.findScopeTags(mockUser, 'is')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('tag-1')
      expect(result[0].scopes[0].name).toBe('@island.is/assets')
    })

    it('should create "Mitt sveitarfélag" tag when user municipality matches a domain', async () => {
      mockNationalRegistry.getAddress.mockResolvedValue({
        sveitarfelag: 'Kópavogur',
      })
      mockDomainModel.findOne.mockResolvedValue({ name: '@kopavogur.is' })

      mockCms.getDelegationScopeTags.mockResolvedValue([
        {
          id: 'tag-sv',
          title: 'Sveitarfélag',
          slug: 'sveitarfelog',
          description: '',
        },
      ])
      mockDelegationResources.findScopesInternal.mockResolvedValue([
        {
          ...makeScope('@kopavogur.is/service', '@kopavogur.is'),
          tags: [{ tagId: 'tag-sv' }],
        },
        {
          ...makeScope('@arborg.is/service', '@arborg.is'),
          tags: [{ tagId: 'tag-sv' }],
        },
      ])

      const result = await service.findScopeTags(mockUser, 'is')

      const mittTag = result.find((t) => t.id === 'virtual-mitt-sveitarfelag')
      expect(mittTag).toBeDefined()
      expect(mittTag!.title).toBe('Mitt sveitarfélag')
      expect(mittTag!.scopes).toHaveLength(1)
      expect(mittTag!.scopes[0].name).toBe('@kopavogur.is/service')
    })

    it('should keep scopes in original "Sveitarfélag" tag when creating "Mitt sveitarfélag"', async () => {
      mockNationalRegistry.getAddress.mockResolvedValue({
        sveitarfelag: 'Kópavogur',
      })
      mockDomainModel.findOne.mockResolvedValue({ name: '@kopavogur.is' })

      mockCms.getDelegationScopeTags.mockResolvedValue([
        {
          id: 'tag-sv',
          title: 'Sveitarfélag',
          slug: 'sveitarfelog',
          description: '',
        },
      ])
      mockDelegationResources.findScopesInternal.mockResolvedValue([
        {
          ...makeScope('@kopavogur.is/service', '@kopavogur.is'),
          tags: [{ tagId: 'tag-sv' }],
        },
      ])

      const result = await service.findScopeTags(mockUser, 'is')

      const svTag = result.find((t) => t.slug === 'sveitarfelog')
      expect(svTag).toBeDefined()
      expect(svTag!.scopes).toHaveLength(1)
      expect(svTag!.scopes[0].name).toBe('@kopavogur.is/service')
    })

    it('should pin "Mitt sveitarfélag" to the top of the list', async () => {
      mockNationalRegistry.getAddress.mockResolvedValue({
        sveitarfelag: 'Kópavogur',
      })
      mockDomainModel.findOne.mockResolvedValue({ name: '@kopavogur.is' })

      mockCms.getDelegationScopeTags.mockResolvedValue([
        {
          id: 'tag-sv',
          title: 'Sveitarfélag',
          slug: 'sveitarfelog',
          description: '',
        },
        { id: 'tag-other', title: 'Annað', slug: 'annad', description: '' },
      ])
      mockDelegationResources.findScopesInternal.mockResolvedValue([
        {
          ...makeScope('@kopavogur.is/service', '@kopavogur.is'),
          tags: [{ tagId: 'tag-sv' }],
        },
        {
          ...makeScope('@island.is/something', '@island.is'),
          tags: [{ tagId: 'tag-other' }],
        },
      ])

      const result = await service.findScopeTags(mockUser, 'is')

      expect(result[0].id).toBe('virtual-mitt-sveitarfelag')
    })

    it('should not create "Mitt sveitarfélag" when NatReg fails', async () => {
      mockNationalRegistry.getAddress.mockRejectedValue(
        new Error('NatReg down'),
      )

      mockCms.getDelegationScopeTags.mockResolvedValue([
        {
          id: 'tag-sv',
          title: 'Sveitarfélag',
          slug: 'sveitarfelog',
          description: '',
        },
      ])
      mockDelegationResources.findScopesInternal.mockResolvedValue([
        {
          ...makeScope('@kopavogur.is/service', '@kopavogur.is'),
          tags: [{ tagId: 'tag-sv' }],
        },
      ])

      const result = await service.findScopeTags(mockUser, 'is')

      expect(
        result.find((t) => t.id === 'virtual-mitt-sveitarfelag'),
      ).toBeUndefined()
      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe('sveitarfelog')
    })

    it('should not create "Mitt sveitarfélag" when no domain matches municipality', async () => {
      mockNationalRegistry.getAddress.mockResolvedValue({
        sveitarfelag: 'Dalvík',
      })
      mockDomainModel.findOne.mockResolvedValue(null)

      mockCms.getDelegationScopeTags.mockResolvedValue([
        {
          id: 'tag-sv',
          title: 'Sveitarfélag',
          slug: 'sveitarfelog',
          description: '',
        },
      ])
      mockDelegationResources.findScopesInternal.mockResolvedValue([
        {
          ...makeScope('@kopavogur.is/service', '@kopavogur.is'),
          tags: [{ tagId: 'tag-sv' }],
        },
      ])

      const result = await service.findScopeTags(mockUser, 'is')

      expect(
        result.find((t) => t.id === 'virtual-mitt-sveitarfelag'),
      ).toBeUndefined()
    })

    it('should not create "Mitt sveitarfélag" when no "Sveitarfélag" tag exists', async () => {
      mockNationalRegistry.getAddress.mockResolvedValue({
        sveitarfelag: 'Kópavogur',
      })
      mockDomainModel.findOne.mockResolvedValue({ name: '@kopavogur.is' })

      mockCms.getDelegationScopeTags.mockResolvedValue([
        { id: 'tag-other', title: 'Eignir', slug: 'eignir', description: '' },
      ])
      mockDelegationResources.findScopesInternal.mockResolvedValue([
        {
          ...makeScope('@island.is/assets', '@island.is'),
          tags: [{ tagId: 'tag-other' }],
        },
      ])

      const result = await service.findScopeTags(mockUser, 'is')

      expect(
        result.find((t) => t.id === 'virtual-mitt-sveitarfelag'),
      ).toBeUndefined()
    })

    it('should not create "Mitt sveitarfélag" when user has no municipal scopes in the tag', async () => {
      mockNationalRegistry.getAddress.mockResolvedValue({
        sveitarfelag: 'Kópavogur',
      })
      mockDomainModel.findOne.mockResolvedValue({ name: '@kopavogur.is' })

      mockCms.getDelegationScopeTags.mockResolvedValue([
        {
          id: 'tag-sv',
          title: 'Sveitarfélag',
          slug: 'sveitarfelog',
          description: '',
        },
      ])
      mockDelegationResources.findScopesInternal.mockResolvedValue([
        {
          ...makeScope('@arborg.is/service', '@arborg.is'),
          tags: [{ tagId: 'tag-sv' }],
        },
      ])

      const result = await service.findScopeTags(mockUser, 'is')

      expect(
        result.find((t) => t.id === 'virtual-mitt-sveitarfelag'),
      ).toBeUndefined()
      expect(result).toHaveLength(1)
    })

    it('should not create "Mitt sveitarfélag" when address has no sveitarfelag', async () => {
      mockNationalRegistry.getAddress.mockResolvedValue({ sveitarfelag: null })

      mockCms.getDelegationScopeTags.mockResolvedValue([
        {
          id: 'tag-sv',
          title: 'Sveitarfélag',
          slug: 'sveitarfelog',
          description: '',
        },
      ])
      mockDelegationResources.findScopesInternal.mockResolvedValue([
        {
          ...makeScope('@kopavogur.is/service', '@kopavogur.is'),
          tags: [{ tagId: 'tag-sv' }],
        },
      ])

      const result = await service.findScopeTags(mockUser, 'is')

      expect(
        result.find((t) => t.id === 'virtual-mitt-sveitarfelag'),
      ).toBeUndefined()
    })
  })
})
