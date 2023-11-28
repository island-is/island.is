import { Box, ContentBlock } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Markdown } from '@island.is/shared/components'

export const FinalStep = (): JSX.Element => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingTop={2}>
      <Box marginTop={2} marginBottom={5}>
        <ContentBlock>
          <Markdown>{formatMessage(m.beforeSubmitStatement)}</Markdown>
        </ContentBlock>
      </Box>
    </Box>
  )
}

export default FinalStep
