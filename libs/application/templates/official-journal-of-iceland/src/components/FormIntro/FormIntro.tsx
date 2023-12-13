import { Box, Text } from '@island.is/island-ui/core'

type Props = {
  title?: string
  description?: string
}

export const FormIntro = ({ title, description }: Props) => {
  if (!title && !description) return null

  return (
    <Box marginBottom={6}>
      {title && (
        <Text variant="h2" marginBottom={2}>
          {title}
        </Text>
      )}
      {description && <Text>{description}</Text>}
    </Box>
  )
}
