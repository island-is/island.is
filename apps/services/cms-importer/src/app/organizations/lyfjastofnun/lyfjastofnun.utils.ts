import { stripHtml } from '../../platform/localization'
import { WpPost } from './lyfjastofnun.types'

export const extractIntro = (post: WpPost): string => {
  const fromExcerpt = stripHtml(post.excerpt?.rendered ?? '')
  if (fromExcerpt) return fromExcerpt
  return stripHtml(post.content?.rendered ?? '')
    .slice(0, 300)
    .trimEnd()
}
