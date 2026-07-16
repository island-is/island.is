import { Injectable } from '@nestjs/common'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { logger } from '@island.is/logging'
import {
  LEIDBEININGAR_URL,
  LEIDBEININGAR_URL_EN,
  LISTAR_URL,
  LISTAR_URL_EN,
  WP_BASE_URL,
  IMPORT_MONTHS_BACK,
} from './lyfjastofnun.constants'
import { LyfjastofnunScrapedItem, WpPost } from './lyfjastofnun.types'

type EnhancedFetch = ReturnType<typeof createEnhancedFetch>

const stripWhitespace = (value: string): string =>
  value.replace(/\s+/g, ' ').trim()

const normalizeFileName = (url: string): string =>
  (url.split('/').pop() ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')

const matchKeyFor = (item: LyfjastofnunScrapedItem): string | null => {
  if (item.externalUrl) return `url:${item.externalUrl.toLowerCase()}`
  if (item.fileUrl) return `file:${normalizeFileName(item.fileUrl)}`
  return null
}

// One repository for the whole lyfjastofnun.is site — three fetch methods,
// two different mechanisms (HTML scrape for guidelines/lists, WordPress REST
// API for news), all reading from the same host.
@Injectable()
export class LyfjastofnunRepository {
  private readonly instructionsFetch = createEnhancedFetch({
    name: 'LyfjastofnunInstructionsClient',
  })
  private readonly listsFetch = createEnhancedFetch({
    name: 'LyfjastofnunListsClient',
  })
  private readonly wordpressFetch = createEnhancedFetch({
    name: 'LyfjastofnunWordpressClient',
  })

  async getInstructions(): Promise<LyfjastofnunScrapedItem[]> {
    return this.scrapeRelatedFilesPage(
      this.instructionsFetch,
      LEIDBEININGAR_URL,
      LEIDBEININGAR_URL_EN,
      'Lyfjastofnun guidelines page',
    )
  }

  async getLists(): Promise<LyfjastofnunScrapedItem[]> {
    return this.scrapeRelatedFilesPage(
      this.listsFetch,
      LISTAR_URL,
      LISTAR_URL_EN,
      'Lyfjastofnun lists page',
    )
  }

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
        const response = await this.wordpressFetch(url)
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
      const response = await this.wordpressFetch(link)
      if (!response.ok) return null
      const html = await response.text()
      const match =
        /<div[^>]+class="[^"]*article__summary[^"]*"[^>]*>([\s\S]*?)<\/div>/i.exec(
          html,
        )
      if (!match) return null
      const text = match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      return text || null
    } catch {
      return null
    }
  }

  private async scrapeRelatedFilesPage(
    fetch: EnhancedFetch,
    isUrl: string,
    enUrl: string,
    pageLogLabel: string,
  ): Promise<LyfjastofnunScrapedItem[]> {
    const [isHtml, enHtml] = await Promise.all([
      this.fetchPage(fetch, isUrl, pageLogLabel),
      this.fetchPage(fetch, enUrl, pageLogLabel),
    ])
    if (!isHtml) return []

    const isItems = this.parsePage(isHtml)
    const enItems = enHtml ? this.parsePage(enHtml) : []

    const enByKey = new Map<string, LyfjastofnunScrapedItem>()
    for (const item of enItems) {
      const key = matchKeyFor(item)
      if (key) enByKey.set(key, item)
    }

    const items: LyfjastofnunScrapedItem[] = isItems.map((item) => {
      const key = matchKeyFor(item)
      const titleEn = key ? enByKey.get(key)?.title : undefined
      return { ...item, titleEn }
    })

    const matched = items.filter((item) => item.titleEn).length
    logger.info(`Scraped ${pageLogLabel}`, {
      total: items.length,
      matchedEnglish: matched,
    })
    return items
  }

  private async fetchPage(
    fetch: EnhancedFetch,
    url: string,
    pageLogLabel: string,
  ): Promise<string | null> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        logger.warn(`${pageLogLabel} returned non-OK response`, {
          url,
          status: response.status,
        })
        return null
      }
      return await response.text()
    } catch (error) {
      logger.error(`Failed to fetch ${pageLogLabel}`, { url, error })
      return null
    }
  }

  private parsePage(html: string): LyfjastofnunScrapedItem[] {
    const groupHeadings = this.parseGroupHeadings(html)
    const groupTitleFor = (index: number): string => {
      let title = ''
      for (const heading of groupHeadings) {
        if (heading.index > index) break
        title = heading.title
      }
      return title
    }

    const items: LyfjastofnunScrapedItem[] = []
    const itemPattern =
      /<div class="relatedfiles__item">([\s\S]*?)<div class="relatedfiles__item__icon">([\s\S]*?)<\/div>\s*<\/div>/g
    let itemMatch: RegExpExecArray | null

    while ((itemMatch = itemPattern.exec(html)) !== null) {
      const item = this.parseItem(itemMatch, groupTitleFor)
      if (item) items.push(item)
    }

    return items
  }

  private parseGroupHeadings(
    html: string,
  ): Array<{ index: number; title: string }> {
    const headings: Array<{ index: number; title: string }> = []
    const headingPattern = /<h2 class="relatedfiles__title">([\s\S]*?)<\/h2>/g
    let headingMatch: RegExpExecArray | null

    while ((headingMatch = headingPattern.exec(html)) !== null) {
      headings.push({
        index: headingMatch.index,
        title: stripWhitespace(headingMatch[1]),
      })
    }

    return headings
  }

  private parseItem(
    itemMatch: RegExpExecArray,
    groupTitleFor: (index: number) => string,
  ): LyfjastofnunScrapedItem | null {
    const [, header, icon] = itemMatch

    const titleMatch = /<span>([^<]+)<\/span>/.exec(header)
    const title = titleMatch ? stripWhitespace(titleMatch[1]) : ''
    if (!title) return null

    const linkMatch =
      /<a href="([^"]+)" class="relatedfiles__item__(download|open)">/.exec(
        icon,
      )
    if (!linkMatch) return null

    const [, url, linkType] = linkMatch

    return {
      title,
      groupTitle: groupTitleFor(itemMatch.index),
      fileUrl: linkType === 'download' ? url : undefined,
      externalUrl: linkType === 'open' ? url : undefined,
    }
  }
}
