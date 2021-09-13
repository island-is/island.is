import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Text, Box, Input, Tooltip } from '@island.is/island-ui/core'
import { CaseCustodyRestrictions } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
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
import { rcReportForm } from '@island.is/judicial-system-web/messages'
import { useRouter } from 'next/router'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { formatProsecutorDemands } from '@island.is/judicial-system/formatters'

export const StepFour: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [isStepIllegal, setIsStepIllegal] = useState<boolean>(true)
  const [demandsErrorMessage, setDemandsErrorMessage] = useState<string>('')
  const [caseFactsErrorMessage, setCaseFactsErrorMessage] = useState<string>('')
  const [
    legalArgumentsErrorMessage,
    setLegalArgumentsErrorMessage,
  ] = useState<string>('')

  const { formatMessage } = useIntl()
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
          ) ?? false,
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
        value: workingCase?.demands ?? '',
        validations: ['empty'],
      },
      {
        value: workingCase?.caseFacts ?? '',
        validations: ['empty'],
      },
      {
        value: workingCase?.legalArguments ?? '',
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
                {formatMessage(rcReportForm.heading)}
              </Text>
            </Box>
            <Box component="section" marginBottom={7}>
              <Box marginBottom={4}>
                <Text as="h3" variant="h3">
                  {formatMessage(rcReportForm.sections.demands.heading)}{' '}
                  <Tooltip
                    text={formatMessage(rcReportForm.sections.demands.tooltip)}
                  />
                </Text>
              </Box>
              <Box marginBottom={3}>
                <Input
                  name="demands"
                  label={formatMessage(rcReportForm.sections.demands.label)}
                  placeholder={formatMessage(
                    rcReportForm.sections.demands.placeholder,
                  )}
                  defaultValue={workingCase?.demands}
                  errorMessage={demandsErrorMessage}
                  hasError={demandsErrorMessage !== ''}
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'demands',
                      event,
                      ['empty'],
                      workingCase,
                      setWorkingCase,
                      demandsErrorMessage,
                      setDemandsErrorMessage,
                    )
                  }
                  onBlur={(event) =>
                    validateAndSendToServer(
                      'demands',
                      event.target.value,
                      ['empty'],
                      workingCase,
                      updateCase,
                      setDemandsErrorMessage,
                    )
                  }
                  rows={7}
                  textarea
                  required
                />
              </Box>
            </Box>
            <Box component="section" marginBottom={7}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  {formatMessage(rcReportForm.sections.caseFacts.heading)}{' '}
                  <Tooltip
                    placement="right"
                    as="span"
                    text={formatMessage(
                      rcReportForm.sections.caseFacts.tooltip,
                    )}
                  />
                </Text>
              </Box>
              <Box marginBottom={3}>
                <Input
                  data-testid="caseFacts"
                  name="caseFacts"
                  label={formatMessage(rcReportForm.sections.caseFacts.label)}
                  placeholder={formatMessage(
                    rcReportForm.sections.caseFacts.placeholder,
                  )}
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
                  {formatMessage(rcReportForm.sections.legalArguments.heading)}{' '}
                  <Tooltip
                    placement="right"
                    as="span"
                    text={formatMessage(
                      rcReportForm.sections.legalArguments.tooltip,
                    )}
                  />
                </Text>
              </Box>
              <Box marginBottom={7}>
                <Input
                  data-testid="legalArguments"
                  name="legalArguments"
                  label={formatMessage(
                    rcReportForm.sections.legalArguments.label,
                  )}
                  placeholder={formatMessage(
                    rcReportForm.sections.legalArguments.placeholder,
                  )}
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
                    {formatMessage(rcReportForm.sections.comments.heading)}{' '}
                    <Tooltip
                      placement="right"
                      as="span"
                      text={formatMessage(
                        rcReportForm.sections.comments.tooltip,
                      )}
                    />
                  </Text>
                </Box>
                <Box marginBottom={3}>
                  <Input
                    name="comments"
                    label={formatMessage(rcReportForm.sections.comments.label)}
                    placeholder={formatMessage(
                      rcReportForm.sections.comments.placeholder,
                    )}
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
