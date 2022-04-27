import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { DescriptionText } from '../..'
import { status } from '../../../lib/messages'

interface Props {
  rulesPage?: string
  email?: string
}

const MoreActions = ({ rulesPage, email }: Props) => {
  if (!rulesPage && !email) {
    return null
  }

  const { formatMessage } = useIntl()

  return (
    <>
      <Text as="h3" variant="h3">
        {formatMessage(status.moreActions.title)}
      </Text>
      <Box marginTop={2}>
        {rulesPage && (
          <DescriptionText
            textProps={{ variant: 'small' }}
            text={status.moreActions.rulesLink}
            format={{
              rulesPage: rulesPage,
            }}
          />
        )}
        {email && (
          <DescriptionText
            textProps={{ variant: 'small' }}
            text={status.moreActions.emailLink}
            format={{
              email: email,
            }}
          />
        )}
      </Box>
    </>
  )
}

export default MoreActions
