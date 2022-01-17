import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { summaryForm } from '../../lib/messages'
import { useIntl } from 'react-intl'
import DescriptionText from '../DescriptionText/DescriptionText'

const SummaryForm = () => {
  const { formatMessage } = useIntl()

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        marginTop={[2, 2, 4]}
      >
        <Box marginRight={1}>
          <Text as="h3" variant="h3">
            {formatMessage(summaryForm.general.descriptionTitle)}
          </Text>
        </Box>

        <Text variant="small">
          {formatMessage(summaryForm.general.descriptionSubtitle)}
        </Text>
      </Box>

      <Box marginTop={2}>
        <DescriptionText text={summaryForm.general.description} />
      </Box>

      <Box marginTop={2}>
        <DescriptionText text={summaryForm.general.description} />
      </Box>
    </>
  )
}

export default SummaryForm
