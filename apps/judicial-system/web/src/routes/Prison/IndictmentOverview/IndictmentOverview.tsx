import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Button, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  InfoCardClosedIndictment,
  PageHeader,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import { EventType } from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './IndictmentOverview.strings'

const IndictmentOverview = () => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const router = useRouter()

  const indictmentReviewedDate = workingCase.eventLogs?.find(
    (log) => log.eventType === EventType.INDICTMENT_REVIEWED,
  )?.created

  return (
    <PageLayout workingCase={workingCase} isLoading={false} notFound={false}>
      <PageHeader title={formatMessage(strings.htmlTitle)} />
      <FormContentContainer>
        <Box marginBottom={5}>
          <Box marginBottom={3}>
            <Button
              variant="text"
              preTextIcon="arrowBack"
              onClick={() => router.push(constants.PRISON_CASES_ROUTE)}
            >
              {formatMessage(core.back)}
            </Button>
          </Box>
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
        {workingCase.indictmentCompletedDate && (
          <Box marginBottom={5}>
            <Text variant="h4" as="h3">
              {formatMessage(strings.indictmentCompletedTitle, {
                date: formatDate(workingCase.indictmentCompletedDate, 'PPP'),
              })}
            </Text>
          </Box>
        )}
        <InfoCardClosedIndictment
          displayVerdictViewDate
          indictmentReviewedDate={indictmentReviewedDate}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default IndictmentOverview
