import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import {
  Case,
  CaseCustodyProvisions,
  CaseType,
  IntegratedCourts,
} from '@island.is/judicial-system/types'
import {
  BlueBox,
  CaseFileList,
  FormContentContainer,
  InfoCard,
  PdfButton,
} from '@island.is/judicial-system-web/src/shared-components'
import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import * as styles from './Overview.treat'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  capitalize,
  formatDate,
  formatRequestedCustodyRestrictions,
  laws,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { requestCourtDate } from '@island.is/judicial-system-web/messages'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  handleCreateCourtCase: (wc: Case) => void
  createCourtCaseSuccess: boolean
  setCreateCourtCaseSuccess: React.Dispatch<React.SetStateAction<boolean>>
  courtCaseNumberEM: string
  setCourtCaseNumberEM: React.Dispatch<React.SetStateAction<string>>
  setIsDraftingConclusion: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >
}

const OverviewForm: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    handleCreateCourtCase,
    createCourtCaseSuccess,
    setCreateCourtCaseSuccess,
    courtCaseNumberEM,
    setCourtCaseNumberEM,
    setIsDraftingConclusion,
  } = props
  const { updateCase, isCreatingCourtCase } = useCase()
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

  return (
    <FormContentContainer>
      <Box marginBottom={7}>
        <Text as="h1" variant="h1">
          {`Yfirlit ${
            workingCase.type === CaseType.CUSTODY
              ? 'gæsluvarðhaldskröfu'
              : 'farbannskröfu'
          }`}
        </Text>
      </Box>
      <Box component="section" marginBottom={6}>
        <Box marginBottom={2}>
          <Text as="h2" variant="h3">
            Málsnúmer héraðsdóms
          </Text>
        </Box>
        <Box marginBottom={2}>
          <Text>
            Smelltu á hnappinn til að stofna nýtt mál eða skráðu inn málsnúmer
            sem er þegar til í Auði. Athugið að gögn verða sjálfkrafa vistuð á
            það málsnúmer sem slegið er inn.
          </Text>
        </Box>
        <BlueBox>
          <div className={styles.createCourtCaseContainer}>
            <Box display="flex">
              {workingCase.court &&
                IntegratedCourts.includes(workingCase.court.id) && (
                  <div className={styles.createCourtCaseButton}>
                    <Button
                      size="small"
                      onClick={() => handleCreateCourtCase(workingCase)}
                      loading={isCreatingCourtCase}
                      disabled={Boolean(workingCase.courtCaseNumber)}
                      fluid
                    >
                      Stofna nýtt mál
                    </Button>
                  </div>
                )}
              <div className={styles.createCourtCaseInput}>
                <Input
                  data-testid="courtCaseNumber"
                  name="courtCaseNumber"
                  label="Mál nr."
                  placeholder="R-X/ÁÁÁÁ"
                  size="sm"
                  backgroundColor="white"
                  value={workingCase.courtCaseNumber ?? ''}
                  icon={
                    workingCase.courtCaseNumber && createCourtCaseSuccess
                      ? 'checkmark'
                      : undefined
                  }
                  errorMessage={courtCaseNumberEM}
                  hasError={!isCreatingCourtCase && courtCaseNumberEM !== ''}
                  onChange={(event) => {
                    setCreateCourtCaseSuccess(false)
                    removeTabsValidateAndSet(
                      'courtCaseNumber',
                      event,
                      ['empty'],
                      workingCase,
                      setWorkingCase,
                      courtCaseNumberEM,
                      setCourtCaseNumberEM,
                    )
                  }}
                  onBlur={(event) => {
                    validateAndSendToServer(
                      'courtCaseNumber',
                      event.target.value,
                      ['empty'],
                      workingCase,
                      updateCase,
                      setCourtCaseNumberEM,
                    )
                  }}
                  required
                />
              </div>
            </Box>
          </div>
        </BlueBox>
      </Box>
      <Box component="section" marginBottom={5}>
        <InfoCard
          data={[
            {
              title: 'Embætti',
              value: `${
                workingCase.prosecutor?.institution?.name ?? 'Ekki skráð'
              }`,
            },
            {
              title: formatMessage(requestCourtDate.heading),
              value: `${capitalize(
                formatDate(workingCase.requestedCourtDate, 'PPPP', true) ?? '',
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
                      workingCase.parentCase.validToDate,
                      'PPPP',
                      true,
                    ) ?? '',
                  )} kl. ${formatDate(
                    workingCase.parentCase.validToDate,
                    TIME_FORMAT,
                  )}`
                : workingCase.arrestDate
                ? `${capitalize(
                    formatDate(workingCase.arrestDate, 'PPPP', true) ?? '',
                  )} kl. ${formatDate(workingCase.arrestDate, TIME_FORMAT)}`
                : 'Var ekki skráður',
            },
          ]}
          accusedName={workingCase.accusedName}
          accusedNationalId={workingCase.accusedNationalId}
          accusedAddress={workingCase.accusedAddress}
          defender={{
            name: workingCase.defenderName ?? '',
            email: workingCase.defenderEmail,
            phoneNumber: workingCase.defenderPhoneNumber,
          }}
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
        <div className={styles.infoSection}>
          <Box marginBottom={6} data-testid="lawsBroken">
            <Box marginBottom={1}>
              <Text as="h2" variant="h3">
                Lagaákvæði sem brot varða við
              </Text>
            </Box>
            <Text>
              <span className={styles.breakSpaces}>
                {workingCase.lawsBroken}
              </span>
            </Text>
          </Box>
          <Box data-testid="custodyProvisions">
            <Box marginBottom={1}>
              <Text as="h2" variant="h3">
                Lagaákvæði sem krafan er byggð á
              </Text>
            </Box>
            {workingCase.custodyProvisions?.map(
              (custodyProvision: CaseCustodyProvisions, index) => {
                return (
                  <div key={index}>
                    <Text>{laws[custodyProvision]}</Text>
                  </div>
                )
              },
            )}
          </Box>
        </div>
        <div className={styles.infoSection} data-testid="custodyRestrictions">
          <Box marginBottom={1}>
            <Text variant="h3" as="h2">
              {`Takmarkanir og tilhögun ${
                workingCase.type === CaseType.CUSTODY ? 'gæslu' : 'farbanns'
              }`}
            </Text>
          </Box>
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
        </div>
        {(workingCase.caseFacts || workingCase.legalArguments) && (
          <div className={styles.infoSection}>
            <Box marginBottom={1}>
              <Text variant="h3" as="h2">
                Greinargerð um málsatvik og lagarök
              </Text>
            </Box>
            {workingCase.caseFacts && (
              <Box marginBottom={2}>
                <Box marginBottom={2}>
                  <Text variant="eyebrow" color="blue400">
                    Málsatvik
                  </Text>
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
                  <Text variant="eyebrow" color="blue400">
                    Lagarök
                  </Text>
                </Box>
                <Text>
                  <span className={styles.breakSpaces}>
                    {workingCase.legalArguments}
                  </span>
                </Text>
              </Box>
            )}
          </div>
        )}
        {(workingCase.comments || workingCase.caseFilesComments) && (
          <div className={styles.infoSection}>
            <Box marginBottom={2}>
              <Text variant="h3" as="h2">
                Athugasemdir
              </Text>
            </Box>
            {workingCase.comments && (
              <Box marginBottom={workingCase.caseFilesComments ? 3 : 0}>
                <Box marginBottom={1}>
                  <Text variant="h4" as="h3" color="blue400">
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
            {workingCase.caseFilesComments && (
              <>
                <Box marginBottom={1}>
                  <Text variant="h4" as="h3" color="blue400">
                    Athugasemdir vegna rannsóknargagna
                  </Text>
                </Box>
                <Text>
                  <span className={styles.breakSpaces}>
                    {workingCase.caseFilesComments}
                  </span>
                </Text>
              </>
            )}
          </div>
        )}

        <div className={styles.infoSection}>
          <Box marginBottom={1}>
            <Text as="h2" variant="h3">
              {`Rannsóknargögn (${
                workingCase.files ? workingCase.files.length : 0
              })`}
            </Text>
          </Box>
          <CaseFileList
            caseId={workingCase.id}
            files={workingCase.files ?? []}
            canOpenFiles={
              workingCase.judge !== null && workingCase.judge?.id === user?.id
            }
          />
        </div>
        <Box marginBottom={3}>
          <PdfButton
            caseId={workingCase.id}
            title="Opna PDF kröfu"
            pdfType="request"
          />
        </Box>
        <Button
          variant="ghost"
          icon="pencil"
          size="small"
          onClick={() => setIsDraftingConclusion(true)}
        >
          Skrifa drög að niðurstöðu
        </Button>
      </Box>
    </FormContentContainer>
  )
}

export default OverviewForm
