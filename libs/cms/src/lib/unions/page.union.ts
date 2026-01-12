import { createUnionType } from '@nestjs/graphql'
import { Article, mapArticle } from '../models/article.model'
import { mapSubArticle, SubArticle } from '../models/subArticle.model'
import { AnchorPage, mapAnchorPage } from '../models/anchorPage.model'
import {
  mapOrganizationPage,
  OrganizationPage,
} from '../models/organizationPage.model'
import {
  IArticle,
  IArticleCategory,
  ILifeEventPage,
  IAnchorPage,
  INews,
  IOrganizationPage,
  IOrganizationSubpage,
  ISubArticle,
  IProjectPage,
} from '../generated/contentfulTypes'
import { ApolloError } from 'apollo-server-express'
import { mapNews, News } from '../models/news.model'
import {
  ArticleCategory,
  mapArticleCategory,
} from '../models/articleCategory.model'
import {
  mapOrganizationSubpage,
  OrganizationSubpage,
} from '../models/organizationSubpage.model'
import { mapProjectPage, ProjectPage } from '../models/projectPage.model'
import { LifeEventPage, mapLifeEventPage } from '../models/lifeEventPage.model'

export type PageTypes =
  | IArticle
  | ISubArticle
  | ILifeEventPage
  | IAnchorPage
  | INews
  | IArticleCategory
  | IOrganizationPage
  | IOrganizationSubpage
  | IProjectPage

export const PageUnion = createUnionType({
  name: 'Page',
  types: () => [
    Article,
    SubArticle,
    AnchorPage,
    LifeEventPage,
    News,
    ArticleCategory,
    OrganizationPage,
    OrganizationSubpage,
    ProjectPage,
  ],
  resolveType: (document) => document.typename, // typename is appended to request on indexing
})

export const mapPageUnion = (page: PageTypes): typeof PageUnion => {
  const contentType = page.sys.contentType?.sys?.id
  switch (contentType) {
    case 'article': {
      return mapArticle(page as IArticle)
    }
    case 'subArticle': {
      return mapSubArticle(page as ISubArticle)
    }
    case 'lifeEventPage': {
      return mapLifeEventPage(page as ILifeEventPage)
    }
    case 'anchorPage': {
      return mapAnchorPage(page as IAnchorPage)
    }
    case 'news': {
      return mapNews(page as INews)
    }
    case 'articleCategory': {
      return mapArticleCategory(page as IArticleCategory)
    }
    case 'organizationPage': {
      return mapOrganizationPage(page as IOrganizationPage)
    }
    case 'organizationSubpage': {
      return mapOrganizationSubpage(page as IOrganizationSubpage)
    }
    case 'projectPage': {
      return mapProjectPage(page as IProjectPage)
    }
    default: {
      throw new ApolloError(`Can not map to page union: ${contentType}`)
    }
  }
}
