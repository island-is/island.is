import { formatText } from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import {
  FieldBaseProps,
  MessageWithLinkButtonField,
} from '@island.is/application/types'

interface Props extends FieldBaseProps {
  field: MessageWithLinkButtonField
}

export const MessageWithLinkButtonFormField: FC<
  React.PropsWithChildren<Props>
> = ({ application, field }) => {
  const { formatMessage } = useLocale()

  const getUrl = () => {
    if (field.url === '/minarsidur/umsoknir') {
      return `${field.url}#${application.id}`
    }
    return field.url
  }

  return (
    <Box marginTop={field.marginTop} marginBottom={field.marginBottom}>
      <Box
        borderRadius="standard"
        padding={4}
        background="blue100"
        display={['block', 'block', 'flex']}
        alignItems="center"
        justifyContent="spaceBetween"
        flexDirection={['column', 'column', 'row']}
        marginY={2}
      >
        <Box paddingRight={[0, 0, 4]} style={{ overflowWrap: 'anywhere' }}>
          <Text variant="small" color={field.messageColor}>
            {formatText(field.message, application, formatMessage)}
          </Text>
        </Box>
        <Box marginTop={[3, 3, 0]} marginLeft={[0, 0, 3]}>
          <Button
            onClick={() => {
              window.open(`${getUrl()}`, '_blank')
            }}
            size="small"
            icon="arrowForward"
            nowrap
          >
            {formatText(field.buttonTitle, application, formatMessage)}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
