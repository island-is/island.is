import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  PageHeader,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'

import { strings } from './IndictmentOverview.strings'

const IndictmentOverview = () => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()

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
        <Box marginBottom={1}>
          <Text variant="h2" as="h2">
            {formatMessage(core.caseNumber, {
              caseNumber: workingCase.courtCaseNumber,
            })}
          </Text>
        </Box>
      </FormContentContainer>
    </PageLayout>
  )
}

export default IndictmentOverview
