import { stripHtml } from '../cms/mapper'
import { WpPost } from './wordpress.types'

export const extractFirstImageUrl = (html: string): string | null => {
  const match = /<img[^>]+src=["']([^"']+)["']/i.exec(html)
  return match?.[1] ?? null
}

export const extractIntro = (post: WpPost): string => {
  const fromExcerpt = stripHtml(post.excerpt?.rendered ?? '')
  if (fromExcerpt) return fromExcerpt
  return stripHtml(post.content?.rendered ?? '')
    .slice(0, 300)
    .trimEnd()
}
