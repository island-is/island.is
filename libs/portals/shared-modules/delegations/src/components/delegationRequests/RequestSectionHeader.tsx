import { Box, Icon, Text } from '@island.is/island-ui/core'

export const RequestSectionHeader = ({
  direction,
  title,
  subtitle,
}: {
  direction: 'incoming' | 'outgoing'
  title: string
  subtitle: string
}) => {
  const color = direction === 'incoming' ? 'purple400' : 'blue400'
  const background = direction === 'incoming' ? 'purple100' : 'blue100'

  return (
    <Box display="flex" flexDirection="column" rowGap={1} marginBottom={2}>
      <Box display="flex" alignItems="center" columnGap={1}>
        <Box
          borderRadius="large"
          background={background}
          padding={1}
          display="flex"
          alignItems="center"
        >
          <Icon size="small" color={color} type="outline" icon="person" />
          <Icon
            size="small"
            color={color}
            icon={direction === 'incoming' ? 'arrowBack' : 'arrowForward'}
          />
        </Box>
        <Text variant="h4">{title}</Text>
      </Box>
      <Text variant="default">{subtitle}</Text>
    </Box>
  )
}
