import React, { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { LayoutGroup } from 'framer-motion'
import router from 'next/router'

import { Accordion, AlertMessage, Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { CaseFileCategory } from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentsCaseFilesAccordionItem,
  PageHeader,
  PageLayout,
  PdfButton,
  ProsecutorCaseInfo,
} from '@island.is/judicial-system-web/src/components'

import { caseFile as m } from './CaseFile.strings'

const CaseFile = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { formatMessage } = useIntl()
  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={true}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.caseFile)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.heading)}
          </Text>
        </Box>
        <Box marginBottom={5}>
          <ProsecutorCaseInfo workingCase={workingCase} />
        </Box>
        <Box marginBottom={7}>
          <AlertMessage type="info" message={formatMessage(m.infoPanel)} />
        </Box>
        <Box marginBottom={5}>
          <LayoutGroup>
            <Accordion singleExpand>
              {workingCase.policeCaseNumbers.map((policeCaseNumber, index) => (
                <IndictmentsCaseFilesAccordionItem
                  key={index}
                  caseId={workingCase.id}
                  policeCaseNumber={policeCaseNumber}
                  shouldStartExpanded={index === 0}
                  caseFiles={
                    workingCase.caseFiles?.filter(
                      (caseFile) =>
                        caseFile.policeCaseNumber === policeCaseNumber &&
                        caseFile.category === CaseFileCategory.CASE_FILE,
                    ) ?? []
                  }
                  subtypes={workingCase.indictmentSubtypes}
                  crimeScenes={workingCase.crimeScenes}
                />
              ))}
            </Accordion>
          </LayoutGroup>
        </Box>
        <Box marginBottom={7}>
          {workingCase.policeCaseNumbers.map((policeCaseNumber, index) => (
            <Box marginBottom={2} key={`${policeCaseNumber}-${index}`}>
              <PdfButton
                caseId={workingCase.id}
                title={formatMessage(m.pdfButtonText, {
                  policeCaseNumber: policeCaseNumber,
                })}
                pdfType="caseFilesRecord"
                policeCaseNumber={policeCaseNumber}
              />
            </Box>
          ))}
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INDICTMENTS_PROCESSING_ROUTE)
          }
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CaseFile
