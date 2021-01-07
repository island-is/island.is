import React, { useEffect, useState, useCallback } from 'react'
import {
  Box,
  Text,
  Accordion,
  AccordionItem,
  Input,
} from '@island.is/island-ui/core'
import {
  formatDate,
  capitalize,
  formatCustodyRestrictions,
  laws,
  formatNationalId,
  formatGender,
} from '@island.is/judicial-system/formatters'
import {
  constructProsecutorDemands,
  isNextDisabled,
} from '../../../utils/stepHelper'
import { FormFooter } from '../../../shared-components/FormFooter'
import { useParams } from 'react-router-dom'
import * as Constants from '../../../utils/constants'
import { TIME_FORMAT } from '@island.is/judicial-system/formatters'
import {
  Case,
  CaseCustodyProvisions,
  CaseState,
  CaseTransition,
  UpdateCase,
} from '@island.is/judicial-system/types'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'
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
import { parseTransition } from '../../../utils/formatters'

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
      activeSection={Sections.JUDGE}
      activeSubSection={JudgeSubsections.JUDGE_OVERVIEW}
      isLoading={loading}
      notFound={data?.case === undefined}
    >
      {workingCase ? (
        <>
          <Box marginBottom={10}>
            <Text as="h1" variant="h1">
              Yfirlit kröfu
            </Text>
          </Box>
          <Box component="section" marginBottom={8}>
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
            <Box>
              <Text
                variant="small"
                fontWeight="semiBold"
              >{`LÖKE málsnr. ${workingCase.policeCaseNumber}`}</Text>
            </Box>
          </Box>
          <Box component="section">
            <Box marginBottom={5}>
              <Box marginBottom={1}>
                <Text variant="eyebrow" color="blue400">
                  Kennitala
                </Text>
              </Box>
              <Text variant="h3">
                {formatNationalId(workingCase.accusedNationalId)}
              </Text>
            </Box>
            <Box marginBottom={5}>
              <Box marginBottom={1}>
                <Text variant="eyebrow" color="blue400">
                  Fullt nafn
                </Text>
              </Box>
              <Text variant="h3">{workingCase.accusedName}</Text>
            </Box>
            <Box marginBottom={5}>
              <Box marginBottom={1}>
                <Text variant="eyebrow" color="blue400">
                  Lögheimili/dvalarstaður
                </Text>
              </Box>
              <Text variant="h3">{workingCase.accusedAddress}</Text>
            </Box>
            {workingCase.accusedGender && (
              <Box marginBottom={5}>
                <Box marginBottom={1}>
                  <Text variant="eyebrow" color="blue400">
                    Kyn
                  </Text>
                </Box>
                <Text variant="h3">
                  {capitalize(formatGender(workingCase.accusedGender))}
                </Text>
              </Box>
            )}
            {workingCase.requestedDefenderName && (
              <Box marginBottom={5}>
                <Box marginBottom={1}>
                  <Text variant="eyebrow" color="blue400">
                    Nafn verjanda
                  </Text>
                </Box>
                <Text variant="h3">{workingCase.requestedDefenderName}</Text>
              </Box>
            )}
            {workingCase.requestedDefenderEmail && (
              <Box marginBottom={5}>
                <Box marginBottom={1}>
                  <Text variant="eyebrow" color="blue400">
                    Netfang verjanda
                  </Text>
                </Box>
                <Text variant="h3">{workingCase.requestedDefenderEmail}</Text>
              </Box>
            )}
            <Box marginBottom={5}>
              <Box marginBottom={1}>
                <Text variant="eyebrow" color="blue400">
                  Dómstóll
                </Text>
              </Box>
              <Text variant="h3">{workingCase.court}</Text>
            </Box>
            <Box marginBottom={5}>
              <Box marginBottom={1}>
                <Text variant="eyebrow" color="blue400">
                  Tími handtöku
                </Text>
              </Box>
              <Text variant="h3">
                {workingCase.arrestDate &&
                  `${capitalize(
                    formatDate(workingCase.arrestDate, 'PPPP') || '',
                  )} kl. ${formatDate(workingCase.arrestDate, TIME_FORMAT)}`}
              </Text>
            </Box>
            <Box marginBottom={5}>
              <Box marginBottom={1}>
                <Text variant="eyebrow" color="blue400">
                  Ósk um fyrirtökudag og tíma
                </Text>
              </Box>
              <Text variant="h3">
                {`${capitalize(
                  formatDate(workingCase.requestedCourtDate, 'PPPP') || '',
                )} eftir kl. ${formatDate(
                  workingCase.requestedCourtDate,
                  TIME_FORMAT,
                )}`}
              </Text>
            </Box>
            <Box marginBottom={5}>
              <Box marginBottom={1}>
                <Text variant="eyebrow" color="blue400">
                  Ákærandi
                </Text>
              </Box>
              <Text variant="h3">
                {workingCase.prosecutor?.name} {workingCase.prosecutor?.title}
              </Text>
            </Box>
          </Box>
          <Box component="section" marginBottom={5}>
            <Accordion singleExpand={false}>
              <AccordionItem
                id="id_1"
                label="Dómkröfur"
                startExpanded
                labelVariant="h3"
              >
                {constructProsecutorDemands(workingCase)}
              </AccordionItem>
              <AccordionItem
                id="id_2"
                label="Lagaákvæði"
                startExpanded
                labelVariant="h3"
              >
                <Box marginBottom={2}>
                  <Box marginBottom={2}>
                    <Text as="h4" variant="h4">
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
                  <Box marginBottom={2}>
                    <Text as="h4" variant="h4">
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
              </AccordionItem>
              <AccordionItem
                id="id_3"
                label="Takmarkanir á gæslu"
                startExpanded
                labelVariant="h3"
              >
                <Text>
                  {formatCustodyRestrictions(
                    workingCase.requestedCustodyRestrictions,
                  )}
                </Text>
              </AccordionItem>
              <AccordionItem
                id="id_4"
                label="Greinargerð um málsatvik og lagarök"
                startExpanded
                labelVariant="h3"
              >
                {workingCase.caseFacts && (
                  <Box marginBottom={2}>
                    <Box marginBottom={2}>
                      <Text variant="h5">Málsatvik rakin</Text>
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
              <AccordionItem
                id="id_5"
                label="Athugasemdir vegna málsmeðferðar"
                startExpanded
                labelVariant="h3"
              >
                <Text>
                  <span className={styles.breakSpaces}>
                    {workingCase.comments}
                  </span>
                </Text>
              </AccordionItem>
            </Accordion>
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
