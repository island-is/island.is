/* eslint-disable @typescript-eslint/no-use-before-define */
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import { Injectable } from '@nestjs/common'
import sortBy from 'lodash/sortBy'
import type { EntryCollection } from 'contentful'
import * as types from './generated/contentfulTypes'
import { Article, mapArticle } from './models/article.model'
import { ContentSlug, TextFieldLocales } from './models/contentSlug.model'
import { GenericPage, mapGenericPage } from './models/genericPage.model'
import {
  GenericOverviewPage,
  mapGenericOverviewPage,
} from './models/genericOverviewPage.model'
import { News, mapNews } from './models/news.model'

import { GetContentSlugInput } from './dto/getContentSlug.input'
import { GetGenericPageInput } from './dto/getGenericPage.input'
import { GetGenericOverviewPageInput } from './dto/getGenericOverviewPage.input'
import { Namespace, mapNamespace } from './models/namespace.model'
import { Menu, mapMenu } from './models/menu.model'
import { AnchorPage, mapAnchorPage } from './models/anchorPage.model'
import { Organization } from './models/organization.model'
import { Organizations } from './models/organizations.model'
import { mapOrganization } from './models/organization.model'
import { OrganizationTags } from './models/organizationTags.model'
import { mapOrganizationTag } from './models/organizationTag.model'
import { ContentfulRepository, localeMap } from './contentful.repository'
import { GetAlertBannerInput } from './dto/getAlertBanner.input'
import { AlertBanner, mapAlertBanner } from './models/alertBanner.model'
import { mapUrl, Url } from './models/url.model'
import { GetSubpageHeaderInput } from './dto/getSubpageHeader.input'
import { mapSubpageHeader, SubpageHeader } from './models/subpageHeader.model'
import {
  mapOrganizationSubpage,
  OrganizationSubpage,
} from './models/organizationSubpage.model'
import { GetErrorPageInput } from './dto/getErrorPage.input'
import { ErrorPage, mapErrorPage } from './models/errorPage.model'
import {
  OrganizationPage,
  mapOrganizationPage,
} from './models/organizationPage.model'
import { Auction, mapAuction } from './models/auction.model'
import { mapFrontpage, Frontpage } from './models/frontpage.model'
import { GetFrontpageInput } from './dto/getFrontpage.input'
import { OpenDataPage, mapOpenDataPage } from './models/openDataPage.model'
import { GetOpenDataPageInput } from './dto/getOpenDataPage.input'
import { GetOrganizationsInput } from './dto/getOrganizations.input'
import {
  OpenDataSubpage,
  mapOpenDataSubpage,
} from './models/openDataSubpage.model'
import { GetOpenDataSubpageInput } from './dto/getOpenDataSubpage.input'
import { mapProjectPage, ProjectPage } from './models/projectPage.model'
import { ICourseListPage, IProjectPage } from './generated/contentfulTypes'
import { GetSupportQNAsInput } from './dto/getSupportQNAs.input'
import { mapSupportQNA, SupportQNA } from './models/supportQNA.model'
import { GetSupportCategoryInput } from './dto/getSupportCategory.input'
import {
  mapSupportCategory,
  SupportCategory,
} from './models/supportCategory.model'
import { GetSupportQNAsInCategoryInput } from './dto/getSupportQNAsInCategory.input'
import { GetSupportCategoriesInput } from './dto/getSupportCategories.input'
import { GetSupportCategoriesInOrganizationInput } from './dto/getSupportCategoriesInOrganization.input'
import { Form, mapForm } from './models/form.model'
import { GetFormInput } from './dto/getForm.input'
import { GetServicePortalAlertBannersInput } from './dto/getServicePortalAlertBanners.input'
import { mapImage } from './models/image.model'
import { EmailSignup, mapEmailSignup } from './models/emailSignup.model'
import { GetTabSectionInput } from './dto/getTabSection.input'
import { mapTabSection, TabSection } from './models/tabSection.model'
import { GenericTag, mapGenericTag } from './models/genericTag.model'
import { GetEmailSignupInput } from './dto/getEmailSignup.input'
import { LifeEventPage, mapLifeEventPage } from './models/lifeEventPage.model'
import { GetGenericTagBySlugInput } from './dto/getGenericTagBySlug.input'
import { GetGenericTagsInTagGroupsInput } from './dto/getGenericTagsInTagGroups.input'
import { Grant, mapGrant } from './models/grant.model'
import { mapManual } from './models/manual.model'
import { mapServiceWebPage } from './models/serviceWebPage.model'
import { mapEvent } from './models/event.model'
import { GetOrganizationParentSubpageInput } from './dto/getOrganizationParentSubpage.input'
import { mapOrganizationParentSubpage } from './models/organizationParentSubpage.model'
import {
  GetOrganizationPageStandaloneSitemapLevel1Input,
  GetOrganizationPageStandaloneSitemapLevel2Input,
} from './dto/getOrganizationPageStandaloneSitemap.input'
import {
  OrganizationPageStandaloneSitemap,
  OrganizationPageStandaloneSitemapLevel2,
} from './models/organizationPageStandaloneSitemap.model'
import { SitemapTree, SitemapTreeNodeType } from '@island.is/shared/types'
import {
  getOrganizationPageUrlPrefix,
  sortAlpha,
} from '@island.is/shared/utils'
import { NewsList } from './models/newsList.model'
import { GetCmsNewsInput } from './dto/getNews.input'
import {
  GetBloodDonationRestrictionDetailsInput,
  GetBloodDonationRestrictionsInput,
} from './dto/getBloodDonationRestrictions.input'
import {
  BloodDonationRestrictionList,
  mapBloodDonationRestrictionDetails,
  mapBloodDonationRestrictionListItem,
} from './models/bloodDonationRestriction.model'
import { GetCourseByIdInput } from './dto/getCourseById.input'
import { CourseDetails, mapCourse } from './models/course.model'
import { GetCourseListPageByIdInput } from './dto/getCourseListPageById.input'
import { mapCourseListPage } from './models/courseListPage.model'
import { GetCourseSelectOptionsInput } from './dto/getCourseSelectOptions.input'
import { GetWebChatInput } from './dto/getWebChat.input'
import { mapWebChat, WebChat } from './models/webChat.model'

const errorHandler = (name: string) => {
  return (error: Error) => {
    logger.error(error)
    throw new ApolloError('Failed to resolve request in ' + name)
  }
}

const ArticleFields = (
  [
    // we want to exclude relatedArticles because it's a self-referencing
    // relation and selecting related articles to a depth of 10 would make the
    // response huge
    'sys',
    'fields.activeTranslations',
    'fields.alertBanner',
    'fields.category',
    'fields.content',
    'fields.contentStatus',
    'fields.featuredImage',
    'fields.group',
    'fields.importance',
    'fields.intro',
    'fields.organization',
    'fields.otherCategories',
    'fields.otherGroups',
    'fields.otherSubgroups',
    'fields.processEntry',
    'fields.processEntryButtonText',
    'fields.relatedContent',
    'fields.relatedOrganization',
    'fields.responsibleParty',
    'fields.shortTitle',
    'fields.showTableOfContents',
    'fields.signLanguageVideo',
    'fields.slug',
    'fields.stepper',
    'fields.subArticles',
    'fields.subgroup',
    'fields.title',
    'fields.userStories',
    'fields.keywords',
  ] as ('sys' | `fields.${keyof types.IArticle['fields']}`)[]
).join(',')

@Injectable()
export class CmsContentfulService {
  constructor(private contentfulRepository: ContentfulRepository) {}

  async getOrganizations(input: GetOrganizationsInput): Promise<Organizations> {
    const organizationTitles = input?.organizationTitles && {
      'fields.title[in]': input.organizationTitles.join(','),
    }

    const organizationReferenceIdentifiers = input?.referenceIdentifiers && {
      'fields.referenceIdentifier[in]': input.referenceIdentifiers.join(','),
    }

    const params = {
      ['content_type']: 'organization',
      include: 4,
      limit: 1000,
      ...organizationTitles,
      ...organizationReferenceIdentifiers,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationFields>(
        input?.lang ?? 'is-IS',
        params,
      )
      .catch(errorHandler('getOrganizations'))

    return {
      items: (result.items as types.IOrganization[])
        .map(mapOrganization)
        .filter((organization) => organization.title && organization.slug),
    }
  }

  async getOrganizationLogos(
    organizationFieldValues: string[],
    searchByField: keyof types.IOrganizationFields,
  ): Promise<Array<string | null>> {
    const params = {
      ['content_type']: 'organization',
      select: `fields.logo,fields.${searchByField}`,
      [`fields.${searchByField}[in]`]: organizationFieldValues.join(','),
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationFields>(null, params)
      .catch(errorHandler('getOrganizationsLogo'))

    return organizationFieldValues.map((title) => {
      if (!result.items) {
        return null
      } else {
        const organization = result.items.find(
          (item) => item.fields[searchByField] === title,
        )

        const image = organization?.fields.logo
          ? mapImage(organization?.fields.logo)
          : null

        return image?.url ? image.url : null
      }
    })
  }

  async getOrganizationTitles(
    organizationKeys: string[],
    searchByField: keyof types.IOrganizationFields,
    locale?: 'en' | 'is',
  ): Promise<Array<string | null>> {
    const params = {
      ['content_type']: 'organization',
      select: `fields.title,fields.${searchByField}`,
      [`fields.${searchByField}[in]`]: organizationKeys.join(','),
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationFields>(locale, params)
      .catch(errorHandler('getOrganizationsTitle'))

    return organizationKeys.map((key) => {
      if (!result.items) {
        return null
      } else {
        const organization = result.items.find(
          (item) => item.fields[searchByField] === key,
        )

        const title = organization?.fields.title || organization?.fields.title

        return title ?? null
      }
    })
  }

  async getOrganizationLink(
    organizationKeys: string[],
    locale?: 'en' | 'is',
  ): Promise<Array<string | null>> {
    const params = {
      ['content_type']: 'organization',
      select: 'fields.link,fields.referenceIdentifier',
      'fields.referenceIdentifier[in]': organizationKeys.join(','),
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationFields>(locale, params)
      .catch(errorHandler('getOrganizationLink'))

    return organizationKeys.map((key) => {
      if (!result.items) {
        return null
      } else {
        const organization = result.items.find(
          (item) => item.fields.referenceIdentifier === key,
        )

        const link = organization?.fields.link || organization?.fields.link

        return link ?? null
      }
    })
  }

  async getOrganizationTags(lang = 'is-IS'): Promise<OrganizationTags> {
    const params = {
      ['content_type']: 'organizationTag',
      include: 10,
      limit: 100,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationTagFields>(lang, params)
      .catch(errorHandler('getOrganizationTags'))

    return {
      items: (result.items as types.IOrganizationTag[]).map(mapOrganizationTag),
    }
  }

  private async getOrganizationBy(
    fieldName: string,
    fieldValue: string,
    lang: string,
    requireFieldValue = false,
  ): Promise<Organization | null> {
    if (requireFieldValue && !fieldValue) {
      return null
    }

    const params = {
      ['content_type']: 'organization',
      include: 10,
      [`fields.${fieldName}`]: fieldValue,
      limit: 1,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationFields>(lang, params)
      .catch(errorHandler('getOrganization'))

    return (
      (result.items as types.IOrganization[]).map(mapOrganization)[0] ?? null
    )
  }

  async getOrganization(
    slug: string,
    lang: string,
  ): Promise<Organization | null> {
    return this.getOrganizationBy('slug', slug, lang, true)
  }

  async getOrganizationByTitle(
    title: string,
    lang: string,
  ): Promise<Organization | null> {
    return this.getOrganizationBy('title[match]', title, lang)
  }

  async getOrganizationByReferenceId(
    referenceId: string,
    lang: string,
  ): Promise<Organization | null> {
    return this.getOrganizationBy('referenceIdentifier', referenceId, lang)
  }

  async getOrganizationByNationalId(
    nationalId: string,
    lang: string,
  ): Promise<Organization | null> {
    return this.getOrganizationBy('kennitala', nationalId, lang, true)
  }

  async getOrganizationByEntryId(
    entryId: string,
  ): Promise<Organization | null> {
    const params = {
      ['content_type']: 'organization',
      include: 5,
      limit: 1,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntry<types.IOrganizationFields>(entryId, null, params)
      .catch(errorHandler('getOrganizationByEntryId'))

    return result ? mapOrganization(result as types.IOrganization) : null
  }

  async getOrganizationPage(
    slug: string,
    lang: string,
  ): Promise<OrganizationPage> {
    const params = {
      ['content_type']: 'organizationPage',
      include: 5,
      'fields.slug': slug,
      limit: 1,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationPageFields>(lang, params)
      .catch(errorHandler('getOrganizationPage'))

    return (
      (result.items as types.IOrganizationPage[]).map(mapOrganizationPage)[0] ??
      null
    )
  }

  async getOrganizationSubpage(
    organizationSlug: string,
    slug: string,
    lang: string,
  ): Promise<OrganizationSubpage> {
    const params = {
      ['content_type']: 'organizationSubpage',
      include: 5,
      'fields.slug': slug,
      'fields.organizationPage.sys.contentType.sys.id': 'organizationPage',
      'fields.organizationPage.fields.slug': organizationSlug,
      'fields.organizationParentSubpage[exists]': false,
      limit: 1,
    }
    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationSubpageFields>(lang, params)
      .catch(errorHandler('getOrganizationSubpage'))

    return (
      (result.items as types.IOrganizationSubpage[]).map(
        mapOrganizationSubpage,
      )[0] ?? null
    )
  }

  async getOrganizationSubpageById(
    id: string,
    lang: string,
  ): Promise<OrganizationSubpage> {
    const params = {
      ['content_type']: 'organizationSubpage',
      include: 5,
      'sys.id': id,
      limit: 1,
    }
    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationSubpageFields>(lang, params)
      .catch(errorHandler('getOrganizationSubpage'))

    return (
      (result.items as types.IOrganizationSubpage[]).map(
        mapOrganizationSubpage,
      )[0] ?? null
    )
  }

  async getServiceWebPage(slug: string, lang: string) {
    const params = {
      ['content_type']: 'serviceWebPage',
      include: 5,
      'fields.slug': slug,
      limit: 1,
    }
    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IServiceWebPageFields>(lang, params)
      .catch(errorHandler('getServiceWebPage'))

    return (
      (result.items as types.IServiceWebPage[]).map(mapServiceWebPage)[0] ??
      null
    )
  }

  async getAuctions(
    lang: string,
    organization?: string,
    year?: number,
    month?: number,
  ): Promise<Auction[]> {
    // If year and date is not specified, we query for the next month
    const fromDate =
      year !== undefined && month !== undefined
        ? new Date(year, month, 1)
        : new Date()
    fromDate.setDate(fromDate.getDate() - 1)

    const toDate = new Date(fromDate.getTime())
    toDate.setMonth(toDate.getMonth() + 1)

    const params = {
      ['content_type']: 'auction',
      'fields.organization.sys.contentType.sys.id': 'organization',
      'fields.organization.fields.slug': organization ?? '',
      'fields.date[gte]': fromDate.toISOString(),
      'fields.date[lte]': toDate.toISOString(),
      order: 'fields.date',
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IAuctionFields>(lang, params)
      .catch(errorHandler('getAuctions'))

    return (result.items as types.IAuction[]).map(mapAuction)
  }

  async getAuction(id: string, lang: string): Promise<Auction> {
    const params = {
      ['content_type']: 'auction',
      'sys.id': id,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IAuctionFields>(lang, params)
      .catch(errorHandler('getAuction'))

    return (result.items as types.IAuction[]).map(mapAuction)[0]
  }

  async getProjectPage(
    slug: string,
    lang: string,
  ): Promise<ProjectPage | null> {
    const params = {
      ['content_type']: 'projectPage',
      'fields.slug': slug,
      limit: 1,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IProjectPageFields>(lang, params, 5)
      .catch(errorHandler('getProjectPage'))

    return result.items.length
      ? mapProjectPage(result.items[0] as IProjectPage)
      : null
  }

  async getArticle(slug: string, lang: string): Promise<Article | null> {
    const params = {
      ['content_type']: 'article',
      'fields.slug': slug,
      select: ArticleFields,
      include: 5,
      limit: 1,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IArticleFields>(lang, params)
      .catch(errorHandler('getArticle'))

    return (result.items as types.IArticle[]).map(mapArticle)[0] ?? null
  }

  async getErrorPage({
    lang,
    errorCode,
  }: GetErrorPageInput): Promise<ErrorPage> {
    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IErrorPageFields>(lang, {
        ['content_type']: 'errorPage',
        'fields.errorCode': errorCode,
        include: 10,
      })
      .catch(errorHandler('getErrorPage'))

    return (result.items as types.IErrorPage[]).map(mapErrorPage)[0] ?? null
  }

  async getRelatedArticles(slug: string, lang: string): Promise<Article[]> {
    const params = {
      ['content_type']: 'article',
      'fields.slug': slug,
      select: 'fields.relatedArticles',
      include: 1,
    }

    const articleResult = await this.contentfulRepository
      .getLocalizedEntries<types.IArticleFields>(lang, params)
      .catch(errorHandler('getRelatedArticles'))

    const articles = articleResult.items[0]?.fields?.relatedArticles ?? []
    if (articles.length === 0) return []

    const relatedResultParams = {
      ['content_type']: 'article',
      'sys.id[in]': articles.map((a) => a.sys.id).join(','),
      select: ArticleFields,
      include: 5,
    }

    const relatedResult = await this.contentfulRepository
      .getLocalizedEntries<types.IArticleFields>(lang, relatedResultParams)
      .catch(errorHandler('getRelatedArticles'))

    const sortedIds = articles.map((a) => a.sys.id)
    const results = (relatedResult.items as types.IArticle[]).map(mapArticle)
    return sortBy(results, (a) => sortedIds.indexOf(a.id))
  }

  async getSingleNewsItem(lang: string, slug: string): Promise<News | null> {
    const params = {
      ['content_type']: 'news',
      include: 5,
      'fields.slug': slug,
      limit: 1,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.INewsFields>(lang, params)
      .catch(errorHandler('getNews'))

    return (result.items as types.INews[]).map(mapNews)[0] ?? null
  }

  async getNews(input: GetCmsNewsInput): Promise<NewsList> {
    const size = input.size ?? 10
    const page = input.page ?? 1

    const orderPrefix = input.order === 'asc' ? '' : '-'

    const params = {
      ['content_type']: 'news',
      include: 5,
      limit: size,
      skip: (page - 1) * size,
      'fields.organization.sys.contentType.sys.id': 'organization',
      'fields.organization.fields.slug': input.organization,
      order: `${orderPrefix}fields.date,${orderPrefix}fields.initialPublishDate,${orderPrefix}sys.firstPublishedAt`,
      'fields.title[exists]': true,
      'fields.slug[exists]': true,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.INewsFields>(input.lang, params)
      .catch(errorHandler('getNews'))

    return {
      items: ((result.items as types.INews[]) ?? []).map(mapNews),
      total: result.total,
    }
  }

  async getGrant(lang: string, id: string): Promise<Grant | null> {
    const params = {
      ['content_type']: 'grant',
      'fields.grantApplicationId': id,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IGrantFields>(lang, params)
      .catch(errorHandler('getGrant'))

    return (result.items as types.IGrant[]).map(mapGrant)[0] ?? null
  }

  async getSingleEvent(lang: string, slug: string) {
    const params = {
      ['content_type']: 'event',
      include: 5,
      'fields.slug': slug,
      limit: 1,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IEventFields>(lang, params)
      .catch(errorHandler('getSingleEvent'))

    return (result.items as types.IEvent[]).map(mapEvent)[0] ?? null
  }

  async getSingleManual(lang: string, slug: string) {
    const params = {
      ['content_type']: 'manual',
      include: 5,
      'fields.slug': slug,
      limit: 1,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IManualFields>(lang, params)
      .catch(errorHandler('getSingleManual'))

    return (result.items as types.IManual[]).map(mapManual)[0] ?? null
  }

  async getContentSlug({
    id,
  }: GetContentSlugInput): Promise<ContentSlug | null> {
    const result = await this.contentfulRepository
      .getClient()
      .getEntry<{
        slug: Record<string, string>
        title: Record<string, string>
        url: Record<string, string>
        question?: Record<string, string>
        activeTranslations?: { 'is-IS': Record<string, boolean> }
        parent?: { 'is-IS': { fields: { slug: Record<string, string> } } }
      }>(id, {
        locale: '*',
        include: 1,
      })
      .catch(errorHandler('getContentSlug'))

    let slugs: TextFieldLocales = { is: '', en: '' }
    let titles: TextFieldLocales = { is: '', en: '' }
    let urls: TextFieldLocales = { is: '', en: '' }

    const type = result?.sys?.contentType?.sys?.id ?? ''

    if (
      (result?.fields?.title || result?.fields?.question) &&
      (result?.fields?.slug || result?.fields?.url)
    ) {
      ;({ slugs, titles, urls } = Object.keys(localeMap).reduce(
        (obj, k) => {
          obj.slugs[k] = result?.fields?.slug?.[localeMap[k]] ?? ''
          obj.titles[k] =
            (result?.fields?.title ?? result?.fields?.question)?.[
              localeMap[k]
            ] ?? ''

          if (type === 'subArticle') {
            const parentSlug =
              result?.fields?.parent?.['is-IS']?.fields?.slug?.[localeMap[k]] ??
              ''

            const url = result?.fields?.url?.[localeMap[k]] ?? ''

            obj.urls[k] = parentSlug
              ? `${parentSlug}/${url?.split('/')?.pop() ?? ''}`
              : ''
          } else {
            obj.urls[k] = result?.fields?.url?.[localeMap[k]] ?? ''
          }

          return obj
        },
        {
          slugs: {} as typeof localeMap,
          titles: {} as typeof localeMap,
          urls: {} as typeof localeMap,
        },
      ))
    }

    return {
      id: result?.sys?.id,
      slug: slugs,
      title: titles,
      url: urls,
      type,
      activeTranslations: result?.fields?.activeTranslations?.['is-IS'] ?? {
        en: true,
      },
    }
  }

  async getGenericPage({
    lang,
    slug,
  }: GetGenericPageInput): Promise<GenericPage> {
    const params = {
      ['content_type']: 'genericPage',
      'fields.slug': slug,
      include: 10,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IGenericPageFields>(lang, params)
      .catch(errorHandler('getGenericPage'))

    return (result.items as types.IGenericPage[]).map(mapGenericPage)[0] ?? null
  }

  async getGenericOverviewPage({
    lang,
    pageIdentifier,
  }: GetGenericOverviewPageInput): Promise<GenericOverviewPage> {
    const params = {
      ['content_type']: 'genericOverviewPage',
      'fields.pageIdentifier': pageIdentifier,
      include: 10,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IGenericOverviewPageFields>(lang, params)
      .catch(errorHandler('getGenericOverviewPage'))

    return (
      (result.items as types.IGenericOverviewPage[]).map(
        mapGenericOverviewPage,
      )[0] ?? null
    )
  }

  async getNamespace(
    namespace: string,
    lang: string,
  ): Promise<Namespace | null> {
    const params = {
      ['content_type']: 'uiConfiguration',
      'fields.namespace': namespace,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IUiConfigurationFields>(lang, params)
      .catch(errorHandler('getNamespace'))

    return (
      (result.items as types.IUiConfiguration[]).map(mapNamespace)[0] ?? null
    )
  }

  async getMenu(name: string, lang: string): Promise<Menu | null> {
    const params = {
      ['content_type']: 'menu',
      'fields.title': name,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IMenuFields>(lang, params)
      .catch(errorHandler('getMenu'))

    return (result.items as types.IMenu[]).map(mapMenu)[0] ?? null
  }

  async getAnchorPage(slug: string, lang: string): Promise<AnchorPage | null> {
    const params = {
      ['content_type']: 'anchorPage',
      'fields.slug': slug,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IAnchorPageFields>(lang, params)
      .catch(errorHandler('getAnchorPage'))

    return (result.items as types.IAnchorPage[]).map(mapAnchorPage)[0] ?? null
  }

  async getAnchorPages(lang: string): Promise<AnchorPage[]> {
    const params = {
      ['content_type']: 'anchorPage',
      order: 'sys.createdAt',
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IAnchorPageFields>(lang, params)
      .catch(errorHandler('getAnchorPages'))

    return (result.items as types.IAnchorPage[]).map(mapAnchorPage)
  }

  async getLifeEventPage(
    slug: string,
    lang: string,
  ): Promise<LifeEventPage | null> {
    const params = {
      ['content_type']: 'lifeEventPage',
      'fields.slug': slug,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ILifeEventPageFields>(lang, params)
      .catch(errorHandler('getLifeEventPage'))

    return (
      (result.items as types.ILifeEventPage[]).map(mapLifeEventPage)[0] ?? null
    )
  }

  async getLifeEventsForOverview(lang: string): Promise<LifeEventPage[]> {
    const params = {
      ['content_type']: 'lifeEventPage',
      order: '-fields.importance,sys.createdAt',
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ILifeEventPageFields>(lang, params)
      .catch(errorHandler('getLifeEvents'))

    return (result.items as types.ILifeEventPage[]).map(mapLifeEventPage)
  }

  async getLifeEventsInCategory(
    lang: string,
    slug: string,
  ): Promise<LifeEventPage[]> {
    const params = {
      ['content_type']: 'lifeEventPage',
      'fields.category.sys.contentType.sys.id': 'articleCategory',
      'fields.category.fields.slug': slug,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ILifeEventPageFields>(lang, params)
      .catch(errorHandler('getLifeEventsInCategory'))

    return (result.items as types.ILifeEventPage[]).map(mapLifeEventPage)
  }

  async getAlertBanner({
    lang,
    id,
  }: GetAlertBannerInput): Promise<AlertBanner | null> {
    const params = {
      ['content_type']: 'alertBanner',
      'sys.id': id,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IAlertBannerFields>(lang, params)
      .catch(errorHandler('getAlertBanner'))

    return (result.items as types.IAlertBanner[]).map(mapAlertBanner)[0] ?? null
  }

  async getServicePortalAlertBanners({
    lang,
  }: GetServicePortalAlertBannersInput): Promise<AlertBanner[]> {
    const params = {
      ['content_type']: 'alertBanner',
      'fields.servicePortalPaths[exists]': 'true',
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IAlertBannerFields>(lang, params)
      .catch(errorHandler('getAlertBanner'))

    const items = (result.items as types.IAlertBanner[]).map(mapAlertBanner)

    // Make sure that the global alert banner is first in the list
    items.sort((a, b) => {
      if (a.servicePortalPaths?.includes('*')) return -1
      if (b.servicePortalPaths?.includes('*')) return 1
      return 0
    })

    return items
  }

  async getUrl(slug: string, lang: string): Promise<Url | null> {
    const params = {
      ['content_type']: 'url',
      'fields.urlsList[all]': slug,
      include: 1,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IUrlFields>(lang, params)
      .catch(errorHandler('getUrl'))
    return (result.items as types.IUrl[]).map(mapUrl)[0] ?? null
  }

  async getFrontpage({
    lang,
    pageIdentifier,
  }: GetFrontpageInput): Promise<Frontpage> {
    const params = {
      ['content_type']: 'frontpage',
      'fields.pageIdentifier': pageIdentifier,
      include: 5,
      order: '-sys.createdAt',
      limit: 1,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IFrontpageFields>(lang, params)
      .catch(errorHandler('getFrontpage'))

    return (result.items as types.IFrontpage[]).map(mapFrontpage)[0]
  }

  async getSubpageHeader({
    lang,
    id,
  }: GetSubpageHeaderInput): Promise<SubpageHeader> {
    const params = {
      ['content_type']: 'subpageHeader',
      'fields.subpageId': id,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ISubpageHeaderFields>(lang, params)
      .catch(errorHandler('getSubpageHeader'))

    return (result.items as types.ISubpageHeader[]).map(mapSubpageHeader)[0]
  }

  async getSupportQNAs({ lang }: GetSupportQNAsInput): Promise<SupportQNA[]> {
    const params = {
      ['content_type']: 'supportQNA',
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ISupportQnaFields>(lang, params)
      .catch(errorHandler('getSupportQNAs'))

    return (result.items as types.ISupportQna[]).map(mapSupportQNA)
  }

  async getSupportQNAsInCategory({
    lang,
    slug,
  }: GetSupportQNAsInCategoryInput): Promise<SupportQNA[]> {
    const params = {
      ['content_type']: 'supportQNA',
      'fields.category.sys.contentType.sys.id': 'supportCategory',
      'fields.category.fields.slug': slug,
      limit: 1000,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ISupportQnaFields>(lang, params)
      .catch(errorHandler('getSupportQNAsInCategory'))

    return (result.items as types.ISupportQna[])
      .map(mapSupportQNA)
      .filter((qna) => qna?.title && qna?.answer && qna?.slug)
  }

  async getSupportCategory({
    lang,
    slug,
  }: GetSupportCategoryInput): Promise<SupportCategory> {
    const params = {
      ['content_type']: 'supportCategory',
      'fields.slug': slug,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ISupportCategoryFields>(lang, params)
      .catch(errorHandler('getSupportCategory'))

    return (result.items as types.ISupportCategory[]).map(mapSupportCategory)[0]
  }

  async getSupportCategories({
    lang,
  }: GetSupportCategoriesInput): Promise<SupportCategory[]> {
    const params = {
      ['content_type']: 'supportCategory',
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ISupportCategoryFields>(lang, params)
      .catch(errorHandler('getSupportCategories'))

    return (result.items as types.ISupportCategory[])
      .map(mapSupportCategory)
      .filter((category) => category?.title && category?.slug)
  }

  async getSupportCategoriesInOrganization({
    lang,
    slug,
  }: GetSupportCategoriesInOrganizationInput): Promise<SupportCategory[]> {
    const params = {
      ['content_type']: 'supportCategory',
      'fields.organization.sys.contentType.sys.id': 'organization',
      'fields.organization.fields.slug': slug,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ISupportCategoryFields>(lang, params)
      .catch(errorHandler('getSupportCategoriesInOrganization'))

    return (result.items as types.ISupportCategory[])
      .map(mapSupportCategory)
      .filter((category) => category?.title && category?.slug)
  }

  async getOpenDataPage({ lang }: GetOpenDataPageInput): Promise<OpenDataPage> {
    const params = {
      ['content_type']: 'openDataPage',
      include: 10,
      order: '-sys.createdAt',
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOpenDataPageFields>(lang, params)
      .catch(errorHandler('getOpenDataPage'))

    return (
      (result.items as types.IOpenDataPage[]).map(mapOpenDataPage)[0] ?? null
    )
  }

  async getOpenDataSubpage({
    lang,
  }: GetOpenDataSubpageInput): Promise<OpenDataSubpage> {
    const params = {
      ['content_type']: 'openDataSubpage',
      include: 10,
      order: '-sys.createdAt',
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOpenDataSubpageFields>(lang, params)
      .catch(errorHandler('getOpenDataSubpage'))

    return (
      (result.items as types.IOpenDataSubpage[]).map(mapOpenDataSubpage)[0] ??
      null
    )
  }

  async getEmailSignup({
    id,
    lang = 'is',
  }: GetEmailSignupInput): Promise<EmailSignup | null> {
    const params = {
      ['content_type']: 'emailSignup',
      'sys.id': id,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IEmailSignupFields>(lang, params)
      .catch(errorHandler('getEmailSignup'))

    return (result.items as types.IEmailSignup[]).map(mapEmailSignup)[0] ?? null
  }

  async getForm(input: GetFormInput): Promise<Form | null> {
    const params = {
      ['content_type']: 'form',
      'sys.id': input.id,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IFormFields>(input.lang, params)
      .catch(errorHandler('getForm'))

    return (result.items as types.IForm[]).map(mapForm)[0] ?? null
  }

  async getTabSection({
    id,
    lang = 'is',
  }: GetTabSectionInput): Promise<TabSection | null> {
    const params = {
      ['content_type']: 'tabSection',
      'sys.id': id,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ITabSectionFields>(lang, params, 5)
      .catch(errorHandler('getTabSection'))

    return (result.items as types.ITabSection[]).map(mapTabSection)[0] ?? null
  }

  async getGenericTagBySlug({
    slug,
    lang = 'is',
  }: GetGenericTagBySlugInput): Promise<GenericTag | null> {
    const params = {
      ['content_type']: 'genericTag',
      'fields.slug': slug,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IGenericTagFields>(lang, params)
      .catch(errorHandler('getGenericTag'))

    return (result.items as types.IGenericTag[]).map(mapGenericTag)[0] ?? null
  }

  async getGenericTagsInTagGroups({
    lang = 'is',
    tagGroupSlugs,
  }: GetGenericTagsInTagGroupsInput): Promise<Array<GenericTag> | null> {
    let params
    if (tagGroupSlugs) {
      params = {
        ['content_type']: 'genericTag',
        'fields.genericTagGroup.fields.slug[in]': tagGroupSlugs.join(','),
        'fields.genericTagGroup.sys.contentType.sys.id': 'genericTagGroup',
      }
    } else {
      params = {
        ['content_type']: 'genericTag',
        'fields.genericTagGroup.sys.contentType.sys.id': 'genericTagGroup',
      }
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IGenericTagFields>(lang, params)
      .catch(errorHandler('getGenericTag'))

    return (result.items as types.IGenericTag[]).map(mapGenericTag)
  }

  async getBloodDonationRestrictions(
    input: GetBloodDonationRestrictionsInput,
  ): Promise<BloodDonationRestrictionList> {
    const itemsPerPage = 10
    const currentPage = input.page ?? 1

    const response = await this.contentfulRepository.getLocalizedEntries(
      input.lang,
      {
        content_type: 'bloodDonationRestriction',
        limit: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
        'fields.title[exists]': true,
      },
    )

    return {
      total: response.total,
      items: (response.items as types.IBloodDonationRestriction[]).map(
        mapBloodDonationRestrictionListItem,
      ),
      input,
    }
  }

  async getBloodDonationRestrictionDetails(
    input: GetBloodDonationRestrictionDetailsInput,
  ) {
    const response = await this.contentfulRepository.getLocalizedEntries(
      input.lang,
      {
        content_type: 'bloodDonationRestriction',
        'sys.id': input.id,
        limit: 1,
      },
    )

    if (response.items.length === 0) {
      return null
    }

    return mapBloodDonationRestrictionDetails(
      response.items[0] as types.IBloodDonationRestriction,
    )
  }

  async getOrganizationParentSubpage(input: GetOrganizationParentSubpageInput) {
    const params = {
      content_type: 'organizationParentSubpage',
      'fields.slug': input.slug,
      'fields.organizationPage.sys.contentType.sys.id': 'organizationPage',
      'fields.organizationPage.fields.slug': input.organizationPageSlug,
      limit: 1,
    }

    const response = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationParentSubpageFields>(
        input.lang,
        params,
      )
      .catch(errorHandler('getOrganizationParentSubpage'))

    return (
      (response.items as types.IOrganizationParentSubpage[]).map(
        mapOrganizationParentSubpage,
      )[0] ?? null
    )
  }

  async getOrganizationPageStandaloneSitemapLevel1(
    input: GetOrganizationPageStandaloneSitemapLevel1Input,
  ): Promise<OrganizationPageStandaloneSitemap | null> {
    const params = {
      content_type: 'organizationPage',
      'fields.slug': input.organizationPageSlug,
      select: 'fields.sitemap',
      limit: 1,
    }

    const response = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationPageFields>(input.lang, params)
      .catch(errorHandler('getOrganizationPageStandaloneSitemapLevel1'))

    const tree = response.items?.[0]?.fields.sitemap?.fields.tree as SitemapTree

    if (!tree) {
      return null
    }

    const category = tree.childNodes.find(
      (node) =>
        node.type === SitemapTreeNodeType.CATEGORY &&
        node.slug === input.categorySlug,
    )

    if (!category) {
      return null
    }

    const entryNodes = new Map<string, { label: string; href: string }[]>()

    const result = {
      childLinks: category.childNodes.map((node) => {
        if (node.type === SitemapTreeNodeType.CATEGORY) {
          return {
            label: node.label,
            href: `/${getOrganizationPageUrlPrefix(input.lang)}/${
              input.organizationPageSlug
            }/${input.categorySlug}/${node.slug}`,
            description: node.description,
          }
        }
        if (node.type === SitemapTreeNodeType.URL) {
          return {
            label: node.label,
            href: node.url,
          }
        }

        // We need to fetch the label and href for all entry nodes, so we store them in a map
        const entryNode = {
          label: '',
          href: '',
          entryId: node.entryId,
        }
        const nodeList = entryNodes.get(node.entryId) ?? []
        nodeList.push(entryNode)
        entryNodes.set(node.entryId, nodeList)
        return entryNode
      }),
    }

    const parentSubpageResponse =
      await this.contentfulRepository.getLocalizedEntries<types.IOrganizationParentSubpageFields>(
        input.lang,
        {
          content_type: 'organizationParentSubpage',
          'sys.id[in]': Array.from(entryNodes.keys()).join(','),
          limit: 1000,
        },
        1,
      )

    for (const parentSubpage of parentSubpageResponse.items) {
      const nodeList = entryNodes.get(parentSubpage.sys.id)
      if (
        !nodeList ||
        !parentSubpage.fields.slug ||
        !parentSubpage.fields.title
      ) {
        continue
      }
      for (const node of nodeList) {
        node.label = parentSubpage.fields.title
        node.href = `/${getOrganizationPageUrlPrefix(input.lang)}/${
          input.organizationPageSlug
        }/${parentSubpage.fields.slug}`
      }
    }

    // Prune empty values
    result.childLinks = result.childLinks.filter(
      (link) => link.label && link.href,
    )

    return result
  }

  async getOrganizationPageStandaloneSitemapLevel2(
    input: GetOrganizationPageStandaloneSitemapLevel2Input,
  ): Promise<OrganizationPageStandaloneSitemapLevel2 | null> {
    const params = {
      content_type: 'organizationPage',
      'fields.slug': input.organizationPageSlug,
      select: 'fields.sitemap',
      limit: 1,
    }

    const response = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationPageFields>(input.lang, params)
      .catch(errorHandler('getOrganizationPageStandaloneSitemapLevel2'))

    const tree = response.items?.[0]?.fields.sitemap?.fields.tree as SitemapTree

    if (!tree) {
      return null
    }

    const category = tree.childNodes.find(
      (node) =>
        node.type === SitemapTreeNodeType.CATEGORY &&
        node.slug === input.categorySlug,
    )

    if (!category) {
      return null
    }

    const subcategory = category.childNodes.find(
      (node) =>
        node.type === SitemapTreeNodeType.CATEGORY &&
        node.slug === input.subcategorySlug,
    )

    if (!subcategory || subcategory.type !== SitemapTreeNodeType.CATEGORY) {
      return null
    }

    const entryNodes = new Map<
      string,
      { label: string; href: string; entryId: string }[]
    >()

    const result: OrganizationPageStandaloneSitemapLevel2 = {
      label: subcategory.label,
      childCategories: subcategory.childNodes.map((node) => {
        if (node.type === SitemapTreeNodeType.CATEGORY) {
          return {
            label: node.label,
            childLinks: node.childNodes.map((childNode) => {
              if (childNode.type === SitemapTreeNodeType.CATEGORY) {
                // Category at depth 3 should be empty so it gets pruned at a later stage
                return {
                  label: '',
                  href: '',
                  childLinks: [],
                }
              }
              if (childNode.type === SitemapTreeNodeType.URL) {
                return {
                  label: childNode.label,
                  href: childNode.url,
                  childLinks: [],
                }
              }

              const entryNode = {
                label: '',
                href: '',
                entryId: childNode.entryId,
                childLinks: [],
              }

              const nodeList = entryNodes.get(childNode.entryId) ?? []
              nodeList.push(entryNode)
              entryNodes.set(childNode.entryId, nodeList)

              return entryNode
            }),
          }
        }

        if (node.type === SitemapTreeNodeType.URL) {
          return {
            label: node.label,
            href: node.url,
            childLinks: [],
          }
        }

        const entryNode = {
          label: '',
          href: '',
          entryId: node.entryId,
          childLinks: [],
        }

        const nodeList = entryNodes.get(node.entryId) ?? []
        nodeList.push(entryNode)
        entryNodes.set(node.entryId, nodeList)

        return entryNode
      }),
    }

    const parentSubpageResponse =
      await this.contentfulRepository.getLocalizedEntries<types.IOrganizationParentSubpageFields>(
        input.lang,
        {
          content_type: 'organizationParentSubpage',
          'sys.id[in]': Array.from(entryNodes.keys()).join(','),
          limit: 1000,
        },
        1,
      )

    for (const parentSubpage of parentSubpageResponse.items) {
      const nodeList = entryNodes.get(parentSubpage.sys.id)
      if (
        !nodeList ||
        !parentSubpage.fields.slug ||
        !parentSubpage.fields.title
      ) {
        continue
      }

      for (const node of nodeList) {
        node.label = parentSubpage.fields.title
        node.href = `/${getOrganizationPageUrlPrefix(input.lang)}/${
          input.organizationPageSlug
        }/${parentSubpage.fields.slug}`
      }
    }

    // Prune empty values
    result.childCategories = result.childCategories.filter((childCategory) => {
      childCategory.childLinks = childCategory.childLinks.filter(
        (childLink) => {
          return childLink.href && childLink.label
        },
      )
      return childCategory.label && childCategory.childLinks.length > 0
    })

    return result
  }

  async getOrganizationNavigationPages(
    entryIdsObject: {
      parentSubpageEntryIds: string[]
      organizationSubpageEntryIds: string[]
      entryIds: string[]
    },
    lang: string,
  ) {
    if (
      entryIdsObject.parentSubpageEntryIds.length === 0 &&
      entryIdsObject.organizationSubpageEntryIds.length === 0 &&
      entryIdsObject.entryIds.length === 0
    )
      return []

    const fieldSelect =
      'fields.title,fields.shortTitle,fields.shortDescription,fields.slug,sys'

    const [parentSubpageResponse, organizationSubpageResponse, entryResponse] =
      await Promise.allSettled([
        this.contentfulRepository.getLocalizedEntries(
          lang,
          {
            'sys.id[in]': entryIdsObject.parentSubpageEntryIds.join(','),
            content_type: 'organizationParentSubpage',
            limit: 1000,
            select: fieldSelect,
          },
          1,
        ),
        this.contentfulRepository.getLocalizedEntries(
          lang,
          {
            'sys.id[in]': entryIdsObject.organizationSubpageEntryIds.join(','),
            content_type: 'organizationSubpage',
            limit: 1000,
            select: fieldSelect,
          },
          1,
        ),
        this.contentfulRepository.getLocalizedEntries(
          lang,
          {
            'sys.id[in]': entryIdsObject.entryIds.join(','),
            limit: 1000,
          },
          1,
        ),
      ])

    const items = []

    if (parentSubpageResponse.status === 'fulfilled')
      items.push(...parentSubpageResponse.value.items)
    else
      errorHandler('getOrganizationNavigationPages.parentSubpageResponse')(
        parentSubpageResponse.reason,
      )

    if (organizationSubpageResponse.status === 'fulfilled')
      items.push(...organizationSubpageResponse.value.items)
    else
      errorHandler(
        'getOrganizationNavigationPages.organizationSubpageResponse',
      )(organizationSubpageResponse.reason)

    if (entryResponse.status === 'fulfilled')
      for (const item of entryResponse.value.items) {
        const isValidPageType =
          item.sys.contentType.sys.id === 'organizationParentSubpage' ||
          item.sys.contentType.sys.id === 'organizationSubpage'
        if (!isValidPageType) continue
        items.push(item)
      }
    else
      errorHandler('getOrganizationNavigationPages.entryResponse')(
        entryResponse.reason,
      )

    return items
  }

  async getCourseById(
    input: GetCourseByIdInput,
  ): Promise<CourseDetails | null> {
    const params = {
      content_type: 'course',
      limit: 1,
      include: 4,
    }

    const [isResponse, enResponse] = await Promise.all([
      this.contentfulRepository.getLocalizedEntry<types.ICourseFields>(
        input.id,
        'is',
        { ...params, include: input.lang === 'is' ? 4 : 0 },
      ),
      this.contentfulRepository.getLocalizedEntry<types.ICourseFields>(
        input.id,
        'en',
        { ...params, include: input.lang === 'en' ? 4 : 0 },
      ),
    ])

    const response = input.lang === 'is' ? isResponse : enResponse

    if (response?.sys?.contentType?.sys?.id !== 'course') {
      return null
    }

    const mappedCourse = mapCourse(response as types.ICourse)

    // Filter out instances that are in the past
    const today = new Date()
    mappedCourse.instances = mappedCourse.instances.filter(
      (instance) =>
        Boolean(instance.startDate) && new Date(instance.startDate) > today,
    )

    // Sort instances in ascending start date order
    mappedCourse.instances.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    )

    return {
      course: mappedCourse,
      activeLocales: {
        is: Boolean(isResponse?.fields?.title),
        en: Boolean(enResponse?.fields?.title),
      },
    }
  }

  async getCourseListPageById(input: GetCourseListPageByIdInput) {
    const params = {
      content_type: 'courseListPage',
      limit: 1,
      include: 0,
    }

    const response =
      await this.contentfulRepository.getLocalizedEntry<types.ICourseListPageFields>(
        input.id,
        input.lang,
        params,
      )

    if (response?.sys?.contentType?.sys?.id !== 'courseListPage') {
      return null
    }

    return mapCourseListPage(response as ICourseListPage)
  }

  async getCourseSelectOptions(input: GetCourseSelectOptionsInput) {
    const params = {
      content_type: 'course',
      limit: 1000,
      include: 0,
      select: 'fields.title,sys',
      'fields.courseListPage.sys.contentType.sys.id': 'courseListPage',
      'fields.courseListPage.fields.organization.sys.id': input.organizationId,
    }

    const response =
      await this.contentfulRepository.getLocalizedEntries<types.ICourseFields>(
        input.lang,
        params,
        0,
      )

    const items = response.items.map((item) => ({
      id: item.sys.id,
      title: item.fields.title,
    }))

    items.sort(sortAlpha('title'))

    return { items, total: response.total, input }
  }

  private findBestWebChatMatch(
    response: EntryCollection<types.IWebChatFields>,
  ): types.IWebChat | null {
    let bestMatch: types.IWebChat | null = null

    for (const item of response.items) {
      const webChatEntry = item as types.IWebChat
      for (const location of webChatEntry.fields.displayLocations ?? []) {
        if (location?.sys?.contentType?.sys?.id !== 'organization')
          return webChatEntry
        bestMatch = webChatEntry
      }
    }

    return bestMatch
  }

  async getWebChat(input: GetWebChatInput): Promise<WebChat | null> {
    const params = {
      content_type: 'webChat',
      'fields.displayLocations.sys.id[in]': input.displayLocationIds.join(','),
      limit: 100,
    }

    const response = await this.contentfulRepository
      .getLocalizedEntries<types.IWebChatFields>(input.lang, params, 1)
      .catch(errorHandler('getWebChat'))

    const bestMatch = this.findBestWebChatMatch(response)
    if (!bestMatch) return null

    return mapWebChat(bestMatch, input.lang)
  }
}
