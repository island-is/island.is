import { Box, ContentBlock, AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { m } from '../../lib/messages'

export const Congratulations = ({
  application,
}: FieldBaseProps): JSX.Element => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={5}>
      <ContentBlock>
        <AlertMessage
          type="success"
          title={formatText(m.congratulationsTitle, application, formatMessage)}
          message={formatText(
            m.congratulationsTitleSuccess,
            application,
            formatMessage,
          )}
        />
      </ContentBlock>
    </Box>
  )
}
