import { ReactNode, useContext } from 'react'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Stack, Text } from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

import { EntryContext } from './entryContext'
import { TreeNode, TreeNodeType } from './utils'

interface SitemapNodeContentProps {
  node: TreeNode
}

export const SitemapNodeContent = ({ node }: SitemapNodeContentProps) => {
  const { entries } = useContext(EntryContext)
  const sdk = useSDK<FieldExtensionSDK>()

  const label: string | ReactNode =
    node.type !== TreeNodeType.ENTRY
      ? node.label
      : entries[node.entryId]?.fields?.title?.[sdk.field.locale] || '...'
  const slug =
    node.type === TreeNodeType.CATEGORY
      ? node.slug
      : node.type === TreeNodeType.URL
      ? node.url
      : entries[node.entryId]?.fields?.slug?.[sdk.field.locale] || '...'

  return (
    <Stack flexDirection="column" spacing="none" alignItems="flex-start">
      <Text fontSize="fontSizeL" fontWeight="fontWeightMedium">
        {label}
      </Text>
      <Text fontSize="fontSizeM">{slug}</Text>
    </Stack>
  )
}
