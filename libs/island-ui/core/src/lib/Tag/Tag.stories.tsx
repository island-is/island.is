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
        <Tag variant="darkerBlue">Gifting</Tag>
        <Tag variant="darkerMint">Fæðingarorlof</Tag>
        <Tag variant="mint">Skilnaður</Tag>
        <Tag variant="purple">Færnimat</Tag>
        <Tag variant="red" label>
          Færnimat
        </Tag>
        <Tag variant="white" label>
          Færnimat
        </Tag>
      </Inline>
    </Box>
  </ContentBlock>
)
