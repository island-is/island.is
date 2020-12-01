import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Link } from '@island.is/island-ui/core'
import { m } from '../../../forms/messages'

const ThankYouScreen: FC<FieldBaseProps> = ({}) => {
  return (
    <Box marginBottom={8}>
      <Box marginBottom={2}>
        <Text variant="h3">{m.thankYouScreenSubTitle.defaultMessage} </Text>
      </Box>
      <Box marginBottom={2}>
        <Text>{m.thankYouScreenFirstMessage.defaultMessage}</Text>
      </Box>
      <Box marginTop={[2, 3]}>
        <Box>
          <Text>{m.thankYouScreenSecondMessage.defaultMessage}</Text>
        </Box>
        <Box marginTop={[2, 3]}>
          <Link
            href={m.thankYouScreenLinkUrl1.defaultMessage}
            color="blue400"
            underline="small"
            underlineVisibility="always"
          >
            {m.thankYouScreenLinkText1.defaultMessage}
          </Link>
        </Box>
        <Box marginTop={[2, 3]}>
          <Link
            href={m.thankYouScreenLinkUrl2.defaultMessage}
            color="blue400"
            underline="small"
            underlineVisibility="always"
          >
            {m.thankYouScreenLinkText2.defaultMessage}
          </Link>
        </Box>
        <Box marginTop={[2, 3]}>
          <Link
            href={m.thankYouScreenLinkUrl3.defaultMessage}
            color="blue400"
            underline="small"
            underlineVisibility="always"
          >
            {m.thankYouScreenLinkText3.defaultMessage}
          </Link>
        </Box>
        <Box marginTop={[2, 3]}>
          <Text>{m.thankYouScreenFooterMessage.defaultMessage}</Text>
        </Box>
      </Box>
    </Box>
  )
}

export default ThankYouScreen
