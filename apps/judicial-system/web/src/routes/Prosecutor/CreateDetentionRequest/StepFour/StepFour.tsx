import React, { useEffect, useState } from 'react'
import { Text, Box, Input, Tooltip } from '@island.is/island-ui/core'
import { Case, UpdateCase } from '@island.is/judicial-system/types'
import {
  constructProsecutorDemands,
  isNextDisabled,
} from '@island.is/judicial-system-web/src/utils/stepHelper'
import { Validation } from '@island.is/judicial-system-web/src/utils/validate'
import {
  FormFooter,
  PageLayout,
  BlueBox,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/src/graphql'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'

import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
} from '@island.is/judicial-system-web/src/utils/formHelper'

export const StepFour: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [isStepIllegal, setIsStepIllegal] = useState<boolean>(true)

  const { id } = useParams<{ id: string }>()

  const [caseFactsErrorMessage, setCaseFactsErrorMessage] = useState<string>('')

  const [legalArgumentsErrorMessage, setLegalArgumentsErrorMessage] = useState<
    string
  >('')

  const { data, loading } = useQuery(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const resCase = data?.case

  useEffect(() => {
    document.title = 'Greinargerð - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (id && !workingCase && resCase) {
      setWorkingCase(resCase)
    }
  }, [id, workingCase, setWorkingCase, resCase])

  useEffect(() => {
    const requiredFields: { value: string; validations: Validation[] }[] = [
      {
        value: workingCase?.caseFacts || '',
        validations: ['empty'],
      },
      {
        value: workingCase?.legalArguments || '',
        validations: ['empty'],
      },
    ]

    if (workingCase) {
      setIsStepIllegal(isNextDisabled(requiredFields))
    }
  }, [workingCase, setIsStepIllegal])

  const [updateCaseMutation] = useMutation(UpdateCaseMutation)

  const updateCase = async (id: string, updateCase: UpdateCase) => {
    const { data } = await updateCaseMutation({
      variables: { input: { id, ...updateCase } },
    })

    const resCase = data?.updateCase

    if (resCase) {
      // Do smoething with the result. In particular, we want th modified timestamp passed between
      // the client and the backend so that we can handle multiple simultanious updates.
    }

    return resCase
  }

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={
        ProsecutorSubsections.CREATE_DETENTION_REQUEST_STEP_FOUR
      }
      isLoading={loading}
      notFound={data?.case === undefined}
      decision={workingCase?.decision}
      parentCaseDecision={workingCase?.parentCase?.decision}
    >
      {workingCase ? (
        <>
          <Box marginBottom={10}>
            <Text as="h1" variant="h1">
              Greinargerð
            </Text>
          </Box>
          <Box component="section" marginBottom={7}>
            <Box marginBottom={4}>
              <Text as="h3" variant="h3">
                Dómkröfutexti
              </Text>
            </Box>
            <BlueBox>
              <Box marginBottom={3}>
                {constructProsecutorDemands(workingCase, true)}
              </Box>
              <Input
                name="prosecutorDemands"
                label="Bæta texta við dómkröfur"
                placeholder="Hér er hægt að bæta texta við dómkröfurnar eftir þörfum..."
                defaultValue={workingCase?.otherDemands}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'otherDemands',
                    event,
                    [],
                    workingCase,
                    setWorkingCase,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'otherDemands',
                    event.target.value,
                    [],
                    workingCase,
                    updateCase,
                  )
                }
                rows={7}
                textarea
              />
            </BlueBox>
          </Box>
          <Box component="section" marginBottom={7}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Greinargerð um málsatvik{' '}
                <Tooltip
                  placement="right"
                  as="span"
                  text="Málsatvik, hvernig meðferð þessa máls hófst, skal skrá hér ásamt framburðum vitna og sakborninga ef til eru. Einnig er gott að taka fram stöðu rannsóknar og næstu skref."
                />
              </Text>
            </Box>
            <Box marginBottom={3}>
              <Input
                name="caseFacts"
                label="Málsatvik"
                placeholder="Hvað hefur átt sér stað hingað til? Hver er framburður sakborninga og vitna? Hver er staða rannsóknar og næstu skref?"
                errorMessage={caseFactsErrorMessage}
                hasError={caseFactsErrorMessage !== ''}
                defaultValue={workingCase?.caseFacts}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'caseFacts',
                    event,
                    ['empty'],
                    workingCase,
                    setWorkingCase,
                    caseFactsErrorMessage,
                    setCaseFactsErrorMessage,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'caseFacts',
                    event.target.value,
                    ['empty'],
                    workingCase,
                    updateCase,
                    setCaseFactsErrorMessage,
                  )
                }
                required
                rows={14}
                textarea
              />
            </Box>
          </Box>
          <Box component="section" marginBottom={7}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Greinargerð um lagarök{' '}
                <Tooltip
                  placement="right"
                  as="span"
                  text="Lagarök og lagaákvæði sem eiga við brotið og kröfuna skal taka fram hér."
                />
              </Text>
            </Box>
            <Box marginBottom={7}>
              <Input
                name="legalArguments"
                label="Lagarök"
                placeholder="Hver eru lagarökin fyrir kröfu um gæsluvarðhald?"
                defaultValue={workingCase?.legalArguments}
                errorMessage={legalArgumentsErrorMessage}
                hasError={legalArgumentsErrorMessage !== ''}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'legalArguments',
                    event,
                    ['empty'],
                    workingCase,
                    setWorkingCase,
                    legalArgumentsErrorMessage,
                    setLegalArgumentsErrorMessage,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'legalArguments',
                    event.target.value,
                    ['empty'],
                    workingCase,
                    updateCase,
                    setLegalArgumentsErrorMessage,
                  )
                }
                required
                textarea
                rows={14}
              />
            </Box>
            {/* <Box component="section" marginBottom={7}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  Athugasemdir vegna málsmeðferðar{' '}
                  <Tooltip
                    placement="right"
                    as="span"
                    text="Hér er hægt að skrá athugasemdir til dómara og dómritara um hagnýt atriði sem tengjast fyrirtökunni eða málsmeðferðinni, og eru ekki hluti af sjálfri kröfunni."
                  />
                </Text>
              </Box>
              <Box marginBottom={3}>
                <Input
                  name="comments"
                  label="Athugasemdir"
                  placeholder="Er eitthvað sem þú vilt koma á framfæri við dómstólinn varðandi fyrirtökuna eða málsmeðferðina?"
                  defaultValue={workingCase?.comments}
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'comments',
                      event,
                      [],
                      workingCase,
                      setWorkingCase,
                    )
                  }
                  onBlur={(event) =>
                    validateAndSendToServer(
                      'comments',
                      event.target.value,
                      [],
                      workingCase,
                      updateCase,
                    )
                  }
                  textarea
                  rows={7}
                />
              </Box>
            </Box> */}
          </Box>
          <FormFooter
            nextUrl={`${Constants.STEP_FIVE_ROUTE}/${workingCase.id}`}
            nextIsDisabled={isStepIllegal}
          />
        </>
      ) : null}
    </PageLayout>
  )
}

export default StepFour
