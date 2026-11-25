import sanitizeHtml from 'sanitize-html'
import { HTMLElement, Node, TextNode, parse } from 'node-html-parser'
import {
  Block,
  BLOCKS,
  CONTAINERS,
  Document,
  Inline,
  INLINES,
  LIST_ITEM_BLOCKS,
  MARKS,
  Text,
  TopLevelBlock,
} from '@contentful/rich-text-types'
import { EntryCreationDto } from '../../../../platform/cms.types'
import { generateNewsEntry } from '../../../../platform/content-types/news.mapper'
import { mapLocalizedValue, stripHtml } from '../../../../platform/localization'
import { WpPost } from '../../lyfjastofnun.types'
import { extractIntro } from '../../lyfjastofnun.utils'
import {
  LYFJASTOFNUN_ORG_ID,
  LYFJASTOFNUN_OWNER_TAG,
} from '../../lyfjastofnun.constants'

const HEADING_TAG_TO_BLOCK: Record<string, BLOCKS> = {
  h2: BLOCKS.HEADING_2,
  h3: BLOCKS.HEADING_3,
  h4: BLOCKS.HEADING_4,
  h5: BLOCKS.HEADING_5,
  h6: BLOCKS.HEADING_6,
}

const INLINE_MARKS: Record<string, MARKS> = {
  strong: MARKS.BOLD,
  em: MARKS.ITALIC,
}

const LIST_TAG_TO_BLOCK: Record<string, BLOCKS.UL_LIST | BLOCKS.OL_LIST> = {
  ul: BLOCKS.UL_LIST,
  ol: BLOCKS.OL_LIST,
}

const tagOf = (node: Node): string | undefined =>
  node instanceof HTMLElement ? node.rawTagName?.toLowerCase() : undefined

const isInlineNode = (node: Node): boolean => {
  const tag = tagOf(node)
  return (
    node instanceof TextNode ||
    tag === 'a' ||
    tag === 'br' ||
    (tag !== undefined && tag in INLINE_MARKS)
  )
}

const makeTextNode = (value: string, marks: MARKS[]): Text => ({
  nodeType: 'text',
  value,
  marks: marks.map((type) => ({ type })),
  data: {},
})

const toInlineNodes = (
  nodes: Node[],
  marks: MARKS[] = [],
): Array<Text | Inline> =>
  nodes.flatMap((node): Array<Text | Inline> => {
    if (node instanceof TextNode) {
      const value = node.text.replace(/\s+/g, ' ')
      return value ? [makeTextNode(value, marks)] : []
    }
    const tag = tagOf(node)
    if (tag === 'br') return [makeTextNode(' ', marks)]
    if (tag && tag in INLINE_MARKS) {
      return toInlineNodes(node.childNodes, [...marks, INLINE_MARKS[tag]])
    }
    if (tag === 'a' && node instanceof HTMLElement) {
      const uri = node.getAttribute('href')
      const content = toInlineNodes(node.childNodes, marks).filter(
        (child): child is Text => child.nodeType === 'text',
      )
      if (!uri) return content
      return content.length
        ? [{ nodeType: INLINES.HYPERLINK, data: { uri }, content }]
        : []
    }
    return toInlineNodes(node.childNodes, marks)
  })

const trimInlineNodes = (nodes: Array<Text | Inline>): Array<Text | Inline> => {
  const trimEdge = (node: Text | Inline, trim: (s: string) => string) => {
    if (node.nodeType === 'text') return { ...node, value: trim(node.value) }
    return node
  }
  const trimmed = nodes.map((node, index) => {
    let result = node
    if (index === 0) result = trimEdge(result, (s) => s.trimStart())
    if (index === nodes.length - 1)
      result = trimEdge(result, (s) => s.trimEnd())
    return result
  })
  return trimmed.filter((node) => node.nodeType !== 'text' || node.value)
}

const hasText = (nodes: Array<Text | Inline>): boolean =>
  nodes.some((node) =>
    node.nodeType === 'text'
      ? node.value.trim().length > 0
      : hasText(node.content as Array<Text | Inline>),
  )

const makeInlineBlock = (
  nodeType: BLOCKS,
  nodes: Node[],
): TopLevelBlock | null => {
  const content = trimInlineNodes(toInlineNodes(nodes))
  if (!hasText(content)) return null
  return { nodeType, data: {}, content } as TopLevelBlock
}

const isTextOrInline = (node: Block | Inline | Text): boolean =>
  node.nodeType === 'text' || node.nodeType === INLINES.HYPERLINK

const coerceBlocks = (
  nodes: Array<Block | Inline | Text>,
  allowed: readonly string[],
): TopLevelBlock[] =>
  nodes.flatMap((node): TopLevelBlock[] => {
    if (isTextOrInline(node)) return []
    if (allowed.includes(node.nodeType)) return [node as TopLevelBlock]
    const children = (node as Block).content
    if (children.every(isTextOrInline)) {
      return children.length
        ? [
            {
              nodeType: BLOCKS.PARAGRAPH,
              data: {},
              content: children,
            } as TopLevelBlock,
          ]
        : []
    }
    return coerceBlocks(children, allowed)
  })

const makeListNode = (
  nodeType: BLOCKS.UL_LIST | BLOCKS.OL_LIST,
  list: HTMLElement,
): TopLevelBlock | null => {
  const items = list.childNodes
    .filter((child) => tagOf(child) === 'li')
    .map((li) => ({
      nodeType: BLOCKS.LIST_ITEM,
      data: {},
      content: coerceBlocks(toBlocks(li.childNodes), LIST_ITEM_BLOCKS),
    }))
    .filter((item) => item.content.length > 0)
  if (items.length === 0) return null
  return { nodeType, data: {}, content: items } as TopLevelBlock
}

const makeTableNode = (table: HTMLElement): TopLevelBlock | null => {
  const rows = table
    .querySelectorAll('tr')
    .map((tr) => ({
      nodeType: BLOCKS.TABLE_ROW,
      data: {},
      content: tr.childNodes
        .filter((cell) => tagOf(cell) === 'td' || tagOf(cell) === 'th')
        .map((cell) => {
          const content = coerceBlocks(
            toBlocks(cell.childNodes),
            CONTAINERS[BLOCKS.TABLE_CELL],
          )
          return {
            nodeType:
              tagOf(cell) === 'th'
                ? BLOCKS.TABLE_HEADER_CELL
                : BLOCKS.TABLE_CELL,
            data: {},
            content: content.length
              ? content
              : [
                  {
                    nodeType: BLOCKS.PARAGRAPH,
                    data: {},
                    content: [makeTextNode('', [])],
                  },
                ],
          }
        }),
    }))
    .filter((row) => row.content.length > 0)
  if (rows.length === 0) return null
  return { nodeType: BLOCKS.TABLE, data: {}, content: rows } as TopLevelBlock
}

const toBlock = (
  node: HTMLElement,
  tag: string,
): Array<TopLevelBlock | null> => {
  if (tag in HEADING_TAG_TO_BLOCK) {
    return [makeInlineBlock(HEADING_TAG_TO_BLOCK[tag], node.childNodes)]
  }
  if (tag === 'p') return [makeInlineBlock(BLOCKS.PARAGRAPH, node.childNodes)]
  if (tag === 'blockquote') {
    const content = coerceBlocks(
      toBlocks(node.childNodes),
      CONTAINERS[BLOCKS.QUOTE],
    )
    return [
      content.length
        ? ({ nodeType: BLOCKS.QUOTE, data: {}, content } as TopLevelBlock)
        : null,
    ]
  }
  if (tag in LIST_TAG_TO_BLOCK) {
    return [makeListNode(LIST_TAG_TO_BLOCK[tag], node)]
  }
  if (tag === 'table') return [makeTableNode(node)]
  if (tag === 'hr') return [{ nodeType: BLOCKS.HR, data: {}, content: [] }]
  return toBlocks(node.childNodes)
}

const toBlocks = (nodes: Node[]): TopLevelBlock[] => {
  const blocks: Array<TopLevelBlock | null> = []
  let pendingInline: Node[] = []

  const flushInline = () => {
    if (pendingInline.length) {
      blocks.push(makeInlineBlock(BLOCKS.PARAGRAPH, pendingInline))
      pendingInline = []
    }
  }

  for (const node of nodes) {
    const tag = tagOf(node)
    if (isInlineNode(node)) {
      pendingInline.push(node)
    } else if (tag && node instanceof HTMLElement) {
      flushInline()
      blocks.push(...toBlock(node, tag))
    }
  }
  flushInline()

  return blocks.filter((block): block is TopLevelBlock => block !== null)
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

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

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
      (_, inner) => `<blockquote>${escapeHtml(stripHtml(inner))}</blockquote>`,
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
          if (text) items += `<li><a href="${linkMatch[1]}">${escapeHtml(text)}</a></li>`
        }
        return items ? `<ul>${items}</ul>` : ''
      },
    )

export const htmlToRichTextDocument = (html: string): Document => {
  const normalized = transformSpecialDivs(
    sanitizeHtml(html, SANITIZE_OPTIONS).replace(/\r\n/g, '\n').trim(),
  )

  return {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: toBlocks(parse(normalized).childNodes),
  }
}

export const buildNewsEntry = (
  post: WpPost,
  assetId: string,
  summary?: string | null,
): EntryCreationDto | undefined =>
  generateNewsEntry({
    ownerTags: [LYFJASTOFNUN_OWNER_TAG],
    properties: {
      organizationId: LYFJASTOFNUN_ORG_ID,
      title: mapLocalizedValue(stripHtml(post.title.rendered)),
      slug: mapLocalizedValue(post.slug),
      date: mapLocalizedValue(post.date),
      intro: mapLocalizedValue(summary ?? extractIntro(post)),
      content: mapLocalizedValue(
        htmlToRichTextDocument(post.content?.rendered ?? ''),
      ),
      imageAssetId: assetId,
    },
  })
