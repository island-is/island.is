import { Injectable } from '@nestjs/common'
import {
  ElasticService,
  SearchIndexes,
  sortDirection,
} from '@island.is/api/content-search'
import { ArticleCategory } from './models/articleCategory.model'
import { Article } from './models/article.model'
import { News } from './models/news.model'

@Injectable()
export class CmsElasticsearchService {
  constructor(private elasticService: ElasticService) { }

  async getArticleCategories(
    index: SearchIndexes,
    { size }: { size?: number },
  ): Promise<ArticleCategory[]> {
    const query = {
      types: ['webArticleCategory'],
      sort: { 'title.sort': 'asc' as sortDirection },
      size,
    }
    const categoryResponse = await this.elasticService.getDocumentsByMetaData(
      index,
      query,
    )

    return categoryResponse.hits.hits.map<ArticleCategory>((response) =>
      JSON.parse(response._source.response),
    )
  }

  async getArticles(
    index: SearchIndexes,
    { category, size }: { category: string; size?: number },
  ): Promise<Article[]> {
    const query = {
      types: ['webArticle'],
      tags: [{ type: 'category', key: category }],
      sort: { 'title.sort': 'asc' as sortDirection },
      size,
    }

    const articlesResponse = await this.elasticService.getDocumentsByMetaData(
      index,
      query,
    )
    return articlesResponse.hits.hits.map<Article>((response) =>
      JSON.parse(response._source.response),
    )
  }

  async getNews(
    index: SearchIndexes,
    { size }: { size?: number },
  ): Promise<News[]> {
    const query = {
      types: ['webNews'],
      sort: { 'dateCreated': 'asc' as sortDirection },
      size,
    }

    const articlesResponse = await this.elasticService.getDocumentsByMetaData(
      index,
      query,
    )
    return articlesResponse.hits.hits.map<News>((response) =>
      JSON.parse(response._source.response),
    )
  }

  async getSingleDocumentTypeBySlug<RequestedType>(
    index: SearchIndexes,
    { type, slug }: { type: string; slug: string },
  ): Promise<RequestedType | null> {
    // return a single news item by slug
    const query = { types: [type], tags: [{ type: 'slug', key: slug }] }
    const newsResponse = await this.elasticService.getDocumentsByMetaData(
      index,
      query,
    )
    const response = newsResponse.hits.hits?.[0]?._source?.response
    if (response) {
      return JSON.parse(response)
    } else {
      return null
    }
  }
}
