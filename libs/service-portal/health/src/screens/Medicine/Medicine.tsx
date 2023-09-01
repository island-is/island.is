import { useNamespaces } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/portals/core'

const Medicine = () => {
  useNamespaces('sp.health')

  return (
    <Box>
      <IntroHeader title={'title'} intro={'intor'} />
    </Box>
  )
}

export default Medicine
