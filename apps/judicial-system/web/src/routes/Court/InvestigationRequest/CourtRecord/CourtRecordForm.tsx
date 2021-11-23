import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { Box, Input, Text, Tooltip } from '@island.is/island-ui/core'
import {
  BlueBox,
  CaseNumbers,
  CourtDocuments,
  DateTime,
  FormContentContainer,
  FormFooter,
  HideableText,
} from '@island.is/judicial-system-web/src/components'
import { Case, SessionArrangements } from '@island.is/judicial-system/types'
import {
  newSetAndSendDateToServer,
  removeTabsValidateAndSet,
  setAndSendToServer,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { capitalize, caseTypes } from '@island.is/judicial-system/formatters'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'
import {
  closedCourt,
  icCourtRecord as m,
} from '@island.is/judicial-system-web/messages'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import { isCourtRecordStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isLoading: boolean
}

const CourtRecordForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isLoading } = props
  const [, setCourtRecordStartDateIsValid] = useState(true)
  const [courtLocationEM, setCourtLocationEM] = useState('')
  const [
    litigationPresentationsErrorMessage,
    setLitigationPresentationsMessage,
  ] = useState('')

  const { updateCase } = useCase()
  const { formatMessage } = useIntl()

  const validations: FormSettings = {
    courtLocation: {
      validations: ['empty'],
    },
    prosecutorDemands: {
      validations: ['empty'],
    },
    litigationPresentations: {
      validations: ['empty'],
    },
  }

  useCaseFormHelper(workingCase, setWorkingCase, validations)

  const displayAccusedBookings =
    workingCase.sessionArrangements === SessionArrangements.ALL_PRESENT ||
    (workingCase.sessionArrangements ===
      SessionArrangements.ALL_PRESENT_SPOKESPERSON &&
      workingCase.defenderIsSpokesperson &&
      workingCase.defenderName)

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Þingbók
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <CaseNumbers workingCase={workingCase} />
        </Box>
        <Box component="section" marginBottom={3}>
          <BlueBox>
            <Box marginBottom={3}>
              <DateTime
                name="courtStartDate"
                datepickerLabel="Dagsetning þinghalds"
                timeLabel="Þinghald hófst (kk:mm)"
                maxDate={new Date()}
                selectedDate={
                  workingCase.courtStartDate
                    ? new Date(workingCase.courtStartDate)
                    : new Date()
                }
                onChange={(date: Date | undefined, valid: boolean) => {
                  newSetAndSendDateToServer(
                    'courtStartDate',
                    date,
                    valid,
                    workingCase,
                    setWorkingCase,
                    setCourtRecordStartDateIsValid,
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
              defaultValue={workingCase.courtLocation}
              placeholder={formatMessage(m.sections.courtLocation.placeholder)}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'courtLocation',
                  event,
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
            defaultValue={workingCase.courtAttendees}
            placeholder="Skrifa hér..."
            onChange={(event) =>
              removeTabsValidateAndSet(
                'courtAttendees',
                event,
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
          />
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Dómskjöl
            </Text>
          </Box>
          <CourtDocuments
            title={`Krafa - ${capitalize(caseTypes[workingCase.type])}`}
            tagText="Þingmerkt nr. 1"
            tagVariant="darkerBlue"
            text="Rannsóknargögn málsins liggja frammi."
            caseId={workingCase.id}
            selectedCourtDocuments={workingCase.courtDocuments ?? []}
            onUpdateCase={updateCase}
            setWorkingCase={setWorkingCase}
            workingCase={workingCase}
          />
        </Box>
        {displayAccusedBookings && (
          <Box component="section" marginBottom={8}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                {`${formatMessage(m.sections.accusedBookings.title)} `}
                <Tooltip
                  text={formatMessage(m.sections.accusedBookings.tooltip)}
                />
              </Text>
            </Box>
            <Input
              data-testid="accusedBookings"
              name="accusedBookings"
              label={formatMessage(m.sections.accusedBookings.label)}
              defaultValue={workingCase.accusedBookings}
              placeholder={formatMessage(
                m.sections.accusedBookings.placeholder,
              )}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'accusedBookings',
                  event,
                  [],
                  workingCase,
                  setWorkingCase,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'accusedBookings',
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
        )}
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Málflutningur
            </Text>
          </Box>
          <Box marginBottom={3}>
            <Input
              data-testid="litigationPresentations"
              name="litigationPresentations"
              label="Málflutningur og aðrar bókanir"
              defaultValue={workingCase.litigationPresentations}
              placeholder="Málflutningsræður og annað sem fram kom í þinghaldi er skráð hér..."
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'litigationPresentations',
                  event,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  litigationPresentationsErrorMessage,
                  setLitigationPresentationsMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'litigationPresentations',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setLitigationPresentationsMessage,
                )
              }
              errorMessage={litigationPresentationsErrorMessage}
              hasError={litigationPresentationsErrorMessage !== ''}
              textarea
              rows={7}
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
