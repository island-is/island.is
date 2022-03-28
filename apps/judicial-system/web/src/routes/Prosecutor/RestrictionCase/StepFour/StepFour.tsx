import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { Text, Box, Input, Tooltip } from '@island.is/island-ui/core'
import {
  CaseCustodyRestrictions,
  CaseType,
  isAcceptingCaseDecision,
} from '@island.is/judicial-system/types'
import { isPoliceReportStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import {
  FormFooter,
  PageLayout,
  FormContentContainer,
  CaseInfo,
} from '@island.is/judicial-system-web/src/components'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { rcReportForm } from '@island.is/judicial-system-web/messages'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  formatDate,
  formatNationalId,
} from '@island.is/judicial-system/formatters'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import useDeb from '@island.is/judicial-system-web/src/utils/hooks/useDeb'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages/Core/titles'
import type { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system/consts'

export const StepFour: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const [demandsErrorMessage, setDemandsErrorMessage] = useState<string>('')
  const [caseFactsErrorMessage, setCaseFactsErrorMessage] = useState<string>('')
  const [
    legalArgumentsErrorMessage,
    setLegalArgumentsErrorMessage,
  ] = useState<string>('')

  const { formatMessage } = useIntl()

  const { updateCase, autofill } = useCase()

  useDeb(workingCase, 'demands')
  useDeb(workingCase, 'caseFacts')
  useDeb(workingCase, 'legalArguments')
  useDeb(workingCase, 'comments')

  useEffect(() => {
    if (isCaseUpToDate) {
      const theCase: Case = workingCase

      if (theCase.defendants && theCase.defendants.length > 0) {
        autofill(
          'demands',
          `${formatMessage(rcReportForm.sections.demands.autofill, {
            accusedName: theCase.defendants[0].name,
            accusedNationalId: theCase.defendants[0].noNationalId
              ? ' '
              : `, kt. ${formatNationalId(
                  theCase.defendants[0].nationalId ?? '',
                )}, `,
            extensionSuffix:
              theCase.parentCase &&
              isAcceptingCaseDecision(theCase.parentCase.decision)
                ? ' áframhaldandi'
                : '',
            caseType:
              theCase.type === CaseType.CUSTODY ? 'gæsluvarðhaldi' : 'farbanni',
            court: theCase.court?.name.replace('Héraðsdómur', 'Héraðsdóms'),
            requestedValidToDate: formatDate(
              theCase.requestedValidToDate,
              'PPPPp',
            )
              ?.replace('dagur,', 'dagsins')
              ?.replace(' kl.', ', kl.'),
            isolationSuffix:
              theCase.type === CaseType.CUSTODY &&
              theCase.requestedCustodyRestrictions?.includes(
                CaseCustodyRestrictions.ISOLATION,
              )
                ? ', og verði gert að sæta einangrun á meðan á varðhaldi stendur'
                : '',
          })}`,
          theCase,
        )
      }

      setWorkingCase(theCase)
    }
  }, [autofill, formatMessage, isCaseUpToDate, setWorkingCase, workingCase])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.STEP_FOUR}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.restrictionCases.policeReport)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(rcReportForm.heading)}
          </Text>
        </Box>
        <Box marginBottom={7}>
          <CaseInfo
            workingCase={workingCase}
            userRole={user?.role}
            showAdditionalInfo
          />
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
              value={workingCase.demands || ''}
              errorMessage={demandsErrorMessage}
              hasError={demandsErrorMessage !== ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'demands',
                  event.target.value,
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
              autoExpand={{ on: true, maxHeight: 300 }}
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
                text={formatMessage(rcReportForm.sections.caseFacts.tooltip)}
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
              value={workingCase.caseFacts || ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'caseFacts',
                  event.target.value,
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
              autoExpand={{ on: true, maxHeight: 600 }}
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
              label={formatMessage(rcReportForm.sections.legalArguments.label)}
              placeholder={formatMessage(
                rcReportForm.sections.legalArguments.placeholder,
              )}
              value={workingCase.legalArguments || ''}
              errorMessage={legalArgumentsErrorMessage}
              hasError={legalArgumentsErrorMessage !== ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'legalArguments',
                  event.target.value,
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
              autoExpand={{ on: true, maxHeight: 600 }}
            />
          </Box>
          <Box component="section" marginBottom={7}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                {formatMessage(rcReportForm.sections.comments.heading)}{' '}
                <Tooltip
                  placement="right"
                  as="span"
                  text={formatMessage(rcReportForm.sections.comments.tooltip)}
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
                value={workingCase.comments || ''}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'comments',
                    event.target.value,
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
                autoExpand={{ on: true, maxHeight: 300 }}
              />
            </Box>
          </Box>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.STEP_THREE_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.STEP_FIVE_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isPoliceReportStepValidRC(workingCase)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default StepFour
