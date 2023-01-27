import { formatText } from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { messages } from './messages'
import { useHistory } from 'react-router-dom'
import { FieldBaseProps } from '@island.is/application/types'

export const GoToServicePortalFormField: FC<FieldBaseProps> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const history = useHistory()
  return (
    <Box
      borderRadius="standard"
      padding={4}
      background="blue100"
      display="flex"
      alignItems="center"
      flexDirection={['column', 'column', 'row']}
      marginY={2}
    >
      <Box paddingRight={[0, 0, 4]}>
        <Text variant="small">
          {formatText(messages.information.text, application, formatMessage)}
        </Text>
      </Box>
      <Box marginTop={[2, 2, 0]} marginLeft={[0, 0, 3]}>
        <Button
          onClick={() => history.push('/minarsidur')}
          size="small"
          icon="arrowForward"
        >
          {formatText(
            messages.information.buttonText,
            application,
            formatMessage,
          )}
        </Button>
      </Box>
    </Box>
  )
}
