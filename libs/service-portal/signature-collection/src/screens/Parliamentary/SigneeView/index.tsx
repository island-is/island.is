import { Box, Text } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'

const SigneeView = () => {
  useNamespaces('sp.signatureCollectionParliamentary')

  return (
    <Box>
      <Text>Hello Signee</Text>
    </Box>
  )
}

export default SigneeView
