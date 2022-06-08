import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  FormFooter,
  PageLayout,
  FormContentContainer,
  PdfButton,
  CaseFilesAccordionItem,
  CommentsAccordionItem,
  AccordionListItem,
  InfoCard,
} from '@island.is/judicial-system-web/src/components'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  UploadState,
  useCourtUpload,
} from '@island.is/judicial-system-web/src/utils/hooks/useCourtUpload'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  titles,
  ruling,
  rcCourtOverview,
  core,
  laws,
  requestCourtDate,
  restrictionsV2,
} from '@island.is/judicial-system-web/messages'
import {
  CaseLegalProvisions,
  isAcceptingCaseDecision,
} from '@island.is/judicial-system/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  Text,
  Accordion,
  AccordionItem,
  Box,
  Button,
  AlertMessage,
} from '@island.is/island-ui/core'
import { formatRequestedCustodyRestrictions } from '@island.is/judicial-system-web/src/utils/restrictions'
import MarkdownWrapper from '@island.is/judicial-system-web/src/components/MarkdownWrapper/MarkdownWrapper'
import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import * as Constants from '@island.is/judicial-system/consts'

import DraftConclusionModal from '../../SharedComponents/DraftConclusionModal/DraftConclusionModal'

export const JudgeOverview: React.FC = () => {
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
  const { autofill } = useCase()

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
        title={formatMessage(titles.court.restrictionCases.overview)}
      />
      <FormContentContainer>
        {workingCase.caseResentExplanation && (
          <Box marginBottom={workingCase.seenByDefender ? 3 : 5}>
            <AlertMessage
              title={formatMessage(
                rcCourtOverview.sections.caseResentExplanation.title,
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
                rcCourtOverview.sections.seenByDefenderAlert.title,
              )}
              message={formatMessage(
                rcCourtOverview.sections.seenByDefenderAlert.text,
                { when: formatDate(workingCase.seenByDefender, 'PPPp') },
              )}
              type="info"
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
                  Constants.TIME_FORMAT,
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
                      Constants.TIME_FORMAT,
                    )}`
                  : workingCase.arrestDate
                  ? `${capitalize(
                      formatDate(workingCase.arrestDate, 'PPPP', true) ?? '',
                    )} kl. ${formatDate(
                      workingCase.arrestDate,
                      Constants.TIME_FORMAT,
                    )}`
                  : 'Var ekki skráður',
              },
            ]}
            defendants={workingCase.defendants ?? []}
            defender={{
              name: workingCase.defenderName ?? '',
              email: workingCase.defenderEmail,
              phoneNumber: workingCase.defenderPhoneNumber,
            }}
            sessionArrangement={workingCase.sessionArrangements}
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
                label="Lagaákvæði sem brot varða við"
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
          previousUrl={`${Constants.RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`}
          nextUrl={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/${id}`}
          nextIsDisabled={uploadState === UploadState.UPLOADING}
          nextButtonText={formatMessage(rcCourtOverview.continueButton.label)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default JudgeOverview
