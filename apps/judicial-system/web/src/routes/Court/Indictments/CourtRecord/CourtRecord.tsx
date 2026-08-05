import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import { Accordion, AlertMessage, Box, Button } from '@island.is/island-ui/core'
import {
  DISTRICT_COURT_INDICTMENT_CASE_CONCLUSION_ROUTE,
  DISTRICT_COURT_INDICTMENT_CASE_DEFENDER_ROUTE,
} from '@island.is/judicial-system/consts'
import { hasGeneratedCourtRecordPdf } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
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
import {
  isGeneratedIndictmentCourtRecordValid,
  isNoGeneratedIndictmentCourtRecord,
} from '@island.is/judicial-system-web/src/utils/validate'

import CourtSessionAccordionItem from './CourtSessionAccordionItem'
import { alertContainer } from './CourtRecord.css'

const CourtRecord: FC = () => {
  const { formatMessage } = useIntl()
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

  const canCreateCourtSession =
    isNoGeneratedIndictmentCourtRecord(workingCase) ||
    isGeneratedIndictmentCourtRecordValid(workingCase)

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={true}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title="Þingbók - Réttarvörslugátt" />
      <FormContentContainer>
        <PageTitle>Þingbók</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        {workingCase.withCourtSessions ? (
          <>
            <Accordion dividerOnTop={false} singleExpand={false}>
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
          </>
        ) : (
          <Box className={alertContainer} marginBottom={10}>
            <AlertMessage
              title="Sjálfvirkni ekki í boði"
              message="Þetta mál var stofnað af sækjanda áður en sjálfvirkni við gerð þingbókar var virkjuð."
              type="info"
            />
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${DISTRICT_COURT_INDICTMENT_CASE_DEFENDER_ROUTE}/${workingCase.id}`}
          actions={[
            {
              text: formatMessage(core.continue),
              icon: 'arrowForward',
              onClick: () =>
                handleNavigationTo(
                  DISTRICT_COURT_INDICTMENT_CASE_CONCLUSION_ROUTE,
                ),
              loading: isLoadingWorkingCase,
              testId: 'continueButton',
            },
          ]}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CourtRecord
