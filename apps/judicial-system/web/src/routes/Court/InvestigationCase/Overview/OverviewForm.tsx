import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  Accordion,
  AccordionItem,
  AlertMessage,
  Box,
  Button,
  Text,
} from '@island.is/island-ui/core'
import {
  AccordionListItem,
  CommentsAccordionItem,
  FormContentContainer,
  FormFooter,
  InfoCard,
  PdfButton,
} from '@island.is/judicial-system-web/src/components'
import {
  capitalize,
  caseTypes,
  formatDate,
} from '@island.is/judicial-system/formatters'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import {
  core,
  icCourtOverview,
  requestCourtDate,
} from '@island.is/judicial-system-web/messages'
import CaseFilesAccordionItem from '@island.is/judicial-system-web/src/components/AccordionItems/CaseFilesAccordionItem/CaseFilesAccordionItem'
import {
  UploadState,
  useCourtUpload,
} from '@island.is/judicial-system-web/src/utils/hooks/useCourtUpload'
import MarkdownWrapper from '@island.is/judicial-system-web/src/components/MarkdownWrapper/MarkdownWrapper'
import type { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system/consts'

import DraftConclusionModal from '../../SharedComponents/DraftConclusionModal/DraftConclusionModal'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  isLoading: boolean
}

const OverviewForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isLoading } = props
  const [isDraftingConclusion, setIsDraftingConclusion] = useState<boolean>()
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const { uploadState } = useCourtUpload(workingCase, setWorkingCase)

  return (
    <>
      <FormContentContainer>
        {workingCase.caseResentExplanation && (
          <Box marginBottom={5}>
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
                value: `${
                  workingCase.creatingProsecutor?.institution?.name ??
                  'Ekki skráð'
                }`,
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
              data-testId="draftConclusionButton"
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
          previousUrl={`${Constants.IC_RECEPTION_AND_ASSIGNMENT_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoading}
          nextUrl={`${Constants.IC_COURT_HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`}
          nextIsDisabled={uploadState === UploadState.UPLOADING}
        />
      </FormContentContainer>
    </>
  )
}

export default OverviewForm
