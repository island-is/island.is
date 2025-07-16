import { Box } from './Box'

export default {
  title: 'Layout/Box',
  component: Box,
}

export const Default = {
  render: () => (
    <Box
      background={['blue100', 'red200', 'blue100', 'red200']}
      paddingY={1}
      paddingX={1}
    >
      A nice box.
    </Box>
  ),

  name: 'Default',
}
