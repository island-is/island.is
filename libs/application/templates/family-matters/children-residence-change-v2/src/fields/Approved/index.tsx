import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import { DescriptionText } from '@island.is/application/templates/family-matters-core/components'
import { approved } from '../../lib/messages'

const Approved = () => {
  const { formatMessage } = useIntl()

  return (
    <Box marginTop={3} paddingBottom={5}>
      <DescriptionText text={approved.general.description} />
      <Text variant="h4" marginTop={3}>
        {formatMessage(approved.nextSteps.title)}
      </Text>
      <Box marginTop={2}>
        <DescriptionText text={approved.nextSteps.text} />
      </Box>
    </Box>
  )
}

export default Approved
