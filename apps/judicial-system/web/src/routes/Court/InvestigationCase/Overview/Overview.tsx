import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  AccordionListItem,
  CaseFilesAccordionItem,
  CommentsAccordionItem,
  FormContentContainer,
  FormFooter,
  InfoCard,
  PageLayout,
  PdfButton,
} from '@island.is/judicial-system-web/src/components'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  core,
  icCourtOverview,
  requestCourtDate,
  ruling,
  titles,
} from '@island.is/judicial-system-web/messages'
import { isAcceptingCaseDecision } from '@island.is/judicial-system/types'
import {
  Accordion,
  AccordionItem,
  AlertMessage,
  Box,
  Button,
  Text,
} from '@island.is/island-ui/core'
import MarkdownWrapper from '@island.is/judicial-system-web/src/components/MarkdownWrapper/MarkdownWrapper'
import {
  UploadState,
  useCourtUpload,
} from '@island.is/judicial-system-web/src/utils/hooks/useCourtUpload'
import {
  formatDate,
  caseTypes,
  capitalize,
} from '@island.is/judicial-system/formatters'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import * as constants from '@island.is/judicial-system/consts'

import DraftConclusionModal from '../../SharedComponents/DraftConclusionModal/DraftConclusionModal'

const Overview = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { autofill } = useCase()
  const { user } = useContext(UserContext)
  const { uploadState } = useCourtUpload(workingCase, setWorkingCase)
  const [isDraftingConclusion, setIsDraftingConclusion] = useState<boolean>()

  useEffect(() => {
    if (isCaseUpToDate) {
      autofill(
        [
          {
            key: 'ruling',
            value: !workingCase.parentCase
              ? `\n${formatMessage(ruling.autofill, {
                  judgeName: workingCase.judge?.name,
                })}`
              : isAcceptingCaseDecision(workingCase.decision)
              ? workingCase.parentCase.ruling
              : undefined,
          },
        ],
        workingCase,
        setWorkingCase,
      )
    }
  }, [autofill, formatMessage, isCaseUpToDate, setWorkingCase, workingCase])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={CourtSubsections.JUDGE_OVERVIEW}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.court.investigationCases.overview)}
      />
      <FormContentContainer>
        {workingCase.caseResentExplanation && (
          <Box marginBottom={workingCase.seenByDefender ? 3 : 5}>
            <AlertMessage
              title={formatMessage(
                icCourtOverview.sections.caseResentExplanation.title,
              )}
              message={
                <MarkdownWrapper
                  markdown={workingCase.caseResentExplanation}
                  textProps={{ variant: 'small' }}
                />
              }
              type="warning"
            />
          </Box>
        )}
        {workingCase.seenByDefender && (
          <Box marginBottom={5}>
            <AlertMessage
              title={formatMessage(
                icCourtOverview.sections.seenByDefenderAlert.title,
              )}
              message={formatMessage(
                icCourtOverview.sections.seenByDefenderAlert.text,
                {
                  when: formatDate(workingCase.seenByDefender, 'PPPp'),
                },
              )}
              type="info"
            />
          </Box>
        )}
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Yfirlit kröfu um rannsóknarheimild
          </Text>
        </Box>
        <Box component="section" marginBottom={5}>
          <InfoCard
            data={[
              {
                title: formatMessage(core.policeCaseNumber),
                value: workingCase.policeCaseNumber,
              },
              {
                title: formatMessage(core.prosecutor),
                value: `${workingCase.creatingProsecutor?.institution?.name}`,
              },
              {
                title: formatMessage(requestCourtDate.heading),
                value: `${capitalize(
                  formatDate(workingCase.requestedCourtDate, 'PPPP', true) ??
                    '',
                )} eftir kl. ${formatDate(
                  workingCase.requestedCourtDate,
                  constants.TIME_FORMAT,
                )}`,
              },
              {
                title: formatMessage(core.prosecutorPerson),
                value: workingCase.prosecutor?.name,
              },
              {
                title: formatMessage(core.caseType),
                value: capitalize(caseTypes[workingCase.type]),
              },
            ]}
            defendants={workingCase.defendants ?? []}
            defender={{
              name: workingCase.defenderName ?? '',
              defenderNationalId: workingCase.defenderNationalId,
              email: workingCase.defenderEmail,
              phoneNumber: workingCase.defenderPhoneNumber,
            }}
            sessionArrangement={workingCase.sessionArrangements}
          />
        </Box>
        <>
          {workingCase.description && (
            <Box marginBottom={5}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  Efni kröfu
                </Text>
              </Box>
              <Text>{workingCase.description}</Text>
            </Box>
          )}
          <Box marginBottom={5} data-testid="demands">
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Dómkröfur
              </Text>
            </Box>
            <Text>{workingCase.demands}</Text>
          </Box>
          <Box marginBottom={5}>
            <Accordion>
              <AccordionItem
                labelVariant="h3"
                id="id_1"
                label="Lagaákvæði sem brot varða við"
              >
                <Text whiteSpace="breakSpaces">{workingCase.lawsBroken}</Text>
              </AccordionItem>
              <AccordionItem
                labelVariant="h3"
                id="id_2"
                label="Lagaákvæði sem krafan er byggð á"
              >
                <Text whiteSpace="breakSpaces">{workingCase.legalBasis}</Text>
              </AccordionItem>
              {(workingCase.caseFacts || workingCase.legalArguments) && (
                <AccordionItem
                  labelVariant="h3"
                  id="id_4"
                  label="Greinargerð um málsatvik og lagarök"
                >
                  {workingCase.caseFacts && (
                    <AccordionListItem title="Málsatvik">
                      <Text whiteSpace="breakSpaces">
                        {workingCase.caseFacts}
                      </Text>
                    </AccordionListItem>
                  )}
                  {workingCase.legalArguments && (
                    <AccordionListItem title="Lagarök">
                      <Text whiteSpace="breakSpaces">
                        {workingCase.legalArguments}
                      </Text>
                    </AccordionListItem>
                  )}
                </AccordionItem>
              )}
              {(workingCase.comments ||
                workingCase.caseFilesComments ||
                workingCase.caseResentExplanation) && (
                <CommentsAccordionItem workingCase={workingCase} />
              )}
              {user && (
                <CaseFilesAccordionItem
                  workingCase={workingCase}
                  setWorkingCase={setWorkingCase}
                  user={user}
                />
              )}
            </Accordion>
          </Box>
          <Box marginBottom={10}>
            <Box marginBottom={3}>
              <PdfButton
                caseId={workingCase.id}
                title={formatMessage(core.pdfButtonRequest)}
                pdfType="request"
              />
            </Box>
            <Button
              data-testid="draftConclusionButton"
              variant="ghost"
              icon="pencil"
              size="small"
              onClick={() => setIsDraftingConclusion(true)}
            >
              Skrifa drög að niðurstöðu
            </Button>
          </Box>
          <DraftConclusionModal
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            isDraftingConclusion={isDraftingConclusion}
            setIsDraftingConclusion={setIsDraftingConclusion}
          />
        </>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.IC_RECEPTION_AND_ASSIGNMENT_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoadingWorkingCase}
          nextUrl={`${constants.IC_COURT_HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`}
          nextIsDisabled={uploadState === UploadState.UPLOADING}
          nextButtonText={formatMessage(icCourtOverview.continueButton.label)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Overview
