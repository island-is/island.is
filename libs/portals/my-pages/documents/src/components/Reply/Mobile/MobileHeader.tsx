import { Box, Button, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { LinkResolver } from '@island.is/portals/my-pages/core'
import { InformationPaths } from '@island.is/portals/my-pages/information'
import React from 'react'
import { messages } from '../../../utils/messages'
import * as styles from '../Reply.css'

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
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={2}>
      <Box paddingY={1} paddingX={2}>
        <Text fontWeight="medium">{title}</Text>
      </Box>
      <Divider />
      <Box paddingY="p2" paddingX={2}>
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
            <Text variant="medium">{from}</Text>
          ) : (
            <>
              <Text variant="medium">
                {` ${formatMessage(messages.from)}: `}
              </Text>

              <LinkResolver
                className={styles.link}
                href={InformationPaths.Settings}
              >
                <Button
                  icon="pencil"
                  iconType="outline"
                  size="small"
                  type="button"
                  variant="text"
                  as="span"
                  unfocusable
                >
                  {formatMessage(messages.pleaseRegisterEmail)}
                </Button>
              </LinkResolver>
            </>
          ))}
      </Box>
      <Divider />
    </Box>
  )
}

export default ReplyHeaderMobile
