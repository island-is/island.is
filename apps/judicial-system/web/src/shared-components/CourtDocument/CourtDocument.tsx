import { Box, Tag, TagVariant, Text } from '@island.is/island-ui/core'
import React from 'react'

import * as styles from './CourtDocument.treat'

interface CourtDocumentProps {
  title: string
  text: string
  tagText: string
  tagVariant: TagVariant
}

const CourtDocument: React.FC<CourtDocumentProps> = ({
  title,
  text,
  tagText,
  tagVariant,
}: CourtDocumentProps) => {
  return (
    <div className={styles.container}>
      <Box display="flex" justifyContent="spaceBetween">
        <Box marginBottom={1}>
          <Text variant="h4">{title}</Text>
        </Box>
        <Tag variant={tagVariant} label>
          {tagText}
        </Tag>
      </Box>
      <Text>{text}</Text>
    </div>
  )
}

export default CourtDocument
