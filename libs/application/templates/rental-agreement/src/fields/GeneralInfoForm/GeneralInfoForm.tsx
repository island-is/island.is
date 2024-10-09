import { Box, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { prerequisites } from '../../lib/messages'

const GeneralInfoForm = () => {
  const { formatMessage } = useIntl()

  return (
    <Box>
      <Text variant="intro" marginBottom={2}>
        {formatMessage(prerequisites.intro.subTitle)}
      </Text>
    </Box>
  )
}
export default GeneralInfoForm
