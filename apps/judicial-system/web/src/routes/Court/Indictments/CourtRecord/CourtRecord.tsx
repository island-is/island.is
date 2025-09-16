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
} from '@island.is/judicial-system-web/src/components'
import { CourtSessionResponse } from '@island.is/judicial-system-web/src/graphql/schema'
import { useCourtSessions } from '@island.is/judicial-system-web/src/utils/hooks'
import { isIndictmentCourtRecordStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import CourtSessionAccordionItem from './CourtSessionAccordionItem'

const CourtRecord: FC = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { createCourtSession } = useCourtSessions()
  const [expandedIndex, setExpandedIndex] = useState<number>()

  // useEffect(() => {
  //   if (!workingCase.courtDocuments) {
  //     return
  //   }

  //   setReorderableItems(
  //     workingCase.courtDocuments.map((doc) => ({
  //       id: doc.id,
  //       name: doc.name,
  //     })),
  //   )
  // }, [workingCase.courtDocuments])

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  const stepIsValid = isIndictmentCourtRecordStepValid(
    workingCase.courtSessions,
  )

  useEffect(() => {
    setExpandedIndex(
      workingCase.courtSessions?.length
        ? workingCase.courtSessions.length - 1
        : 0,
    )
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
              onToggle={() =>
                setExpandedIndex(index === expandedIndex ? -1 : index)
              }
              onConfirmClick={() => setExpandedIndex(undefined)}
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
            />
          ))}
        </Accordion>
        <Box
          display="flex"
          justifyContent="flexEnd"
          marginTop={5}
          marginBottom={10}
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
            disabled={!stepIsValid}
            icon="add"
          >
            Bæta við þinghaldi
          </Button>
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
