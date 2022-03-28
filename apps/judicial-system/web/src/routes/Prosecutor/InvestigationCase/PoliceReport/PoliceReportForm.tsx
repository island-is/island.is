import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Checkbox, Input, Text, Tooltip } from '@island.is/island-ui/core'
import {
  BlueBox,
  CaseInfo,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/components'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { icReportForm } from '@island.is/judicial-system-web/messages'
import { isPoliceReportStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import useDeb from '@island.is/judicial-system-web/src/utils/hooks/useDeb'
import type { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system/consts'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  isLoading: boolean
  isCaseUpToDate: boolean
}

const PoliceReportForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isLoading } = props

  const { formatMessage } = useIntl()
  const { updateCase, autofill } = useCase()
  const { user } = useContext(UserContext)

  const [caseFactsEM, setCaseFactsEM] = useState<string>('')
  const [legalArgumentsEM, setLegalArgumentsEM] = useState<string>('')

  useDeb(workingCase, 'caseFacts')
  useDeb(workingCase, 'legalArguments')
  useDeb(workingCase, 'prosecutorOnlySessionRequest')
  useDeb(workingCase, 'comments')

  useEffect(() => {
    if (workingCase.requestProsecutorOnlySession) {
      autofill(
        'prosecutorOnlySessionRequest',
        formatMessage(icReportForm.prosecutorOnly.input.defaultValue),
        workingCase,
      )
    }
  }, [autofill, formatMessage, workingCase])

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(icReportForm.heading)}
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <CaseInfo
            workingCase={workingCase}
            userRole={user?.role}
            showAdditionalInfo
          />
        </Box>
        <Box marginBottom={5}>
          <BlueBox>
            <Text>{workingCase.demands}</Text>
          </BlueBox>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(icReportForm.caseFacts.heading)}{' '}
              <Tooltip
                placement="right"
                as="span"
                text={formatMessage(icReportForm.caseFacts.tooltip)}
              />
            </Text>
          </Box>
          <Input
            data-testid="caseFacts"
            name="caseFacts"
            label={formatMessage(icReportForm.caseFacts.label)}
            placeholder={formatMessage(icReportForm.caseFacts.placeholder)}
            errorMessage={caseFactsEM}
            hasError={caseFactsEM !== ''}
            value={workingCase.caseFacts || ''}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'caseFacts',
                event.target.value,
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
            autoExpand={{ on: true, maxHeight: 600 }}
            textarea
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(icReportForm.legalArguments.heading)}{' '}
              <Tooltip
                placement="right"
                as="span"
                text={formatMessage(icReportForm.legalArguments.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Input
              data-testid="legalArguments"
              name="legalArguments"
              label={formatMessage(icReportForm.legalArguments.label)}
              placeholder={formatMessage(
                icReportForm.legalArguments.placeholder,
              )}
              value={workingCase.legalArguments || ''}
              errorMessage={legalArgumentsEM}
              hasError={legalArgumentsEM !== ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'legalArguments',
                  event.target.value,
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
              autoExpand={{ on: true, maxHeight: 600 }}
            />
          </Box>
          <Box component="section" marginBottom={5}>
            <BlueBox>
              <Box marginBottom={2}>
                <Checkbox
                  name="request-prosecutor-only-session"
                  label={formatMessage(
                    icReportForm.prosecutorOnly.checkbox.label,
                  )}
                  tooltip={formatMessage(
                    icReportForm.prosecutorOnly.checkbox.tooltip,
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
                label={formatMessage(icReportForm.prosecutorOnly.input.label)}
                placeholder={formatMessage(
                  icReportForm.prosecutorOnly.input.placeholder,
                )}
                disabled={workingCase.requestProsecutorOnlySession === false}
                value={workingCase.prosecutorOnlySessionRequest || ''}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'prosecutorOnlySessionRequest',
                    event.target.value,
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
                autoExpand={{ on: true, maxHeight: 300 }}
              />
            </BlueBox>
          </Box>
          <Box component="section" marginBottom={10}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                {formatMessage(icReportForm.comments.heading)}{' '}
                <Tooltip
                  placement="right"
                  as="span"
                  text={formatMessage(icReportForm.comments.tooltip)}
                />
              </Text>
            </Box>
            <Input
              name="comments"
              label={formatMessage(icReportForm.comments.label)}
              placeholder={formatMessage(icReportForm.comments.placeholder)}
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
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.IC_POLICE_DEMANDS_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.IC_CASE_FILES_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isPoliceReportStepValidIC(workingCase)}
          nextIsLoading={isLoading}
        />
      </FormContentContainer>
    </>
  )
}

export default PoliceReportForm
