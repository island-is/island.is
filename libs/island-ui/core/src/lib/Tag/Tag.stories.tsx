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
        <Tag variant="red" attention>Mikilvægt</Tag>
      </Inline>
    </Box>
  </ContentBlock>
)

export const Bordered = () => (
  <ContentBlock>
    <Box paddingY={[1, 2]}>
      <Inline space={1}>
        <Tag bordered>Ferðagjöf</Tag>
        <Tag variant="darkerBlue" bordered>
          Gifting
        </Tag>
        <Tag variant="darkerMint" bordered>
          Fæðingarorlof
        </Tag>
        <Tag variant="mint" bordered>
          Skilnaður
        </Tag>
        <Tag variant="purple" bordered>
          Færnimat
        </Tag>
        <Tag variant="red" label bordered>
          Færnimat
        </Tag>
        <Tag variant="white" label bordered>
          Færnimat
        </Tag>
        <Tag variant="darkerMint" label bordered attention>
          Mikilvægt
        </Tag>
      </Inline>
    </Box>
  </ContentBlock>
)
