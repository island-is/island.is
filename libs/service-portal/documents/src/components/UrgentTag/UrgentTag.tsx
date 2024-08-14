import { Box, Icon, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'

const UrgentTag = () => {
  const { formatMessage } = useLocale()
  return (
    <Box
      border="standard"
      borderRadius="large"
      borderColor="red200"
      background="red100"
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      padding="smallGutter"
      marginTop="smallGutter"
      marginLeft={2}
    >
      <Icon color="red400" icon="warning" type="filled" />
      <Box marginX={1}>
        <Text as="span" variant="small" lineHeight="xs">
          {formatMessage(m.urgent)}
        </Text>
      </Box>
    </Box>
  )
}

export default UrgentTag
