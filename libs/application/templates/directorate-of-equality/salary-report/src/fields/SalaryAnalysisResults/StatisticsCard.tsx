import { Box, Text } from '@island.is/island-ui/core'

export type StatisticCardProps = {
  title: string
  content: string
  color?: 'blue' | 'purple'
  // Small print under the figure, used for quieter context such as the benchmark.
  subtext?: string
}

export const StatisticCard = ({
  title,
  content,
  color = 'blue',
  subtext,
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
      {subtext && (
        <Text variant="small" color="dark350">
          {subtext}
        </Text>
      )}
    </Box>
  )
}
