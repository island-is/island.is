import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import {
  RskResolvedLink,
  RskTreatyDocument,
  RskTreatyItem,
  RskTreatyLink,
  RskTreatyLinkKind,
  RskTreatyTabKey,
} from './dto/rskTreaty.dto'
import {
  EXACT_TITLE_OVERRIDES,
  ISLAND_IS_SEARCH_URL,
  ISLAND_IS_VIEWER_BASE_URL,
  RSK_TREATIES_URL,
  SEARCH_QUERY_OVERRIDES,
  SKATTURINN_BASE_URL,
  TAB_SEARCH_KEYWORD,
} from './rskTreaties.constants'

const USER_AGENT = 'Mozilla/5.0'
const FETCH_TIMEOUT_MS = 15_000

const DIRECT_PDF_PATTERNS = [
  /^https?:\/\/adverts\.stjornartidindi\.is\/.*\.pdf$/i,
  /^https?:\/\/(www\.)?skatturinn\.is\/media\/.*\.pdf$/i,
  /^https?:\/\/(www\.)?stjornartidindi\.is\/PdfVersions\.aspx/i,
  /^https?:\/\/(www\.)?fjarmalaraduneyti\.is\/.*\.pdf$/i,
  /^https?:\/\/(www\.)?stjornarradid\.is\/.*\.pdf$/i,
]

const VIEWER_PAGE_PATTERNS = [
  /^https?:\/\/island\.is\/stjornartidindi\/nr\//i,
  /^https?:\/\/(www\.)?stjornartidindi\.is\/Advert\.aspx/i,
]

const DOCUMENT_ACTIONS_PATTERN =
  /^https?:\/\/(www\.)?stjornartidindi\.is\/DocumentActions\.aspx/i

const decodeHtmlEntities = (value: string): string =>
  value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()

const stripTags = (value: string): string =>
  decodeHtmlEntities(value.replace(/<[^>]+>/g, '')).trim()

interface ParsedCell {
  text: string
  href: string | null
  linkLabel: string | null
}

const parseCells = (rowHtml: string): ParsedCell[] => {
  const tds = rowHtml.match(/<td[^>]*>([\s\S]*?)<\/td>/g) ?? []
  return tds.map((td) => {
    const inner = td.replace(/^<td[^>]*>/, '').replace(/<\/td>$/, '')
    const anchorMatch = inner.match(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/)
    return {
      text: stripTags(inner),
      href: anchorMatch ? decodeHtmlEntities(anchorMatch[1]) : null,
      linkLabel: anchorMatch ? stripTags(anchorMatch[2]) : null,
    }
  })
}

const resolveAbsoluteUrl = (href: string): string =>
  href.startsWith('/') ? `${SKATTURINN_BASE_URL}${href}` : href

const extractSection = (html: string, startHeader: string, endHeader: string) => {
  const start = html.indexOf(`<h2 class="tabhead">${startHeader}</h2>`)
  if (start === -1) return null
  const rest = html.slice(start)
  const end = rest.indexOf(`<h2 class="tabhead">${endHeader}</h2>`)
  return end === -1 ? rest : rest.slice(0, end)
}

const extractFirstTable = (sectionHtml: string): string | null => {
  const match = sectionHtml.match(/<table>([\s\S]*?)<\/table>/)
  return match ? match[1] : null
}

const extractRows = (tableHtml: string): string[] =>
  tableHtml.match(/<tr>([\s\S]*?)<\/tr>/g) ?? []

const parseSamningarTable = (html: string): RskTreatyItem[] => {
  const section = extractSection(html, 'Samningar', 'Upplýsingaskipti')
  const table = section && extractFirstTable(section)
  if (!table) {
    logger.warn('RSK treaties: could not find Samningar table')
    return []
  }

  const items: RskTreatyItem[] = []
  let currentDocuments: RskTreatyDocument[] | null = null
  let currentName: string | null = null

  for (const rowHtml of extractRows(table)) {
    const cells = parseCells(rowHtml)
    if (cells.length < 5) continue

    const [nameCell, noteCell, isCell, enCell, otherCell] = cells

    const isNewItem = !!nameCell.text && nameCell.text !== currentName
    if (isNewItem || !currentDocuments) {
      currentName = nameCell.text || currentName
      currentDocuments = []
      if (currentName) {
        items.push({
          name: currentName,
          tabKeys: ['samningar'],
          documents: currentDocuments,
        })
      }
    }

    const links: RskTreatyLink[] = []
    const pushLink = (cell: ParsedCell, kind: RskTreatyLinkKind) => {
      if (cell.href) {
        links.push({
          kind,
          label: cell.linkLabel || kind,
          href: resolveAbsoluteUrl(cell.href),
        })
      }
    }
    pushLink(isCell, 'is')
    pushLink(enCell, 'en')
    pushLink(otherCell, 'other')

    if (links.length && currentDocuments && currentName) {
      currentDocuments.push({
        label: noteCell.text || undefined,
        tabKey: 'samningar',
        links,
      })
    } else if (links.length) {
      logger.warn(
        'RSK treaties: dropping links found before any item name was seen',
        { noteCell: noteCell.text },
      )
    }
  }

  return items
}

const parseUpplysingaskiptiTable = (html: string): RskTreatyItem[] => {
  const section = extractSection(html, 'Upplýsingaskipti', 'Aðrir samningar')
  const table = section && extractFirstTable(section)
  if (!table) {
    logger.warn('RSK treaties: could not find Upplýsingaskipti table')
    return []
  }

  const items: RskTreatyItem[] = []

  for (const rowHtml of extractRows(table)) {
    const cells = parseCells(rowHtml)
    if (cells.length < 3) continue

    const [nameCell, isCell, enCell] = cells
    if (!nameCell.text) continue

    const links: RskTreatyLink[] = []
    if (isCell.href) {
      links.push({
        kind: 'is',
        label: isCell.linkLabel || 'is',
        href: resolveAbsoluteUrl(isCell.href),
      })
    }
    if (enCell.href) {
      links.push({
        kind: 'en',
        label: enCell.linkLabel || 'en',
        href: resolveAbsoluteUrl(enCell.href),
      })
    }

    if (links.length) {
      items.push({
        name: nameCell.text,
        tabKeys: ['upplysingaskipti'],
        documents: [{ tabKey: 'upplysingaskipti', links }],
      })
    }
  }

  return items
}

const parseAdrirSamningarTable = (html: string): RskTreatyItem[] => {
  const section = extractSection(html, 'Aðrir samningar', 'Gagnkvæmt samkomulag')
  const table = section && extractFirstTable(section)
  if (!table) {
    logger.warn('RSK treaties: could not find Aðrir samningar table')
    return []
  }

  const items: RskTreatyItem[] = []
  let current: RskTreatyItem | null = null

  for (const rowHtml of extractRows(table)) {
    const cells = parseCells(rowHtml)
    if (cells.length < 4) continue

    const [groupCell, noteCell, titleCell, isCell] = cells

    // Blank column 1 continues the previous item (e.g. OECD's viðauki/breyting
    // 2010). A non-blank column 1 always starts a NEW item, even if it repeats
    // the same group name — unlike Samningar, "Norðurlöndin" repeats across 4
    // genuinely distinct, unrelated agreements here, so a same-name-continues
    // rule would incorrectly merge them. This relies on titleCell being
    // distinct per row (true today) rather than being structurally
    // guaranteed — mergeCrossSectionItems merges by name globally, so two
    // rows with identical group+title text would incorrectly merge too.
    if (groupCell.text) {
      const name = titleCell.text
        ? `${groupCell.text} - ${titleCell.text}`
        : groupCell.text
      current = { name, tabKeys: ['adrirSamningar'], documents: [] }
      items.push(current)
    }

    if (!current) continue

    if (isCell.href) {
      current.documents.push({
        label: noteCell.text || undefined,
        tabKey: 'adrirSamningar',
        links: [
          {
            kind: 'is',
            href: resolveAbsoluteUrl(isCell.href),
            label: isCell.linkLabel || 'is',
          },
        ],
      })
    }
  }

  return items
}

const mergeCrossSectionItems = (items: RskTreatyItem[]): RskTreatyItem[] => {
  const byName = new Map<string, RskTreatyItem>()
  const order: string[] = []

  for (const item of items) {
    const existing = byName.get(item.name)
    if (existing) {
      existing.tabKeys.push(...item.tabKeys)
      existing.documents.push(...item.documents)
    } else {
      byName.set(item.name, {
        ...item,
        tabKeys: [...item.tabKeys],
        documents: [...item.documents],
      })
      order.push(item.name)
    }
  }

  return order.map((name) => byName.get(name) as RskTreatyItem)
}

interface FetchOptions {
  redirect?: 'follow' | 'manual'
}

@Injectable()
export class RskTreatiesRepository {
  private async fetchText(
    url: string,
    options?: FetchOptions,
  ): Promise<string | null> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT },
        redirect: options?.redirect ?? 'follow',
        signal: controller.signal,
      })
      if (!response.ok) {
        logger.warn('RSK treaties: fetch failed', {
          url,
          status: response.status,
        })
        return null
      }
      return await response.text()
    } catch (error) {
      logger.warn('RSK treaties: fetch threw', { url, error })
      return null
    } finally {
      clearTimeout(timeout)
    }
  }

  async getTreatyItems(): Promise<RskTreatyItem[]> {
    const html = await this.fetchText(RSK_TREATIES_URL)
    if (!html) {
      logger.warn('RSK treaties: could not fetch source page')
      return []
    }

    const items = [
      ...parseSamningarTable(html),
      ...parseUpplysingaskiptiTable(html),
      ...parseAdrirSamningarTable(html),
    ]

    return mergeCrossSectionItems(items)
  }

  /**
   * Resolves a single scraped link to either a downloadable PDF (to be
   * uploaded as a Contentful Asset) or a plain external hyperlink, following
   * the rules worked out against the live site:
   *  - direct PDF domains/paths resolve as-is
   *  - island.is/stjornartidindi/nr and Advert.aspx viewer pages resolve with
   *    one extra fetch, regexing out the embedded PDF link
   *  - DocumentActions.aspx links resolve via the Stjórnartíðindi search,
   *    matched by title, falling back to a manual override, falling back to
   *    a plain hyperlink if nothing matches
   *  - everything else (retsinformation.dk, regjeringen.no, lagen.nu,
   *    althingi.is, unrecognized domains) stays a plain hyperlink
   */
  async resolveLink(
    link: RskTreatyLink,
    context: { name: string; documentLabel?: string; tabKey: RskTreatyTabKey },
  ): Promise<RskResolvedLink> {
    const { href } = link

    if (DIRECT_PDF_PATTERNS.some((pattern) => pattern.test(href))) {
      return { type: 'asset', url: href }
    }

    if (VIEWER_PAGE_PATTERNS.some((pattern) => pattern.test(href))) {
      logger.info('RSK treaties: following viewer page', { href })
      const resolved = await this.resolveViewerPage(href)
      logger.info('RSK treaties: viewer page resolved', { href, resolved })
      return resolved
        ? { type: 'asset', url: resolved }
        : { type: 'hyperlink', url: href }
    }

    if (DOCUMENT_ACTIONS_PATTERN.test(href)) {
      logger.info('RSK treaties: searching Stjórnartíðindi for document', {
        name: context.name,
        documentLabel: context.documentLabel,
      })
      const resolved = await this.resolveDocumentActionsLink(context)
      logger.info('RSK treaties: DocumentActions search finished', {
        name: context.name,
        resolved,
      })
      return resolved
        ? { type: 'asset', url: resolved }
        : { type: 'hyperlink', url: href }
    }

    return { type: 'hyperlink', url: href }
  }

  private async resolveViewerPage(url: string): Promise<string | null> {
    const html = await this.fetchText(url)
    if (!html) return null
    const match = html.match(
      /href="(https:\/\/adverts\.stjornartidindi\.is\/[^"]+\.pdf)"/,
    )
    return match ? match[1] : null
  }

  private async resolveDocumentActionsLink(context: {
    name: string
    documentLabel?: string
    tabKey: RskTreatyTabKey
  }): Promise<string | null> {
    const { name, documentLabel, tabKey } = context

    if (tabKey !== 'samningar' && tabKey !== 'upplysingaskipti') {
      return null
    }

    const exactTitleOverride =
      EXACT_TITLE_OVERRIDES[`${name}::${documentLabel ?? ''}`]

    const searchQuery = SEARCH_QUERY_OVERRIDES[name] ?? name
    const adverts = await this.searchAdverts(searchQuery)
    if (!adverts) return null

    let match: { id: string; title: string } | undefined

    if (exactTitleOverride) {
      match = adverts.find((advert) => advert.title === exactTitleOverride)
    } else {
      const keyword = TAB_SEARCH_KEYWORD[tabKey]
      const candidates = adverts.filter(
        (advert) =>
          advert.title.includes(keyword) &&
          advert.title.includes(`við ${searchQuery}`) &&
          !advert.title.toLowerCase().includes('bókun'),
      )
      if (candidates.length === 1) {
        match = candidates[0]
      } else if (candidates.length > 1) {
        logger.warn('RSK treaties: ambiguous DocumentActions search match', {
          name,
          documentLabel,
          titles: candidates.map((c) => c.title),
        })
      }
    }

    if (!match) {
      logger.info('RSK treaties: no DocumentActions search match found', {
        name,
        documentLabel,
      })
      return null
    }

    return this.resolveViewerPage(`${ISLAND_IS_VIEWER_BASE_URL}/${match.id}`)
  }

  private async searchAdverts(
    query: string,
  ): Promise<Array<{ id: string; title: string }> | null> {
    const url = `${ISLAND_IS_SEARCH_URL}?q=${encodeURIComponent(
      query,
    )}&deild=c-deild`
    const html = await this.fetchText(url)
    if (!html) return null

    const scriptMatch = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
    )
    if (!scriptMatch) return null

    try {
      const data = JSON.parse(scriptMatch[1])
      const adverts = findInitialAdverts(data)
      if (!Array.isArray(adverts)) return null
      return adverts
        .filter((advert) => typeof advert?.id === 'string' && typeof advert?.title === 'string')
        .map((advert) => ({ id: advert.id, title: advert.title }))
    } catch (error) {
      logger.warn('RSK treaties: failed to parse search results JSON', {
        query,
        error,
      })
      return null
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const findInitialAdverts = (node: any): unknown => {
  if (!node || typeof node !== 'object') return undefined
  if ('initialAdverts' in node) return node.initialAdverts
  const values = Array.isArray(node) ? node : Object.values(node)
  for (const value of values) {
    const found = findInitialAdverts(value)
    if (found !== undefined) return found
  }
  return undefined
}
