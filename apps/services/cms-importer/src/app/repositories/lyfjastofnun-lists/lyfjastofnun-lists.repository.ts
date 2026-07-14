import { Injectable } from '@nestjs/common'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { logger } from '@island.is/logging'
import { LISTAR_URL } from './lyfjastofnun-lists.constants'
import { LyfjastofnunListItem } from './lyfjastofnun-lists.types'

const stripWhitespace = (value: string): string =>
  value.replace(/\s+/g, ' ').trim()

@Injectable()
export class LyfjastofnunListsRepository {
  private readonly fetch = createEnhancedFetch({
    name: 'LyfjastofnunListsClient',
  })

  async getItems(): Promise<LyfjastofnunListItem[]> {
    const html = await this.fetchPage()
    if (!html) return []

    const groupHeadings = this.parseGroupHeadings(html)
    const groupTitleFor = (index: number): string => {
      let title = ''
      for (const heading of groupHeadings) {
        if (heading.index > index) break
        title = heading.title
      }
      return title
    }

    const items: LyfjastofnunListItem[] = []
    const itemPattern =
      /<div class="relatedfiles__item">([\s\S]*?)<div class="relatedfiles__item__icon">([\s\S]*?)<\/div>\s*<\/div>/g
    let itemMatch: RegExpExecArray | null

    while ((itemMatch = itemPattern.exec(html)) !== null) {
      const item = this.parseItem(itemMatch, groupTitleFor)
      if (item) items.push(item)
    }

    logger.info('Scraped Lyfjastofnun lists page', { total: items.length })
    return items
  }

  private async fetchPage(): Promise<string | null> {
    try {
      const response = await this.fetch(LISTAR_URL)
      if (!response.ok) {
        logger.warn('Lyfjastofnun listar page returned non-OK response', {
          status: response.status,
        })
        return null
      }
      return await response.text()
    } catch (error) {
      logger.error('Failed to fetch Lyfjastofnun listar page', { error })
      return null
    }
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
  ): LyfjastofnunListItem | null {
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

    const formatMatch =
      /relatedfiles__item__title--filesize">([\s\S]*?)<\/span>/.exec(header)
    const formatLabel = formatMatch
      ? stripWhitespace(formatMatch[1])
      : undefined

    return {
      title,
      groupTitle: groupTitleFor(itemMatch.index),
      formatLabel,
      fileUrl: linkType === 'download' ? url : undefined,
      externalUrl: linkType === 'open' ? url : undefined,
    }
  }
}
