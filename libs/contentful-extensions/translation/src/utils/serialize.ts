import escapeHtml from 'escape-html'

import { BlockType, LeafType, NodeTypes } from '../types/types'
import { DEFAULT_NODE_TYPES, BREAK_TAG, LIST_TYPES } from './constants'

interface Options {
  nodeTypes: NodeTypes
  listDepth?: number
  olListItemIndex?: number
  ignoreParagraphNewline?: boolean
}

const reverseStr = (string: string) => string.split('').reverse().join('')

const isLeafNode = (node: BlockType | LeafType): node is LeafType => {
  return typeof (node as LeafType)?.text === 'string'
}

const retainWhitespaceAndFormat = (string: string, format: string) => {
  // we keep this for a comparison later
  const frozenString = string.trim()

  // children will be mutated
  let children = frozenString

  // We reverse the right side formatting, to properly handle bold/italic
  // formats, so we can create ~~***FooBar***~~
  const fullFormat = `${format}${children}${reverseStr(format)}`

  // This conditions accounts for no whitespace in our string
  // if we don't have any, we can return early.
  if (children.length === string.length) {
    return fullFormat
  }

  // if we do have whitespace, let's add our formatting around our trimmed string
  // We reverse the right side formatting, to properly handle bold/italic
  // formats, so we can create ~~***FooBar***~~
  const formattedString = format + children + reverseStr(format)

  // and replace the non-whitespace content of the string
  return string.replace(frozenString, formattedString)
}

/**
 * Most of the code is coming from https://github.com/hanford/remark-slate.
 * However it was working until Slate < 0.51.0. They changed the way how
 * each nodes were represented in the next versions. This supports Slate 0.59
 * and fixes a couple of issues that were in the current npm library.
 */
export const serialize = (
  data: (LeafType | BlockType)[],
  opts: Options = { nodeTypes: DEFAULT_NODE_TYPES },
) =>
  data.map((chunk) => {
    const {
      nodeTypes: userNodeTypes = DEFAULT_NODE_TYPES,
      ignoreParagraphNewline = false,
      listDepth = 0,
    } = opts

    let text = (chunk as LeafType).text || ''
    let type = (chunk as BlockType).type || ''

    const nodeTypes = {
      ...DEFAULT_NODE_TYPES,
      ...userNodeTypes,
      heading: {
        ...DEFAULT_NODE_TYPES.heading,
        ...userNodeTypes.heading,
      },
    }

    let children = text

    if (!isLeafNode(chunk)) {
      children = chunk.children
        .map((c: BlockType | LeafType, index: number) => {
          const isList = !isLeafNode(c)
            ? LIST_TYPES.includes(c.type || '')
            : false

          const selfIsList = LIST_TYPES.includes(chunk.type || '')

          // Links can have the following shape
          // In which case we don't want to surround
          // with break tags
          // {
          //  type: 'paragraph',
          //  children: [
          //    { text: '' },
          //    { type: 'link', children: [{ text: foo.com }]}
          //    { text: '' }
          //  ]
          // }
          let childrenHasLink = false

          if (Array.isArray(chunk.children)) {
            childrenHasLink = chunk.children.some(
              (f) => !isLeafNode(f) && f.type === nodeTypes.link,
            )
          }

          return serialize([{ ...c, parentType: type }], {
            nodeTypes,
            // WOAH.
            // what we're doing here is pretty tricky, it relates to the block below where
            // we check for ignoreParagraphNewline and set type to paragraph.
            // We want to strip out empty paragraphs sometimes, but other times we don't.
            // If we're the descendant of a list, we know we don't want a bunch
            // of whitespace. If we're parallel to a link we also don't want
            // to respect neighboring paragraphs
            ignoreParagraphNewline:
              (ignoreParagraphNewline ||
                isList ||
                selfIsList ||
                childrenHasLink) &&
              // if we have c.break, never ignore empty paragraph new line
              !(c as BlockType).break,

            // track depth of nested lists so we can add proper spacing
            listDepth: LIST_TYPES.includes((c as BlockType).type || '')
              ? listDepth + 1
              : listDepth,

            // track ol_list index
            olListItemIndex: type === nodeTypes.ol_list ? index + 1 : undefined,
          })
        })
        .join('')
    }

    // This is pretty fragile code, check the long comment where we iterate over children
    if (
      !ignoreParagraphNewline &&
      (text === '' || text === '\n') &&
      chunk.parentType === nodeTypes.paragraph
    ) {
      type = nodeTypes.paragraph
      children = BREAK_TAG
    }

    if (children === '') {
      return
    }

    // Never allow decorating break tags with rich text formatting,
    // this can malformed generated markdown
    // Also ensure we're only ever applying text formatting to leaf node
    // level chunks, otherwise we can end up in a situation where
    // we try applying formatting like to a node like this:
    // "Text foo bar **baz**" resulting in "**Text foo bar **baz****"
    // which is invalid markup and can mess everything up
    if (children !== BREAK_TAG && isLeafNode(chunk)) {
      if (chunk.strikeThrough && chunk.bold && chunk.italic) {
        children = retainWhitespaceAndFormat(children, '~~***')
      } else if (chunk.bold && chunk.italic) {
        children = retainWhitespaceAndFormat(children, '***')
      } else {
        if (chunk.bold) {
          children = retainWhitespaceAndFormat(children, '**')
        }

        if (chunk.italic) {
          children = retainWhitespaceAndFormat(children, '_')
        }

        if (chunk.strikeThrough) {
          children = retainWhitespaceAndFormat(children, '~~')
        }
      }
    }

    switch (type) {
      case nodeTypes.heading[1]:
        return `# ${children}\n\n`
      case nodeTypes.heading[2]:
        return `## ${children}\n\n`
      case nodeTypes.heading[3]:
        return `### ${children}\n\n`
      case nodeTypes.heading[4]:
        return `#### ${children}\n\n`
      case nodeTypes.heading[5]:
        return `##### ${children}\n\n`
      case nodeTypes.heading[6]:
        return `###### ${children}\n\n`

      case nodeTypes.block_quote:
        // For some reason, marked is parsing blockquote w/ one new line
        // as continued blockquote, so adding two new lines ensures that doesn't
        // happen
        return `> ${children}\n\n`

      case nodeTypes.code_block:
        return `\`\`\`${
          (chunk as BlockType).language || ''
        }\n${children}\n\`\`\`\n`

      case nodeTypes.link:
        const url = (chunk as { url?: string })?.url
        return url ? `[${children}](${url})` : children

      case nodeTypes.ul_list:
      case nodeTypes.ol_list:
        return `\n${children}\n`

      case nodeTypes.listItem:
        const isOL = chunk && chunk.parentType === nodeTypes.ol_list
        let spacer = ''

        for (let k = 0; listDepth > k; k++) {
          if (isOL) {
            // https://github.com/remarkjs/remark-react/issues/65
            spacer += '   '
          } else {
            spacer += '  '
          }
        }

        return `${spacer}${
          isOL ? `${opts.olListItemIndex}.` : '-'
        } ${children}\n`

      case nodeTypes.paragraph:
        return `${children}\n\n`

      default:
        return escapeHtml(children)
    }
  })

export const serializeAndFormat = (data: (LeafType | BlockType)[]) => {
  const firstLineBreak = /^[\n]/g
  const lastItemLineBreak = /[\n]{2}$/g

  return serialize(data)
    .map((line, index, arr) => {
      // We remove the last line-break in the line if found for the last item of the array
      if (index === arr.length - 1) {
        return line?.replace(lastItemLineBreak, '')
      }

      // We remove the line-break if found at the first position of the line
      return line?.replace(firstLineBreak, '')
    })
    .join('')
}
