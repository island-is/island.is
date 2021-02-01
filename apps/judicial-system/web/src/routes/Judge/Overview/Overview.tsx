import React, { useEffect, useState, useCallback } from 'react'
import { Box, Text, Input } from '@island.is/island-ui/core'
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
  CaseNumbers,
  InfoCard,
} from '@island.is/judicial-system-web/src/shared-components'
import { useParams } from 'react-router-dom'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { TIME_FORMAT } from '@island.is/judicial-system/formatters'
import {
  Case,
  CaseCustodyProvisions,
  CaseState,
  CaseTransition,
  CaseType,
  UpdateCase,
} from '@island.is/judicial-system/types'
import * as styles from './Overview.treat'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  TransitionCaseMutation,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/src/graphql'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { parseTransition } from '@island.is/judicial-system-web/src/utils/formatters'

interface CaseData {
  case?: Case
}

export const JudgeOverview: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [
    courtCaseNumberErrorMessage,
    setCourtCaseNumberErrorMessage,
  ] = useState('')
  const [workingCase, setWorkingCase] = useState<Case>()

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
        console.log(e)
      }
    }

    if (workingCase?.state === CaseState.SUBMITTED) {
      transitionCase(workingCase)
    }
  }, [workingCase, setWorkingCase, transitionCaseMutation])

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
          <Box marginBottom={10}>
            <Text as="h1" variant="h1">
              {`Yfirlit ${
                workingCase.type === CaseType.CUSTODY
                  ? 'kröfu'
                  : 'farbannskröfu'
              }`}
            </Text>
          </Box>
          <Box component="section" marginBottom={7}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Málsnúmer héraðsdóms
              </Text>
            </Box>
            <Box marginBottom={1}>
              <Input
                data-testid="courtCaseNumber"
                name="courtCaseNumber"
                label="Slá inn málsnúmer"
                placeholder="R-X/ÁÁÁÁ"
                defaultValue={workingCase.courtCaseNumber}
                errorMessage={courtCaseNumberErrorMessage}
                hasError={courtCaseNumberErrorMessage !== ''}
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
                onBlur={(event) =>
                  validateAndSendToServer(
                    'courtCaseNumber',
                    event.target.value,
                    ['empty'],
                    workingCase,
                    updateCase,
                    setCourtCaseNumberErrorMessage,
                  )
                }
                required
              />
            </Box>
            <CaseNumbers workingCase={workingCase} />
          </Box>
          <Box component="section" marginBottom={5}>
            <InfoCard
              data={[
                {
                  title: 'Embætti',
                  value: 'Lögreglan á Höfuðborgarsvæðinu',
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
                    : `${capitalize(
                        formatDate(workingCase.arrestDate, 'PPPP', true) || '',
                      )} kl. ${formatDate(
                        workingCase.arrestDate,
                        TIME_FORMAT,
                      )}`,
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
              <Box marginBottom={2}>
                <Text variant="h3" as="h3">
                  Lagaákvæði
                </Text>
              </Box>
              <Box>
                <Box marginBottom={2}>
                  <Box marginBottom={1}>
                    <Text variant="eyebrow" color="blue400">
                      Lagaákvæði sem brot varða við
                    </Text>
                  </Box>
                  <Text>
                    <span className={styles.breakSpaces}>
                      {workingCase.lawsBroken}
                    </span>
                  </Text>
                </Box>
                <Box marginBottom={2}>
                  <Box marginBottom={1}>
                    <Text variant="eyebrow" color="blue400">
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
              </Box>
            </div>
            <div className={styles.infoSection}>
              <Box marginBottom={1}>
                <Text variant="h3" as="h3">
                  {`Takmarkanir og tilhögun ${
                    workingCase.type === CaseType.CUSTODY
                      ? 'á gæslu'
                      : 'farbanns'
                  }`}
                </Text>
              </Box>
              <Text>
                {formatRequestedCustodyRestrictions(
                  workingCase.type,
                  workingCase.requestedCustodyRestrictions,
                )}
              </Text>
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
                        Málsatvik rakin
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
          </Box>
          <FormFooter
            nextUrl={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/${id}`}
            nextIsDisabled={isNextDisabled([
              {
                value: workingCase.courtCaseNumber || '',
                validations: ['empty'],
              },
            ])}
          />
        </>
      ) : null}
    </PageLayout>
  )
}

export default JudgeOverview
