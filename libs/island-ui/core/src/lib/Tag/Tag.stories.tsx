import React from 'react'
import { ContentBlock, Box, Inline } from '../..'
import { Tag } from './Tag'

export default {
  title: 'Components/Tag',
  component: Tag,
}

export const Basic = () => (
  <ContentBlock>
    <Box paddingY={[1, 2]}>
      <Inline space={1}>
        <Tag>Ferðagjöf</Tag>
        <Tag>Gifting</Tag>
        <Tag>Fæðingarorlof</Tag>
        <Tag>Skilnaður</Tag>
        <Tag>Færnimat</Tag>
      </Inline>
    </Box>
  </ContentBlock>
)
