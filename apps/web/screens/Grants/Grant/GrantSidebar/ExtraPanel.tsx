import React, { useMemo } from 'react'

import { Box, Button, LinkV2, Stack } from '@island.is/island-ui/core'
import { isDefined } from '@island.is/shared/utils'
import { Grant } from '@island.is/web/graphql/schema'

interface ExtraPanelProps {
  grant: Grant
}

const ExtraPanel: React.FC<ExtraPanelProps> = ({ grant }) => {
  const supportLinksPanelData = useMemo(
    () =>
      grant.supportLinks
        ?.map((link) => {
          if (!link.url || !link.text || !link.id) {
            return null
          }
          return (
            <LinkV2
              newTab
              key={link.id}
              href={link.url}
              underlineVisibility="hover"
            >
              <Button
                icon="link"
                iconType="outline"
                variant="text"
                size="small"
                as="span"
              >
                {link.text}
              </Button>
            </LinkV2>
          )
        })
        .filter(isDefined) ?? [],
    [grant.supportLinks],
  )

  const filesPanelData = useMemo(
    () =>
      grant.files
        ?.map((f, index) => {
          if (!f.url) {
            return null
          }
          return (
            <LinkV2
              key={`${f.url}-${index}`}
              newTab
              href={f.url}
              underlineVisibility="hover"
            >
              <Button
                icon="download"
                iconType="outline"
                variant="text"
                size="small"
                as="span"
              >
                {f.title}
              </Button>
            </LinkV2>
          )
        })
        .concat(supportLinksPanelData)
        .filter(isDefined) ?? [],
    [grant.files, supportLinksPanelData],
  )

  return filesPanelData.length > 0 ? (
    <Box
      background={'red100'}
      padding={3}
      borderRadius="large"
      marginBottom={3}
    >
      <Stack space={2}>{filesPanelData}</Stack>
    </Box>
  ) : null
}

export default ExtraPanel
