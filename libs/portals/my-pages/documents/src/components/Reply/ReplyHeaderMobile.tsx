import { Box, Button, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InformationPaths } from '@island.is/portals/my-pages/information'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../utils/messages'

interface ReplyHeaderMobileProps {
  title: string
  to: string
  hasEmail?: boolean
  displayEmail?: boolean
  from?: string
}

const ReplyHeaderMobile: React.FC<ReplyHeaderMobileProps> = ({
  title,
  to,
  from,
  hasEmail,
  displayEmail,
}) => {
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={2}>
      <Box paddingY={1} paddingX={2}>
        <Text fontWeight="medium">{title}</Text>
      </Box>
      <Divider />
      <Box paddingY={1} paddingX={2}>
        <Text variant="medium">{to}</Text>
      </Box>
      <Divider />
      <Box
        paddingY={1}
        paddingX={2}
        display="flex"
        flexDirection="row"
        alignItems="center"
      >
        {displayEmail &&
          (hasEmail ? (
            <Text variant="medium"> {from}</Text>
          ) : (
            <>
              <Text variant="medium">
                {' '}
                {formatMessage(messages.fromWithArgs, { senderName: '' })}
              </Text>
              <Button
                variant="text"
                icon="pencil"
                iconType="outline"
                size="small"
                onClick={() => {
                  navigate(InformationPaths.Settings)
                }}
              >
                {formatMessage(messages.pleaseRegisterEmail)}
              </Button>
            </>
          ))}
      </Box>
      <Divider />
    </Box>
  )
}

export default ReplyHeaderMobile
