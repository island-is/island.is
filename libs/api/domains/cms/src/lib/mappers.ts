import ArticleModel from './model/article.model'

const mapArticle = (entry: Entry<Article>): ArticleModel => {
  return {
    id: entry.sys.id
    contentStatus: entry.field.contentStatus,
    title: entry.field.title,
    slug: entry.field.slug,
    content: entry.field.content,
    category: mapArticleCategory(entry.field.category),
    group: mapArticleGroup(entry.field.group),
    organization: entry.field.organization.map(mapOrganization),
  }
}
