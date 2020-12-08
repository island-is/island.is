import React, { useEffect, useState } from 'react'
import { Text, Box, Input, Tooltip } from '@island.is/island-ui/core'
import { Case, UpdateCase } from '@island.is/judicial-system/types'
import { isNextDisabled } from '../../../../utils/stepHelper'
import { Validation } from '@island.is/judicial-system-web/src/utils/validate'
import { FormFooter } from '../../../../shared-components/FormFooter'
import * as Constants from '../../../../utils/constants'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'
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
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const { id } = useParams<{ id: string }>()

  const [caseFactsErrorMessage, setCaseFactsErrorMessage] = useState<string>('')

  const [legalArgumentsErrorMessage, setLegalArgumentsErrorMessage] = useState<
    string
  >('')

  const { data } = useQuery(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const resCase = data?.case

  useEffect(() => {
    document.title = 'Greinargerð - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    const getCurrentCase = async () => {
      setIsLoading(true)
      setWorkingCase(resCase)
      setIsLoading(false)
    }
    if (id && !workingCase && resCase) {
      getCurrentCase()
    }
  }, [id, setIsLoading, workingCase, setWorkingCase, resCase])

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
      activeSection={Sections.PROSECUTOR}
      activeSubSection={
        ProsecutorSubsections.CREATE_DETENTION_REQUEST_STEP_FOUR
      }
      isLoading={isLoading}
      notFound={data?.case === undefined}
    >
      {workingCase ? (
        <>
          <Box marginBottom={10}>
            <Text as="h1" variant="h1">
              Greinargerð
            </Text>
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
                data-testid="caseFacts"
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
                data-testid="legalArguments"
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
            <Box component="section" marginBottom={7}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  Skilaboð til dómara{' '}
                  <Tooltip
                    placement="right"
                    as="span"
                    text="Hér er hægt að skrá athugasemdir eða skilaboð til dómara sem verður ekki vistað sem hluti af kröfunni. Til dæmis aðrar upplýsingar en koma fram í kröfunni og/eða upplýsingar um ástand sakbornings."
                  />
                </Text>
              </Box>
              <Box marginBottom={3}>
                <Input
                  name="comments"
                  label="Skilaboð til dómara"
                  placeholder="Er eitthvað sem þú vilt koma á framfæri við dómara sem tengist kröfunni eða ástandi sakbornings?"
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
            </Box>
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
