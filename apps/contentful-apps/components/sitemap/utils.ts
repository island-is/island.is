import { FieldExtensionSDK } from '@contentful/app-sdk'

export enum TreeNodeType {
  ENTRY = 'entry',
  CATEGORY = 'category',
  URL = 'url',
}

export type TreeNode = Tree &
  (
    | {
        type: TreeNodeType.ENTRY
        entryId: string
      }
    | {
        type: TreeNodeType.CATEGORY
        label: string
        slug: string
        description: string
      }
    | {
        type: TreeNodeType.URL
        label: string
        url: string
      }
  )

export type Tree = {
  id: number
  childNodes: TreeNode[]
}

const getHighestId = (tree: Tree) => {
  let highestId = tree.id
  for (const child of tree.childNodes) {
    const highestChildId = getHighestId(child)
    if (highestChildId > highestId) {
      highestId = highestChildId
    }
  }
  return highestId
}

export const generateId = (tree: Tree) => {
  return getHighestId(tree) + 1
}

export const removeNode = async (
  parentNode: Tree,
  idOfNodeToRemove: number,
) => {
  parentNode.childNodes = parentNode.childNodes.filter(
    (node) => node.id !== idOfNodeToRemove,
  )
}

export const addNode = async (
  parentNode: Tree,
  type: TreeNodeType,
  sdk: FieldExtensionSDK,
  root: Tree,
) => {
  let entryId = ''

  let label = ''
  let slug = ''
  let description = ''

  let url = ''

  if (type === TreeNodeType.ENTRY) {
    const entry = await sdk.dialogs.selectSingleEntry<{
      sys: { id: string }
    } | null>({
      contentTypes: ['organizationSubpage'],
    })
    if (!entry?.sys?.id) {
      return
    }

    const parentIsEntry =
      'type' in parentNode && parentNode.type === TreeNodeType.ENTRY

    if (
      parentIsEntry &&
      'entryId' in parentNode &&
      entry.sys.id === parentNode.entryId
    ) {
      sdk.dialogs.openAlert({
        title: 'Invalid entry selected',
        message: 'You can not place the same page below itself!',
      })
      return
    }

    entryId = entry.sys.id
  } else if (type === TreeNodeType.CATEGORY) {
    const data = await sdk.dialogs.openCurrentApp({
      parameters: {
        type: TreeNodeType.CATEGORY,
      },
      minHeight: '400px',
    })

    if (!data) {
      return
    }

    label = data.label
    slug = data.slug
    description = data.description
  } else if (type === TreeNodeType.URL) {
    const labelPrompt = await sdk.dialogs.openPrompt({
      title: 'URL',
      message: 'Label',
    })

    if (!labelPrompt || typeof labelPrompt !== 'string') {
      return
    }
    label = labelPrompt

    const urlPrompt = await sdk.dialogs.openPrompt({
      title: 'URL',
      message: 'HREF',
    })

    if (!urlPrompt || typeof urlPrompt !== 'string') {
      return
    }
    url = urlPrompt
  }

  const node: TreeNode = {
    childNodes: [],
    id: generateId(root),
    ...(type === TreeNodeType.ENTRY
      ? { type: TreeNodeType.ENTRY, entryId }
      : type === TreeNodeType.CATEGORY
      ? {
          type: TreeNodeType.CATEGORY,
          label,
          slug,
          description,
        }
      : {
          type: TreeNodeType.URL,
          label,
          url,
        }),
  }
  parentNode.childNodes = [...parentNode.childNodes].concat(node)
}
