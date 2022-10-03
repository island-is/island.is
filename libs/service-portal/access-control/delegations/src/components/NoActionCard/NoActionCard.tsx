import { Box, Text } from '@island.is/island-ui/core'

type NoActionCardProps = {
  title: string
  description?: string
  label?: string
}

export const NoActionCard = ({
  title,
  description,
  label,
}: NoActionCardProps) => (
  <Box
    display="flex"
    flexDirection="column"
    background="blue100"
    rowGap={1}
    paddingX={4}
    paddingY={3}
    borderRadius="standard"
  >
    {label && (
      <Text color="blue400" variant="small" fontWeight="semiBold">
        {label}
      </Text>
    )}
    <Text variant="h3">{title}</Text>
    {description && <Text>{description}</Text>}
  </Box>
)
