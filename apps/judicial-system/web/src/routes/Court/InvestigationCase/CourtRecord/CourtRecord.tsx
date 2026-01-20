import { FC, useCallback, useContext } from 'react'
import { IntlShape, useIntl } from 'react-intl'
import router from 'next/router'

import { Box, Input, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  applyDativeCaseToCourtName,
  lowercase,
} from '@island.is/judicial-system/formatters'
import {
  closedCourt,
  core,
  icCourtRecord as m,
  titles,
} from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CourtCaseInfo,
  CourtDocuments,
  DateTime,
  FormContentContainer,
  FormContext,
  FormFooter,
  HideableText,
  PageHeader,
  PageLayout,
  PageTitle,
  PdfButton,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseAppealDecision,
  CaseType,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  formatDateForServer,
  useCase,
  useDebouncedInput,
  useOnceOn,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import {
  isCourtRecordStepValidIC,
  isNullOrUndefined,
  Validation,
} from '@island.is/judicial-system-web/src/utils/validate'

import AppealSections from '../../components/AppealSections/AppealSections'
import { populateEndOfCourtSessionBookingsIntro } from '../../shared/populateEndOfCourtSessionBookingsIntro'

const getSessionBookingsAutofill = (
  formatMessage: IntlShape['formatMessage'],
  workingCase: Case,
) => {
  const autofillSessionBookings = []

  if (workingCase.defenderName) {
    autofillSessionBookings.push(
      `${formatMessage(m.sections.sessionBookings.autofillDefender, {
        defender: workingCase.defenderName,
      })}\n\n`,
    )
  }

  if (workingCase.translator) {
    autofillSessionBookings.push(
      `${formatMessage(m.sections.sessionBookings.autofillTranslator, {
        translator: workingCase.translator,
      })}\n\n`,
    )
  }

  autofillSessionBookings.push(
    `${formatMessage(
      m.sections.sessionBookings.autofillRightToRemainSilent,
    )}\n\n${formatMessage(
      m.sections.sessionBookings.autofillCourtDocumentOne,
    )}\n\n${formatMessage(
      m.sections.sessionBookings.autofillAccusedPlea,
    )}\n\n${formatMessage(m.sections.sessionBookings.autofillAllPresent)}`,
  )
  return autofillSessionBookings.length > 0
    ? autofillSessionBookings.join('')
    : undefined
}

const CourtRecord: FC = () => {
  const { setAndSendCaseToServer } = useCase()
  const { formatMessage } = useIntl()
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)

  const sessionBookingValidation: Validation[] =
    workingCase.sessionArrangements === SessionArrangements.NONE_PRESENT
      ? []
      : ['empty']
  const courtAttendeesInput = useDebouncedInput('courtAttendees', [])
  const courtLocationInput = useDebouncedInput('courtLocation', ['empty'])
  const sessionBookingsInput = useDebouncedInput(
    'sessionBookings',
    sessionBookingValidation,
  )
  const endOfSessionBookingsInput = useDebouncedInput(
    'endOfSessionBookings',
    [],
  )

  const hasMissingInfoInRulingStep = workingCase.isCompletedWithoutRuling
    ? !workingCase.decision
    : !workingCase.decision || !workingCase.ruling || !workingCase.conclusion

  const initialize = useCallback(() => {
    const autofillAttendees = []
    const endOfSessionBookings: string[] = []

    if (workingCase.sessionArrangements === SessionArrangements.NONE_PRESENT) {
      autofillAttendees.push(formatMessage(core.sessionArrangementsNonePresent))
    } else {
      if (workingCase.prosecutor) {
        autofillAttendees.push(
          `${workingCase.prosecutor.name} ${lowercase(
            workingCase.prosecutor.title,
          )}`,
        )
      }

      if (
        workingCase.defenderName &&
        workingCase.sessionArrangements !==
          SessionArrangements.PROSECUTOR_PRESENT
      ) {
        autofillAttendees.push(
          `\n${workingCase.defenderName} skipaður ${
            workingCase.sessionArrangements ===
            SessionArrangements.ALL_PRESENT_SPOKESPERSON
              ? 'talsmaður'
              : 'verjandi'
          } ${formatMessage(core.defendant, { suffix: 'a' })}`,
        )
      }

      if (workingCase.translator) {
        autofillAttendees.push(`\n${workingCase.translator} túlkur`)
      }

      if (workingCase.defendants && workingCase.defendants.length > 0) {
        if (
          workingCase.sessionArrangements === SessionArrangements.ALL_PRESENT
        ) {
          workingCase.defendants.forEach((defendant) => {
            autofillAttendees.push(
              `\n${defendant.name} ${formatMessage(core.defendant, {
                suffix: 'i',
              })}`,
            )
          })
        }
      }
    }
    populateEndOfCourtSessionBookingsIntro(workingCase, endOfSessionBookings)

    setAndSendCaseToServer(
      [
        {
          courtStartDate: workingCase.arraignmentDate?.date,
          courtLocation: `í ${applyDativeCaseToCourtName(
            workingCase.court?.name || 'héraðsdómi',
          )}`,
          courtAttendees:
            autofillAttendees.length > 0
              ? autofillAttendees.join('')
              : undefined,
          sessionBookings:
            workingCase.type === CaseType.RESTRAINING_ORDER ||
            workingCase.type ===
              CaseType.RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME
              ? formatMessage(
                  m.sections.sessionBookings.autofillRestrainingOrder,
                )
              : workingCase.type === CaseType.EXPULSION_FROM_HOME
              ? formatMessage(
                  m.sections.sessionBookings.autofillExpulsionFromHome,
                )
              : workingCase.type === CaseType.AUTOPSY
              ? formatMessage(m.sections.sessionBookings.autofillAutopsy)
              : workingCase.sessionArrangements ===
                SessionArrangements.ALL_PRESENT
              ? getSessionBookingsAutofill(formatMessage, workingCase)
              : workingCase.sessionArrangements ===
                SessionArrangements.ALL_PRESENT_SPOKESPERSON
              ? formatMessage(m.sections.sessionBookings.autofillSpokeperson)
              : workingCase.sessionArrangements ===
                SessionArrangements.PROSECUTOR_PRESENT
              ? formatMessage(m.sections.sessionBookings.autofillProsecutor)
              : workingCase.sessionArrangements ===
                SessionArrangements.NONE_PRESENT
              ? formatMessage(m.sections.sessionBookings.autofillNonePresent)
              : undefined,
          endOfSessionBookings:
            endOfSessionBookings.length > 0
              ? endOfSessionBookings.join('')
              : undefined,
        },
      ],
      workingCase,
      setWorkingCase,
    )
  }, [setAndSendCaseToServer, formatMessage, setWorkingCase, workingCase])

  useOnceOn(isCaseUpToDate, initialize)

  const stepIsValid = isCourtRecordStepValidIC(workingCase)
  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  const handleEndOfSessionBookingsUpdate = ({
    accusedAppealDecision,
    accusedAppealAnnouncement,
    prosecutorAppealDecision,
    prosecutorAppealAnnouncement,
  }: {
    accusedAppealDecision?: CaseAppealDecision
    accusedAppealAnnouncement?: string
    prosecutorAppealDecision?: CaseAppealDecision
    prosecutorAppealAnnouncement?: string
  }) => {
    const endOfSessionBookings: string[] = []
    const updatedCase = {
      ...workingCase,
      ...(!isNullOrUndefined(accusedAppealDecision)
        ? { accusedAppealDecision }
        : {}),
      ...(!isNullOrUndefined(accusedAppealAnnouncement)
        ? { accusedAppealAnnouncement }
        : {}),
      ...(!isNullOrUndefined(prosecutorAppealDecision)
        ? { prosecutorAppealDecision }
        : {}),
      ...(!isNullOrUndefined(prosecutorAppealAnnouncement)
        ? { prosecutorAppealAnnouncement }
        : {}),
    }
    populateEndOfCourtSessionBookingsIntro(updatedCase, endOfSessionBookings)

    // override existing end of session booking if there
    // is a update for a given working case (e.g. appeal decision)
    // that should trigger an end of session bookings default text update
    setAndSendCaseToServer(
      [
        {
          endOfSessionBookings:
            endOfSessionBookings.length > 0
              ? endOfSessionBookings.join('')
              : undefined,
          force: true,
        },
      ],
      workingCase,
      setWorkingCase,
    )
  }

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.court.investigationCases.courtRecord)}
      />
      <FormContentContainer>
        <PageTitle>{formatMessage(m.sections.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <div className={grid({ gap: 5, marginBottom: 10 })}>
          <Box component="section">
            <BlueBox className={grid({ gap: 2 })}>
              <DateTime
                name="courtStartDate"
                datepickerLabel={formatMessage(
                  m.sections.courtStartDate.dateLabel,
                )}
                timeLabel={formatMessage(m.sections.courtStartDate.timeLabel)}
                maxDate={new Date()}
                selectedDate={workingCase.courtStartDate}
                onChange={(date: Date | undefined, valid: boolean) => {
                  if (date && valid) {
                    setAndSendCaseToServer(
                      [
                        {
                          courtStartDate: formatDateForServer(date),
                          force: true,
                        },
                      ],
                      workingCase,
                      setWorkingCase,
                    )
                  }
                }}
                blueBox={false}
                required
              />
              <Input
                data-testid="courtLocation"
                name="courtLocation"
                tooltip={formatMessage(m.sections.courtLocation.tooltip)}
                label={formatMessage(m.sections.courtLocation.label)}
                value={courtLocationInput.value || ''}
                placeholder={formatMessage(
                  m.sections.courtLocation.placeholder,
                )}
                onChange={(evt) =>
                  courtLocationInput.onChange(evt.target.value)
                }
                onBlur={(evt) => courtLocationInput.onBlur(evt.target.value)}
                errorMessage={courtLocationInput.errorMessage}
                hasError={courtLocationInput.hasError}
                autoComplete="off"
                required
              />
            </BlueBox>
          </Box>
          <Box component="section">
            <HideableText
              text={formatMessage(closedCourt.text)}
              isHidden={workingCase.isClosedCourtHidden}
              onToggleVisibility={(isVisible: boolean) =>
                setAndSendCaseToServer(
                  [
                    {
                      isClosedCourtHidden: isVisible,
                      force: true,
                    },
                  ],
                  workingCase,
                  setWorkingCase,
                )
              }
              tooltip={formatMessage(closedCourt.tooltip)}
            />
          </Box>
          <Box component="section">
            <Input
              data-testid="courtAttendees"
              name="courtAttendees"
              label="Mættir eru"
              placeholder="Skrifa hér..."
              value={courtAttendeesInput.value ?? ''}
              onChange={(evt) => courtAttendeesInput.onChange(evt.target.value)}
              textarea
              rows={7}
            />
          </Box>
          <Box component="section">
            <CourtDocuments
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
            />
          </Box>
          <Box component="section">
            <SectionHeading
              title={formatMessage(m.sections.sessionBookings.title)}
              tooltip={formatMessage(m.sections.sessionBookings.tooltip)}
            />
            <Input
              data-testid="sessionBookings"
              name="sessionBookings"
              label={formatMessage(m.sections.sessionBookings.label)}
              value={sessionBookingsInput.value ?? ''}
              placeholder={formatMessage(
                m.sections.sessionBookings.placeholder,
              )}
              onChange={(evt) =>
                sessionBookingsInput.onChange(evt.target.value)
              }
              onBlur={(evt) => sessionBookingsInput.onBlur(evt.target.value)}
              errorMessage={sessionBookingsInput.errorMessage}
              hasError={sessionBookingsInput.hasError}
              textarea
              rows={16}
              required={sessionBookingValidation.length > 0}
            />
          </Box>
          {workingCase.conclusion && (
            <Box component="section">
              <SectionHeading title={formatMessage(m.sections.conclusion)} />
              <BlueBox>
                <Text>{workingCase.conclusion}</Text>
              </BlueBox>
            </Box>
          )}
          <Box component="section">
            <AppealSections
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
              onChange={handleEndOfSessionBookingsUpdate}
            />
          </Box>
          <Box component="section">
            <SectionHeading
              title={formatMessage(m.sections.endOfSessionBookings.title)}
            />
            <Input
              data-testid="endOfSessionBookings"
              name="endOfSessionBookings"
              label={formatMessage(m.sections.endOfSessionBookings.label)}
              value={endOfSessionBookingsInput.value || ''}
              placeholder={formatMessage(
                m.sections.endOfSessionBookings.placeholder,
              )}
              onChange={(evt) =>
                endOfSessionBookingsInput.onChange(evt.target.value)
              }
              rows={16}
              textarea
            />
          </Box>
          <Box>
            <SectionHeading
              title={formatMessage(m.sections.endOfSessionTitle)}
            />
            <BlueBox>
              <DateTime
                name="courtEndTime"
                datepickerLabel={formatMessage(
                  m.sections.courtEndTime.dateLabel,
                )}
                timeLabel={formatMessage(m.sections.courtEndTime.timeLabel)}
                minDate={
                  workingCase.courtStartDate
                    ? new Date(workingCase.courtStartDate)
                    : undefined
                }
                maxDate={new Date()}
                selectedDate={workingCase.courtEndTime}
                onChange={(date: Date | undefined, valid: boolean) => {
                  if (date && valid) {
                    setAndSendCaseToServer(
                      [
                        {
                          courtEndTime: formatDateForServer(date),
                          force: true,
                        },
                      ],
                      workingCase,
                      setWorkingCase,
                    )
                  }
                }}
                blueBox={false}
                required
              />
            </BlueBox>
          </Box>
          <Box>
            <PdfButton
              caseId={workingCase.id}
              title={formatMessage(core.pdfButtonRulingShortVersion)}
              pdfType="courtRecord"
              elementId={formatMessage(core.pdfButtonRulingShortVersion)}
            />
          </Box>
        </div>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INVESTIGATION_CASE_RULING_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoadingWorkingCase}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INVESTIGATION_CASE_CONFIRMATION_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
          hideNextButton={hasMissingInfoInRulingStep}
          infoBoxText={
            hasMissingInfoInRulingStep
              ? formatMessage(m.sections.nextButtonInfo.text, {
                  isCompletedWithoutRuling:
                    workingCase.isCompletedWithoutRuling,
                })
              : ''
          }
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CourtRecord
