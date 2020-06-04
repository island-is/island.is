import { RawArticle } from './types'

export const processArticleResponse = (rawArticleResponse: RawArticle) => {
  const article = rawArticleResponse.items[0]

  const { id, title, description, ctaLabel, ctaUrl, content } = article.fields

  return {
    id,
    title,
    cta:
      ctaLabel && ctaUrl
        ? {
            label: ctaLabel,
            url: ctaUrl,
          }
        : null,
    description: JSON.stringify(description) || '',
    content: JSON.stringify(content) || '',
  }
}
