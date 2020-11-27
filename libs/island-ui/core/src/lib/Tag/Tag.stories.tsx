import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { ContentBlock } from '../ContentBlock/ContentBlock'
import { Box } from '../Box/Box'
import { Inline } from '../Inline/Inline'
import { Tag } from './Tag'

export default {
  title: 'Components/Tag',
  component: Tag,
  parameters: withFigma({
    desktop:
      'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=49%3A285',
    mobile:
      'https://www.figma.com/file/rU3mPM1cLfHa3u7TWuutPQ/UI-Library-%E2%80%93-%F0%9F%93%B1Mobile?node-id=30%3A1',
  }),
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
        <Tag variant="red">Færnimat</Tag>
        <Tag variant="white">Færnimat</Tag>
        <Tag variant="rose">Færnimat</Tag>
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
        <Tag variant="darkerMint" outlined>
          Fæðingarorlof
        </Tag>
        <Tag variant="mint" outlined>
          Skilnaður
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
        <Tag variant="darkerMint" outlined attention>
          Mikilvægt
        </Tag>
      </Inline>
    </Box>
  </ContentBlock>
)
