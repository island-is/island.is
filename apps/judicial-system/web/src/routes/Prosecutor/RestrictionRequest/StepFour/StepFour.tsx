import React, { useEffect, useState } from 'react'
import { Text, Box, Input, Tooltip } from '@island.is/island-ui/core'
import { Case, CaseCustodyRestrictions } from '@island.is/judicial-system/types'
import { isNextDisabled } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { Validation } from '@island.is/judicial-system-web/src/utils/validate'
import {
  FormFooter,
  PageLayout,
  FormContentContainer,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'

import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useRouter } from 'next/router'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { formatProsecutorDemands } from '@island.is/judicial-system/formatters'

export const StepFour: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [isStepIllegal, setIsStepIllegal] = useState<boolean>(true)
  const [caseFactsErrorMessage, setCaseFactsErrorMessage] = useState<string>('')
  const [
    legalArgumentsErrorMessage,
    setLegalArgumentsErrorMessage,
  ] = useState<string>('')

  const router = useRouter()
  const id = router.query.id

  const { updateCase, autofill } = useCase()
  const { data, loading } = useQuery(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    document.title = 'Greinargerð - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (id && !workingCase && data?.case) {
      const theCase = data.case

      autofill(
        'demands',
        formatProsecutorDemands(
          theCase.type,
          theCase.accusedNationalId,
          theCase.accusedName,
          theCase.court.name,
          theCase.requestedValidToDate,
          theCase.requestedCustodyRestrictions?.includes(
            CaseCustodyRestrictions.ISOLATION,
          ) || false,
          theCase.parentCase !== undefined,
          theCase.parentCase?.decision,
        ),
        theCase,
      )

      setWorkingCase(theCase)
    }
  }, [id, workingCase, setWorkingCase, data, autofill])

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

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.CUSTODY_REQUEST_STEP_FOUR}
      isLoading={loading}
      notFound={data?.case === undefined}
      decision={workingCase?.decision}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
      caseId={workingCase?.id}
    >
      {workingCase ? (
        <>
          <FormContentContainer>
            <Box marginBottom={10}>
              <Text as="h1" variant="h1">
                Greinargerð
              </Text>
            </Box>
            <Box component="section" marginBottom={7}>
              <Box marginBottom={4}>
                <Text as="h3" variant="h3">
                  Dómkröfutexti{' '}
                  <Tooltip text="Hér er hægt að bæta texta við dómkröfur, t.d. ef óskað er eftir öðrum úrræðum til vara." />
                </Text>
              </Box>
              <Box marginBottom={3}>
                <Input
                  name="demands"
                  label="Dómkröfur"
                  placeholder="Hér er hægt að bæta texta við dómkröfurnar eftir þörfum..."
                  defaultValue={workingCase?.demands}
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'demands',
                      event,
                      [],
                      workingCase,
                      setWorkingCase,
                    )
                  }
                  onBlur={(event) =>
                    validateAndSendToServer(
                      'demands',
                      event.target.value,
                      [],
                      workingCase,
                      updateCase,
                    )
                  }
                  rows={7}
                  textarea
                />
              </Box>
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
              </Box>
            </Box>
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={`${Constants.STEP_THREE_ROUTE}/${workingCase.id}`}
              nextUrl={`${Constants.STEP_FIVE_ROUTE}/${workingCase.id}`}
              nextIsDisabled={isStepIllegal}
            />
          </FormContentContainer>
        </>
      ) : null}
    </PageLayout>
  )
}

export default StepFour
