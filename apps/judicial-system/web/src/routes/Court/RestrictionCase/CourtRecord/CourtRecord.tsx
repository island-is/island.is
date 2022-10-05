import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  RadioButton,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import {
  FormFooter,
  PageLayout,
  CourtCaseInfo,
  BlueBox,
  FormContentContainer,
  DateTime,
  HideableText,
  PdfButton,
  CourtDocuments,
  FormContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseAppealDecision,
  CaseDecision,
  CaseType,
  isAcceptingCaseDecision,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import {
  RestrictionCaseCourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  rcCourtRecord as m,
  closedCourt,
  core,
  titles,
} from '@island.is/judicial-system-web/messages'
import useDeb from '@island.is/judicial-system-web/src/utils/hooks/useDeb'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { formatDateForServer } from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import * as constants from '@island.is/judicial-system/consts'

import { isCourtRecordStepValidRC } from '../../../../utils/validate'
import { formatCustodyRestrictions } from '../../../../utils/restrictions'
import * as styles from './CourtRecord.css'
import { capitalize } from '@island.is/judicial-system/formatters'

export const CourtRecord: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)

  const [courtLocationErrorMessage, setCourtLocationMessage] = useState<string>(
    '',
  )
  const [
    sessionBookingsErrorMessage,
    setSessionBookingsErrorMessage,
  ] = useState<string>('')

  const router = useRouter()
  const [initialAutoFillDone, setInitialAutoFillDone] = useState(false)
  const { updateCase, setAndSendToServer } = useCase()
  const { formatMessage } = useIntl()

  const id = router.query.id

  useDeb(workingCase, 'courtAttendees')
  useDeb(workingCase, 'sessionBookings')
  useDeb(workingCase, 'accusedAppealAnnouncement')
  useDeb(workingCase, 'prosecutorAppealAnnouncement')
  useDeb(workingCase, 'endOfSessionBookings')

  useEffect(() => {
    if (isCaseUpToDate && !initialAutoFillDone) {
      const autofillAttendees = []
      const autofillSessionBookings = []
      const endOfSessionBookings = []

      if (workingCase.courtAttendees !== '') {
        if (workingCase.prosecutor) {
          autofillAttendees.push(
            `${workingCase.prosecutor.name} ${workingCase.prosecutor.title}`,
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
            `\n${workingCase.defendants[0].name} ${formatMessage(
              core.defendant,
              {
                suffix: 'i',
              },
            )}`,
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

        if (
          isAcceptingCaseDecision(workingCase.decision) ||
          workingCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
        ) {
          if (isAcceptingCaseDecision(workingCase.decision)) {
            const formattedRestrictions = formatCustodyRestrictions(
              formatMessage,
              workingCase.type,
              workingCase.requestedCustodyRestrictions,
            )

            if (formattedRestrictions) {
              endOfSessionBookings.push(formattedRestrictions, '\n\n')
            }
          }

          endOfSessionBookings.push(
            formatMessage(m.sections.custodyRestrictions.disclaimerV2, {
              caseType:
                workingCase.decision ===
                CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                  ? CaseType.TRAVEL_BAN
                  : workingCase.type,
            }),
          )
        }
      } else if (workingCase.type === CaseType.TRAVEL_BAN) {
        autofillSessionBookings.push(
          `\n\n${formatMessage(
            m.sections.sessionBookings.autofillPresentationsTravelBan,
          )}`,
        )

        if (
          isAcceptingCaseDecision(workingCase.decision) &&
          workingCase.requestedOtherRestrictions
        ) {
          endOfSessionBookings.push(
            `${
              workingCase.requestedOtherRestrictions &&
              `${workingCase.requestedOtherRestrictions}\n\n`
            }${formatMessage(m.sections.custodyRestrictions.disclaimerV2, {
              caseType: workingCase.type,
            })}`,
          )
        }
      }

      setAndSendToServer(
        [
          {
            courtStartDate: workingCase.courtDate,
            courtLocation:
              workingCase.court &&
              `í ${
                workingCase.court.name.indexOf('dómur') > -1
                  ? workingCase.court.name.replace('dómur', 'dómi')
                  : workingCase.court.name
              }`,
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

      setInitialAutoFillDone(true)
    }
  }, [
    setAndSendToServer,
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
      activeSubSection={RestrictionCaseCourtSubsections.COURT_RECORD}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.court.restrictionCases.courtRecord)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.sections.title)}
          </Text>
        </Box>
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
                    setAndSendToServer(
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
                  workingCase,
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
                setAndSendToServer(
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
                  workingCase,
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
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.appealDecision.title)}
            </Text>
          </Box>
          <Box marginBottom={3}>
            <Text variant="h4" fontWeight="light">
              {formatMessage(m.sections.appealDecision.disclaimer)}
            </Text>
          </Box>
          {workingCase.defendants && workingCase.defendants.length > 0 && (
            <Box marginBottom={3}>
              <BlueBox>
                <Box marginBottom={2}>
                  <Text as="h4" variant="h4">
                    {`${formatMessage(
                      m.sections.appealDecision.defendantTitle,
                    )} `}
                    <Text as="span" color="red600" fontWeight="semiBold">
                      *
                    </Text>
                  </Text>
                </Box>
                <div className={styles.gridRowEqual}>
                  <RadioButton
                    name="accused-appeal-decision"
                    id="accused-appeal"
                    label={formatMessage(
                      m.sections.appealDecision.accusedAppeal,
                      {
                        accused: capitalize(
                          formatMessage(core.defendant, {
                            suffix: 'i',
                          }),
                        ),
                      },
                    )}
                    value={CaseAppealDecision.APPEAL}
                    checked={
                      workingCase.accusedAppealDecision ===
                      CaseAppealDecision.APPEAL
                    }
                    onChange={() => {
                      setAndSendToServer(
                        [
                          {
                            accusedAppealDecision: CaseAppealDecision.APPEAL,
                            force: true,
                          },
                          {
                            accusedAppealAnnouncement:
                              workingCase.sessionArrangements ===
                              SessionArrangements.ALL_PRESENT_SPOKESPERSON
                                ? formatMessage(
                                    m.sections.appealDecision
                                      .defendantAnnouncementAutofillSpokespersonAppeal,
                                  )
                                : formatMessage(
                                    m.sections.appealDecision
                                      .defendantAnnouncementAutofillAppeal,
                                    {
                                      caseType: workingCase.type,
                                    },
                                  ),
                            force: true,
                          },
                        ],
                        workingCase,
                        setWorkingCase,
                      )
                    }}
                    large
                    backgroundColor="white"
                  />
                  <RadioButton
                    name="accused-appeal-decision"
                    id="accused-accept"
                    label={formatMessage(
                      m.sections.appealDecision.accusedAccept,
                      {
                        accused: capitalize(
                          formatMessage(core.defendant, {
                            suffix: 'i',
                          }),
                        ),
                      },
                    )}
                    value={CaseAppealDecision.ACCEPT}
                    checked={
                      workingCase.accusedAppealDecision ===
                      CaseAppealDecision.ACCEPT
                    }
                    onChange={() => {
                      setAndSendToServer(
                        [
                          {
                            accusedAppealDecision: CaseAppealDecision.ACCEPT,
                            force: true,
                          },
                          {
                            accusedAppealAnnouncement: '',
                            force: true,
                          },
                        ],
                        workingCase,
                        setWorkingCase,
                      )
                    }}
                    large
                    backgroundColor="white"
                  />
                </div>
                <div className={styles.gridRow2fr1fr}>
                  <RadioButton
                    name="accused-appeal-decision"
                    id="accused-postpone"
                    label={formatMessage(
                      m.sections.appealDecision.accusedPostpone,
                      {
                        accused: capitalize(
                          formatMessage(core.defendant, {
                            suffix: 'i',
                          }),
                        ),
                      },
                    )}
                    value={CaseAppealDecision.POSTPONE}
                    checked={
                      workingCase.accusedAppealDecision ===
                      CaseAppealDecision.POSTPONE
                    }
                    onChange={() => {
                      setAndSendToServer(
                        [
                          {
                            accusedAppealDecision: CaseAppealDecision.POSTPONE,
                            force: true,
                          },
                          {
                            accusedAppealAnnouncement: '',
                            force: true,
                          },
                        ],
                        workingCase,
                        setWorkingCase,
                      )
                    }}
                    large
                    backgroundColor="white"
                  />
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
                      setAndSendToServer(
                        [
                          {
                            accusedAppealDecision:
                              CaseAppealDecision.NOT_APPLICABLE,
                            force: true,
                          },
                          {
                            accusedAppealAnnouncement: '',
                            force: true,
                          },
                        ],
                        workingCase,
                        setWorkingCase,
                      )
                    }}
                    large
                    backgroundColor="white"
                  />
                </div>
                <Input
                  name="accusedAppealAnnouncement"
                  data-testid="accusedAppealAnnouncement"
                  label={formatMessage(
                    m.sections.appealDecision.defendantAnnouncementLabel,
                  )}
                  value={workingCase.accusedAppealAnnouncement || ''}
                  placeholder={formatMessage(
                    m.sections.appealDecision.defendantAnnouncementPlaceholder,
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
              <div className={styles.gridRowEqual}>
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
                    setAndSendToServer(
                      [
                        {
                          prosecutorAppealDecision: CaseAppealDecision.APPEAL,
                          force: true,
                        },
                        {
                          prosecutorAppealAnnouncement: formatMessage(
                            m.sections.appealDecision
                              .prosecutorAnnoncementAutofillAppeal,
                          ),
                          force: true,
                        },
                      ],
                      workingCase,
                      setWorkingCase,
                    )
                  }}
                  large
                  backgroundColor="white"
                />

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
                    setAndSendToServer(
                      [
                        {
                          prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
                          force: true,
                        },
                        {
                          prosecutorAppealAnnouncement: '',
                          force: true,
                        },
                      ],
                      workingCase,
                      setWorkingCase,
                    )
                  }}
                  large
                  backgroundColor="white"
                />
              </div>
              <div className={styles.gridRow2fr1fr}>
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
                    setAndSendToServer(
                      [
                        {
                          prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
                          force: true,
                        },
                        {
                          prosecutorAppealAnnouncement: '',
                          force: true,
                        },
                      ],
                      workingCase,
                      setWorkingCase,
                    )
                  }}
                  large
                  backgroundColor="white"
                />

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
                    setAndSendToServer(
                      [
                        {
                          prosecutorAppealDecision:
                            CaseAppealDecision.NOT_APPLICABLE,
                          force: true,
                        },
                        {
                          prosecutorAppealAnnouncement: '',
                          force: true,
                        },
                      ],
                      workingCase,
                      setWorkingCase,
                    )
                  }}
                  large
                  backgroundColor="white"
                />
              </div>
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
              {formatMessage(m.sections.endOfSessionTitle)}
            </Text>
          </Box>
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
                    setAndSendToServer(
                      [
                        {
                          courtEndTime:
                            date && valid
                              ? formatDateForServer(date)
                              : undefined,
                          force: true,
                        },
                      ],
                      workingCase,
                      setWorkingCase,
                    )
                  }}
                  blueBox={false}
                  required
                />
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
          previousUrl={`${constants.RESTRICTION_CASE_RULING_ROUTE}/${workingCase.id}`}
          nextUrl={`${constants.RESTRICTION_CASE_CONFIRMATION_ROUTE}/${id}`}
          nextIsDisabled={!isCourtRecordStepValidRC(workingCase)}
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
