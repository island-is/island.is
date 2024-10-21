import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Button, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCardClosedIndictment,
  PageHeader,
  PageLayout,
  RenderFiles,
} from '@island.is/judicial-system-web/src/components'
import { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'
import { useFileList } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './IndictmentOverview.strings'

const IndictmentOverview = () => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const router = useRouter()

  const { onOpen } = useFileList({
    caseId: workingCase.id,
  })

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
        <Box marginBottom={5}>
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
            <Text variant="h4" as="h3">
              {formatMessage(strings.indictmentCompletedTitle, {
                date: formatDate(workingCase.indictmentCompletedDate, 'PPP'),
              })}
            </Text>
          )}
        </Box>
        <Box marginBottom={5}>
          <InfoCardClosedIndictment displayVerdictViewDate />
        </Box>
        <Box marginBottom={10}>
          <Text variant="h4" as="h4" marginBottom={1}>
            {formatMessage(strings.verdictTitle)}
          </Text>
          <RenderFiles
            onOpenFile={onOpen}
            caseFiles={
              workingCase.caseFiles?.filter(
                (file) => file.category === CaseFileCategory.RULING,
              ) || []
            }
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter previousUrl={constants.PRISON_CASES_ROUTE} hideNextButton />
      </FormContentContainer>
    </PageLayout>
  )
}

export default IndictmentOverview
