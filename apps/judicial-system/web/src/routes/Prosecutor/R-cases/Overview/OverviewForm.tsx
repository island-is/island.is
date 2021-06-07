import React, { useContext } from 'react'
import { Accordion, AccordionItem, Box, Text } from '@island.is/island-ui/core'
import {
  Case,
  CaseCustodyProvisions,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'
import {
  CaseFileList,
  FormContentContainer,
  FormFooter,
  InfoCard,
  PdfButton,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  capitalize,
  formatDate,
  formatRequestedCustodyRestrictions,
  laws,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import { constructProsecutorDemands } from '@island.is/judicial-system-web/src/utils/stepHelper'
import * as styles from './Overview.treat'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  handleNextButtonClick: () => void
  isSendingNotification: boolean
}

const OverviewForm: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    handleNextButtonClick,
    isSendingNotification,
  } = props
  const { user } = useContext(UserContext)

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={10}>
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
                title: 'Dómstóll',
                value: workingCase.court?.name,
              },
              {
                title: 'Embætti',
                value: `${
                  workingCase.prosecutor?.institution?.name || 'Ekki skráð'
                }`,
              },
              {
                title: 'Ósk um fyrirtökudag og tíma',
                value: `${capitalize(
                  formatDate(workingCase.requestedCourtDate, 'PPPP', true) ||
                    '',
                )} eftir kl. ${formatDate(
                  workingCase.requestedCourtDate,
                  TIME_FORMAT,
                )}`,
              },
              { title: 'Ákærandi', value: workingCase.prosecutor?.name },
              {
                title: workingCase.parentCase
                  ? `${
                      workingCase.type === CaseType.CUSTODY
                        ? 'Fyrri gæsla'
                        : 'Fyrra farbann'
                    }`
                  : 'Tími handtöku',
                value: workingCase.parentCase
                  ? `${capitalize(
                      formatDate(
                        workingCase.parentCase.requestedValidToDate,
                        'PPPP',
                        true,
                      ) || '',
                    )} kl. ${formatDate(
                      workingCase.parentCase.requestedValidToDate,
                      TIME_FORMAT,
                    )}`
                  : workingCase.arrestDate
                  ? `${capitalize(
                      formatDate(workingCase.arrestDate, 'PPPP', true) || '',
                    )} kl. ${formatDate(workingCase.arrestDate, TIME_FORMAT)}`
                  : 'Var ekki skráður',
              },
            ]}
            accusedName={workingCase.accusedName}
            accusedNationalId={workingCase.accusedNationalId}
            accusedAddress={workingCase.accusedAddress}
            defender={{
              name: workingCase.defenderName || '',
              email: workingCase.defenderEmail,
              phoneNumber: workingCase.defenderPhoneNumber,
            }}
          />
        </Box>
        <Box
          component="section"
          marginBottom={5}
          data-testid="prosecutorDemands"
        >
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Dómkröfur
            </Text>
          </Box>
          {constructProsecutorDemands(workingCase)}
        </Box>
        <Box component="section" marginBottom={10}>
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
              {workingCase.custodyProvisions &&
                workingCase.custodyProvisions.map(
                  (custodyProvision: CaseCustodyProvisions, index) => {
                    return (
                      <div key={index}>
                        <Text>{laws[custodyProvision]}</Text>
                      </div>
                    )
                  },
                )}
            </AccordionItem>
            <AccordionItem
              labelVariant="h3"
              id="id_3"
              label={`Takmarkanir og tilhögun ${
                workingCase.type === CaseType.CUSTODY ? 'gæslu' : 'farbanns'
              }`}
            >
              {formatRequestedCustodyRestrictions(
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
                workingCase.files ? workingCase.files.length : 0
              })`}`}
              labelVariant="h3"
            >
              <Box marginY={3}>
                <CaseFileList
                  caseId={workingCase.id}
                  files={workingCase.files || []}
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
            title="Opna PDF kröfu"
            pdfType="request"
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.STEP_FIVE_ROUTE}/${workingCase.id}`}
          nextButtonText={
            workingCase.state === CaseState.NEW ||
            workingCase.state === CaseState.DRAFT
              ? 'Senda kröfu á héraðsdóm'
              : 'Endursenda kröfu á héraðsdóm'
          }
          nextIsLoading={isSendingNotification}
          onNextButtonClick={handleNextButtonClick}
        />
      </FormContentContainer>
    </>
  )
}

export default OverviewForm
