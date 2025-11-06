import { FC, useCallback, useContext, useEffect, useState } from 'react'
import router from 'next/router'

import { Accordion, AlertMessage, Box, Button } from '@island.is/island-ui/core'
import { INDICTMENTS_CONCLUSION_ROUTE } from '@island.is/judicial-system/consts'
import { INDICTMENTS_DEFENDER_ROUTE } from '@island.is/judicial-system/consts'
import { hasGeneratedCourtRecordPdf } from '@island.is/judicial-system/types'
import {
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  PdfButton,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { useCourtSessions } from '@island.is/judicial-system-web/src/utils/hooks'
import { isIndictmentCourtRecordStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import CourtSessionAccordionItem from './CourtSessionAccordionItem'

const CourtRecord: FC = () => {
  const { user } = useContext(UserContext)
  const { workingCase, isLoadingWorkingCase, caseNotFound, refreshCase } =
    useContext(FormContext)
  const { createCourtSession } = useCourtSessions()
  const [expandedIndex, setExpandedIndex] = useState<number>()

  const hasGeneratedCourtRecord = hasGeneratedCourtRecordPdf(
    workingCase.state,
    workingCase.indictmentRulingDecision,
    workingCase.withCourtSessions,
    workingCase.courtSessions,
    user,
  )

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  const handleCreateCourtSession = async () => {
    const courtSession = await createCourtSession({
      caseId: workingCase.id,
    })

    if (!courtSession?.id) {
      return
    }

    refreshCase()
  }

  useEffect(() => {
    if (
      workingCase.courtSessions?.length &&
      workingCase.courtSessions.length > 0
    ) {
      setExpandedIndex(workingCase.courtSessions.length - 1)
    }
  }, [workingCase.courtSessions?.length])

  const stepIsValid = isIndictmentCourtRecordStepValid(workingCase)
  const allCourtSessionsConfirmed = workingCase.courtSessions?.every(
    (c) => c.isConfirmed,
  )
  const canCreateCourtSession =
    !workingCase.courtSessions ||
    workingCase.courtSessions.length === 0 ||
    (stepIsValid && allCourtSessionsConfirmed)

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title="Þingbók - Réttarvörslugátt" />
      <FormContentContainer>
        <PageTitle>Þingbók</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        {workingCase.withCourtSessions ? (
          <Box>
            <Accordion dividerOnTop={false} singleExpand>
              {workingCase.courtSessions?.map((courtSession, index) => (
                <CourtSessionAccordionItem
                  key={courtSession.id}
                  index={index}
                  courtSession={courtSession}
                  isExpanded={expandedIndex === index}
                  onToggle={() =>
                    setExpandedIndex(index === expandedIndex ? -1 : index)
                  }
                />
              ))}
            </Accordion>
            <Box
              display="flex"
              justifyContent="flexEnd"
              marginTop={5}
              marginBottom={2}
            >
              <Button
                variant="ghost"
                onClick={handleCreateCourtSession}
                disabled={!canCreateCourtSession}
                icon="add"
              >
                Bæta við þinghaldi
              </Button>
            </Box>
            <Box marginBottom={10}>
              <PdfButton
                caseId={workingCase.id}
                title="Þingbók - PDF"
                pdfType="courtRecord"
                elementId="Þingbók"
                disabled={!hasGeneratedCourtRecord}
              />
            </Box>
          </Box>
        ) : (
          <Box width="half" marginBottom={10}>
            <AlertMessage
              title="Sjálfvirkni ekki í boði"
              message="Þetta mál var móttekið af héraðsdómi áður en sjálfvirkni við gerð þingbókar var virkjuð."
              type="info"
            />
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${INDICTMENTS_DEFENDER_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoadingWorkingCase}
          nextUrl={`${INDICTMENTS_CONCLUSION_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!stepIsValid || !allCourtSessionsConfirmed}
          onNextButtonClick={() =>
            handleNavigationTo(INDICTMENTS_CONCLUSION_ROUTE)
          }
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CourtRecord
