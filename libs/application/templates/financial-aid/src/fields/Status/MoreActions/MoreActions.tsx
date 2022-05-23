import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { DescriptionText } from '../..'
import { moreActions } from '../../../lib/messages'

interface Props {
  municipalityRulesPage?: string
  municipalityEmail?: string
}

const MoreActions = ({ municipalityRulesPage, municipalityEmail }: Props) => {
  const { formatMessage } = useIntl()

  if (!municipalityRulesPage && !municipalityEmail) {
    return null
  }

  return (
    <>
      <Text as="h3" variant="h3">
        {formatMessage(moreActions.title)}
      </Text>
      <Box marginTop={2}>
        {municipalityRulesPage && (
          <DescriptionText
            textProps={{ variant: 'small' }}
            text={moreActions.rulesLink}
            format={{
              rulesPage: municipalityRulesPage,
            }}
          />
        )}
        {municipalityEmail && (
          <DescriptionText
            textProps={{ variant: 'small' }}
            text={moreActions.emailLink}
            format={{
              email: municipalityEmail,
            }}
          />
        )}
      </Box>
    </>
  )
}

export default MoreActions
