import { FC, useCallback, useContext, useEffect, useState } from 'react'
import router from 'next/router'

import {
  Accordion,
  Box,
  Button,
  PdfViewer,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { INDICTMENTS_CASE_FILE_ROUTE } from '@island.is/judicial-system/consts'
import { INDICTMENTS_DEFENDER_ROUTE } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  PdfButton,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseFileCategory,
  CourtSessionResponse,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCourtSessions,
  useFileList,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { isIndictmentCourtRecordStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import CourtSessionAccordionItem from './CourtSessionAccordionItem'

const CourtRecord: FC = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { createCourtSession, updateCourtSession } = useCourtSessions()
  const [expandedIndex, setExpandedIndex] = useState<number>()
  const [modalVisible, setModalVisible] = useState<'TODO:REMOVE'>()
  const [rulingUrl, setRulingUrl] = useState<string>()

  const { getFileUrl } = useFileList({
    caseId: workingCase.id,
  })

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

  const handleRuling = async () => {
    const showError = () => toast.error('Dómur fannst ekki')

    const rulings = workingCase.caseFiles?.filter(
      (c) => c.category === CaseFileCategory.COST_BREAKDOWN,
    )

    if (!rulings || rulings.length === 0) {
      showError()
      return
    }

    const rulingId = rulings[0].id
    const url = await getFileUrl(rulingId)

    if (url) {
      setRulingUrl(url)
      setModalVisible('TODO:REMOVE')
    } else {
      showError()
    }
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
          onNextButtonClick={() => {
            handleRuling()
          }}
        />
      </FormContentContainer>
      {modalVisible === 'TODO:REMOVE' && (
        <Modal
          title="Viltu staðfesta dómsúrlausn og ljúka máli?"
          text={
            <Box display="flex" rowGap={2} flexDirection="column">
              <Box>
                <Text fontWeight="semiBold" as="span">
                  Lyktir:
                </Text>
                <Text as="span">{` Dómur`}</Text>
              </Box>
              <Box>
                <Text fontWeight="semiBold" as="span">
                  Dagsetning lykta:
                </Text>
                <Text as="span">
                  {` ${formatDate(workingCase.courtEndTime)}`}
                </Text>
              </Box>
              <Box as="ul" marginLeft={2}>
                <li>
                  <Text>Vinsamlegast rýnið skjal fyrir staðfestingu.</Text>
                </li>
                <li>
                  <Text>
                    Staðfestur dómur verður aðgengilegur málflytjendum í
                    Réttarvörslugátt.
                  </Text>
                </li>
                <li>
                  <Text>
                    Ef birta þarf dóminn verður hann sendur í rafræna birtingu í
                    stafrænt pósthólf dómfellda á island.is á næsta skrefi.
                  </Text>
                </li>
              </Box>
            </Box>
          }
          primaryButton={{
            text: 'Staðfesta',
            onClick: () => null,
            isDisabled: false, // !hasReviewed || pdfError, TODO FIX BUG ON PRD AND REVERT THIS
          }}
          secondaryButton={{
            text: 'Hætta við',
            onClick: () => null,
          }}
          footerCheckbox={{
            label: 'Ég hef rýnt þetta dómskjal',
            checked: false,
            onChange: () => null,
            disabled: false,
          }}
        >
          {rulingUrl && <PdfViewer file={rulingUrl} showAllPages />}
        </Modal>
      )}
    </PageLayout>
  )
}

export default CourtRecord
