import { Injectable } from '@nestjs/common'
import { ElasticService, SearchIndexes } from '@island.is/api/content-search'
import { ArticleCategory } from './models/articleCategory.model'
import { Article } from './models/article.model'
import { GetArticleCategoriesInput, GetArticlesInput } from '@island.is/api/schema'

@Injectable()
export class CmsService {
  constructor(private elasticService: ElasticService) {}

  async getArticleCategories(
    index: SearchIndexes, {size = 100}: {size?: number}
  ): Promise<ArticleCategory[]> {
    const query = {size, types: ['webArticleCategory']}
    const categoryResponse = await this.elasticService.getDocumentsByTypes(
      index,
      query,
    )

    return categoryResponse.hits.hits.map<ArticleCategory>((response) =>
      JSON.parse(response._source.response),
    )
  }

  async getArticles(
    index: SearchIndexes, {category = '', size = 100}: {category: string, size?: number}
  ): Promise<Article[]> {
    let query = {
      tag: { type: 'category', key: category },
      size,
    }
    
    const articlesResponse = await this.elasticService.getDocumentsByTag(
      index,
      query
    )
    return articlesResponse.hits.hits.map<Article>((response) =>
      JSON.parse(response._source.response),
    )
  }

}
