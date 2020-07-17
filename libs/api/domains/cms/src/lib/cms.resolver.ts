import { Args, Query, Resolver } from '@nestjs/graphql'
import { Article } from './models/article.model'
import { GetArticleInput } from './dto/getArticle.input'
import { News } from './models/news.model'
import { GetNewsInput } from './dto/getNews.input'
import { GetNewsListInput } from './dto/getNewsList.input'
import { PaginatedNews } from './models/paginatedNews.model'
import { Namespace } from './models/namespace.model'
import { Page } from './models/page.model'
import { GetNamespaceInput } from './dto/getNamespace.input'
import { GetPageInput } from './dto/getPage.input'
import {
  getArticle,
  getNews,
  getNewsList,
  getNamespace,
  getPage,
} from './services'

@Resolver()
export class CmsResolver {
  @Query((returns) => Article, { nullable: true })
  getArticle(@Args('input') input: GetArticleInput): Promise<Article | null> {
    return getArticle(input?.slug ?? '', input?.lang ?? 'is-IS')
  }

  @Query((returns) => News, { nullable: true })
  getNews(@Args('input') input: GetNewsInput): Promise<News | null> {
    return getNews(input.lang ?? 'is-IS', input.slug)
  }

  @Query((returns) => PaginatedNews)
  getNewsList(@Args('input') input: GetNewsListInput): Promise<PaginatedNews> {
    return getNewsList(input)
  }

  @Query((returns) => Namespace, { nullable: true })
  getNamespace(@Args('input') input: GetNamespaceInput): Promise<Namespace | null> {
    return getNamespace(input?.namespace ?? '', input?.lang ?? 'is-IS')
  }

  @Query((returns) => Page, { nullable: true })
  getPage(@Args('input') input: GetPageInput): Promise<Page | null> {
    return getPage(input)
  }
}
