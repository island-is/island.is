import { Box, Text } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { IntroHeader } from '@island.is/service-portal/core'

const OwnerView = () => {
  useNamespaces('sp.signatureCollectionParliamentary')

  return (
    <Box>
      <IntroHeader
        title={'Title'}
        intro={'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
      />
      <Text>Sælar</Text>
    </Box>
  )
}

export default OwnerView
