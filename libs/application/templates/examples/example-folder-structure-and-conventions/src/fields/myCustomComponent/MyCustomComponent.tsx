import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'

interface Props {
  field: {
    props: {
      someData: Array<string>
    }
  }
}

export const MyCustomComponent = ({ field }: Props & FieldBaseProps) => {
  const { someData } = field.props
  if (!someData) return null

  return (
    <Box>
      <Text>{someData.map((item) => item)}</Text>
    </Box>
  )
}
