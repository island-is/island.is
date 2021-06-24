import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Box, Checkbox, Input, Text, Tooltip } from '@island.is/island-ui/core'
import {
  BlueBox,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import { Case } from '@island.is/judicial-system/types'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { reportForm } from '@island.is/judicial-system-web/messages'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isLoading: boolean
}

const PoliceReportForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isLoading } = props
  const validations: FormSettings = {
    caseFacts: {
      validations: ['empty'],
    },
    legalArguments: {
      validations: ['empty'],
    },
  }
  const { formatMessage } = useIntl()
  const { updateCase, autofill } = useCase()
  const [caseFactsEM, setCaseFactsEM] = useState<string>('')
  const [legalArgumentsEM, setLegalArgumentsEM] = useState<string>('')
  const { isValid } = useCaseFormHelper(
    workingCase,
    setWorkingCase,
    validations,
  )
  const defaultProsecutorOnlySessionRequest = formatMessage(
    reportForm.prosecutorOnly.input.defaultValue,
  )
  useEffect(() => {
    if (workingCase.requestProsecutorOnlySession) {
      autofill(
        'prosecutorOnlySessionRequest',
        defaultProsecutorOnlySessionRequest,
        workingCase,
      )
    }
  }, [autofill, workingCase.requestProsecutorOnlySession])

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(reportForm.heading)}
          </Text>
        </Box>
        <Box marginBottom={5}>
          <BlueBox>
            <Text>{workingCase.demands}</Text>
          </BlueBox>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(reportForm.facts.heading)}{' '}
              <Tooltip
                placement="right"
                as="span"
                text={formatMessage(reportForm.facts.tooltip)}
              />
            </Text>
          </Box>
          <Input
            data-testid="caseFacts"
            name="caseFacts"
            label={formatMessage(reportForm.facts.label)}
            placeholder={formatMessage(reportForm.facts.placeholder)}
            errorMessage={caseFactsEM}
            hasError={caseFactsEM !== ''}
            defaultValue={workingCase?.caseFacts}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'caseFacts',
                event,
                ['empty'],
                workingCase,
                setWorkingCase,
                caseFactsEM,
                setCaseFactsEM,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'caseFacts',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setCaseFactsEM,
              )
            }
            required
            rows={14}
            textarea
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(reportForm.legalArguments.heading)}{' '}
              <Tooltip
                placement="right"
                as="span"
                text={formatMessage(reportForm.legalArguments.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Input
              data-testid="legalArguments"
              name="legalArguments"
              label={formatMessage(reportForm.legalArguments.label)}
              placeholder={formatMessage(reportForm.legalArguments.placeholder)}
              defaultValue={workingCase?.legalArguments}
              errorMessage={legalArgumentsEM}
              hasError={legalArgumentsEM !== ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'legalArguments',
                  event,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  legalArgumentsEM,
                  setLegalArgumentsEM,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'legalArguments',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setLegalArgumentsEM,
                )
              }
              required
              textarea
              rows={14}
            />
          </Box>
          <Box component="section" marginBottom={5}>
            <BlueBox>
              <Box marginBottom={2}>
                <Checkbox
                  name="request-prosecutor-only-session"
                  label={formatMessage(
                    reportForm.prosecutorOnly.checkbox.label,
                  )}
                  tooltip={formatMessage(
                    reportForm.prosecutorOnly.checkbox.tooltip,
                  )}
                  checked={workingCase.requestProsecutorOnlySession}
                  onChange={(evt) => {
                    setWorkingCase({
                      ...workingCase,
                      requestProsecutorOnlySession: evt.target.checked,
                    })
                    updateCase(workingCase.id, {
                      requestProsecutorOnlySession: evt.target.checked,
                    })
                  }}
                  filled
                  large
                />
              </Box>
              <Input
                name="prosecutor-only-session-request"
                label={formatMessage(reportForm.prosecutorOnly.input.label)}
                placeholder={formatMessage(
                  reportForm.prosecutorOnly.input.placeholder,
                )}
                disabled={workingCase.requestProsecutorOnlySession === false}
                defaultValue={workingCase.prosecutorOnlySessionRequest}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'prosecutorOnlySessionRequest',
                    event,
                    [],
                    workingCase,
                    setWorkingCase,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'prosecutorOnlySessionRequest',
                    event.target.value,
                    [],
                    workingCase,
                    updateCase,
                  )
                }
                textarea
                rows={7}
              />
            </BlueBox>
          </Box>
          <Box component="section" marginBottom={10}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                {formatMessage(reportForm.proceduralComments.heading)}{' '}
                <Tooltip
                  placement="right"
                  as="span"
                  text={formatMessage(reportForm.proceduralComments.tooltip)}
                />
              </Text>
            </Box>
            <Input
              name="comments"
              label={formatMessage(reportForm.proceduralComments.label)}
              placeholder={formatMessage(
                reportForm.proceduralComments.placeholder,
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
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.R_CASE_POLICE_DEMANDS_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.R_CASE_CASE_FILES_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isValid}
          nextIsLoading={isLoading}
        />
      </FormContentContainer>
    </>
  )
}

export default PoliceReportForm
