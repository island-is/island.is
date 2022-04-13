import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { CaseType } from '@island.is/judicial-system/types'
import {
  AccordionListItem,
  CommentsAccordionItem,
  FormContentContainer,
  InfoCard,
  PdfButton,
} from '@island.is/judicial-system-web/src/components'
import {
  Accordion,
  AccordionItem,
  AlertMessage,
  Box,
  Button,
  Text,
} from '@island.is/island-ui/core'
import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import CaseFilesAccordionItem from '@island.is/judicial-system-web/src/components/AccordionItems/CaseFilesAccordionItem/CaseFilesAccordionItem'
import {
  core,
  laws,
  requestCourtDate,
  rcCourtOverview,
} from '@island.is/judicial-system-web/messages'
import MarkdownWrapper from '@island.is/judicial-system-web/src/components/MarkdownWrapper/MarkdownWrapper'
import type {
  Case,
  CaseLegalProvisions,
} from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'

import DraftConclusionModal from '../../SharedComponents/DraftConclusionModal/DraftConclusionModal'
import { formatRequestedCustodyRestrictions } from '@island.is/judicial-system-web/src/utils/restrictions'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
}

const OverviewForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props
  const [isDraftingConclusion, setIsDraftingConclusion] = useState<boolean>()
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

  return (
    <FormContentContainer>
      {workingCase.caseResentExplanation && (
        <Box marginBottom={5}>
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
      <Box marginBottom={7}>
        <Text as="h1" variant="h1">
          {`Yfirlit ${
            workingCase.type === CaseType.CUSTODY
              ? 'gæsluvarðhaldskröfu'
              : 'farbannskröfu'
          }`}
        </Text>
      </Box>
      <Box component="section" marginBottom={5}>
        <InfoCard
          data={[
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
                formatDate(workingCase.requestedCourtDate, 'PPPP', true) ?? '',
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
                        <Text>{formatMessage(laws[legalProvision].title)}</Text>
                      </div>
                    )
                  },
                )}
              {workingCase.legalBasis && <Text>{workingCase.legalBasis}</Text>}
            </AccordionItem>
            <AccordionItem
              labelVariant="h3"
              id="id_3"
              label={`Takmarkanir og tilhögun ${
                workingCase.type === CaseType.CUSTODY ? 'gæslu' : 'farbanns'
              }`}
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
    </FormContentContainer>
  )
}

export default OverviewForm
