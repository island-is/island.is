import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { CopyLink } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import Illustration from '../../assets/Illustration'

export const ListCreated = () => {
  const { formatMessage } = useLocale()

  return (
    <Stack space={3}>
      <Box>
        <Text variant="h3" marginBottom={2}>
          {formatMessage(m.nextSteps)}
        </Text>
        <Text>{formatMessage(m.nextStepsDescription)}</Text>
      </Box>
      <Box>
        <Text variant="h3" marginBottom={2}>
          {formatMessage(m.shareList)}
        </Text>
        <CopyLink linkUrl={'/todo'} buttonTitle={formatMessage(m.copyLink)} />
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        marginTop={5}
        marginBottom={8}
      >
        <Illustration />
      </Box>
    </Stack>
  )
}

export default ListCreated
