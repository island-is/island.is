import sanitizeHtml from 'sanitize-html'
import {
  Block,
  BLOCKS,
  Document,
  Inline,
  INLINES,
  Text,
  TopLevelBlock,
} from '@contentful/rich-text-types'
import { EntryCreationDto } from '../repositories/cms/cms.types'
import {
  makeTagMetadata,
  mapLocalizedValue,
  stripHtml,
} from '../repositories/cms/mapper'
import { LOCALE } from '../constants'
import { WpPost } from '../repositories/lyfjastofnun-wordpress/wordpress.types'
import { extractIntro } from '../repositories/lyfjastofnun-wordpress/wordpress.utils'
import { LYFJASTOFNUN_ORG_ID, LYFJASTOFNUN_OWNER_TAG } from './constants'

const HEADING_TAG_TO_BLOCK: Record<string, BLOCKS> = {
  h2: BLOCKS.HEADING_2,
  h3: BLOCKS.HEADING_3,
  h4: BLOCKS.HEADING_4,
  h5: BLOCKS.HEADING_5,
  h6: BLOCKS.HEADING_6,
}

const makeTextNode = (value: string): Text => ({
  nodeType: 'text',
  value,
  marks: [],
  data: {},
})

const makeHyperlinkNode = (uri: string, text: string): Inline => ({
  nodeType: INLINES.HYPERLINK,
  data: { uri },
  content: [makeTextNode(text)],
})

const htmlToInlineNodes = (html: string): Array<Text | Inline> => {
  const nodes: Array<Text | Inline> = []
  const linkPattern = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = linkPattern.exec(html)) !== null) {
    const before = stripHtml(html.slice(lastIndex, match.index))
    const beforeWithSpace =
      before &&
      /\s$/.test(html.slice(lastIndex, match.index).replace(/<[^>]+>/g, ''))
        ? before + ' '
        : before
    if (beforeWithSpace) nodes.push(makeTextNode(beforeWithSpace))

    const href = match[1]
    const linkText = stripHtml(match[2])
    if (linkText) nodes.push(makeHyperlinkNode(href, linkText))

    lastIndex = match.index + match[0].length
  }

  const afterHtml = html.slice(lastIndex)
  const after = stripHtml(afterHtml)
  const afterNeedsSpace =
    after &&
    /^\s/.test(afterHtml.replace(/<[^>]+>/g, '')) &&
    !/^[.,;:!?)}\]'"]/.test(after)
  const afterWithSpace = afterNeedsSpace ? ' ' + after : after
  if (afterWithSpace) nodes.push(makeTextNode(afterWithSpace))

  if (nodes.length === 0) {
    const text = stripHtml(html)
    if (text) nodes.push(makeTextNode(text))
  }

  return nodes
}

const makeBlockNode = (nodeType: BLOCKS, html: string): TopLevelBlock =>
  ({ nodeType, data: {}, content: htmlToInlineNodes(html) } as TopLevelBlock)

const makeListItemNode = (html: string): Block =>
  ({
    nodeType: BLOCKS.LIST_ITEM,
    data: {},
    content: [makeBlockNode(BLOCKS.PARAGRAPH, html)],
  } as Block)

const makeListNode = (
  nodeType: BLOCKS.UL_LIST | BLOCKS.OL_LIST,
  items: Block[],
): TopLevelBlock => ({ nodeType, data: {}, content: items } as TopLevelBlock)

const makeTableNode = (inner: string): TopLevelBlock | null => {
  const rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
  const rows: Block[] = []
  let rowMatch: RegExpExecArray | null
  while ((rowMatch = rowPattern.exec(inner)) !== null) {
    const cellPattern = /<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi
    const cells: Block[] = []
    let cellMatch: RegExpExecArray | null
    while ((cellMatch = cellPattern.exec(rowMatch[1])) !== null) {
      const isHeader = cellMatch[1].toLowerCase() === 'th'
      cells.push({
        nodeType: isHeader ? BLOCKS.TABLE_HEADER_CELL : BLOCKS.TABLE_CELL,
        data: {},
        content: [makeBlockNode(BLOCKS.PARAGRAPH, cellMatch[2])],
      } as Block)
    }
    if (cells.length > 0)
      rows.push({
        nodeType: BLOCKS.TABLE_ROW,
        data: {},
        content: cells,
      } as Block)
  }
  if (rows.length === 0) return null
  return { nodeType: BLOCKS.TABLE, data: {}, content: rows } as TopLevelBlock
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'ul',
    'ol',
    'li',
    'a',
    'hr',
    'div',
    'strong',
    'em',
    'blockquote',
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'th',
    'td',
  ],
  allowedAttributes: {
    a: ['href'],
    div: ['class'],
  },
}

const transformSpecialDivs = (html: string): string =>
  html
    // Unwrap collapselist__item__text: keep inner content (p tags etc), strip the div wrapper.
    // Safe to regex-match because item__text never contains nested divs.
    .replace(
      /<div[^>]+class="[^"]*collapselist__item__text[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
      '$1',
    )
    // Strip all collapselist opening div tags; orphaned </div> are ignored by the block parser.
    .replace(/<div[^>]+class="[^"]*collapselist[^"]*"[^>]*>/gi, '')
    .replace(
      /<div[^>]+class="[^"]*lightbluebox-text[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi,
      (_, inner) => `<blockquote>${stripHtml(inner)}</blockquote>`,
    )
    .replace(
      /<div[^>]+class="[^"]*linklist[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
      (_, inner) => {
        const linkPattern =
          /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
        let items = ''
        let linkMatch: RegExpExecArray | null
        while ((linkMatch = linkPattern.exec(inner)) !== null) {
          const text = stripHtml(linkMatch[2])
          if (text) items += `<li><a href="${linkMatch[1]}">${text}</a></li>`
        }
        return items ? `<ul>${items}</ul>` : ''
      },
    )

export const htmlToRichTextDocument = (html: string): Document => {
  const topLevel: TopLevelBlock[] = []
  const normalized = transformSpecialDivs(
    sanitizeHtml(html, SANITIZE_OPTIONS).replace(/\r\n/g, '\n').trim(),
  )

  const blockPattern =
    /<(h[2-6]|p|ul|ol|blockquote|table)[^>]*>([\s\S]*?)<\/\1>|<(hr)\s*\/?>/gi
  let match: RegExpExecArray | null

  while ((match = blockPattern.exec(normalized)) !== null) {
    const tag = (match[1] || match[3])?.toLowerCase()
    const inner = (match[2] ?? '').trim()

    if (!inner && tag !== 'hr') continue

    if (tag && tag in HEADING_TAG_TO_BLOCK) {
      topLevel.push(makeBlockNode(HEADING_TAG_TO_BLOCK[tag], inner))
    } else if (tag === 'p') {
      topLevel.push(makeBlockNode(BLOCKS.PARAGRAPH, inner))
    } else if (tag === 'blockquote') {
      topLevel.push({
        nodeType: BLOCKS.QUOTE,
        data: {},
        content: [makeBlockNode(BLOCKS.PARAGRAPH, inner)],
      } as TopLevelBlock)
    } else if (tag === 'ul' || tag === 'ol') {
      const listType = tag === 'ul' ? BLOCKS.UL_LIST : BLOCKS.OL_LIST
      const itemPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi
      const items: Block[] = []
      let liMatch: RegExpExecArray | null
      while ((liMatch = itemPattern.exec(inner)) !== null) {
        if (stripHtml(liMatch[1])) items.push(makeListItemNode(liMatch[1]))
      }
      if (items.length > 0) topLevel.push(makeListNode(listType, items))
    } else if (tag === 'table') {
      const tableNode = makeTableNode(inner)
      if (tableNode) topLevel.push(tableNode)
    } else if (tag === 'hr') {
      topLevel.push({ nodeType: BLOCKS.HR, data: {}, content: [] })
    }
  }

  if (topLevel.length === 0) {
    const fallback = stripHtml(normalized)
    if (fallback) topLevel.push(makeBlockNode(BLOCKS.PARAGRAPH, normalized))
  }

  return { nodeType: BLOCKS.DOCUMENT, data: {}, content: topLevel }
}

export const buildNewsEntry = (
  post: WpPost,
  assetId: string,
  summary?: string | null,
): EntryCreationDto => ({
  metadata: makeTagMetadata(LYFJASTOFNUN_OWNER_TAG),
  fields: {
    organization: mapLocalizedValue({
      sys: { type: 'Link', linkType: 'Entry', id: LYFJASTOFNUN_ORG_ID },
    }),
    title: mapLocalizedValue(stripHtml(post.title.rendered)),
    slug: mapLocalizedValue(post.slug),
    date: mapLocalizedValue(post.date),
    intro: mapLocalizedValue(summary ?? extractIntro(post)),
    content: mapLocalizedValue(
      htmlToRichTextDocument(post.content?.rendered ?? ''),
    ),
    image: mapLocalizedValue({
      sys: { type: 'Link', linkType: 'Asset', id: assetId },
    }),
  },
})
