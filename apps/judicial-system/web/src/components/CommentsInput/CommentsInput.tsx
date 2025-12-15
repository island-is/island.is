import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Box, Input, Text, Tooltip } from '@island.is/island-ui/core'
import { commentsInput as strings } from '@island.is/judicial-system-web/messages/Core/commentsInput'

import { useDebouncedInput } from '../../utils/hooks'

const CommentsInput: FC = () => {
  const { formatMessage } = useIntl()
  const commentsInput = useDebouncedInput('comments', [])

  return (
    <>
      <Box marginBottom={3}>
        <Text as="h3" variant="h3">
          {formatMessage(strings.heading)}{' '}
          <Tooltip
            placement="right"
            as="span"
            text={formatMessage(strings.tooltip)}
          />
        </Text>
      </Box>
      <Input
        name="comments"
        label={formatMessage(strings.label)}
        placeholder={formatMessage(strings.placeholder)}
        value={commentsInput.value ?? ''}
        onChange={(evt) => commentsInput.onChange(evt.target.value)}
        textarea
        rows={7}
      />
    </>
  )
}

export default CommentsInput
