import { useCallback, useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { LayoutGroup } from 'motion/react'
import router from 'next/router'

import { Accordion, AlertMessage, Box } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentsCaseFilesAccordionItem,
  PageHeader,
  PageLayout,
  PageTitle,
  PdfButton,
  ProsecutorCaseInfo,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseFile as TCaseFile,
  CaseFileCategory,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { caseFile as m } from './CaseFile.strings'

const CaseFile = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const caseFiles = useMemo(() => {
    return new Map<string, TCaseFile[]>(
      workingCase.policeCaseNumbers?.map((policeCaseNumber) => [
        policeCaseNumber,
        workingCase.caseFiles?.filter(
          (caseFile) =>
            caseFile.policeCaseNumber === policeCaseNumber &&
            caseFile.category === CaseFileCategory.CASE_FILE_RECORD,
        ) ?? [],
      ]),
    )
  }, [workingCase.caseFiles, workingCase.policeCaseNumbers])

  const { formatMessage } = useIntl()
  const [editCount, setEditCount] = useState<number>(0)

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
        <PageTitle>{formatMessage(m.heading)}</PageTitle>
        <Box marginBottom={5}>
          <ProsecutorCaseInfo workingCase={workingCase} />
        </Box>
        <Box marginBottom={7}>
          <AlertMessage type="info" message={formatMessage(m.infoPanel)} />
        </Box>
        <Box marginBottom={5}>
          <LayoutGroup>
            <Accordion singleExpand>
              {workingCase.policeCaseNumbers?.map((policeCaseNumber, index) => {
                return (
                  <IndictmentsCaseFilesAccordionItem
                    key={index}
                    caseId={workingCase.id}
                    policeCaseNumber={policeCaseNumber}
                    shouldStartExpanded={index === 0}
                    caseFiles={caseFiles.get(policeCaseNumber) ?? []}
                    subtypes={workingCase.indictmentSubtypes}
                    crimeScenes={workingCase.crimeScenes}
                    setEditCount={setEditCount}
                  />
                )
              })}
            </Accordion>
          </LayoutGroup>
        </Box>
        <Box marginBottom={7}>
          {workingCase.policeCaseNumbers?.map((policeCaseNumber, index) => {
            const caseFilesRecordFileName = formatMessage(m.pdfButtonText, {
              policeCaseNumber: policeCaseNumber,
            })

            return (
              <Box marginBottom={2} key={`${policeCaseNumber}-${index}`}>
                <PdfButton
                  caseId={workingCase.id}
                  title={caseFilesRecordFileName}
                  pdfType="caseFilesRecord"
                  elementId={[policeCaseNumber, caseFilesRecordFileName]}
                />
              </Box>
            )
          })}
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INDICTMENTS_CASE_FILES_ROUTE)
          }
          nextIsLoading={isLoadingWorkingCase}
          nextIsDisabled={editCount > 0}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CaseFile
