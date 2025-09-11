import { EntryProps } from 'contentful-management'
import { FieldExtensionSDK } from '@contentful/app-sdk'

import {
  SitemapTree as Tree,
  SitemapTreeNode as TreeNode,
  SitemapTreeNodeType as TreeNodeType,
  SitemapUrlType,
} from '@island.is/shared/types'

export { type Tree, type TreeNode, TreeNodeType }

export type EntryType = 'organizationParentSubpage' | 'organizationSubpage'

export const ENTRY_CONTENT_TYPE_IDS: EntryType[] = [
  'organizationParentSubpage',
  'organizationSubpage',
]

export const optionMap = {
  [TreeNodeType.CATEGORY]: 'Category',
  [TreeNodeType.ENTRY]: 'Page',
  [TreeNodeType.URL]: 'Link',
}

export const URL_DIALOG_MIN_HEIGHT = 520
export const CATEGORY_DIALOG_MIN_HEIGHT = 700

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
  root: Tree,
) => {
  const node = findNode(parentNode, (node) => node.id === idOfNodeToRemove)

  if (!node) {
    return
  }

  parentNode.childNodes = parentNode.childNodes.filter(
    (node) => node.id !== idOfNodeToRemove,
  )

  if (node.type === TreeNodeType.ENTRY && node.primaryLocation) {
    const otherNodesWithSameEntryId = findNodes(
      root,
      (otherNode) =>
        otherNode.id !== idOfNodeToRemove &&
        otherNode.type === TreeNodeType.ENTRY &&
        otherNode.entryId === node.entryId,
    )

    if (otherNodesWithSameEntryId.length > 0) {
      for (const otherNode of otherNodesWithSameEntryId) {
        if (otherNode.type === TreeNodeType.ENTRY) {
          otherNode.primaryLocation = true
          return
        }
      }
    }
  }
}

const findNodeRecursive = (
  node: TreeNode,
  condition: (otherNode: TreeNode) => boolean,
): TreeNode => {
  if (condition(node)) {
    return node
  }
  for (const child of node.childNodes) {
    const nodeInChildTree = findNodeRecursive(child, condition)
    if (nodeInChildTree) return nodeInChildTree
  }
  return null
}

export const findNode = (
  root: Tree,
  condition: (otherNode: TreeNode) => boolean,
) => {
  for (const child of root.childNodes) {
    const node = findNodeRecursive(child, condition)
    if (node) return node
  }
  return null
}

const findNodesRecursive = (
  node: TreeNode,
  condition: (otherNode: TreeNode) => boolean,
) => {
  const nodes: TreeNode[] = []
  if (condition(node)) {
    nodes.push(node)
  }
  for (const child of node.childNodes) {
    for (const childNode of findNodesRecursive(child, condition)) {
      nodes.push(childNode)
    }
  }
  return nodes
}

export const findNodes = (
  root: Tree,
  condition: (otherNode: TreeNode) => boolean,
) => {
  const nodes: TreeNode[] = []
  for (const child of root.childNodes) {
    for (const node of findNodesRecursive(child, condition)) {
      nodes.push(node)
    }
  }
  return nodes
}

export const addNode = async (
  parentNode: Tree,
  type: TreeNodeType,
  sdk: FieldExtensionSDK,
  root: Tree,
  createNew: boolean,
  entryType: EntryType = 'organizationParentSubpage',
  entries: Record<string, EntryProps>,
) => {
  let entryId = ''

  let label = ''
  let labelEN = ''
  let slug = ''
  let slugEN = ''
  let description = ''
  let descriptionEN = ''
  let url = ''
  let urlEN = ''
  let urlType: SitemapUrlType = 'custom'
  let chosenEntryType = entryType

  if (type === TreeNodeType.ENTRY) {
    if (createNew) {
      const entry = await sdk.navigator.openNewEntry(entryType, {
        slideIn: { waitForClose: true },
      })
      if (!entry?.entity?.sys?.id) {
        return
      }
      entryId = entry.entity.sys.id
    } else {
      const entry = await sdk.dialogs.selectSingleEntry<{
        sys: { id: string; contentType: { sys: { id: string } } }
      } | null>({
        contentTypes: ENTRY_CONTENT_TYPE_IDS,
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
      chosenEntryType = entry.sys.contentType.sys.id as EntryType
    }
  } else if (type === TreeNodeType.CATEGORY) {
    const otherCategoriesAndEntryNodes = parentNode.childNodes.filter(
      (child) =>
        child.type === TreeNodeType.CATEGORY ||
        child.type === TreeNodeType.ENTRY,
    )

    const otherSlugs = otherCategoriesAndEntryNodes
      .map((child) =>
        child.type === TreeNodeType.CATEGORY
          ? child.slug
          : child.type === TreeNodeType.ENTRY
          ? entries[child.entryId]?.fields?.slug?.['is-IS']
          : '',
      )
      .filter(Boolean)

    const otherSlugsEN = otherCategoriesAndEntryNodes
      .map((child) =>
        child.type === TreeNodeType.CATEGORY
          ? child.slugEN
          : child.type === TreeNodeType.ENTRY
          ? entries[child.entryId]?.fields?.slug?.['en']
          : '',
      )
      .filter(Boolean)

    const data = await sdk.dialogs.openCurrentApp({
      parameters: {
        node: {
          type: TreeNodeType.CATEGORY,
          label: '',
          description: '',
          slug: '',
          labelEN: '',
          slugEN: '',
          descriptionEN: '',
        },
        otherSlugs,
        otherSlugsEN,
      },
      minHeight: CATEGORY_DIALOG_MIN_HEIGHT,
    })

    if (!data) {
      return
    }

    label = data.label
    labelEN = data.labelEN
    slug = data.slug
    slugEN = data.slugEN
    description = data.description
    descriptionEN = data.descriptionEN
  } else if (type === TreeNodeType.URL) {
    const data = await sdk.dialogs.openCurrentApp({
      parameters: {
        node: {
          type: TreeNodeType.URL,
          url: '',
        },
      },
      minHeight: URL_DIALOG_MIN_HEIGHT,
    })

    if (!data) {
      return
    }

    label = data.label
    labelEN = data.labelEN
    url = data.url
    urlEN = data.urlEN
    urlType = data.urlType
  }

  const node: TreeNode = {
    childNodes: [],
    id: generateId(root),
    ...(type === TreeNodeType.ENTRY
      ? {
          type: TreeNodeType.ENTRY,
          entryId,
          contentType: chosenEntryType,
          // It's the primary location if the same entry isn't already present in the sitemap
          primaryLocation: !findNode(
            root,
            (otherNode) =>
              otherNode.type === TreeNodeType.ENTRY &&
              otherNode.entryId === entryId,
          ),
        }
      : type === TreeNodeType.CATEGORY
      ? {
          type: TreeNodeType.CATEGORY,
          label,
          labelEN,
          slug,
          slugEN,
          description,
          descriptionEN,
          status: 'draft',
        }
      : {
          type: TreeNodeType.URL,
          label,
          labelEN,
          url,
          urlEN,
          urlType,
          status: 'draft',
        }),
  }
  parentNode.childNodes = [...parentNode.childNodes].concat(node)
}

export const updateNode = (parentNode: Tree, updatedNode: TreeNode) => {
  const nodeIndex = parentNode.childNodes.findIndex(
    (node) => node.id === updatedNode.id,
  )
  if (nodeIndex >= 0) {
    parentNode.childNodes[nodeIndex] = updatedNode
  }
}

export const findEntryNodePaths = (
  root: Tree,
  entryId: string,
  entries: Record<string, EntryProps>,
  language: 'is-IS' | 'en' = 'is-IS',
) => {
  const nodePaths: { node: TreeNode; path: string[] }[] = []

  // DFS down until we find a node with the entryId and keep track of the path
  const findEntryNodePathsRecursive = (
    node: TreeNode,
    currentPath: string[],
  ) => {
    if (node.type === TreeNodeType.ENTRY && node.entryId === entryId) {
      nodePaths.push({
        node,
        path: [
          ...currentPath,
          entries[entryId]?.fields?.title?.[language] ?? '',
        ],
      })
      return
    }

    if (node.type === TreeNodeType.CATEGORY) {
      for (const child of node.childNodes) {
        findEntryNodePathsRecursive(child, [
          ...currentPath,
          language === 'is-IS' ? node.label : node.labelEN,
        ])
      }
    }
  }

  for (const child of root.childNodes) {
    findEntryNodePathsRecursive(child, [])
  }

  return nodePaths
}

export const extractNodeContent = (
  node: TreeNode,
  language: 'is-IS' | 'en',
  entries: Record<string, EntryProps>,
) => {
  const label: string =
    node.type !== TreeNodeType.ENTRY
      ? language === 'en'
        ? node.labelEN
        : node.label
      : entries[node.entryId]?.fields?.shortTitle?.[language] ||
        entries[node.entryId]?.fields?.title?.[language] ||
        ''
  const slug =
    node.type === TreeNodeType.CATEGORY
      ? language === 'en'
        ? node.slugEN
        : node.slug
      : node.type === TreeNodeType.URL
      ? language === 'en'
        ? node.urlEN
        : node.url
      : entries[node.entryId]?.fields?.slug?.[language] || ''
  const entryContentType =
    node.type === TreeNodeType.ENTRY
      ? entries[node.entryId]?.sys?.contentType?.sys?.id ?? node.contentType
      : ''

  return { label, slug, entryContentType }
}

export const findParentNode = (root: Tree, nodeId: number) => {
  for (const child of root.childNodes) {
    if (child.id === nodeId) {
      return root
    }
    const parent = findParentNode(child, nodeId)
    if (parent) return parent
  }
  return null
}
