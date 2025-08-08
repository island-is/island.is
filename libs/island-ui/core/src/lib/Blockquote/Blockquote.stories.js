import { Box } from '../Box/Box'
import { Blockquote } from './Blockquote'

export default {
  title: 'Components/Blockquote',
  component: Blockquote,
}

export const Default = {
  render: () => (
    <Box padding={2}>
      <Blockquote>Here is a beautiful blockquote.</Blockquote>
    </Box>
  ),

  name: 'Default',
}
