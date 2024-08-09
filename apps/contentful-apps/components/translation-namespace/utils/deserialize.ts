import flatMap from 'lodash/flatMap'
import remarkParse from 'remark-parse'
import { Node } from 'slate'
import unified from 'unified'

import { BlockType, MdastNode, OptionType } from '../types/types'
import { DEFAULT_NODE_TYPES, EMPTY_STATE } from './constants'

/**
 * We need a function here because we need the this keyword to define
 * the Compiler variable needed to work with the unified library.
 */
function plugin(opts?: OptionType) {
  const compiler = (node: { children: Array<MdastNode> }) =>
    node.children.map((c) => deserialize(c, opts))

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  this.Compiler = compiler
}

const forceLeafNode = (children: Array<{ text?: string }>) => ({
  text: children.map((k) => k?.text).join(''),
})

/**
 * This function will take any unknown keys, and bring them up a level
 * allowing leaf nodes to have many different formats at once
 * for example, bold and italic on the same node
 */
const persistLeafFormats = (children: Array<MdastNode>) =>
  children.reduce((acc, node) => {
    Object.keys(node).forEach((key) => {
      if (key === 'children' || key === 'type' || key === 'text') {
        return
      }

      acc[key] = node[key as keyof typeof node]
    })

    return acc
  }, {})

/**
 * This node with the MdastNode type comes from the usage of the remark-slate plugin.
 * After getting the MdastNode we are able to deserialize it.
 */
export const deserialize = (
  node: MdastNode,
  opts: OptionType = { nodeTypes: {} },
) => {
  const types = {
    ...DEFAULT_NODE_TYPES,
    ...opts.nodeTypes,
    heading: {
      ...DEFAULT_NODE_TYPES.heading,
      ...opts?.nodeTypes?.heading,
    },
  }

  const linkDestinationKey = opts.linkDestinationKey ?? 'url'

  let children = [{ text: '' }]

  if (
    node.children &&
    Array.isArray(node.children) &&
    node.children.length > 0
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    children = node.children.map((c: MdastNode) =>
      deserialize(
        {
          ...c,
          ordered: node.ordered || false,
        },
        opts,
      ),
    )
  }

  switch (node.type) {
    case 'heading':
      return { type: types.heading[node.depth || 1], children }

    case 'list':
      return { type: node.ordered ? types.ol_list : types.ul_list, children }

    case 'listItem': {
      const flattenChildren = flatMap(children, (value: BlockType) => {
        if (value?.children) {
          return value.children
        }

        return [value]
      })

      /**
       * Hack? I don't know, but the children are returning a paragraph
       * containing the list item inside its children. I'm flattening
       * it to get the children child's props
       */
      return { type: types.listItem, children: flattenChildren }
    }

    case 'paragraph':
      return { type: types.paragraph, children }

    case 'link':
      return { type: types.link, [linkDestinationKey]: node.url, children }

    case 'blockquote':
      return { type: types.block_quote, children }

    case 'code':
      return {
        type: types.code_block,
        language: node.lang,
        children: [{ text: node.value }],
      }

    case 'html':
      if (node.value?.includes('<br>')) {
        return {
          break: true,
          type: types.paragraph,
          children: [{ text: node.value?.replace(/<br>/g, '') || '' }],
        }
      }

      // TODO: Handle other HTML?
      return { type: 'paragraph', children: [{ text: '' }] }

    case 'emphasis':
      return {
        [types.emphasis_mark]: true,
        ...forceLeafNode(children),
        ...persistLeafFormats(children),
      }

    case 'strong':
      return {
        [types.strong_mark]: true,
        ...forceLeafNode(children),
        ...persistLeafFormats(children),
      }

    case 'delete':
      return {
        [types.delete_mark]: true,
        ...forceLeafNode(children),
        ...persistLeafFormats(children),
      }

    case 'text':
    default:
      return { text: node.value || '' }
  }
}

export const unifyAndDeserialize = (markdown?: string): Node[] => {
  // We start by checking if the markdown is undefined
  if (!markdown?.trim()) {
    return EMPTY_STATE
  }

  try {
    const tree = unified().use(remarkParse).use(plugin).processSync(markdown)

    return tree.result as Node[]
  } catch {
    // ...and if it fails we return an empty paragraph Node
    return EMPTY_STATE
  }
}
