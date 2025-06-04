import { Text, Box } from '@island.is/island-ui/core'
import EmptyImageSmall from './EmptyImgSmall'

export const EmptyState = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <Box display="flex">
      <EmptyImageSmall style={{ maxHeight: 229 }} />
      <Box marginLeft="containerGutter">
        <Text marginBottom={1} variant="h3">
          {title}
        </Text>
        <Text>{description}</Text>
      </Box>
    </Box>
  )
}

export default EmptyState
