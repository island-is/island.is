import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Accordion, AccordionItem, Box, Text } from '@island.is/island-ui/core'
import { CaseState, CaseType } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import {
  CaseFileList,
  FormContentContainer,
  FormFooter,
  InfoCard,
  PdfButton,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  capitalize,
  caseTypes,
  formatDate,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { core, requestCourtDate } from '@island.is/judicial-system-web/messages'

import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import * as styles from './Overview.treat'

interface Props {
  workingCase: Case
  handleNextButtonClick: () => void
  isLoading: boolean
}

const OverviewForm: React.FC<Props> = (props) => {
  const { workingCase, handleNextButtonClick, isLoading } = props
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Yfirlit kröfu um rannsóknarheimild
          </Text>
        </Box>
        <Box component="section" marginBottom={5}>
          <InfoCard
            data={[
              {
                title: 'LÖKE málsnúmer',
                value: workingCase.policeCaseNumber,
              },
              {
                title: 'Krafa stofnuð',
                value: formatDate(workingCase.created, 'P'),
              },
              {
                title: 'Embætti',
                value: `${
                  workingCase.prosecutor?.institution?.name ?? 'Ekki skráð'
                }`,
              },
              {
                title: formatMessage(requestCourtDate.heading),
                value: `${capitalize(
                  formatDate(workingCase.requestedCourtDate, 'PPPP', true) ??
                    '',
                )} eftir kl. ${formatDate(
                  workingCase.requestedCourtDate,
                  TIME_FORMAT,
                )}`,
              },
              {
                title: 'Ákærandi',
                value: `${workingCase.prosecutor?.name} ${workingCase.prosecutor?.title}`,
              },
              {
                title: 'Tegund kröfu',
                value: capitalize(caseTypes[workingCase.type]),
              },
            ]}
            accusedName={workingCase.accusedName}
            accusedNationalId={workingCase.accusedNationalId}
            accusedAddress={workingCase.accusedAddress}
            defender={{
              name: workingCase.defenderName ?? '',
              email: workingCase.defenderEmail,
              phoneNumber: workingCase.defenderPhoneNumber,
              defenderIsSpokesperson: workingCase.defenderIsSpokesperson,
            }}
            isRCase
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Efni kröfu
            </Text>
          </Box>
          <Text>{workingCase.description}</Text>
        </Box>
        <Box component="section" marginBottom={5} data-testid="demands">
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Dómkröfur
            </Text>
          </Box>
          <Text>{workingCase.demands}</Text>
        </Box>
        <Box component="section" marginBottom={5}>
          <Accordion>
            <AccordionItem
              labelVariant="h3"
              id="id_2"
              label="Lagaákvæði sem brot varða við"
            >
              <Text>
                <span className={styles.breakSpaces}>
                  {workingCase.lawsBroken}
                </span>
              </Text>
            </AccordionItem>
            <AccordionItem
              labelVariant="h3"
              id="id_2"
              label="Lagaákvæði sem krafan er byggð á"
            >
              <Text>{workingCase.legalBasis}</Text>
            </AccordionItem>
            <AccordionItem
              labelVariant="h3"
              id="id_4"
              label="Greinargerð um málsatvik og lagarök"
            >
              {workingCase.caseFacts && (
                <Box marginBottom={2}>
                  <Box marginBottom={2}>
                    <Text variant="h5">Málsatvik</Text>
                  </Box>
                  <Text>
                    <span className={styles.breakSpaces}>
                      {workingCase.caseFacts}
                    </span>
                  </Text>
                </Box>
              )}
              {workingCase.legalArguments && (
                <Box marginBottom={2}>
                  <Box marginBottom={2}>
                    <Text variant="h5">Lagarök</Text>
                  </Box>
                  <Text>
                    <span className={styles.breakSpaces}>
                      {workingCase.legalArguments}
                    </span>
                  </Text>
                </Box>
              )}
              {workingCase.requestProsecutorOnlySession && (
                <Box marginBottom={2}>
                  <Box marginBottom={2}>
                    <Text variant="h5" as="h5">
                      Beiðni um dómþing að varnaraðila fjarstöddum
                    </Text>
                  </Box>
                  <Text>{workingCase.prosecutorOnlySessionRequest}</Text>
                </Box>
              )}
            </AccordionItem>
            {(Boolean(workingCase.comments) ||
              Boolean(workingCase.caseFilesComments)) && (
              <AccordionItem id="id_5" label="Athugasemdir" labelVariant="h3">
                {Boolean(workingCase.comments) && (
                  <Box marginBottom={workingCase.caseFilesComments ? 3 : 0}>
                    <Box marginBottom={1}>
                      <Text variant="h4" as="h4">
                        Athugasemdir vegna málsmeðferðar
                      </Text>
                    </Box>
                    <Text>
                      <span className={styles.breakSpaces}>
                        {workingCase.comments}
                      </span>
                    </Text>
                  </Box>
                )}
                {Boolean(workingCase.caseFilesComments) && (
                  <>
                    <Text variant="h4" as="h4">
                      Athugasemdir vegna rannsóknargagna
                    </Text>
                    <Text>
                      <span className={styles.breakSpaces}>
                        {workingCase.caseFilesComments}
                      </span>
                    </Text>
                  </>
                )}
              </AccordionItem>
            )}
            <AccordionItem
              id="id_6"
              label={`Rannsóknargögn ${`(${
                workingCase.caseFiles ? workingCase.caseFiles.length : 0
              })`}`}
              labelVariant="h3"
            >
              <Box marginY={3}>
                <CaseFileList
                  caseId={workingCase.id}
                  files={workingCase.caseFiles ?? []}
                />
              </Box>
            </AccordionItem>
          </Accordion>
        </Box>
        <Box className={styles.prosecutorContainer}>
          <Text variant="h3">
            {workingCase.prosecutor
              ? `${workingCase.prosecutor.name} ${workingCase.prosecutor.title}`
              : `${user?.name} ${user?.title}`}
          </Text>
        </Box>
        <Box marginBottom={10}>
          <PdfButton
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRequest)}
            pdfType="request"
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.IC_CASE_FILES_ROUTE}/${workingCase.id}`}
          nextButtonText={
            workingCase.state === CaseState.NEW ||
            workingCase.state === CaseState.DRAFT
              ? 'Senda kröfu á héraðsdóm'
              : 'Endursenda kröfu á héraðsdóm'
          }
          nextIsLoading={isLoading}
          onNextButtonClick={handleNextButtonClick}
        />
      </FormContentContainer>
    </>
  )
}

export default OverviewForm
