import { FC, useCallback, useContext, useEffect, useState } from 'react'
import router from 'next/router'

import { Accordion, Box, Button } from '@island.is/island-ui/core'
import { INDICTMENTS_CASE_FILE_ROUTE } from '@island.is/judicial-system/consts'
import { INDICTMENTS_DEFENDER_ROUTE } from '@island.is/judicial-system/consts'
import {
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  PdfButton,
} from '@island.is/judicial-system-web/src/components'
import { CourtSessionResponse } from '@island.is/judicial-system-web/src/graphql/schema'
import { useCourtSessions } from '@island.is/judicial-system-web/src/utils/hooks'
import { isIndictmentCourtRecordStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import CourtSessionAccordionItem from './CourtSessionAccordionItem'

const CourtRecord: FC = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { createCourtSession, updateCourtSession } = useCourtSessions()
  const [expandedIndex, setExpandedIndex] = useState<number>()

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  const stepIsValid = isIndictmentCourtRecordStepValid(
    workingCase.courtSessions,
  )

  const handleConfirmClick = (
    courtSessionId: string,
    isConfirmed: boolean | null = false,
  ) => {
    setWorkingCase((prev) => ({
      ...prev,
      courtSessions: prev.courtSessions?.map((session) =>
        session.id === courtSessionId
          ? { ...session, isConfirmed: !isConfirmed }
          : session,
      ),
    }))

    updateCourtSession({
      courtSessionId,
      caseId: workingCase.id,
      isConfirmed: !isConfirmed,
    })
  }

  useEffect(() => {
    if (
      workingCase.courtSessions?.length &&
      workingCase.courtSessions?.length >= 0
    ) {
      setExpandedIndex(workingCase.courtSessions.length - 1)
    }
  }, [workingCase.courtSessions?.length])

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={() => handleNavigationTo(INDICTMENTS_CASE_FILE_ROUTE)}
    >
      <PageHeader title="Þingbók - Réttarvörslugátt" />
      <FormContentContainer>
        <PageTitle>Þingbók</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Accordion dividerOnTop={false} singleExpand>
          {workingCase.courtSessions?.map((courtSession, index) => (
            <CourtSessionAccordionItem
              key={courtSession.id}
              index={index}
              courtSession={courtSession}
              isExpanded={expandedIndex === index}
              onToggle={() => {
                setExpandedIndex(index === expandedIndex ? -1 : index)
              }}
              onConfirmClick={() =>
                handleConfirmClick(courtSession.id, courtSession.isConfirmed)
              }
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
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
            onClick={async () => {
              const courtSession = await createCourtSession({
                caseId: workingCase.id,
              })

              if (!courtSession?.id) {
                return
              }

              setWorkingCase((prev) => ({
                ...prev,
                courtSessions: [
                  ...(prev.courtSessions ?? []),
                  {
                    id: courtSession.id,
                    created: courtSession.created,
                  } as CourtSessionResponse,
                ],
              }))
            }}
            disabled={
              !stepIsValid ||
              workingCase.courtSessions?.some((c) => !c.isConfirmed)
            }
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
            disabled={workingCase.courtSessions?.some((c) => !c.isConfirmed)}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${INDICTMENTS_DEFENDER_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!stepIsValid}
          // onNextButtonClick={() => setModalVisible('CONFIRM_INDICTMENT')}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CourtRecord
