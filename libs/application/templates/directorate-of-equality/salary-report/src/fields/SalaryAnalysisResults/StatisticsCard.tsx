import { Box, Text } from '@island.is/island-ui/core'

type StatisticCardProps = {
  title: string
  content: string
  color?: 'blue' | 'purple'
}

export const StatisticCard = ({
  title,
  content,
  color = 'blue',
}: StatisticCardProps) => {
  const background = color === 'blue' ? 'blue100' : 'purple100'

  return (
    <Box
      background={background}
      borderRadius="large"
      padding={[3]}
      flexGrow={1}
      flexShrink={1}
      style={{ flexBasis: 0 }}
    >
      <Text variant="eyebrow">{title}</Text>
      <Text
        variant="h2"
        as="p"
        color={color === 'blue' ? 'blue400' : 'purple400'}
      >
        {content}
      </Text>
    </Box>
  )
}
