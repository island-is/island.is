import { Box } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { SubmissionUrls } from './SubmissionUrls'
import { Text } from '@island.is/island-ui/core'

export const Urls = () => {
  const { formatMessage } = useIntl()

  return (
    <>
      <Box display="flex" justifyContent="flexStart">
        <Text variant="h3">{formatMessage(m.submitUrls)}</Text>
      </Box>
      <SubmissionUrls />
    </>
  )
}
