import { Box, Icon, Text } from '@island.is/island-ui/core'

const ImportantTag = () => {
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
    >
      <Icon color="red400" icon="warning" type="filled" />
      <Box marginX={1}>
        <Text as="span" variant="small" lineHeight="xs">
          {'Áríðandi'}
        </Text>
      </Box>
    </Box>
  )
}

export default ImportantTag
