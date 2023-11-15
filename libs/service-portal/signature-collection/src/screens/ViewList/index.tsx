import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'

const ViewList = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <IntroHeader
        title={'Vestfirðingafjórðungur'}
        intro={'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
      ></IntroHeader>
    </Box>
  )
}

export default ViewList
