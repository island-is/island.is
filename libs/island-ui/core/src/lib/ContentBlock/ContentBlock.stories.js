import { Box } from '../Box/Box'
import { ContentBlock } from './ContentBlock'

export default {
  title: 'Layout/ContentBlock',
  component: ContentBlock,
}

export const Default = {
  render: () => (
    <ContentBlock>
      <Box background="blue200">Content</Box>
    </ContentBlock>
  ),

  name: 'Default',
}
