import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  InfoCard,
  InfoCardClosedIndictment,
  PageHeader,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import { EventType } from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './IndictmentOverview.strings'

const IndictmentOverview = () => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()

  const indictmentCompletedDate = workingCase.eventLogs?.find(
    (log) => log.eventType === EventType.INDICTMENT_COMPLETED,
  )?.created

  return (
    <PageLayout workingCase={workingCase} isLoading={false} notFound={false}>
      <PageHeader title={formatMessage(strings.htmlTitle)} />
      <FormContentContainer>
        <Box marginBottom={5}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.title)}
          </Text>
        </Box>
        {workingCase.courtCaseNumber && (
          <Box marginBottom={1}>
            <Text variant="h2" as="h2">
              {formatMessage(core.caseNumber, {
                caseNumber: workingCase.courtCaseNumber,
              })}
            </Text>
          </Box>
        )}
        {indictmentCompletedDate && (
          <Box marginBottom={5}>
            <Text variant="h4" as="h3">
              {formatMessage(strings.indictmentCompletedTitle, {
                date: formatDate(indictmentCompletedDate, 'PPP'),
              })}
            </Text>
          </Box>
        )}
        <InfoCardClosedIndictment displayVerdictViewDate />
      </FormContentContainer>
    </PageLayout>
  )
}

export default IndictmentOverview
