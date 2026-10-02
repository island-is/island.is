import type { ReactNode } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import type { ScreenIntrospection } from '../../types/translationWorkspace'
import type { ResolvePreviewString } from '../../types/translationWorkspace'
import { previewStringUsesMarkdown } from './translationWorkspaceFieldPreviewUtils'

export const TextDisplayPreviewNodes = ({
  screen,
  resolvePreviewString,
}: {
  screen: ScreenIntrospection
  resolvePreviewString: ResolvePreviewString
}): ReactNode => {
  if (screen.messageDescriptors.length > 0) {
    const resolvedParts = screen.messageDescriptors
      .map((d) => ({
        id: d.id,
        text: resolvePreviewString(d.id, d.defaultMessage).trim(),
      }))
      .filter((p) => p.text.length > 0)

    if (resolvedParts.length > 0) {
      return (
        <Box>
          {resolvedParts.map((p, i) =>
            previewStringUsesMarkdown(screen.type, p.id) ? (
              <Box key={p.id} marginTop={i > 0 ? 2 : 0}>
                <Markdown>{p.text}</Markdown>
              </Box>
            ) : (
              <Text
                key={p.id}
                as="div"
                whiteSpace="preLine"
                marginTop={i > 0 ? 2 : 0}
              >
                {p.text}
              </Text>
            ),
          )}
        </Box>
      )
    }
  }
  const fallback = screen.title ?? screen.description ?? screen.id
  return (
    <Text as="div" whiteSpace="preLine">
      {fallback}
    </Text>
  )
}
