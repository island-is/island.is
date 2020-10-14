import { Document, TopLevelBlock, BLOCKS } from '@contentful/rich-text-types'
import * as faker from 'faker'
import { factory } from '../../utils'

export const heading = factory<TopLevelBlock>({
  nodeType: BLOCKS.HEADING_2,
  data: {},
  content: [
    {
      nodeType: 'text',
      value: faker.lorem.words(),
      marks: [],
      data: {},
    },
  ],
})

export const paragraph = factory<TopLevelBlock>({
  nodeType: BLOCKS.PARAGRAPH,
  data: {},
  content: [
    { nodeType: 'text', data: {}, marks: [], value: faker.lorem.paragraph() },
  ],
})

export const wysiwyg = factory<Document>({
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [heading(), ...paragraph.list(3)],
})
