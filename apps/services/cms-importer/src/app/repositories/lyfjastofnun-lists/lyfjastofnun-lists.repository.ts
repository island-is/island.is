import { Injectable } from '@nestjs/common'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { logger } from '@island.is/logging'
import { LISTAR_URL, LISTAR_URL_EN } from './lyfjastofnun-lists.constants'
import { LyfjastofnunListItem } from './lyfjastofnun-lists.types'

interface ScrapedItem {
  title: string
  groupTitle: string
  fileUrl?: string
  externalUrl?: string
}

const stripWhitespace = (value: string): string =>
  value.replace(/\s+/g, ' ').trim()

// Lyfjastofnun (Icelandic) and the Icelandic Medicines Agency site (English,
// a separate ima.is domain) publish the same underlying files under slightly
// different names (hyphens vs underscores vs dots). Normalizing to bare
// alphanumerics lets us match an Icelandic item to its English counterpart
// without depending on both sites listing items in the same order — the
// Icelandic page has several items with no English counterpart at all.
const normalizeFileName = (url: string): string =>
  (url.split('/').pop() ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')

const matchKeyFor = (item: ScrapedItem): string | null => {
  if (item.externalUrl) return `url:${item.externalUrl.toLowerCase()}`
  if (item.fileUrl) return `file:${normalizeFileName(item.fileUrl)}`
  return null
}

@Injectable()
export class LyfjastofnunListsRepository {
  private readonly fetch = createEnhancedFetch({
    name: 'LyfjastofnunListsClient',
  })

  async getItems(): Promise<LyfjastofnunListItem[]> {
    const [isHtml, enHtml] = await Promise.all([
      this.fetchPage(LISTAR_URL),
      this.fetchPage(LISTAR_URL_EN),
    ])
    if (!isHtml) return []

    const isItems = this.parsePage(isHtml)
    const enItems = enHtml ? this.parsePage(enHtml) : []

    const enByKey = new Map<string, ScrapedItem>()
    for (const item of enItems) {
      const key = matchKeyFor(item)
      if (key) enByKey.set(key, item)
    }

    const items: LyfjastofnunListItem[] = isItems.map((item) => {
      const key = matchKeyFor(item)
      const titleEn = key ? enByKey.get(key)?.title : undefined
      return { ...item, titleEn }
    })

    const matched = items.filter((item) => item.titleEn).length
    logger.info('Scraped Lyfjastofnun lists page', {
      total: items.length,
      matchedEnglish: matched,
    })
    return items
  }

  private async fetchPage(url: string): Promise<string | null> {
    try {
      const response = await this.fetch(url)
      if (!response.ok) {
        logger.warn('Lyfjastofnun lists page returned non-OK response', {
          url,
          status: response.status,
        })
        return null
      }
      return await response.text()
    } catch (error) {
      logger.error('Failed to fetch Lyfjastofnun lists page', { url, error })
      return null
    }
  }

  private parsePage(html: string): ScrapedItem[] {
    const groupHeadings = this.parseGroupHeadings(html)
    const groupTitleFor = (index: number): string => {
      let title = ''
      for (const heading of groupHeadings) {
        if (heading.index > index) break
        title = heading.title
      }
      return title
    }

    const items: ScrapedItem[] = []
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
  ): ScrapedItem | null {
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
