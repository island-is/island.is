import { Injectable } from '@nestjs/common'
import {
  ElasticService,
  SearchIndexes,
  sortDirection,
} from '@island.is/api/content-search'
import { ArticleCategory } from './models/articleCategory.model'
import { Article } from './models/article.model'

@Injectable()
export class CmsService {
  constructor(private elasticService: ElasticService) {}

  async getArticleCategories(
    index: SearchIndexes,
    { size = 100 }: { size?: number },
  ): Promise<ArticleCategory[]> {
    let query = {
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
    { category = '', size = 100 }: { category: string; size?: number },
  ): Promise<Article[]> {
    let query = {
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

  async getNews(index: SearchIndexes, { slug }: { slug?: string }) {
    // return a single news item by slug
    if (slug) {
      let query = { types: ['webNews'], tags: [{ type: 'slug', key: slug }] }
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
}
