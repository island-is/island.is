import { Box, Text } from '@island.is/island-ui/core'

interface AccessListItemProps {
  name: string
  description?: string | null
  validTo?: string
}

export const AccessListItem = ({
  name,
  description,
  validTo,
}: AccessListItemProps) => {
  return (
    <Box display="flex" alignItems="flexStart">
      <Text>{name}</Text>
      {description && <Text>{description}</Text>}
      {validTo && <Text>{validTo}</Text>}
    </Box>
  )
}
