import { ReactNode, useCallback, useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  Button,
  EntryCard,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Spinner,
  TextInput,
} from '@contentful/f36-components'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  MoreVerticalIcon,
} from '@contentful/f36-icons'
import { JsonEditor } from '@contentful/field-editor-json'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

enum TreeNodeType {
  ENTRY = 'entry',
  CATEGORY = 'category',
  URL = 'url',
}

type TreeNode = Tree &
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

type Tree = {
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

const generateId = (tree: Tree) => {
  return getHighestId(tree) + 1
}

interface AddNodeButtonProps {
  addNode: (type: TreeNodeType) => void
}

const AddNodeButton = ({ addNode }: AddNodeButtonProps) => {
  return (
    <Menu>
      <Menu.Trigger>
        <Button startIcon={<PlusIcon />} endIcon={<ChevronDownIcon />}>
          Add
        </Button>
      </Menu.Trigger>
      <Menu.List>
        <Menu.Item
          onClick={async () => {
            addNode(TreeNodeType.CATEGORY)
          }}
        >
          Category
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            addNode(TreeNodeType.ENTRY)
          }}
        >
          Page
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            addNode(TreeNodeType.URL)
          }}
        >
          URL
        </Menu.Item>
      </Menu.List>
    </Menu>
  )
}

interface EditMenuProps {
  onEdit: () => void
  onRemove: () => void
}

const EditMenu = ({ onEdit, onRemove }: EditMenuProps) => {
  return (
    <Menu>
      <Menu.Trigger>
        <IconButton icon={<MoreVerticalIcon />} aria-label="Edit" />
      </Menu.Trigger>
      <Menu.List>
        <Menu.Item onClick={onEdit}>Edit</Menu.Item>
        <Menu.Item onClick={onRemove}>Remove</Menu.Item>
      </Menu.List>
    </Menu>
  )
}

export const SitemapNode = ({
  node,
  parentNode,
  indent = 0,
  addNode,
  removeNode,
}: {
  node: TreeNode
  parentNode: Tree
  indent?: number
  addNode: (parentNode: Tree, type: TreeNodeType) => void
  removeNode: (parentNode: Tree, idOfNodeToRemove: number) => void
}) => {
  const cma = useCMA()
  const sdk = useSDK<FieldExtensionSDK>()

  const [showChildNodes, setShowChildNodes] = useState(false)

  const [entries, setEntries] = useState<
    {
      id: string
      label: string
      slug: string
    }[]
  >([])

  useEffect(() => {
    if (!showChildNodes) {
      return
    }

    const entryNodes = node.childNodes.filter(
      (node) => node.type === TreeNodeType.ENTRY,
    )

    if (entryNodes.length === 0) {
      return
    }

    const fetchEntries = async () => {
      // TODO: chunk down request
      const response = await cma.entry.getMany({
        query: {
          content_type: 'organizationSubpage',
          include: 1,
          limit: 1000,
          'sys.id[in]': entryNodes
            .filter((node) => Boolean(node.entryId))
            .map((node) => node.entryId)
            .join(','),
        },
      })

      // TODO: fetch more if there is more
      setEntries(
        response.items.map((entry) => ({
          id: entry.sys.id as string,
          label: entry.fields.title[sdk.field.locale] as string,
          slug: entry.fields.slug[sdk.field.locale] as string,
        })),
      )
    }

    fetchEntries()
  }, [cma.entry, node.childNodes, sdk.field.locale, showChildNodes])

  const label: string | ReactNode =
    node.type !== TreeNodeType.ENTRY
      ? node.label
      : entries.find((entry) => entry.id === node.entryId)?.label || '...'
  const slug =
    node.type === TreeNodeType.CATEGORY
      ? node.slug
      : node.type === TreeNodeType.URL
      ? node.url
      : entries.find((entry) => entry.id === node.entryId)?.slug || '...'

  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'column nowrap',
        gap: '8px',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          border: '1px solid black',
          padding: '4px',
          cursor: node.type !== TreeNodeType.URL ? 'cursor' : undefined,
          display: 'flex',
          flexFlow: 'row nowrap',
          justifyContent: 'space-between',
        }}
      >
        <div
          onClick={() => {
            if (node.type !== TreeNodeType.URL) {
              setShowChildNodes((prev) => !prev)
            }
          }}
          style={{
            display: 'flex',
            flexFlow: 'row nowrap',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              visibility: node.type === TreeNodeType.URL ? 'hidden' : 'visible',
            }}
          >
            {showChildNodes ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </div>

          <div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{label}</div>
            <div>{slug}</div>
          </div>
        </div>
        <div>
          <EditMenu
            onEdit={() => {
              console.log('EDIT')
            }}
            onRemove={async () => {
              const confirmed = await sdk.dialogs.openConfirm({
                title: 'Are you sure?',
                message: `"${label}" and everything below it will be removed from the sitemap`,
              })
              if (!confirmed) {
                return
              }
              removeNode(parentNode, node.id)
            }}
          />
        </div>
      </div>
      {showChildNodes && (
        <div
          style={{
            display: 'flex',
            flexFlow: 'column nowrap',
            gap: '8px',
            paddingLeft: `${(indent + 1) * 16}px`,
          }}
        >
          {node.childNodes.map((child) => (
            <SitemapNode
              addNode={addNode}
              parentNode={node}
              removeNode={removeNode}
              key={child.id}
              node={child}
              indent={indent + 1}
            />
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              border: '1px dashed black',
              padding: '4px',
            }}
          >
            <AddNodeButton
              addNode={(type) => {
                addNode(node, type)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

const SitemapTreeField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [tree, setTree] = useState<Tree | undefined>(
    sdk.field.getValue() || {
      id: 0,
      type: 'entry',
      entryId: '',
      childNodes: [],
    },
  )

  useDebounce(
    () => {
      sdk.field.setValue(tree)
    },
    100,
    [tree],
  )

  useEffect(() => {
    sdk.window.startAutoResizer()
    return sdk.window.stopAutoResizer
  }, [sdk.window])

  const addNode = useCallback(
    async (parentNode: Tree, type: TreeNodeType) => {
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
        entryId = entry.sys.id
      } else if (type === TreeNodeType.CATEGORY) {
        const labelPrompt = await sdk.dialogs.openPrompt({
          title: 'Category',
          message: 'Label',
        })

        if (!labelPrompt || typeof labelPrompt !== 'string') {
          return
        }
        label = labelPrompt
        const slugPrompt = await sdk.dialogs.openPrompt({
          title: 'Category',
          message: 'Slug',
        })
        if (!slugPrompt || typeof slugPrompt !== 'string') {
          return
        }
        slug = slugPrompt
        const descriptionPrompt = await sdk.dialogs.openPrompt({
          title: 'Category',
          message: 'Description',
        })
        if (
          typeof descriptionPrompt === 'string' &&
          Boolean(descriptionPrompt)
        ) {
          description = descriptionPrompt
        }
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
        id: generateId(tree),
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
      setTree((prevTree) => ({
        ...prevTree,
      }))
    },
    [sdk.dialogs, tree],
  )

  const removeNode = useCallback(
    (parentNode: Tree, idOfNodeToRemove: number) => {
      parentNode.childNodes = parentNode.childNodes.filter(
        (node) => node.id !== idOfNodeToRemove,
      )
      setTree((prevTree) => ({ ...prevTree }))
    },
    [],
  )

  return (
    <div>
      <div style={{ paddingBottom: '16px' }}>
        <Button
          onClick={() => {
            setTree({
              id: 0,
              childNodes: [],
            })
          }}
        >
          Reset
        </Button>
      </div>

      <div>
        <div
          style={{
            display: 'flex',
            flexFlow: 'column nowrap',
            gap: '12px',
          }}
        >
          {tree.childNodes.map((node) => (
            <SitemapNode
              parentNode={tree}
              removeNode={removeNode}
              addNode={addNode}
              key={node.id}
              node={node}
            />
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              border: '1px dashed black',
              padding: '4px',
            }}
          >
            <AddNodeButton
              addNode={(type) => {
                addNode(tree, type)
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ paddingTop: '16px' }}>
        <JsonEditor field={sdk.field} isInitiallyDisabled={false} />
      </div>
    </div>
  )
}

export default SitemapTreeField
