import React, { FC } from 'react'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text, Link } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../forms/messages'

const ThankYouScreen: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={8}>
      <Box marginTop={7} marginBottom={3}>
        <Text>
          <strong>
            {formatText(m.thankYouScreenSubTitle, application, formatMessage)}
          </strong>
        </Text>
      </Box>
      <Box marginBottom={2}>
        <Text>
          {formatText(m.thankYouScreenFirstMessage, application, formatMessage)}
        </Text>
      </Box>
      <Box>
        <Box marginBottom={2}>
          <Text>
            {formatText(
              m.thankYouScreenSecondMessage,
              application,
              formatMessage,
            )}
          </Text>
        </Box>
        <Box>
          <Text>
            {formatText(
              m.thankYouScreenThirdMessage,
              application,
              formatMessage,
            )}
          </Text>
        </Box>
        <Box marginTop={3}>
          <Link
            href={formatText(
              m.thankYouScreenLinkUrl1,
              application,
              formatMessage,
            )}
            color="blue400"
            underline="small"
            underlineVisibility="always"
          >
            {formatText(m.thankYouScreenLinkText1, application, formatMessage)}
          </Link>
        </Box>
        <Box marginTop={3}>
          <Link
            href={formatText(
              m.thankYouScreenLinkUrl2,
              application,
              formatMessage,
            )}
            color="blue400"
            underline="small"
            underlineVisibility="always"
          >
            {formatText(m.thankYouScreenLinkText2, application, formatMessage)}
          </Link>
        </Box>
        <Box marginTop={3}>
          <Link
            href={formatText(
              m.thankYouScreenLinkUrl3,
              application,
              formatMessage,
            )}
            color="blue400"
            underline="small"
            underlineVisibility="always"
          >
            {formatText(m.thankYouScreenLinkText3, application, formatMessage)}
          </Link>
        </Box>
        <Box marginTop={3}>
          <Text>
            {formatText(
              m.thankYouScreenFooterMessage,
              application,
              formatMessage,
            )}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default ThankYouScreen
