import { FC, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  applyDativeCaseToCourtName,
  lowercase,
} from '@island.is/judicial-system/formatters'
import {
  closedCourt,
  core,
  rcCourtRecord as m,
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
} from '@island.is/judicial-system-web/src/components'
import {
  CaseAppealDecision,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  formatDateForServer,
  useCase,
  useDeb,
  useOnceOn,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  isCourtRecordStepValidRC,
  isNullOrUndefined,
} from '@island.is/judicial-system-web/src/utils/validate'

import { AppealSections } from '../../components'
import { populateEndOfCourtSessionBookingsIntro } from '../../shared/populateEndOfCourtSessionBookingsIntro'
import { populateEndOfCourtSessionForRestrictions } from './helpers/endOfSessionBookings'

export const CourtRecord: FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)

  const [courtLocationErrorMessage, setCourtLocationMessage] =
    useState<string>('')
  const [sessionBookingsErrorMessage, setSessionBookingsErrorMessage] =
    useState<string>('')

  const router = useRouter()
  const { updateCase, setAndSendCaseToServer } = useCase()
  const { formatMessage } = useIntl()

  useDeb(workingCase, [
    'courtAttendees',
    'sessionBookings',
    'accusedAppealAnnouncement',
    'prosecutorAppealAnnouncement',
    'endOfSessionBookings',
  ])

  const initialize = useCallback(() => {
    const autofillAttendees = []
    const autofillSessionBookings = []
    const endOfSessionBookings: string[] = []

    if (workingCase.courtAttendees !== '') {
      if (workingCase.prosecutor) {
        autofillAttendees.push(
          `${workingCase.prosecutor.name} ${lowercase(
            workingCase.prosecutor.title,
          )}`,
        )
      }

      if (workingCase.defenderName) {
        autofillAttendees.push(
          `\n${workingCase.defenderName} skipaður verjandi ${formatMessage(
            core.defendant,
            {
              suffix: 'a',
            },
          )}`,
        )
      }

      if (workingCase.translator) {
        autofillAttendees.push(`\n${workingCase.translator} túlkur`)
      }

      if (workingCase.defendants && workingCase.defendants.length > 0) {
        autofillAttendees.push(
          `\n${workingCase.defendants[0].name} ${formatMessage(core.defendant, {
            suffix: 'i',
          })}`,
        )
      }
    }

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
      )}\n\n${formatMessage(m.sections.sessionBookings.autofillAccusedPlea)}`,
    )

    populateEndOfCourtSessionBookingsIntro(workingCase, endOfSessionBookings)
    populateEndOfCourtSessionForRestrictions(
      workingCase,
      endOfSessionBookings,
      formatMessage,
    )

    if (
      workingCase.type === CaseType.CUSTODY ||
      workingCase.type === CaseType.ADMISSION_TO_FACILITY
    ) {
      autofillSessionBookings.push(
        `\n\n${formatMessage(
          m.sections.sessionBookings.autofillPresentationsV3,
          {
            caseType: workingCase.type,
          },
        )}`,
      )
    } else if (workingCase.type === CaseType.TRAVEL_BAN) {
      autofillSessionBookings.push(
        `\n\n${formatMessage(
          m.sections.sessionBookings.autofillPresentationsTravelBan,
        )}`,
      )
    }

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
            autofillSessionBookings.length > 0
              ? autofillSessionBookings.join('')
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

  const stepIsValid = isCourtRecordStepValidRC(workingCase)
  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [router, workingCase.id],
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
    populateEndOfCourtSessionForRestrictions(
      updatedCase,
      endOfSessionBookings,
      formatMessage,
    )

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
        title={formatMessage(titles.court.restrictionCases.courtRecord)}
      />
      <FormContentContainer>
        <PageTitle>{formatMessage(m.sections.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={3}>
          <BlueBox>
            <Box marginBottom={3}>
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
                  setWorkingCase,
                  courtLocationErrorMessage,
                  setCourtLocationMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'courtLocation',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setCourtLocationMessage,
                )
              }
              errorMessage={courtLocationErrorMessage}
              hasError={courtLocationErrorMessage !== ''}
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
                ['empty'],
                setWorkingCase,
              )
            }
            onBlur={(event) =>
              updateCase(workingCase.id, { courtAttendees: event.target.value })
            }
            textarea
            rows={7}
            autoExpand={{ on: true, maxHeight: 300 }}
          />
        </Box>
        <Box component="section" marginBottom={8}>
          <CourtDocuments
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
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
                  setWorkingCase,
                  sessionBookingsErrorMessage,
                  setSessionBookingsErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'sessionBookings',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setSessionBookingsErrorMessage,
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
        {workingCase.conclusion && (
          <Box component="section" marginBottom={8}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                {formatMessage(m.sections.conclusion)}
              </Text>
            </Box>
            <BlueBox>
              <Text>{workingCase.conclusion}</Text>
            </BlueBox>
          </Box>
        )}
        <Box component="section" marginBottom={8}>
          <AppealSections
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            onChange={handleEndOfSessionBookingsUpdate}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.endOfSessionBookings.title)}
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Input
              data-testid="endOfSessionBookings"
              name="endOfSessionBookings"
              label={formatMessage(m.sections.endOfSessionBookings.label)}
              value={workingCase.endOfSessionBookings || ''}
              placeholder={formatMessage(
                m.sections.endOfSessionBookings.placeholder,
              )}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'endOfSessionBookings',
                  event.target.value,
                  [],
                  setWorkingCase,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'endOfSessionBookings',
                  event.target.value,
                  [],
                  workingCase,
                  updateCase,
                )
              }
              rows={16}
              autoExpand={{ on: true, maxHeight: 600 }}
              textarea
            />
          </Box>
        </Box>
        <Box marginBottom={5}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.endOfSessionTitle)}
            </Text>
          </Box>
          <BlueBox>
            <GridContainer>
              <GridRow>
                <GridColumn>
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
                </GridColumn>
              </GridRow>
            </GridContainer>
          </BlueBox>
        </Box>
        <Box marginBottom={10}>
          <PdfButton
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRulingShortVersion)}
            pdfType="courtRecord"
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.RESTRICTION_CASE_RULING_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.RESTRICTION_CASE_CONFIRMATION_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
          hideNextButton={
            !workingCase.decision ||
            !workingCase.conclusion ||
            !workingCase.ruling
          }
          infoBoxText={
            !workingCase.decision ||
            !workingCase.conclusion ||
            !workingCase.ruling
              ? formatMessage(m.sections.nextButtonInfo.text)
              : ''
          }
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CourtRecord
