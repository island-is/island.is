import { Injectable } from '@nestjs/common'
import {
  dateResolution,
  ElasticService,
  elasticTagField,
  SortDirection,
  SortField,
  sortRule,
} from '@island.is/content-search-toolkit'
import { ArticleCategory } from './models/articleCategory.model'
import { Article } from './models/article.model'
import { News } from './models/news.model'
import { GetNewsInput } from './dto/getNews.input'
import { GetArticlesInput } from './dto/getArticles.input'
import { NewsList } from './models/newsList.model'
import { GetNewsDatesInput } from './dto/getNewsDates.input'
import { Menu } from './models/menu.model'
import { GetMenuInput } from './dto/getMenu.input'
import { GetSingleMenuInput } from './dto/getSingleMenu.input'
import { GetOrganizationSubpageInput } from './dto/getOrganizationSubpage.input'
import { OrganizationSubpage } from './models/organizationSubpage.model'
import { GetPublishedMaterialInput } from './dto/getPublishedMaterial.input'
import { EnhancedAssetSearchResult } from './models/enhancedAssetSearchResult.model'
import { ApiResponse } from '@elastic/elasticsearch'
import { SearchResponse } from '@island.is/shared/types'
import { MappedData } from '@island.is/content-search-indexer/types'
import { SupportQNA } from './models/supportQNA.model'
import { GetFeaturedSupportQNAsInput } from './dto/getFeaturedSupportQNAs.input'
import { Vacancy } from './models/vacancy.model'
import { ResponseError } from '@elastic/elasticsearch/lib/errors'
import { GetEventsInput } from './dto/getEvents.input'
import { Event as EventModel } from './models/event.model'
import { Manual } from './models/manual.model'
import { GetCategoryPagesInput } from './dto/getCategoryPages.input'
import { CategoryPage } from './models/categoryPage.model'
import { GetCustomPageInput } from './dto/getCustomPage.input'
import {
  ElasticsearchIndexLocale,
  getElasticsearchIndex,
} from '@island.is/content-search-index-manager'
import { CustomPage } from './models/customPage.model'
import {
  GetGenericListItemsInput,
  GetGenericListItemsInputOrderBy,
} from './dto/getGenericListItems.input'
import { GenericListItemResponse } from './models/genericListItemResponse.model'
import { GetCustomSubpageInput } from './dto/getCustomSubpage.input'
import { GetGenericListItemBySlugInput } from './dto/getGenericListItemBySlug.input'
import { GenericListItem } from './models/genericListItem.model'
import {
  GetTeamMembersInput,
  GetTeamMembersInputOrderBy,
} from './dto/getTeamMembers.input'
import { TeamMemberResponse } from './models/teamMemberResponse.model'
import {
  GetGrantsInput,
  GrantsAvailabilityStatus,
  GrantsSortBy,
} from './dto/getGrants.input'
import { Grant } from './models/grant.model'
import { GrantList } from './models/grantList.model'
import { BloodDonationRestrictionGenericTagList } from './models/bloodDonationRestriction.model'
import { sortAlpha } from '@island.is/shared/utils'
import { GetBloodDonationRestrictionsInput } from './dto/getBloodDonationRestrictions.input'

@Injectable()
export class CmsElasticsearchService {
  constructor(private elasticService: ElasticService) {}

  async getArticleCategories(
    index: string,
    { size }: { size?: number },
  ): Promise<ArticleCategory[]> {
    const query = {
      types: ['webArticleCategory'],
      sort: [{ 'title.sort': { order: SortDirection.ASC } }] as sortRule[],
      size,
    }
    const categoryResponse = await this.elasticService.getDocumentsByMetaData(
      index,
      query,
    )

    return categoryResponse.hits.hits.map<ArticleCategory>((response) =>
      JSON.parse(response._source.response ?? '[]'),
    )
  }

  async getCategoryPages(
    index: string,
    input: GetCategoryPagesInput,
  ): Promise<typeof CategoryPage[]> {
    const query = {
      types: ['webArticle', 'webManual'],
      tags: [] as elasticTagField[],
      sort: [{ 'title.sort': { order: SortDirection.ASC } }] as sortRule[],
      size: input.size,
    }

    if (input.sort === SortField.POPULAR) {
      query.sort = [
        { popularityScore: { order: SortDirection.DESC } },
        ...query.sort,
      ]
    }

    if (input.category) {
      query.tags.push({ type: 'category', key: input.category })
    }
    if (input.group) {
      query.tags.push({ type: 'group', key: input.group })
    }
    if (input.subgroup) {
      query.tags.push({ type: 'subgroup', key: input.subgroup })
    }
    if (input.organization) {
      query.tags.push({ type: 'organization', key: input.organization })
    }

    const pagesResponse = await this.elasticService.getDocumentsByMetaData(
      index,
      query,
    )

    return pagesResponse.hits.hits
      .filter((page) => Boolean(page?._source?.response))
      .map<Article | Manual>((page) =>
        JSON.parse(page._source.response as string),
      )
  }

  async getArticles(
    index: string,
    input: GetArticlesInput,
  ): Promise<Article[]> {
    const query = {
      types: ['webArticle'],
      tags: [] as elasticTagField[],
      sort: [{ 'title.sort': { order: SortDirection.ASC } }] as sortRule[],
      size: input.size,
    }

    if (input.sort === SortField.POPULAR) {
      query.sort = [
        { popularityScore: { order: SortDirection.DESC } },
        ...query.sort,
      ]
    }

    if (input.category) {
      query.tags.push({ type: 'category', key: input.category })
    }

    if (input.group) {
      query.tags.push({ type: 'group', key: input.group })
    }

    if (input.subgroup) {
      query.tags.push({ type: 'subgroup', key: input.subgroup })
    }

    if (input.organization) {
      query.tags.push({ type: 'organization', key: input.organization })
    }

    const articlesResponse = await this.elasticService.getDocumentsByMetaData(
      index,
      query,
    )
    return articlesResponse.hits.hits.map<Article>((response) =>
      JSON.parse(response._source.response ?? '[]'),
    )
  }

  async getEvents(
    index: string,
    { size, page, order, organization, onlyIncludePastEvents }: GetEventsInput,
  ) {
    const tagList: {
      key: string
      type: string
    }[] = []

    let tagQuery

    if (organization) {
      tagList.push({ key: organization, type: 'organization' })
    }

    if (tagList.length > 0) {
      tagQuery = { tags: tagList }
    }

    const query = {
      types: ['webEvent'],
      sort: [
        { dateCreated: { order } },
        { releaseDate: { order } },
      ] as sortRule[],
      ...tagQuery,
      page,
      size,
      ...(!onlyIncludePastEvents
        ? {
            releaseDate: {
              from: 'now',
            },
          }
        : {
            releaseDate: {
              to: 'now',
            },
          }),
    }

    const eventsResponse = await this.elasticService.getDocumentsByMetaData(
      index,
      query,
    )

    return {
      total: eventsResponse.hits.total.value,
      items: eventsResponse.hits.hits.map<EventModel>((response) =>
        JSON.parse(response._source.response ?? '{}'),
      ),
    }
  }

  async getNews(
    index: string,
    { size, page, order, month, year, tags, organization }: GetNewsInput,
  ): Promise<NewsList> {
    let dateQuery
    if (year) {
      dateQuery = {
        date: {
          from: `${year}-${month?.toString().padStart(2, '0') ?? '01'}-01`, // create a date with the format YYYY-MM-DD
          to: `${year}-${month?.toString().padStart(2, '0') ?? '12'}-31`, // create a date with the format YYYY-MM-DD
        },
      }
    } else {
      dateQuery = {}
    }

    const tagList: {
      key: string
      type: string
    }[] = []

    let tagQuery
    if (tags) {
      for (const tag of tags) {
        tagList.push({ key: tag, type: 'genericTag' })
      }
    }

    if (organization) {
      tagList.push({ key: organization, type: 'organization' })
    }

    if (tagList.length > 0) {
      tagQuery = { tags: tagList }
    }

    const query = {
      types: ['webNews'],
      sort: [
        { dateCreated: { order } },
        { releaseDate: { order } },
      ] as sortRule[],
      ...dateQuery,
      ...tagQuery,
      page,
      size,
    }

    const articlesResponse = await this.elasticService.getDocumentsByMetaData(
      index,
      query,
    )

    return {
      total: articlesResponse.hits.total.value,
      items: articlesResponse.hits.hits.map<News>((response) =>
        JSON.parse(response._source.response ?? '[]'),
      ),
    }
  }

  async getNewsDates(
    index: string,
    { order, tags, organization }: GetNewsDatesInput,
  ): Promise<string[]> {
    const tagList: { key: string; type: string }[] = []

    let tagQuery
    if (tags) {
      for (const tag of tags) {
        tagList.push({ key: tag, type: 'genericTag' })
      }
    }

    if (organization) {
      tagList.push({ key: organization, type: 'organization' })
    }

    if (tagList.length > 0) {
      tagQuery = {
        tags: tagList,
      }
    }

    const query = {
      types: ['webNews'],
      field: 'dateCreated',
      resolution: 'month' as dateResolution,
      ...tagQuery,
      order,
    }

    const newsDatesResponse = await this.elasticService.getDateAggregation(
      index,
      query,
    )

    // we return dates as array of strings on the format y-M
    if (newsDatesResponse.aggregations) {
      return newsDatesResponse.aggregations.dates.buckets.map(
        (aggregationResult) => aggregationResult.key_as_string,
      )
    } else {
      return []
    }
  }

  async getSingleDocumentTypeBySlug<RequestedType>(
    index: string,
    { type, slug }: { type: string; slug: string },
  ): Promise<RequestedType | null> {
    // return a single item by slug
    const query = { types: [type], tags: [{ type: 'slug', key: slug }] }
    const itemsResponse = await this.elasticService.getSingleDocumentByMetaData(
      index,
      query,
    )
    const response = itemsResponse.hits.hits?.[0]?._source?.response
    return response ? JSON.parse(response) : null
  }

  async getSingleDocumentById(index: string, id: string) {
    // return a single document by id
    const documentResponse = await this.elasticService.findById(index, id)
    const response = documentResponse.body?._source?.response
    return response ? JSON.parse(response) : null
  }

  async getSingleOrganizationSubpage(
    index: string,
    { slug, organizationSlug }: GetOrganizationSubpageInput,
  ): Promise<OrganizationSubpage | null> {
    // return an organization page by organization slug and subpage slug
    const query = {
      types: ['webOrganizationSubpage'],
      tags: [
        { type: 'slug', key: slug },
        { type: 'organization', key: organizationSlug },
      ],
    }
    const subpageResponse = await this.elasticService.getDocumentsByMetaData(
      index,
      query,
    )

    const response = subpageResponse.hits.hits?.[0]?._source?.response
    return response ? JSON.parse(response) : null
  }

  async getSingleMenuByName(
    index: string,
    { name }: GetMenuInput,
  ): Promise<Menu | null> {
    // return a single news item by slug
    const query = { types: ['webMenu'], tags: [{ type: 'name', key: name }] }
    const menuResponse = await this.elasticService.getDocumentsByMetaData(
      index,
      query,
    )

    const response = menuResponse.hits.hits?.[0]?._source?.response
    return response ? JSON.parse(response) : null
  }

  async getSingleMenu<RequestedMenuType>(
    index: string,
    { id }: GetSingleMenuInput,
  ): Promise<RequestedMenuType | null> {
    // return a single menu by id
    const menuResponse = await this.elasticService.findById(index, id)
    const response = menuResponse.body?._source?.response
    return response ? JSON.parse(response) : null
  }

  async getSingleVacancy(index: string, id: string) {
    try {
      const vacancyResponse = await this.elasticService.findById(index, id)
      const response = vacancyResponse.body?._source?.response
      return response ? JSON.parse(response) : null
    } catch (error) {
      if (error instanceof ResponseError) {
        if (error?.statusCode === 404) return null
      }
      throw error
    }
  }

  async getCustomPage(input: GetCustomPageInput): Promise<CustomPage | null> {
    return this.getSingleDocumentTypeBySlug(getElasticsearchIndex(input.lang), {
      type: 'webCustomPage',
      slug: input.uniqueIdentifier,
    })
  }

  async getCustomSubpage(
    input: GetCustomSubpageInput,
  ): Promise<CustomPage | null> {
    const index = getElasticsearchIndex(input.lang)

    const must = [
      {
        term: {
          type: {
            value: 'webCustomPage',
          },
        },
      },
      {
        nested: {
          path: 'tags',
          query: {
            bool: {
              must: [
                { match: { 'tags.key': input.parentPageId } },
                { term: { 'tags.type': 'referencedBy' } },
              ],
            },
          },
        },
      },
      {
        nested: {
          path: 'tags',
          query: {
            bool: {
              must: [
                { match: { 'tags.key': input.slug } },
                { term: { 'tags.type': 'slug' } },
              ],
            },
          },
        },
      },
    ]

    const response: ApiResponse<SearchResponse<MappedData>> =
      await this.elasticService.findByQuery(index, {
        query: {
          bool: {
            must,
          },
        },
      })

    return (
      response.body.hits.hits.map((item) =>
        JSON.parse(item._source.response ?? 'null'),
      )[0] ?? null
    )
  }

  async getGenericListItemBySlug(
    input: GetGenericListItemBySlugInput,
  ): Promise<GenericListItem | null> {
    return this.getSingleDocumentTypeBySlug(getElasticsearchIndex(input.lang), {
      slug: input.slug,
      type: 'webGenericListItem',
    })
  }

  private async getListItems<ListItemType extends 'webGenericListItem'>(input: {
    listId: string
    lang: ElasticsearchIndexLocale
    page?: number
    size?: number
    queryString?: string
    tags?: string[]
    tagGroups?: Record<string, string[]>
    type: ListItemType
    orderBy?: GetGenericListItemsInputOrderBy
  }): Promise<Omit<GenericListItemResponse, 'input'>> {
    let must: Record<string, unknown>[] = [
      {
        term: {
          type: {
            value: input.type,
          },
        },
      },
      {
        nested: {
          path: 'tags',
          query: {
            bool: {
              must: [
                {
                  term: {
                    'tags.key': input.listId,
                  },
                },
                {
                  term: {
                    'tags.type': 'referencedBy',
                  },
                },
              ],
            },
          },
        },
      },
    ]

    let queryString = input.queryString
      ? input.queryString.trim().toLowerCase()
      : ''

    if (input.lang === 'is') {
      queryString = queryString.replace('`', '')
    }

    must.push({
      simple_query_string: {
        query: queryString + '*',
        fields: ['title^100', 'content'],
        analyze_wildcard: true,
        default_operator: 'and',
      },
    })

    const size = input.size ?? 10

    let sort: sortRule[] = []

    if (
      !input.orderBy ||
      input.orderBy === GetGenericListItemsInputOrderBy.DATE
    ) {
      sort = [
        {
          [SortField.RELEASE_DATE]: {
            order: SortDirection.DESC,
          },
        },
        { 'title.sort': { order: SortDirection.ASC } },
        { dateCreated: { order: SortDirection.DESC } },
      ]
    }

    if (input.orderBy === GetGenericListItemsInputOrderBy.TITLE) {
      sort = [
        { 'title.sort': { order: SortDirection.ASC } },
        {
          [SortField.RELEASE_DATE]: {
            order: SortDirection.DESC,
          },
        },
        { dateCreated: { order: SortDirection.DESC } },
      ]
    }

    if (input.orderBy === GetGenericListItemsInputOrderBy.PUBLISH_DATE) {
      sort = [
        { dateCreated: { order: SortDirection.DESC } },
        { 'title.sort': { order: SortDirection.ASC } },
        {
          [SortField.RELEASE_DATE]: {
            order: SortDirection.DESC,
          },
        },
      ]
    }

    if (input.orderBy === GetGenericListItemsInputOrderBy.SCORE) {
      sort = [
        { _score: { order: SortDirection.DESC } },
        {
          [SortField.RELEASE_DATE]: {
            order: SortDirection.DESC,
          },
        },
        { 'title.sort': { order: SortDirection.ASC } },
        { dateCreated: { order: SortDirection.DESC } },
      ]
    }

    if (input.tags && input.tags.length > 0 && input.tagGroups) {
      must = must.concat(
        generateGenericTagGroupQueries(input.tags, input.tagGroups),
      )
    }

    const should = []

    if (input.orderBy === GetGenericListItemsInputOrderBy.SCORE) {
      should.push({
        match_phrase_prefix: {
          title: {
            query: queryString,
            boost: 200,
          },
        },
      })
    }

    const response: ApiResponse<SearchResponse<MappedData>> =
      await this.elasticService.findByQuery(getElasticsearchIndex(input.lang), {
        query: {
          bool: {
            must,
            should,
          },
        },
        sort,
        size,
        from: ((input.page ?? 1) - 1) * size,
      })

    return {
      items: response.body.hits.hits
        .map((item) => JSON.parse(item._source.response ?? 'null'))
        .filter(Boolean),
      total: response.body.hits.total.value,
    }
  }

  private async getTeamListItems(input: {
    listId: string
    lang: ElasticsearchIndexLocale
    page?: number
    size?: number
    queryString?: string
    tags?: string[]
    tagGroups?: Record<string, string[]>
    orderBy?: GetTeamMembersInputOrderBy
  }): Promise<Omit<TeamMemberResponse, 'input'>> {
    let must: Record<string, unknown>[] = [
      {
        term: {
          type: {
            value: 'webTeamMember',
          },
        },
      },
      {
        nested: {
          path: 'tags',
          query: {
            bool: {
              must: [
                {
                  term: {
                    'tags.key': input.listId,
                  },
                },
                {
                  term: {
                    'tags.type': 'referencedBy',
                  },
                },
              ],
            },
          },
        },
      },
    ]

    const queryString = input.queryString
      ? input.queryString.replace('´', '').trim().toLowerCase()
      : ''

    must.push({
      simple_query_string: {
        query: queryString + '*',
        fields: ['title^100'],
        analyze_wildcard: true,
        default_operator: 'and',
      },
    })

    const size = input.size ?? 10

    let sort: sortRule[] = []

    if (!input.orderBy) {
      sort = [
        {
          [SortField.RELEASE_DATE]: {
            order: SortDirection.DESC,
          },
        },
        { 'title.sort': { order: SortDirection.ASC } },
        { dateCreated: { order: SortDirection.DESC } },
      ]
    } else if (input.orderBy === GetTeamMembersInputOrderBy.Name) {
      sort = [
        { 'title.sort': { order: SortDirection.ASC } },
        {
          [SortField.RELEASE_DATE]: {
            order: SortDirection.DESC,
          },
        },
        { dateCreated: { order: SortDirection.DESC } },
      ]
    } else if (input.orderBy === GetTeamMembersInputOrderBy.Manual) {
      sort = [
        { dateCreated: { order: SortDirection.DESC } },
        { 'title.sort': { order: SortDirection.ASC } },
        {
          [SortField.RELEASE_DATE]: {
            order: SortDirection.DESC,
          },
        },
      ]
    }

    if (queryString.length > 0) {
      sort.unshift({ _score: { order: SortDirection.DESC } })
    }

    if (input.tags && input.tags.length > 0 && input.tagGroups) {
      must = must.concat(
        generateGenericTagGroupQueries(input.tags, input.tagGroups),
      )
    }

    const response: ApiResponse<SearchResponse<MappedData>> =
      await this.elasticService.findByQuery(getElasticsearchIndex(input.lang), {
        query: {
          bool: {
            must,
            should: [
              {
                prefix: {
                  'title.keyword': {
                    value: queryString,
                    boost: 100,
                  },
                },
              },
              {
                match_phrase: {
                  title: {
                    query: queryString,
                    boost: 5,
                  },
                },
              },
            ],
            minimum_should_match: 0,
          },
        },
        sort,
        track_scores: true,
        size,
        from: ((input.page ?? 1) - 1) * size,
      })

    return {
      items: response.body.hits.hits
        .map((item) => JSON.parse(item._source.response ?? 'null'))
        .filter(Boolean),
      total: response.body.hits.total.value,
    }
  }

  async getTeamMembers(
    input: GetTeamMembersInput,
  ): Promise<TeamMemberResponse> {
    const response = await this.getTeamListItems({
      ...input,
      listId: input.teamListId,
      orderBy:
        input.orderBy === GetTeamMembersInputOrderBy.Manual
          ? GetTeamMembersInputOrderBy.Manual
          : GetTeamMembersInputOrderBy.Name,
    })

    return {
      ...response,
      input,
    }
  }

  async getGenericListItems(
    input: GetGenericListItemsInput,
  ): Promise<GenericListItemResponse> {
    const response = await this.getListItems({
      ...input,
      type: 'webGenericListItem',
      listId: input.genericListId,
    })

    return {
      ...response,
      input,
    }
  }

  async getVacancies(index: string) {
    const vacanciesResponse = await this.elasticService.getDocumentsByMetaData(
      index,
      {
        types: ['webVacancy'],
        size: 1000,
      },
    )
    return vacanciesResponse.hits.hits
      .map<Vacancy>((response) =>
        JSON.parse(response._source.response ?? 'null'),
      )
      .filter(Boolean)
  }

  async getGrants(
    index: string,
    {
      lang,
      search,
      page = 1,
      size = 8,
      sort,
      status,
      categories,
      types,
      organizations,
      funds,
    }: GetGrantsInput,
  ): Promise<GrantList> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const must: Record<string, any>[] = [
      {
        term: {
          type: {
            value: 'webGrant',
          },
        },
      },
    ]

    let queryString = search ? search.toLowerCase() : ''

    if (lang === 'is') {
      queryString = queryString.replace('`', '')
    }

    let sortRules: ('_score' | sortRule)[] = []
    if (!sort || sort === GrantsSortBy.RECENTLY_UPDATED) {
      sortRules = [
        { dateUpdated: { order: SortDirection.ASC } },
        { 'title.sort': { order: SortDirection.ASC } },
      ]
    } else if (sort === GrantsSortBy.ALPHABETICAL) {
      sortRules = [
        { 'title.sort': { order: SortDirection.ASC } },
        { dateUpdated: { order: SortDirection.DESC } },
      ]
    }

    if (queryString.length > 0 && queryString !== '*') {
      sortRules.unshift('_score')
    }

    if (queryString) {
      must.push({
        simple_query_string: {
          query: queryString + '*',
          fields: ['title^100', 'content'],
          analyze_wildcard: true,
          default_operator: 'and',
        },
      })
    }

    const tagFilters: Array<Array<string>> = []

    if (categories) {
      tagFilters.push(categories)
    }
    if (types) {
      tagFilters.push(types)
    }

    tagFilters.forEach((filter) => {
      must.push({
        nested: {
          path: 'tags',
          query: {
            bool: {
              must: [
                {
                  terms: {
                    'tags.key': filter,
                  },
                },
                {
                  term: {
                    'tags.type': 'genericTag',
                  },
                },
              ],
            },
          },
        },
      })
    })

    if (status !== undefined) {
      if (status === GrantsAvailabilityStatus.CLOSED) {
        must.push({
          bool: {
            must: [
              {
                nested: {
                  path: 'tags',
                  query: {
                    bool: {
                      must: [
                        {
                          term: {
                            'tags.type': 'status',
                          },
                        },
                        {
                          terms: {
                            'tags.key': ['Closed with note', 'Automatic'],
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                bool: {
                  must_not: {
                    bool: {
                      filter: [
                        {
                          range: {
                            // date from
                            releaseDate: {
                              lt: 'now',
                            },
                          },
                        },
                        {
                          range: {
                            // date to
                            dateCreated: {
                              gt: 'now',
                            },
                          },
                        },
                        {
                          nested: {
                            path: 'tags',
                            query: {
                              bool: {
                                must: [
                                  {
                                    term: {
                                      'tags.type': 'status',
                                    },
                                  },
                                  {
                                    term: {
                                      'tags.key': 'Automatic',
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        })
      } else {
        must.push({
          bool: {
            should: [
              {
                bool: {
                  filter: [
                    {
                      range: {
                        //date from
                        releaseDate: {
                          lt: 'now',
                        },
                      },
                    },
                    {
                      range: {
                        //date to
                        dateCreated: {
                          gt: 'now',
                        },
                      },
                    },
                    {
                      nested: {
                        path: 'tags',
                        query: {
                          bool: {
                            must: [
                              {
                                term: {
                                  'tags.type': 'status',
                                },
                              },
                              {
                                term: {
                                  'tags.key': 'Automatic',
                                },
                              },
                            ],
                          },
                        },
                      },
                    },
                  ],
                },
              },
              {
                nested: {
                  path: 'tags',
                  query: {
                    bool: {
                      must: [
                        {
                          term: {
                            'tags.type': 'status',
                          },
                        },
                        {
                          terms: {
                            'tags.key': ['Open with note', 'Always open'],
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        })
      }
    }

    if (organizations) {
      must.push({
        nested: {
          path: 'tags',
          query: {
            bool: {
              must: [
                {
                  terms: {
                    'tags.key': organizations,
                  },
                },
                {
                  term: {
                    'tags.type': 'organization',
                  },
                },
              ],
            },
          },
        },
      })
    }

    if (funds) {
      must.push({
        nested: {
          path: 'tags',
          query: {
            bool: {
              must: [
                {
                  terms: {
                    'tags.key': funds,
                  },
                },
                {
                  term: {
                    'tags.type': 'fund',
                  },
                },
              ],
            },
          },
        },
      })
    }

    const grantListResponse: ApiResponse<SearchResponse<MappedData>> =
      await this.elasticService.findByQuery(index, {
        query: {
          bool: {
            must,
          },
        },
        sort: sortRules,
        size,
        from: (page - 1) * size,
      })
    return {
      total: grantListResponse.body.hits.total.value,
      items: grantListResponse.body.hits.hits.map<Grant>((response) =>
        JSON.parse(response._source.response ?? '[]'),
      ),
    }
  }

  async getPublishedMaterial(
    index: string,
    {
      organizationSlug,
      searchString,
      page = 1, // The page number is 1-based meaning that page 1 is the first page
      size = 10,
      tags,
      tagGroups,
      sort,
    }: GetPublishedMaterialInput,
  ): Promise<EnhancedAssetSearchResult> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const must: Record<string, any>[] = [
      {
        term: {
          type: {
            value: 'webEnhancedAsset',
          },
        },
      },
    ]

    if (organizationSlug)
      must.push({
        nested: {
          path: 'tags',
          query: {
            bool: {
              must: [
                {
                  term: {
                    'tags.key': organizationSlug,
                  },
                },
                {
                  term: {
                    'tags.type': 'organization',
                  },
                },
              ],
            },
          },
        },
      })

    const wildcardSearch = {
      wildcard: {
        title: '*',
      },
    }

    const multimatchSearch = {
      multi_match: {
        query: searchString ? searchString.toLowerCase() : '',
        fields: ['title'],
        type: 'phrase_prefix',
      },
    }

    must.push(!searchString ? wildcardSearch : multimatchSearch)

    const enhancedAssetResponse: ApiResponse<SearchResponse<MappedData>> =
      await this.elasticService.findByQuery(index, {
        sort: [
          {
            [sort.field]: {
              order: sort.order,
            },
          },
        ],
        query: {
          bool: {
            must: must.concat(generateGenericTagGroupQueries(tags, tagGroups)),
          },
        },
        size,
        from: (page - 1) * size,
      })

    return {
      total: enhancedAssetResponse.body.hits.total.value,
      items: enhancedAssetResponse.body.hits.hits.map((item) =>
        JSON.parse(item._source.response ?? '{}'),
      ),
    }
  }

  async getFeaturedSupportQNAs(
    index: string,
    input: GetFeaturedSupportQNAsInput,
  ): Promise<SupportQNA[]> {
    const query = {
      types: ['webQNA'],
      tags: [] as elasticTagField[],
      sort: [{ popularityScore: { order: SortDirection.DESC } }] as sortRule[],
      size: input.size,
    }

    if (input.organization) {
      query.tags.push({ type: 'organization', key: input.organization })
    }

    if (input.category) {
      query.tags.push({ type: 'category', key: input.category })
    }

    if (input.subCategory) {
      query.tags.push({ type: 'subcategory', key: input.subCategory })
    }

    const supportqnasResponse =
      await this.elasticService.getDocumentsByMetaData(index, query)
    return supportqnasResponse.hits.hits
      .map((response) => JSON.parse(response._source.response ?? '[]'))
      .filter((qna) => qna?.title && qna?.slug)
  }

  async getBloodDonationRestrictionGenericTags(
    index: string,
  ): Promise<BloodDonationRestrictionGenericTagList> {
    const response = await this.elasticService.findByQuery(index, {
      size: 0,
      aggs: {
        onlyBloodDonationRestrictions: {
          filter: {
            term: {
              type: 'webBloodDonationRestriction',
            },
          },
          aggs: {
            uniqueTags: {
              nested: {
                path: 'tags',
              },
              aggs: {
                uniqueGenericTags: {
                  filter: {
                    term: {
                      'tags.type': 'genericTag',
                    },
                  },
                  aggs: {
                    tagKeys: {
                      terms: {
                        field: 'tags.key',
                        size: 1000,
                      },
                      aggs: {
                        tagValues: {
                          terms: {
                            field: 'tags.value.keyword',
                            size: 1,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    const body = response.body as {
      aggregations: {
        onlyBloodDonationRestrictions: {
          uniqueTags: {
            uniqueGenericTags: {
              tagKeys: {
                buckets: Array<{
                  key: string
                  tagValues: { buckets: Array<{ key: string }> }
                }>
              }
            }
          }
        }
      }
    }

    const tags =
      body.aggregations.onlyBloodDonationRestrictions.uniqueTags.uniqueGenericTags.tagKeys.buckets
        .filter(
          (tagResult) =>
            Boolean(tagResult?.key) &&
            Boolean(tagResult.tagValues?.buckets?.[0]?.key),
        )
        .map((tagResult) => ({
          key: tagResult.key,
          value: tagResult.tagValues.buckets[0].key,
        }))

    tags.sort(sortAlpha('value'))

    return {
      total: tags.length,
      items: tags.map((tag) => ({
        key: tag.key,
        label: tag.value,
      })),
    }
  }

  async getBloodDonationRestrictionList(
    index: string,
    input: GetBloodDonationRestrictionsInput,
  ) {
    const must: Record<string, unknown>[] = [
      {
        term: {
          type: {
            value: 'webBloodDonationRestriction',
          },
        },
      },
    ]

    if (!!input.tagKeys && input.tagKeys.length > 0) {
      must.push({
        nested: {
          path: 'tags',
          query: {
            bool: {
              should: input.tagKeys.map((key) => ({
                bool: {
                  must: [
                    {
                      term: {
                        'tags.key': key,
                      },
                    },
                    {
                      term: {
                        'tags.type': 'genericTag',
                      },
                    },
                  ],
                },
              })),
            },
          },
        },
      })
    }

    const queryString = input.queryString
      ? input.queryString.replace('´', '').trim().toLowerCase()
      : ''

    must.push({
      simple_query_string: {
        query: queryString + '*',
        fields: ['title^100', 'content'],
        analyze_wildcard: true,
        default_operator: 'and',
      },
    })

    const size = 10

    let sort = [
      { _score: { order: SortDirection.DESC } },
      { 'title.sort': { order: SortDirection.ASC } },
    ]

    if (queryString.length === 0) {
      sort = [{ 'title.sort': { order: SortDirection.ASC } }]
    }

    const response: ApiResponse<SearchResponse<MappedData>> =
      await this.elasticService.findByQuery(index, {
        query: {
          bool: {
            must,
          },
        },
        sort,
        size,
        from: ((input.page ?? 1) - 1) * size,
      })

    return {
      items: response.body.hits.hits
        .map((item) => JSON.parse(item._source.response ?? 'null'))
        .filter(Boolean),
      total: response.body.hits.total.value,
      input,
    }
  }
}

const generateGenericTagGroupQueries = (
  tags: string[],
  tagGroups: Record<string, string[]>,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queries: Record<string, any>[] = []

  Object.keys(tagGroups).forEach((tagGroup) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const should: Record<string, any>[] = []

    tags
      .filter((tag) => tagGroups[tagGroup].includes(tag))
      .forEach((tag) => {
        should.push({
          bool: {
            must: [
              {
                term: {
                  'tags.key': tag,
                },
              },
              {
                term: {
                  'tags.type': 'genericTag',
                },
              },
            ],
          },
        })
      })

    const query = {
      nested: {
        path: 'tags',
        query: {
          bool: {
            should,
          },
        },
      },
    }

    queries.push(query)
  })

  return queries
}
