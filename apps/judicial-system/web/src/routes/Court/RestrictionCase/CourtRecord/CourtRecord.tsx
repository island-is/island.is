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
  CourtDocuments,
  PageLayout,
  CaseInfo,
  BlueBox,
  FormContentContainer,
  DateTime,
  HideableText,
  TimeInputField,
  PdfButton,
} from '@island.is/judicial-system-web/src/components'
import {
  capitalize,
  caseTypes,
  formatCustodyRestrictions,
  formatDate,
} from '@island.is/judicial-system/formatters'
import {
  CaseAppealDecision,
  CaseDecision,
  CaseType,
  Gender,
  isAcceptingCaseDecision,
} from '@island.is/judicial-system/types'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
  setAndSendToServer,
  setAndSendDateToServer,
  validateAndSetTime,
  validateAndSendTimeToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  rcCourtRecord as m,
  courtDocuments,
  closedCourt,
  core,
} from '@island.is/judicial-system-web/messages'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import useDeb from '@island.is/judicial-system-web/src/utils/hooks/useDeb'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages/Core/titles'
import * as Constants from '@island.is/judicial-system/consts'

import { isCourtRecordStepValidRC } from '../../../../utils/validate'

export const CourtRecord: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)

  const [courtLocationErrorMessage, setCourtLocationMessage] = useState<string>(
    '',
  )
  const [
    sessionBookingsErrorMessage,
    setSessionBookingsErrorMessage,
  ] = useState<string>('')
  const [
    courtDocumentEndErrorMessage,
    setCourtDocumentEndErrorMessage,
  ] = useState<string>('')

  const router = useRouter()
  const { updateCase, autofill } = useCase()
  const { formatMessage } = useIntl()

  const id = router.query.id

  useDeb(workingCase, 'courtAttendees')
  useDeb(workingCase, 'sessionBookings')
  useDeb(workingCase, 'accusedAppealAnnouncement')
  useDeb(workingCase, 'prosecutorAppealAnnouncement')
  useDeb(workingCase, 'endOfSessionBookings')

  useEffect(() => {
    if (isCaseUpToDate) {
      const theCase = workingCase

      if (theCase.courtDate) {
        autofill('courtStartDate', theCase.courtDate, theCase)
      }

      if (theCase.court) {
        autofill(
          'courtLocation',
          `í ${
            theCase.court.name.indexOf('dómur') > -1
              ? theCase.court.name.replace('dómur', 'dómi')
              : theCase.court.name
          }`,
          theCase,
        )
      }

      if (theCase.courtAttendees !== '') {
        let autofillAttendees = ''

        if (theCase.prosecutor) {
          autofillAttendees += `${theCase.prosecutor.name} ${theCase.prosecutor.title}`
        }

        if (theCase.defenderName) {
          autofillAttendees += `\n${
            theCase.defenderName
          } skipaður verjandi ${formatMessage(core.accused, {
            suffix:
              theCase.defendants &&
              theCase.defendants.length > 0 &&
              theCase.defendants[0].gender === Gender.FEMALE
                ? 'u'
                : 'a',
          })}`
        }

        if (theCase.translator) {
          autofillAttendees += `\n${theCase.translator} túlkur`
        }

        if (theCase.defendants && theCase.defendants.length > 0) {
          autofillAttendees += `\n${theCase.defendants[0].name} ${formatMessage(
            core.accused,
            {
              suffix: theCase.defendants[0].gender === Gender.MALE ? 'i' : 'a',
            },
          )}`
        }

        autofill('courtAttendees', autofillAttendees, theCase)
      }

      let autofillSessionBookings = ''

      if (theCase.defenderName) {
        autofillSessionBookings += `${formatMessage(
          m.sections.sessionBookings.autofillDefender,
          {
            defender: theCase.defenderName,
          },
        )}\n\n`
      }

      if (theCase.translator) {
        autofillSessionBookings += `${formatMessage(
          m.sections.sessionBookings.autofillTranslator,
          {
            translator: theCase.translator,
          },
        )}\n\n`
      }

      autofillSessionBookings += `${formatMessage(
        m.sections.sessionBookings.autofillRightToRemainSilent,
      )}\n\n${formatMessage(
        m.sections.sessionBookings.autofillCourtDocumentOne,
      )}\n\n${formatMessage(m.sections.sessionBookings.autofillAccusedPlea)}`

      if (theCase.type === CaseType.CUSTODY) {
        autofillSessionBookings += `\n\n${formatMessage(
          m.sections.sessionBookings.autofillPresentations,
          {
            accused: formatMessage(core.accused, {
              suffix:
                theCase.defendants &&
                theCase.defendants.length > 0 &&
                theCase.defendants[0].gender === Gender.FEMALE
                  ? 'u'
                  : 'a',
            }),
          },
        )}`

        if (
          isAcceptingCaseDecision(theCase.decision) ||
          theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
        ) {
          autofill(
            'endOfSessionBookings',
            `${
              isAcceptingCaseDecision(theCase.decision)
                ? `${formatCustodyRestrictions(
                    theCase.requestedCustodyRestrictions,
                    theCase.isCustodyIsolation,
                    true,
                  )}\n\n`
                : ''
            }${formatMessage(m.sections.custodyRestrictions.disclaimer, {
              caseType:
                theCase.decision ===
                CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                  ? 'farbannsins'
                  : 'gæsluvarðhaldsins',
            })}`,
            theCase,
          )
        }
      } else if (theCase.type === CaseType.TRAVEL_BAN) {
        autofillSessionBookings += `\n\n${formatMessage(
          m.sections.sessionBookings.autofillPresentationsTravelBan,
        )}`

        if (isAcceptingCaseDecision(theCase.decision)) {
          autofill(
            'endOfSessionBookings',
            `${
              workingCase.requestedOtherRestrictions &&
              `${workingCase.requestedOtherRestrictions}\n\n`
            }${formatMessage(m.sections.custodyRestrictions.disclaimer, {
              caseType: 'farbannsins',
            })}`,
            theCase,
          )
        }
      }

      autofill('sessionBookings', autofillSessionBookings, theCase)

      setWorkingCase({ ...theCase })
    }
  }, [autofill, formatMessage, isCaseUpToDate, setWorkingCase, workingCase])

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
        title={formatMessage(titles.court.restrictionCases.courtRecord)}
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
                ['empty'],
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
              {formatMessage(m.sections.courtDocuments.title)}
            </Text>
          </Box>
          <CourtDocuments
            title={formatMessage(
              m.sections.courtDocuments.firstDocument.title,
              {
                caseType: caseTypes[workingCase.type],
              },
            )}
            tagText={formatMessage(courtDocuments.tag, { index: 1 })}
            tagVariant="darkerBlue"
            text={formatMessage(m.sections.courtDocuments.firstDocument.label)}
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
                    {formatMessage(m.sections.appealDecision.accusedTitle, {
                      accused: formatMessage(core.accused, {
                        suffix:
                          workingCase.defendants[0].gender === Gender.FEMALE
                            ? 'u'
                            : 'a',
                      }),
                    })}{' '}
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
                          m.sections.appealDecision.accusedAppeal,
                          {
                            accused: capitalize(
                              formatMessage(core.accused, {
                                suffix:
                                  workingCase.defendants[0].gender ===
                                  Gender.MALE
                                    ? 'i'
                                    : 'a',
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
                          setWorkingCase({
                            ...workingCase,
                            accusedAppealDecision: CaseAppealDecision.APPEAL,
                          })

                          updateCase(
                            workingCase.id,
                            parseString(
                              'accusedAppealDecision',
                              CaseAppealDecision.APPEAL,
                            ),
                          )
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
                          m.sections.appealDecision.accusedAccept,
                          {
                            accused: capitalize(
                              formatMessage(core.accused, {
                                suffix:
                                  workingCase.defendants[0].gender ===
                                  Gender.MALE
                                    ? 'i'
                                    : 'a',
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
                          setWorkingCase({
                            ...workingCase,
                            accusedAppealDecision: CaseAppealDecision.ACCEPT,
                          })

                          updateCase(
                            workingCase.id,
                            parseString(
                              'accusedAppealDecision',
                              CaseAppealDecision.ACCEPT,
                            ),
                          )
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
                          m.sections.appealDecision.accusedPostpone,
                          {
                            accused: capitalize(
                              formatMessage(core.accused, {
                                suffix:
                                  workingCase.defendants[0].gender ===
                                  Gender.MALE
                                    ? 'i'
                                    : 'a',
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
                          setWorkingCase({
                            ...workingCase,
                            accusedAppealDecision: CaseAppealDecision.POSTPONE,
                          })

                          updateCase(
                            workingCase.id,
                            parseString(
                              'accusedAppealDecision',
                              CaseAppealDecision.POSTPONE,
                            ),
                          )
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

                          updateCase(
                            workingCase.id,
                            parseString(
                              'accusedAppealDecision',
                              CaseAppealDecision.NOT_APPLICABLE,
                            ),
                          )
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
                    {
                      accused: formatMessage(core.accused, {
                        suffix:
                          workingCase.defendants[0].gender === Gender.FEMALE
                            ? 'u'
                            : 'a',
                      }),
                    },
                  )}
                  value={workingCase.accusedAppealAnnouncement || ''}
                  placeholder={formatMessage(
                    m.sections.appealDecision.accusedAnnouncementPlaceholder,
                    {
                      accused: formatMessage(core.accused, {
                        suffix:
                          workingCase.defendants[0].gender === Gender.MALE
                            ? 'i'
                            : 'a',
                      }),
                    },
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

                        updateCase(
                          workingCase.id,
                          parseString(
                            'prosecutorAppealDecision',
                            CaseAppealDecision.APPEAL,
                          ),
                        )
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

                        updateCase(
                          workingCase.id,
                          parseString(
                            'prosecutorAppealDecision',
                            CaseAppealDecision.ACCEPT,
                          ),
                        )
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

                        updateCase(
                          workingCase.id,
                          parseString(
                            'prosecutorAppealDecision',
                            CaseAppealDecision.POSTPONE,
                          ),
                        )
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

                        updateCase(
                          workingCase.id,
                          parseString(
                            'prosecutorAppealDecision',
                            CaseAppealDecision.NOT_APPLICABLE,
                          ),
                        )
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
                      courtDocumentEndErrorMessage,
                      setCourtDocumentEndErrorMessage,
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
                      setCourtDocumentEndErrorMessage,
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
                      Constants.TIME_FORMAT,
                    )}
                    errorMessage={courtDocumentEndErrorMessage}
                    hasError={courtDocumentEndErrorMessage !== ''}
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
          previousUrl={`${Constants.RULING_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.CONFIRMATION_ROUTE}/${id}`}
          nextIsDisabled={!isCourtRecordStepValidRC(workingCase)}
          hideNextButton={!workingCase.decision || !workingCase.conclusion}
          infoBoxText={
            !workingCase.decision || !workingCase.conclusion
              ? formatMessage(m.nextButtonInfo)
              : ''
          }
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CourtRecord
