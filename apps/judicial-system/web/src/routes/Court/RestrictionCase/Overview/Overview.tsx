import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Accordion,
  AccordionItem,
  AlertMessage,
  Box,
  Button,
  Text,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import { isAcceptingCaseDecision } from '@island.is/judicial-system/types'
import {
  core,
  laws,
  rcCourtOverview,
  requestCourtDate,
  restrictionsV2,
  ruling,
  titles,
} from '@island.is/judicial-system-web/messages'
import { lawsBrokenAccordion } from '@island.is/judicial-system-web/messages/Core/lawsBrokenAccordion'
import {
  AccordionListItem,
  CaseFilesAccordionItem,
  CaseResentExplanation,
  CommentsAccordionItem,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCard,
  PageHeader,
  PageLayout,
  PdfButton,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseLegalProvisions } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  UploadState,
  useCase,
  useCourtUpload,
  useOnceOn,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { formatRequestedCustodyRestrictions } from '@island.is/judicial-system-web/src/utils/restrictions'

import { DraftConclusionModal } from '../../components'

export const JudgeOverview: React.FC<React.PropsWithChildren<unknown>> = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const id = router.query.id

  const { uploadState } = useCourtUpload(workingCase, setWorkingCase)
  const { setAndSendCaseToServer } = useCase()

  const [isDraftingConclusion, setIsDraftingConclusion] = useState<boolean>()

  const initialize = useCallback(() => {
    setAndSendCaseToServer(
      [
        {
          ruling: !workingCase.parentCase
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
  }, [setAndSendCaseToServer, formatMessage, setWorkingCase, workingCase])

  useOnceOn(isCaseUpToDate, initialize)

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [router, workingCase.id],
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
        title={formatMessage(titles.court.restrictionCases.overview)}
      />
      <FormContentContainer>
        {workingCase.caseResentExplanation && (
          <Box marginBottom={workingCase.openedByDefender ? 3 : 5}>
            <CaseResentExplanation
              explanation={workingCase.caseResentExplanation}
            />
          </Box>
        )}
        {workingCase.openedByDefender && (
          <Box marginBottom={5}>
            <AlertMessage
              title={formatMessage(
                rcCourtOverview.sections.openedByDefenderAlert.title,
              )}
              message={formatMessage(
                rcCourtOverview.sections.openedByDefenderAlert.text,
                { when: formatDate(workingCase.openedByDefender, 'PPPp') },
              )}
              type="info"
              testid="alertMessageOpenedByDefender"
            />
          </Box>
        )}
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(rcCourtOverview.sections.title, {
              caseType: workingCase.type,
            })}
          </Text>
        </Box>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <InfoCard
            data={[
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
                title: workingCase.parentCase
                  ? formatMessage(core.pastRestrictionCase, {
                      caseType: workingCase.type,
                    })
                  : formatMessage(core.arrestDate),
                value: workingCase.parentCase
                  ? `${capitalize(
                      formatDate(
                        workingCase.parentCase.validToDate,
                        'PPPP',
                        true,
                      ) ?? '',
                    )} kl. ${formatDate(
                      workingCase.parentCase.validToDate,
                      constants.TIME_FORMAT,
                    )}`
                  : workingCase.arrestDate
                  ? `${capitalize(
                      formatDate(workingCase.arrestDate, 'PPPP', true) ?? '',
                    )} kl. ${formatDate(
                      workingCase.arrestDate,
                      constants.TIME_FORMAT,
                    )}`
                  : 'Var ekki skráður',
              },
            ]}
            defendants={
              workingCase.defendants
                ? {
                    title: capitalize(
                      formatMessage(core.defendant, {
                        suffix: workingCase.defendants.length > 1 ? 'ar' : 'i',
                      }),
                    ),
                    items: workingCase.defendants,
                  }
                : undefined
            }
            defenders={[
              {
                name: workingCase.defenderName ?? '',
                email: workingCase.defenderEmail,
                sessionArrangement: workingCase.sessionArrangements,
                phoneNumber: workingCase.defenderPhoneNumber,
              },
            ]}
          />
        </Box>
        <Box marginBottom={5}>
          <Box marginBottom={9}>
            <Box marginBottom={2}>
              <Text variant="h3" as="h2">
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
                label={formatMessage(lawsBrokenAccordion.heading)}
              >
                <Text whiteSpace="breakSpaces">{workingCase.lawsBroken}</Text>
              </AccordionItem>
              <AccordionItem
                labelVariant="h3"
                id="id_2"
                label="Lagaákvæði sem krafan er byggð á"
              >
                {workingCase.legalProvisions &&
                  workingCase.legalProvisions.map(
                    (legalProvision: CaseLegalProvisions, index: number) => {
                      return (
                        <div key={index}>
                          <Text>
                            {formatMessage(laws[legalProvision].title)}
                          </Text>
                        </div>
                      )
                    },
                  )}
                {workingCase.legalBasis && (
                  <Text>{workingCase.legalBasis}</Text>
                )}
              </AccordionItem>
              <AccordionItem
                labelVariant="h3"
                id="id_3"
                label={formatMessage(restrictionsV2.title, {
                  caseType: workingCase.type,
                })}
              >
                {formatRequestedCustodyRestrictions(
                  formatMessage,
                  workingCase.type,
                  workingCase.requestedCustodyRestrictions,
                  workingCase.requestedOtherRestrictions,
                )
                  .split('\n')
                  .map((requestedCustodyRestriction, index) => {
                    return (
                      <div key={index}>
                        <Text>{requestedCustodyRestriction}</Text>
                      </div>
                    )
                  })}
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
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`}
          onNextButtonClick={() =>
            handleNavigationTo(
              constants.RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
            )
          }
          nextIsDisabled={uploadState === UploadState.UPLOADING}
          nextButtonText={formatMessage(rcCourtOverview.continueButton.label)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default JudgeOverview
