import React, { useEffect, useState, useCallback, useContext } from 'react'
import { Box, Text, Input, Button } from '@island.is/island-ui/core'
import {
  formatDate,
  capitalize,
  formatRequestedCustodyRestrictions,
  laws,
} from '@island.is/judicial-system/formatters'
import {
  constructProsecutorDemands,
  isNextDisabled,
} from '@island.is/judicial-system-web/src/utils/stepHelper'
import {
  FormFooter,
  PageLayout,
  InfoCard,
  PdfButton,
  BlueBox,
  Modal,
  FormContentContainer,
  CaseFileList,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { TIME_FORMAT } from '@island.is/judicial-system/formatters'
import {
  Case,
  CaseCustodyProvisions,
  CaseState,
  CaseTransition,
  CaseType,
  Feature,
  UpdateCase,
} from '@island.is/judicial-system/types'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  TransitionCaseMutation,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/graphql'
import {
  CaseData,
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
  setAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { parseTransition } from '@island.is/judicial-system-web/src/utils/formatters'
import { useRouter } from 'next/router'
import { CreateCustodyCourtCaseMutation } from '@island.is/judicial-system-web/src/utils/mutations'
import { FeatureContext } from '@island.is/judicial-system-web/src/shared-components/FeatureProvider/FeatureProvider'
import * as styles from './Overview.treat'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'

interface CreateCustodyCourtCaseMutationResponse {
  createCustodyCourtCase: {
    courtCaseNumber: string
  }
}

export const JudgeOverview: React.FC = () => {
  const router = useRouter()
  const id = router.query.id
  const [
    courtCaseNumberErrorMessage,
    setCourtCaseNumberErrorMessage,
  ] = useState('')
  const [workingCase, setWorkingCase] = useState<Case>()
  const [modalVisible, setModalVisible] = useState<boolean>()
  const { features } = useContext(FeatureContext)
  const [showCreateCustodyCourtCase, setShowCreateCustodyCourtCase] = useState(
    false,
  )
  const { user } = useContext(UserContext)

  const [
    createCustodyCourtCaseMutation,
    { loading: creatingCustodyCourtCase },
  ] = useMutation<CreateCustodyCourtCaseMutationResponse>(
    CreateCustodyCourtCaseMutation,
  )

  const createCase = async (): Promise<void> => {
    if (creatingCustodyCourtCase === false) {
      try {
        const { data, errors } = await createCustodyCourtCaseMutation({
          variables: {
            input: {
              caseId: workingCase?.id,
              policeCaseNumber: workingCase?.policeCaseNumber,
            },
          },
        })

        if (data && workingCase && !errors) {
          setAndSendToServer(
            'courtCaseNumber',
            data.createCustodyCourtCase.courtCaseNumber,
            workingCase,
            setWorkingCase,
            updateCase,
          )

          setCourtCaseNumberErrorMessage('')

          return
        }
      } catch (error) {
        // Catch all so we can set an eror message
      }

      setCourtCaseNumberErrorMessage(
        'Ekki tókst að stofna mál, vinsamlegast reyndu aftur eða sláðu inn málsnr. í reitinn',
      )
    }
  }

  const handleSetCaseNrManuallyClick = () => {
    if (workingCase) {
      setAndSendToServer(
        'setCourtCaseNumberManually',
        true,
        workingCase,
        setWorkingCase,
        updateCase,
      )
      setModalVisible(true)
      setCourtCaseNumberErrorMessage('')
    }
  }
  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const [updateCaseMutation] = useMutation(UpdateCaseMutation)
  const updateCase = useCallback(
    async (id: string, updateCase: UpdateCase) => {
      const { data } = await updateCaseMutation({
        variables: { input: { id, ...updateCase } },
      })
      const resCase = data?.updateCase
      if (resCase) {
        // Do something with the result. In particular, we want th modified timestamp passed between
        // the client and the backend so that we can handle multiple simultanious updates.
      }
      return resCase
    },
    [updateCaseMutation],
  )

  const [transitionCaseMutation] = useMutation(TransitionCaseMutation)

  useEffect(() => {
    const transitionCase = async (theCase: Case) => {
      try {
        // Parse the transition request
        const transitionRequest = parseTransition(
          theCase.modified,
          CaseTransition.RECEIVE,
        )

        const { data } = await transitionCaseMutation({
          variables: {
            input: { id: theCase.id, ...transitionRequest },
          },
        })

        if (!data) {
          return false
        }

        setWorkingCase({
          ...workingCase,
          state: data.transitionCase.state,
        } as Case)
      } catch (e) {
        // TODO: Handle error
      }
    }

    if (workingCase?.state === CaseState.SUBMITTED) {
      transitionCase(workingCase)
    }
  }, [workingCase, setWorkingCase, transitionCaseMutation])

  useEffect(() => {
    const tryToShowFeature = (theCase: Case) => {
      setShowCreateCustodyCourtCase(
        theCase.type === CaseType.CUSTODY &&
          features.includes(Feature.CREATE_CUSTODY_COURT_CASE),
      )
    }

    if (workingCase) {
      tryToShowFeature(workingCase)
    }
  }, [features, workingCase, setShowCreateCustodyCourtCase])

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data])

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.JUDGE_OVERVIEW}
      isLoading={loading}
      notFound={data?.case === undefined}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
    >
      {workingCase ? (
        <>
          <FormContentContainer>
            <Box marginBottom={10}>
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
                <Text as="h3" variant="h3">
                  Málsnúmer héraðsdóms
                </Text>
              </Box>
              <BlueBox>
                <div className={styles.createCourtCaseContainer}>
                  <Box display="flex">
                    {showCreateCustodyCourtCase &&
                      !workingCase.setCourtCaseNumberManually && (
                        <div className={styles.createCourtCaseButton}>
                          <Button
                            size="small"
                            onClick={createCase}
                            loading={creatingCustodyCourtCase}
                            disabled={!!workingCase.courtCaseNumber}
                            fluid
                          >
                            Stofna mál
                          </Button>
                        </div>
                      )}
                    <div className={styles.createCourtCaseInput}>
                      <Input
                        data-testid="courtCaseNumber"
                        name="courtCaseNumber"
                        label="Mál nr."
                        placeholder={
                          !showCreateCustodyCourtCase ||
                          workingCase.setCourtCaseNumberManually
                            ? 'R-X/ÁÁÁÁ'
                            : 'Málsnúmer birtist hér með því að smella á stofna mál'
                        }
                        size="sm"
                        backgroundColor={
                          !showCreateCustodyCourtCase ||
                          workingCase.setCourtCaseNumberManually
                            ? 'white'
                            : 'blue'
                        }
                        value={workingCase.courtCaseNumber || ''}
                        icon={
                          workingCase.courtCaseNumber &&
                          showCreateCustodyCourtCase &&
                          !workingCase.setCourtCaseNumberManually
                            ? 'checkmark'
                            : undefined
                        }
                        disabled={
                          showCreateCustodyCourtCase &&
                          !workingCase.setCourtCaseNumberManually
                        }
                        errorMessage={courtCaseNumberErrorMessage}
                        hasError={
                          !creatingCustodyCourtCase &&
                          courtCaseNumberErrorMessage !== ''
                        }
                        onChange={(event) =>
                          removeTabsValidateAndSet(
                            'courtCaseNumber',
                            event,
                            ['empty'],
                            workingCase,
                            setWorkingCase,
                            courtCaseNumberErrorMessage,
                            setCourtCaseNumberErrorMessage,
                          )
                        }
                        onBlur={(event) => {
                          validateAndSendToServer(
                            'courtCaseNumber',
                            event.target.value,
                            ['empty'],
                            workingCase,
                            updateCase,
                            setCourtCaseNumberErrorMessage,
                          )
                        }}
                        required
                      />
                      {showCreateCustodyCourtCase &&
                        workingCase.setCourtCaseNumberManually && (
                          <Box marginTop={1}>
                            <Text variant="eyebrow" color="blue400">
                              Ath. Gögn verða sjálfkrafa vistuð og uppfærð á það
                              málsnúmer sem slegið er inn
                            </Text>
                          </Box>
                        )}
                    </div>
                  </Box>
                  {courtCaseNumberErrorMessage &&
                    showCreateCustodyCourtCase &&
                    !workingCase.setCourtCaseNumberManually && (
                      <div className={styles.enterCaseNrManuallyButton}>
                        <Button
                          variant="text"
                          type="button"
                          onClick={handleSetCaseNrManuallyClick}
                        >
                          Slá inn málsnúmer
                        </Button>
                      </div>
                    )}
                </div>
              </BlueBox>
            </Box>
            <Box component="section" marginBottom={5}>
              <InfoCard
                data={[
                  {
                    title: 'Embætti',
                    value: `${
                      workingCase.prosecutor?.institution?.name || 'Ekki skráð'
                    }`,
                  },
                  {
                    title: 'Ósk um fyrirtökudag og tíma',
                    value: `${capitalize(
                      formatDate(
                        workingCase.requestedCourtDate,
                        'PPPP',
                        true,
                      ) || '',
                    )} eftir kl. ${formatDate(
                      workingCase.requestedCourtDate,
                      TIME_FORMAT,
                    )}`,
                  },
                  { title: 'Ákærandi', value: workingCase.prosecutor?.name },
                  {
                    title: workingCase.parentCase
                      ? 'Fyrri gæsla'
                      : 'Tími handtöku',
                    value: workingCase.parentCase
                      ? `${capitalize(
                          formatDate(
                            workingCase.parentCase.custodyEndDate,
                            'PPPP',
                            true,
                          ) || '',
                        )} kl. ${formatDate(
                          workingCase.parentCase.custodyEndDate,
                          TIME_FORMAT,
                        )}`
                      : workingCase.arrestDate
                      ? `${capitalize(
                          formatDate(workingCase.arrestDate, 'PPPP', true) ||
                            '',
                        )} kl. ${formatDate(
                          workingCase.arrestDate,
                          TIME_FORMAT,
                        )}`
                      : 'Var ekki skráður',
                  },
                ]}
                accusedName={workingCase.accusedName}
                accusedNationalId={workingCase.accusedNationalId}
                accusedAddress={workingCase.accusedAddress}
                defender={{
                  name: workingCase.defenderName || '',
                  email: workingCase.defenderEmail,
                }}
              />
            </Box>
            <Box marginBottom={5}>
              <Box marginBottom={9}>
                <Box marginBottom={2}>
                  <Text variant="h3" as="h3">
                    Dómkröfur
                  </Text>
                </Box>
                {constructProsecutorDemands(workingCase)}
              </Box>
              <div className={styles.infoSection}>
                <Box marginBottom={6} data-testid="lawsBroken">
                  <Box marginBottom={1}>
                    <Text as="h3" variant="h3">
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
                    <Text as="h3" variant="h3">
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
              <div
                className={styles.infoSection}
                data-testid="custodyRestrictions"
              >
                <Box marginBottom={1}>
                  <Text variant="h3" as="h3">
                    {`Takmarkanir og tilhögun ${
                      workingCase.type === CaseType.CUSTODY
                        ? 'gæslu'
                        : 'farbanns'
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
                    <Text variant="h3" as="h3">
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
              {workingCase.comments && (
                <div className={styles.infoSection}>
                  <Box marginBottom={1}>
                    <Text variant="h3" as="h3">
                      Athugasemdir vegna málsmeðferðar
                    </Text>
                  </Box>
                  <Text>
                    <span className={styles.breakSpaces}>
                      {workingCase.comments}
                    </span>
                  </Text>
                </div>
              )}
              {features.includes(Feature.CASE_FILES) &&
                workingCase.caseFilesComments && (
                  <div className={styles.infoSection}>
                    <Box marginBottom={1}>
                      <Text variant="h3" as="h3">
                        Athugasemdir vegna rannsóknargagna
                      </Text>
                    </Box>
                    <Text>
                      <span className={styles.breakSpaces}>
                        {workingCase.caseFilesComments}
                      </span>
                    </Text>
                  </div>
                )}
              {features.includes(Feature.CASE_FILES) && (
                <div className={styles.infoSection}>
                  <Box marginBottom={1}>
                    <Text as="h3" variant="h3">
                      {`Rannsóknargögn (${
                        workingCase.files ? workingCase.files.length : 0
                      })`}
                    </Text>
                  </Box>
                  <CaseFileList
                    caseId={workingCase.id}
                    files={workingCase.files || []}
                    canOpenFiles={
                      workingCase.judge !== null &&
                      workingCase.judge?.id === user?.id
                    }
                  />
                </div>
              )}
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
              nextUrl={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/${id}`}
              nextIsDisabled={isNextDisabled([
                {
                  value: workingCase.courtCaseNumber || '',
                  validations: ['empty'],
                },
              ])}
            />
          </FormContentContainer>
          {modalVisible && (
            <Modal
              title="Slá inn málsnúmer"
              text="Athugið að gögn verða sjálfkrafa vistuð og uppfærð á það málsnúmer sem slegið er inn."
              handlePrimaryButtonClick={() => {
                setModalVisible(false)
              }}
              primaryButtonText="Loka glugga"
            />
          )}
        </>
      ) : null}
    </PageLayout>
  )
}

export default JudgeOverview
