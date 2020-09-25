import { Box, Tag, TagVariant, Typography } from '@island.is/island-ui/core'
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
          <Typography variant="h4">{title}</Typography>
        </Box>
        <Tag variant={tagVariant} label>
          {tagText}
        </Tag>
      </Box>
      <Typography>{text}</Typography>
    </div>
  )
}

export default CourtDocument
