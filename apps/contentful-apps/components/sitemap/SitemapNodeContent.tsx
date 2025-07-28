import { ReactNode, useContext } from 'react'
import { Stack, Text } from '@contentful/f36-components'

import { EntryContext } from './entryContext'
import { TreeNode, TreeNodeType } from './utils'

interface SitemapNodeContentProps {
  node: TreeNode
  language: 'is-IS' | 'en'
}

export const SitemapNodeContent = ({
  node,
  language,
}: SitemapNodeContentProps) => {
  const { entries } = useContext(EntryContext)

  const label: string | ReactNode =
    node.type !== TreeNodeType.ENTRY
      ? language === 'en'
        ? node.labelEN
        : node.label
      : entries[node.entryId]?.fields?.title?.[language] || '...'
  const slug =
    node.type === TreeNodeType.CATEGORY
      ? language === 'en'
        ? node.slugEN
        : node.slug
      : node.type === TreeNodeType.URL
      ? language === 'en'
        ? node.urlEN
        : node.url
      : entries[node.entryId]?.fields?.slug?.[language] || '...'

  return (
    <Stack flexDirection="column" spacing="none" alignItems="flex-start">
      <Text fontSize="fontSizeL" fontWeight="fontWeightMedium">
        {label}
      </Text>
      <Text fontSize="fontSizeM">{slug}</Text>
    </Stack>
  )
}
