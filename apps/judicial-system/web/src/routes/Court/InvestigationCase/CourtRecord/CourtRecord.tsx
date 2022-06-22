import React, { useContext, useEffect, useState } from 'react'
import { IntlShape, useIntl } from 'react-intl'

import {
  BlueBox,
  CaseInfo,
  CourtDocuments,
  DateTime,
  FormContentContainer,
  FormFooter,
  HideableText,
  PageLayout,
  PdfButton,
  TimeInputField,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseAppealDecision,
  CaseType,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase, useDeb } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  closedCourt,
  core,
  icCourtRecord as m,
  titles,
} from '@island.is/judicial-system-web/messages'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  GridRow,
  GridColumn,
  RadioButton,
  GridContainer,
  Box,
  Text,
  Input,
  Tooltip,
} from '@island.is/island-ui/core'
import {
  setAndSendDateToServer,
  removeTabsValidateAndSet,
  validateAndSendToServer,
  validateAndSetTime,
  validateAndSendTimeToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { isCourtRecordStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'
import {
  formatRequestCaseType,
  formatDate,
} from '@island.is/judicial-system/formatters'
import * as constants from '@island.is/judicial-system/consts'

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

const CourtRecord = () => {
  const [initialAutoFillDone, setInitialAutoFillDone] = useState(false)
  const { autofill, updateCase } = useCase()
  const { formatMessage } = useIntl()
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)

  const [courtLocationEM, setCourtLocationEM] = useState<string>('')
  const [
    sessionBookingsErrorMessage,
    setSessionBookingsMessage,
  ] = useState<string>('')
  const [courtDocumentEndEM, setCourtDocumentEndEM] = useState<string>('')

  useDeb(workingCase, 'courtAttendees')
  useDeb(workingCase, 'sessionBookings')
  useDeb(workingCase, 'accusedAppealAnnouncement')
  useDeb(workingCase, 'prosecutorAppealAnnouncement')
  useDeb(workingCase, 'endOfSessionBookings')

  useEffect(() => {
    if (isCaseUpToDate && !initialAutoFillDone) {
      const autofillAttendees = []

      if (workingCase.courtAttendees !== '') {
        if (workingCase.prosecutor) {
          autofillAttendees.push(
            `${workingCase.prosecutor.name} ${workingCase.prosecutor.title}`,
          )
        }

        if (
          workingCase.defenderName &&
          workingCase.sessionArrangements !==
            SessionArrangements.PROSECUTOR_PRESENT
        ) {
          autofillAttendees.push(
            `\n${workingCase.defenderName} skipaður ${
              workingCase.defenderIsSpokesperson ? 'talsmaður' : 'verjandi'
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

      autofill(
        [
          { key: 'courtStartDate', value: workingCase.courtDate },
          {
            key: 'courtLocation',
            value: workingCase.court
              ? `í ${
                  workingCase.court.name.indexOf('dómur') > -1
                    ? workingCase.court.name.replace('dómur', 'dómi')
                    : workingCase.court.name
                }`
              : undefined,
          },
          {
            key: 'courtAttendees',
            value:
              autofillAttendees.length > 0
                ? autofillAttendees.join('')
                : undefined,
          },
          {
            key: 'sessionBookings',
            value:
              workingCase.type === CaseType.RESTRAINING_ORDER
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
                : undefined,
          },
        ],
        workingCase,
        setWorkingCase,
      )

      setInitialAutoFillDone(true)
    }
  }, [
    autofill,
    formatMessage,
    initialAutoFillDone,
    isCaseUpToDate,
    setWorkingCase,
    workingCase,
  ])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={CourtSubsections.COURT_RECORD}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.court.investigationCases.courtRecord)}
      />
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
                autofill(
                  [
                    {
                      key: 'isClosedCourtHidden',
                      value: isVisible,
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
                [],
                workingCase,
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
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.appealDecision.title)}
            </Text>
          </Box>
          {workingCase.sessionArrangements ===
            SessionArrangements.ALL_PRESENT && (
            <Box marginBottom={3}>
              <Text variant="h4" fontWeight="light">
                {formatMessage(m.sections.appealDecision.disclaimer)}
              </Text>
            </Box>
          )}
          {workingCase.defendants && workingCase.defendants.length > 0 && (
            <Box marginBottom={3}>
              <BlueBox>
                <Box marginBottom={2}>
                  <Text as="h4" variant="h4">
                    {formatMessage(m.sections.appealDecision.accusedTitle)}{' '}
                    <Text as="span" color="red600" fontWeight="semiBold">
                      *
                    </Text>
                  </Text>
                </Box>
                <Box marginBottom={2}>
                  <GridRow>
                    <GridColumn span="6/12">
                      <RadioButton
                        name="accused-appeal-decision"
                        id="accused-appeal"
                        label={formatMessage(
                          workingCase.defendants.length > 1
                            ? m.sections.appealDecision.multipleAccusedAppeal
                            : m.sections.appealDecision.accusedAppeal,
                        )}
                        value={CaseAppealDecision.APPEAL}
                        checked={
                          workingCase.accusedAppealDecision ===
                          CaseAppealDecision.APPEAL
                        }
                        onChange={() => {
                          setWorkingCase({
                            ...workingCase,
                            accusedAppealDecision: CaseAppealDecision.APPEAL,
                          })

                          updateCase(workingCase.id, {
                            accusedAppealDecision: CaseAppealDecision.APPEAL,
                          })
                        }}
                        large
                        backgroundColor="white"
                      />
                    </GridColumn>
                    <GridColumn span="6/12">
                      <RadioButton
                        name="accused-appeal-decision"
                        id="accused-accept"
                        label={formatMessage(
                          workingCase.defendants.length > 1
                            ? m.sections.appealDecision.multipleAccusedAccept
                            : m.sections.appealDecision.accusedAccept,
                        )}
                        value={CaseAppealDecision.ACCEPT}
                        checked={
                          workingCase.accusedAppealDecision ===
                          CaseAppealDecision.ACCEPT
                        }
                        onChange={() => {
                          setWorkingCase({
                            ...workingCase,
                            accusedAppealDecision: CaseAppealDecision.ACCEPT,
                          })

                          updateCase(workingCase.id, {
                            accusedAppealDecision: CaseAppealDecision.ACCEPT,
                          })
                        }}
                        large
                        backgroundColor="white"
                      />
                    </GridColumn>
                  </GridRow>
                </Box>
                <Box marginBottom={2}>
                  <GridRow>
                    <GridColumn span="7/12">
                      <RadioButton
                        name="accused-appeal-decision"
                        id="accused-postpone"
                        label={formatMessage(
                          workingCase.defendants.length > 1
                            ? m.sections.appealDecision.multipleAccusedPostpone
                            : m.sections.appealDecision.accusedPostpone,
                        )}
                        value={CaseAppealDecision.POSTPONE}
                        checked={
                          workingCase.accusedAppealDecision ===
                          CaseAppealDecision.POSTPONE
                        }
                        onChange={() => {
                          setWorkingCase({
                            ...workingCase,
                            accusedAppealDecision: CaseAppealDecision.POSTPONE,
                          })

                          updateCase(workingCase.id, {
                            accusedAppealDecision: CaseAppealDecision.POSTPONE,
                          })
                        }}
                        large
                        backgroundColor="white"
                      />
                    </GridColumn>
                    <GridColumn span="5/12">
                      <RadioButton
                        name="accused-appeal-decision"
                        id="accused-not-applicable"
                        label={formatMessage(
                          m.sections.appealDecision.accusedNotApplicable,
                        )}
                        value={CaseAppealDecision.NOT_APPLICABLE}
                        checked={
                          workingCase.accusedAppealDecision ===
                          CaseAppealDecision.NOT_APPLICABLE
                        }
                        onChange={() => {
                          setWorkingCase({
                            ...workingCase,
                            accusedAppealDecision:
                              CaseAppealDecision.NOT_APPLICABLE,
                          })

                          updateCase(workingCase.id, {
                            accusedAppealDecision:
                              CaseAppealDecision.NOT_APPLICABLE,
                          })
                        }}
                        large
                        backgroundColor="white"
                      />
                    </GridColumn>
                  </GridRow>
                </Box>
                <Input
                  name="accusedAppealAnnouncement"
                  data-testid="accusedAppealAnnouncement"
                  label={formatMessage(
                    m.sections.appealDecision.accusedAnnouncementLabel,
                  )}
                  value={workingCase.accusedAppealAnnouncement || ''}
                  placeholder={formatMessage(
                    workingCase.defendants.length > 1
                      ? m.sections.appealDecision
                          .multipleAccusedAnnouncementPlaceholder
                      : m.sections.appealDecision
                          .accusedAnnouncementPlaceholder,
                  )}
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'accusedAppealAnnouncement',
                      event.target.value,
                      [],
                      workingCase,
                      setWorkingCase,
                    )
                  }
                  onBlur={(event) =>
                    validateAndSendToServer(
                      'accusedAppealAnnouncement',
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
          )}
          <Box marginBottom={5}>
            <BlueBox>
              <Box marginBottom={2}>
                <Text as="h4" variant="h4">
                  {formatMessage(m.sections.appealDecision.prosecutorTitle)}{' '}
                  <Text as="span" color="red400" fontWeight="semiBold">
                    *
                  </Text>
                </Text>
              </Box>
              <Box marginBottom={2}>
                <GridRow>
                  <GridColumn span="6/12">
                    <RadioButton
                      name="prosecutor-appeal-decision"
                      id="prosecutor-appeal"
                      label={formatMessage(
                        m.sections.appealDecision.prosecutorAppeal,
                      )}
                      value={CaseAppealDecision.APPEAL}
                      checked={
                        workingCase.prosecutorAppealDecision ===
                        CaseAppealDecision.APPEAL
                      }
                      onChange={() => {
                        setWorkingCase({
                          ...workingCase,
                          prosecutorAppealDecision: CaseAppealDecision.APPEAL,
                        })

                        updateCase(workingCase.id, {
                          prosecutorAppealDecision: CaseAppealDecision.APPEAL,
                        })
                      }}
                      large
                      backgroundColor="white"
                    />
                  </GridColumn>
                  <GridColumn span="6/12">
                    <RadioButton
                      name="prosecutor-appeal-decision"
                      id="prosecutor-accept"
                      label={formatMessage(
                        m.sections.appealDecision.prosecutorAccept,
                      )}
                      value={CaseAppealDecision.ACCEPT}
                      checked={
                        workingCase.prosecutorAppealDecision ===
                        CaseAppealDecision.ACCEPT
                      }
                      onChange={() => {
                        setWorkingCase({
                          ...workingCase,
                          prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
                        })

                        updateCase(workingCase.id, {
                          prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
                        })
                      }}
                      large
                      backgroundColor="white"
                    />
                  </GridColumn>
                </GridRow>
              </Box>
              <Box marginBottom={2}>
                <GridRow>
                  <GridColumn span="7/12">
                    <RadioButton
                      name="prosecutor-appeal-decision"
                      id="prosecutor-postpone"
                      label={formatMessage(
                        m.sections.appealDecision.prosecutorPostpone,
                      )}
                      value={CaseAppealDecision.POSTPONE}
                      checked={
                        workingCase.prosecutorAppealDecision ===
                        CaseAppealDecision.POSTPONE
                      }
                      onChange={() => {
                        setWorkingCase({
                          ...workingCase,
                          prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
                        })

                        updateCase(workingCase.id, {
                          prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
                        })
                      }}
                      large
                      backgroundColor="white"
                    />
                  </GridColumn>
                  <GridColumn span="5/12">
                    <RadioButton
                      name="prosecutor-appeal-decision"
                      id="prosecutor-not-applicable"
                      label={formatMessage(
                        m.sections.appealDecision.prosecutorNotApplicable,
                      )}
                      value={CaseAppealDecision.NOT_APPLICABLE}
                      checked={
                        workingCase.prosecutorAppealDecision ===
                        CaseAppealDecision.NOT_APPLICABLE
                      }
                      onChange={() => {
                        setWorkingCase({
                          ...workingCase,
                          prosecutorAppealDecision:
                            CaseAppealDecision.NOT_APPLICABLE,
                        })

                        updateCase(workingCase.id, {
                          prosecutorAppealDecision:
                            CaseAppealDecision.NOT_APPLICABLE,
                        })
                      }}
                      large
                      backgroundColor="white"
                    />
                  </GridColumn>
                </GridRow>
              </Box>
              <Box>
                <Input
                  name="prosecutorAppealAnnouncement"
                  data-testid="prosecutorAppealAnnouncement"
                  label={formatMessage(
                    m.sections.appealDecision.prosecutorAnnouncementLabel,
                  )}
                  value={workingCase.prosecutorAppealAnnouncement || ''}
                  placeholder={formatMessage(
                    m.sections.appealDecision.prosecutorAnnouncementPlaceholder,
                  )}
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'prosecutorAppealAnnouncement',
                      event.target.value,
                      [],
                      workingCase,
                      setWorkingCase,
                    )
                  }
                  onBlur={(event) =>
                    validateAndSendToServer(
                      'prosecutorAppealAnnouncement',
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
            </BlueBox>
          </Box>
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
                  workingCase,
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
              Þinghald
            </Text>
          </Box>
          <GridContainer>
            <GridRow>
              <GridColumn>
                <TimeInputField
                  onChange={(evt) =>
                    validateAndSetTime(
                      'courtEndTime',
                      workingCase.courtStartDate,
                      evt.target.value,
                      ['empty', 'time-format'],
                      workingCase,
                      setWorkingCase,
                      courtDocumentEndEM,
                      setCourtDocumentEndEM,
                    )
                  }
                  onBlur={(evt) =>
                    validateAndSendTimeToServer(
                      'courtEndTime',
                      workingCase.courtStartDate,
                      evt.target.value,
                      ['empty', 'time-format'],
                      workingCase,
                      updateCase,
                      setCourtDocumentEndEM,
                    )
                  }
                >
                  <Input
                    data-testid="courtEndTime"
                    name="courtEndTime"
                    label="Þinghaldi lauk (kk:mm)"
                    placeholder="Veldu tíma"
                    autoComplete="off"
                    defaultValue={formatDate(
                      workingCase.courtEndTime,
                      constants.TIME_FORMAT,
                    )}
                    errorMessage={courtDocumentEndEM}
                    hasError={courtDocumentEndEM !== ''}
                    required
                  />
                </TimeInputField>
              </GridColumn>
            </GridRow>
          </GridContainer>
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
          previousUrl={`${constants.IC_RULING_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoadingWorkingCase}
          nextUrl={`${constants.IC_CONFIRMATION_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isCourtRecordStepValidIC(workingCase)}
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
