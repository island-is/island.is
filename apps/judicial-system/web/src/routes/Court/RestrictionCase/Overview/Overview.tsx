import { useCallback, useContext, useState } from 'react'
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
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  core,
  laws,
  rcCourtOverview,
  restrictionsV2,
  titles,
} from '@island.is/judicial-system-web/messages'
import { lawsBrokenAccordion } from '@island.is/judicial-system-web/messages/Core/lawsBrokenAccordion'
import {
  AccordionListItem,
  CaseFilesAccordionItem,
  CaseResentExplanation,
  CaseScheduledCard,
  CommentsAccordionItem,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCard,
  PageHeader,
  PageLayout,
  PageTitle,
  PdfButton,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import useInfoCardItems from '@island.is/judicial-system-web/src/components/InfoCard/useInfoCardItems'
import {
  CaseLegalProvisions,
  CaseState,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  UploadState,
  useCourtUpload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { formatRequestedCustodyRestrictions } from '@island.is/judicial-system-web/src/utils/restrictions'

import { DraftConclusionModal } from '../../components'

export const JudgeOverview = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const id = router.query.id

  const { uploadState } = useCourtUpload(workingCase, setWorkingCase)
  const {
    defendants,
    policeCaseNumbers,
    prosecutor,
    prosecutorsOffice,
    requestedCourtDate,
    parentCaseValidToDate,
  } = useInfoCardItems()

  const [isDraftingConclusion, setIsDraftingConclusion] = useState<boolean>()

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
        <PageTitle>
          {formatMessage(rcCourtOverview.sections.title, {
            caseType: workingCase.type,
          })}
        </PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        {workingCase.state === CaseState.RECEIVED &&
          workingCase.arraignmentDate?.date &&
          workingCase.court && (
            <Box component="section" marginBottom={5}>
              <CaseScheduledCard
                court={workingCase.court}
                courtDate={workingCase.arraignmentDate.date}
                courtRoom={workingCase.arraignmentDate.location}
              />
            </Box>
          )}
        <Box component="section" marginBottom={5}>
          <InfoCard
            sections={[
              {
                id: 'defendants-section',
                items: [defendants({ caseType: workingCase.type })],
              },
              {
                id: 'case-info-section',
                items: [
                  policeCaseNumbers,
                  requestedCourtDate,
                  prosecutorsOffice,
                  parentCaseValidToDate,
                  prosecutor(workingCase.type),
                ],
                columns: 2,
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
              elementId={formatMessage(core.pdfButtonRequest)}
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
