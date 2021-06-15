import React, { useContext, useState } from 'react'
import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import {
  BlueBox,
  CaseFileList,
  FormContentContainer,
  FormFooter,
  InfoCard,
  PdfButton,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  Case,
  IntegratedCourts,
  ReadableCaseType,
} from '@island.is/judicial-system/types'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  capitalize,
  formatDate,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import * as styles from './Overview.treat'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isLoading: boolean
}

const OverviewForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isLoading } = props
  const [courtCaseNumberEM, setCourtCaseNumberEM] = useState<string>('')
  const [createCaseSuccess, setCreateCaseSuccess] = useState<boolean>(false)

  const { user } = useContext(UserContext)
  const { updateCase, createCourtCase, isCreatingCourtCase } = useCase()

  const validations: FormSettings = {
    courtCaseNumber: {
      validations: ['empty'],
    },
  }

  const { isValid } = useCaseFormHelper(
    workingCase,
    setWorkingCase,
    validations,
  )

  const handleCreateCourtCase = (workingCase: Case) => {
    createCourtCase(workingCase, setWorkingCase, setCourtCaseNumberEM)

    if (courtCaseNumberEM === '') {
      setCreateCaseSuccess(true)
    }
  }

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Yfirlit kröfu um rannsóknarheimild
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
                    value={workingCase.courtCaseNumber || ''}
                    icon={
                      workingCase.courtCaseNumber && createCaseSuccess
                        ? 'checkmark'
                        : undefined
                    }
                    errorMessage={courtCaseNumberEM}
                    hasError={!isCreatingCourtCase && courtCaseNumberEM !== ''}
                    onChange={(event) => {
                      setCreateCaseSuccess(false)
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
              {
                title: 'Ákærandi',
                value: `${workingCase.prosecutor?.name} ${workingCase.prosecutor?.title}`,
              },
              {
                title: 'Tegund kröfu',
                value: capitalize(ReadableCaseType[workingCase.type]),
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
            isRCase
          />
        </Box>
        <Box marginBottom={5}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Efni kröfu
            </Text>
          </Box>
          <Text>{workingCase.description}</Text>
        </Box>
        <Box marginBottom={5} data-testid="demands">
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Dómkröfur
            </Text>
          </Box>
          <Text>{workingCase.demands}</Text>
        </Box>
        <Box className={styles.infoSection}>
          <Box marginBottom={5}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Lagaákvæði sem brot varða við
              </Text>
            </Box>
            <Text>{workingCase.lawsBroken}</Text>
          </Box>
          <Box marginBottom={5}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Lagaákvæði sem krafan er byggð á
              </Text>
            </Box>
            <Text>{workingCase.legalBasis}</Text>
          </Box>
        </Box>
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
            files={workingCase.files || []}
            canOpenFiles={
              workingCase.judge !== null && workingCase.judge?.id === user?.id
            }
          />
        </div>
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
          previousUrl={Constants.REQUEST_LIST_ROUTE}
          nextIsLoading={isLoading}
          nextUrl={`${Constants.R_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isValid}
        />
      </FormContentContainer>
    </>
  )
}

export default OverviewForm
