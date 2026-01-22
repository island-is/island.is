import { useContext } from 'react'
import { Stack, Text } from '@contentful/f36-components'

import { EntryContext } from './entryContext'
import { extractNodeContent, TreeNode } from './utils'

interface SitemapNodeContentProps {
  node: TreeNode
  language: 'is-IS' | 'en'
}

export const SitemapNodeContent = ({
  node,
  language,
}: SitemapNodeContentProps) => {
  const { entries } = useContext(EntryContext)

  const { label, slug } = extractNodeContent(node, language, entries)

  return (
    <Stack flexDirection="column" spacing="none" alignItems="flex-start">
      <Text fontSize="fontSizeL" fontWeight="fontWeightMedium">
        {label}
      </Text>
      <Text fontSize="fontSizeM">{slug}</Text>
    </Stack>
  )
}
