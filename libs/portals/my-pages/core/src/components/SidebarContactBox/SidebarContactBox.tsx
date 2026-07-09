import { Box, Icon, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export const SidebarContactBox = () => {
  const { formatMessage } = useLocale()

  return (
    <Box
      borderRadius="large"
      background="purple100"
      padding={3}
      marginTop={[0, 0, 3]}
    >
      <Box display="flex" alignItems="center" marginBottom={1} columnGap={2}>
        <Icon icon="mail" type="outline" color="purple400" />
        <Text variant="h4" color="purple400">
          {formatMessage(m.sidebarContactBoxTitle)}
        </Text>
      </Box>
      <Text variant="default" color="dark400">
        {formatMessage(m.sidebarContactBoxBody)}
      </Text>
    </Box>
  )
}

export default SidebarContactBox
