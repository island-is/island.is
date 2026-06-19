import { Injectable } from '@nestjs/common'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { logger } from '@island.is/logging'
import { WpPost } from './wordpress.types'
import { IMPORT_MONTHS_BACK, WP_BASE_URL } from './wordpress.constants'

@Injectable()
export class LyfjastofnunWordpressRepository {
  private readonly fetch = createEnhancedFetch({
    name: 'LyfjastofnunWordpressClient',
  })

  async getPosts(): Promise<WpPost[]> {
    const after = new Date()
    after.setMonth(after.getMonth() - IMPORT_MONTHS_BACK)

    const MAX_PAGES = 10
    const posts: WpPost[] = []

    for (let page = 1; page <= MAX_PAGES; page++) {
      const url = `${WP_BASE_URL}/frettir?per_page=100&page=${page}&after=${after.toISOString()}&_embed=1`
      logger.info('Fetching WordPress posts', { page, url })

      let batch: WpPost[]
      try {
        const response = await this.fetch(url)
        if (!response.ok) {
          logger.warn('WordPress API returned non-OK response', {
            status: response.status,
            page,
          })
          break
        }
        batch = (await response.json()) as WpPost[]
      } catch (error) {
        logger.error('Failed to fetch WordPress posts', { error, page })
        break
      }

      if (!Array.isArray(batch) || batch.length === 0) break

      posts.push(...batch)

      if (batch.length < 100) break
    }

    logger.info('Fetched WordPress posts', { total: posts.length })
    return posts
  }

  async scrapePostSummary(link: string): Promise<string | null> {
    try {
      const response = await this.fetch(link)
      if (!response.ok) return null
      const html = await response.text()
      const match =
        /<div[^>]+class="[^"]*article__summary[^"]*"[^>]*>([\s\S]*?)<\/div>/i.exec(
          html,
        )
      if (!match) return null
      const text = match[1]
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      return text || null
    } catch {
      return null
    }
  }
}
