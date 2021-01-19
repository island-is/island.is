import { Box, Tag, TagVariant, Text } from '@island.is/island-ui/core'
import React from 'react'
import BlueBox from '../BlueBox/BlueBox'
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
    <BlueBox>
      <Box marginBottom={1}>
        <Text variant="h4">{title}</Text>
      </Box>
      <Box display="flex" justifyContent="spaceBetween" alignItems="flexEnd">
        <Text>{text}</Text>
        <Tag variant={tagVariant} outlined disabled>
          {tagText}
        </Tag>
      </Box>
    </BlueBox>
  )
}

export default CourtDocument
