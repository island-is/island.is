import { Tiles } from './Tiles'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'

export default {
  title: 'Layout/Tiles',
  component: Tiles,
}

export const Default = {
  render: () => (
    <Tiles space={2} columns={[1, 2]}>
      <Box background="blue200" padding={1}>
        <Text>Box and text inside the tiles component.</Text>
      </Box>
    </Tiles>
  ),

  name: 'Default',
}
