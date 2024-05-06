import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import { Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { core } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCardClosedIndictment,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  Defendants,
  Prosecutor,
} from '@island.is/judicial-system-web/src/components/CaseInfo/CaseInfo'
import { RenderFiles } from '@island.is/judicial-system-web/src/components/IndictmentCaseFilesList/IndictmentCaseFilesList'
import { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'
import { useFileList } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './Summary.strings'

const Summary: React.FC = () => {
  const { formatMessage } = useIntl()
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { onOpen } = useFileList({
    caseId: workingCase.id,
  })

  const handleNavigationTo = (destination: string) => {
    return router.push(`${destination}/${workingCase.id}`)
  }

  const courtRecordFiles =
    workingCase.caseFiles?.filter(
      (cf) => cf.category === CaseFileCategory.COURT_RECORD,
    ) || []

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(strings.htmlTitle)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.title)}</PageTitle>
        <Box marginBottom={1}>
          <Text variant="h2" as="h2">
            {formatMessage(core.caseNumber, {
              caseNumber: workingCase.courtCaseNumber,
            })}
          </Text>
        </Box>
        <Box marginBottom={2}>
          <Prosecutor workingCase={workingCase} />
          <Defendants workingCase={workingCase} />
        </Box>
        <Box marginBottom={6}>
          <InfoCardClosedIndictment />
        </Box>
        <SectionHeading title={formatMessage(strings.caseFiles)} />
        {courtRecordFiles.length > 0 && (
          <>
            <Text variant="h4" as="h4" marginBottom={1}>
              {formatMessage(strings.caseFilesSubtitleFine)}
            </Text>
            <RenderFiles
              caseFiles={courtRecordFiles}
              workingCase={workingCase}
              onOpenFile={onOpen}
            />
          </>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INDICTMENTS_CONCLUSION_ROUTE}/${workingCase.id}`}
          nextButtonIcon="checkmark"
          nextButtonText={formatMessage(strings.nextButtonText)}
          // onNextButtonClick={async () => await handleNextButtonClick()}
          // nextIsDisabled={isTransitioningCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Summary
