import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Link, Text } from '@island.is/island-ui/core'
import { status } from '../../../lib/messages'
import DescriptionText from '../../DescriptionText/DescriptionText'

interface Props {
  rejectionComment: string
  rulesPage?: string
  homepage?: string
  email?: string
}

const RejectionMessage = ({
  rejectionComment,
  rulesPage,
  homepage,
  email,
}: Props) => {
  const { formatMessage } = useIntl()
  const showRulesLink = rulesPage || homepage

  return (
    <Box marginBottom={[4, 4, 5]}>
      <Text marginBottom={[2, 2, 3]} variant="h3" fontWeight="light">
        {formatMessage(status.rejectionMessage.explanation, {
          rejectionComment,
        })}{' '}
        {showRulesLink &&
          formatMessage(status.rejectionMessage.explanationLink)}
      </Text>
      {showRulesLink && (
        <Box marginBottom={[4, 4, 5]}>
          <Link
            href={showRulesLink}
            underline="normal"
            underlineVisibility="always"
            color="blue400"
          >
            {rulesPage
              ? formatMessage(status.rejectionMessage.rulesPageLink)
              : homepage}
          </Link>
        </Box>
      )}

      <Text as="h3" variant="h3" marginBottom={[1, 1, 2]}>
        {formatMessage(status.rejectionMessage.appealTitle)}
      </Text>
      <DescriptionText
        text={status.rejectionMessage.appealDescription}
        format={{ email: email || '' }}
      />
    </Box>
  )
}

export default RejectionMessage
