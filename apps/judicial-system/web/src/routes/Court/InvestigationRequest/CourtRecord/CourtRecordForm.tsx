import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Input, Text, Tooltip } from '@island.is/island-ui/core'
import {
  BlueBox,
  CaseInfo,
  CourtDocuments,
  DateTime,
  FormContentContainer,
  FormFooter,
  HideableText,
} from '@island.is/judicial-system-web/src/components'
import { Case, User } from '@island.is/judicial-system/types'
import {
  setAndSendDateToServer,
  removeTabsValidateAndSet,
  setAndSendToServer,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { formatRequestCaseType } from '@island.is/judicial-system/formatters'
import {
  closedCourt,
  icCourtRecord as m,
  core,
} from '@island.is/judicial-system-web/messages'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import { isCourtRecordStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  isLoading: boolean
  user?: User
}

const CourtRecordForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isLoading, user } = props
  const [courtLocationEM, setCourtLocationEM] = useState('')
  const [sessionBookingsErrorMessage, setSessionBookingsMessage] = useState('')

  const { updateCase } = useCase()
  const { formatMessage } = useIntl()

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Þingbók
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <CaseInfo workingCase={workingCase} userRole={user?.role} />
        </Box>
        <Box component="section" marginBottom={3}>
          <BlueBox>
            <Box marginBottom={3}>
              <DateTime
                name="courtStartDate"
                datepickerLabel="Dagsetning þinghalds"
                timeLabel="Þinghald hófst (kk:mm)"
                maxDate={new Date()}
                selectedDate={workingCase.courtStartDate}
                onChange={(date: Date | undefined, valid: boolean) => {
                  setAndSendDateToServer(
                    'courtStartDate',
                    date,
                    valid,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }}
                blueBox={false}
                required
              />
            </Box>
            <Input
              data-testid="courtLocation"
              name="courtLocation"
              tooltip={formatMessage(m.sections.courtLocation.tooltip)}
              label={formatMessage(m.sections.courtLocation.label)}
              value={workingCase.courtLocation || ''}
              placeholder={formatMessage(m.sections.courtLocation.placeholder)}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'courtLocation',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  courtLocationEM,
                  setCourtLocationEM,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'courtLocation',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setCourtLocationEM,
                )
              }
              errorMessage={courtLocationEM}
              hasError={courtLocationEM !== ''}
              autoComplete="off"
              required
            />
          </BlueBox>
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={3}>
            <HideableText
              text={formatMessage(closedCourt.text)}
              isHidden={workingCase.isClosedCourtHidden}
              onToggleVisibility={(isVisible: boolean) =>
                setAndSendToServer(
                  'isClosedCourtHidden',
                  isVisible,
                  workingCase,
                  setWorkingCase,
                  updateCase,
                )
              }
              tooltip={formatMessage(closedCourt.tooltip)}
            />
          </Box>
          <Input
            data-testid="courtAttendees"
            name="courtAttendees"
            label="Mættir eru"
            value={workingCase.courtAttendees || ''}
            placeholder="Skrifa hér..."
            onChange={(event) =>
              removeTabsValidateAndSet(
                'courtAttendees',
                event.target.value,
                [],
                workingCase,
                setWorkingCase,
              )
            }
            onBlur={(event) =>
              updateCase(
                workingCase.id,
                parseString('courtAttendees', event.target.value),
              )
            }
            textarea
            rows={7}
            autoExpand={{ on: true, maxHeight: 300 }}
          />
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.courtDocuments.header)}
            </Text>
          </Box>
          <CourtDocuments
            title={formatMessage(core.requestCaseType, {
              caseType: formatRequestCaseType(workingCase.type),
            })}
            tagText={formatMessage(m.sections.courtDocuments.tag)}
            tagVariant="darkerBlue"
            text={formatMessage(m.sections.courtDocuments.text)}
            caseId={workingCase.id}
            selectedCourtDocuments={workingCase.courtDocuments ?? []}
            onUpdateCase={updateCase}
            setWorkingCase={setWorkingCase}
            workingCase={workingCase}
          />
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {`${formatMessage(m.sections.sessionBookings.title)} `}
              <Tooltip
                text={formatMessage(m.sections.sessionBookings.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={3}>
            <Input
              data-testid="sessionBookings"
              name="sessionBookings"
              label={formatMessage(m.sections.sessionBookings.label)}
              value={workingCase.sessionBookings || ''}
              placeholder={formatMessage(
                m.sections.sessionBookings.placeholder,
              )}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'sessionBookings',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  sessionBookingsErrorMessage,
                  setSessionBookingsMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'sessionBookings',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setSessionBookingsMessage,
                )
              }
              errorMessage={sessionBookingsErrorMessage}
              hasError={sessionBookingsErrorMessage !== ''}
              textarea
              rows={16}
              autoExpand={{ on: true, maxHeight: 600 }}
              required
            />
          </Box>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.IC_COURT_HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoading}
          nextUrl={`${Constants.IC_RULING_STEP_ONE_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isCourtRecordStepValidIC(workingCase)}
        />
      </FormContentContainer>
    </>
  )
}

export default CourtRecordForm
