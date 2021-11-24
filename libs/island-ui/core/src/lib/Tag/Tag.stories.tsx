import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { ContentBlock } from '../ContentBlock/ContentBlock'
import { Box } from '../Box/Box'
import { Inline } from '../Inline/Inline'
import { Tag } from './Tag'

export default {
  title: 'Components/Tag',
  component: Tag,
  parameters: withFigma('Tag'),
}

export const Basic = () => (
  <ContentBlock>
    <Box paddingY={[1, 2]}>
      <Inline space={1}>
        <Tag>Ferðagjöf</Tag>
        <Tag variant="darkerBlue">Gifting</Tag>
        <Tag variant="blueberry">Fæðingarorlof</Tag>
        <Tag variant="purple">Færnimat</Tag>
        <Tag variant="red">Færnimat</Tag>
        <Tag variant="white">Færnimat</Tag>
        <Tag variant="rose">Færnimat</Tag>
        <Tag variant="dark">Færnimat</Tag>
        <Tag variant="red" attention>
          Mikilvægt
        </Tag>
      </Inline>
    </Box>
  </ContentBlock>
)

export const outlined = () => (
  <ContentBlock>
    <Box paddingY={[1, 2]}>
      <Inline space={1}>
        <Tag outlined>Ferðagjöf</Tag>
        <Tag variant="darkerBlue" outlined>
          Gifting
        </Tag>
        <Tag variant="purple" outlined>
          Færnimat
        </Tag>
        <Tag variant="red" outlined>
          Færnimat
        </Tag>
        <Tag variant="white" outlined>
          Færnimat
        </Tag>
        <Tag variant="rose" outlined>
          Færnimat
        </Tag>
        <Tag variant="dark" outlined>
          Færnimat
        </Tag>
        <Tag variant="blueberry" outlined attention>
          Mikilvægt
        </Tag>
      </Inline>
    </Box>
  </ContentBlock>
)
