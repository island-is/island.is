import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import {
  BlueBox,
  CourtArrangements,
  CourtCaseInfo,
  DefenderInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageLayout,
  useCourtArrangements,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { NotificationType } from '@island.is/judicial-system/types'
import {
  RestrictionCaseCourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  useCase,
  useOnceOn,
} from '@island.is/judicial-system-web/src/utils/hooks'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  AlertMessage,
  RadioButton,
  Box,
  Tooltip,
  Text,
} from '@island.is/island-ui/core'
import { isCourtHearingArrangementsStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'
import { formatDateForServer } from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import { hasSentNotification } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { SessionArrangements } from '@island.is/judicial-system-web/src/graphql/schema'
import * as constants from '@island.is/judicial-system/consts'

import { icHearingArrangements as m } from './HearingArrangements.strings'

const HearingArrangements = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const {
    setAndSendCaseToServer,
    sendNotification,
    isSendingNotification,
  } = useCase()
  const {
    courtDate,
    setCourtDate,
    courtDateHasChanged,
    handleCourtDateChange,
  } = useCourtArrangements(workingCase)

  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()
  const [checkedRadio, setCheckedRadio] = useState<SessionArrangements>()

  const initialize = useCallback(() => {
    if (!workingCase.courtDate) {
      setCourtDate(workingCase.requestedCourtDate)
    }

    setAndSendCaseToServer(
      [
        {
          sessionArrangements: workingCase.defenderName
            ? SessionArrangements.AllPresent
            : undefined,
        },
      ],
      workingCase,
      setWorkingCase,
    )
  }, [setAndSendCaseToServer, setCourtDate, setWorkingCase, workingCase])

  useOnceOn(isCaseUpToDate, initialize)

  const handleNavigationTo = useCallback(
    async (destination: keyof stepValidationsType) => {
      await setAndSendCaseToServer(
        [
          {
            courtDate: courtDate
              ? formatDateForServer(new Date(courtDate))
              : undefined,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )

      const isCorrectingRuling = workingCase.notifications?.some(
        (notification) => notification.type === NotificationType.RULING,
      )

      if (
        isCorrectingRuling ||
        (hasSentNotification(
          NotificationType.COURT_DATE,
          workingCase.notifications,
        ) &&
          !courtDateHasChanged)
      ) {
        router.push(`${destination}/${workingCase.id}`)
      } else {
        setNavigateTo(destination)
      }
    },
    [
      workingCase,
      setAndSendCaseToServer,
      courtDate,
      setWorkingCase,
      courtDateHasChanged,
    ],
  )

  const stepIsValid = isCourtHearingArrangementsStepValidIC(
    workingCase,
    courtDate,
  )

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={RestrictionCaseCourtSubsections.HEARING_ARRANGEMENTS}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      onNavigationTo={handleNavigationTo}
      isValid={stepIsValid}
    >
      <PageHeader
        title={formatMessage(
          titles.court.investigationCases.hearingArrangements,
        )}
      />
      {user && (
        <>
          <FormContentContainer>
            {workingCase.requestProsecutorOnlySession &&
              workingCase.prosecutorOnlySessionRequest && (
                <Box marginBottom={workingCase.comments ? 2 : 5}>
                  <AlertMessage
                    type="warning"
                    title={formatMessage(m.requestProsecutorOnlySession)}
                    message={workingCase.prosecutorOnlySessionRequest}
                  />
                </Box>
              )}
            {workingCase.comments && (
              <Box marginBottom={5}>
                <AlertMessage
                  type="warning"
                  title={formatMessage(m.comments.title)}
                  message={workingCase.comments}
                />
              </Box>
            )}
            <Box marginBottom={7}>
              <Text as="h1" variant="h1">
                {formatMessage(m.title)}
              </Text>
            </Box>
            <CourtCaseInfo workingCase={workingCase} />
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  {`${formatMessage(m.sections.sessionArrangements.heading)} `}
                  <Text as="span" color="red600" fontWeight="semiBold">
                    *
                  </Text>
                  <Tooltip
                    text={formatMessage(m.sections.sessionArrangements.tooltip)}
                  />
                </Text>
              </Box>
              <BlueBox>
                <Box marginBottom={2}>
                  <RadioButton
                    name="session-arrangements-all-present"
                    id="session-arrangements-all-present"
                    label={formatMessage(
                      m.sections.sessionArrangements.options.allPresent,
                    )}
                    checked={
                      checkedRadio === SessionArrangements.AllPresent ||
                      (!checkedRadio &&
                        workingCase.sessionArrangements ===
                          SessionArrangements.AllPresent)
                    }
                    onChange={() => {
                      setCheckedRadio(SessionArrangements.AllPresent)
                      setAndSendCaseToServer(
                        [
                          {
                            sessionArrangements: SessionArrangements.AllPresent,
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
                </Box>
                <Box marginBottom={2}>
                  <RadioButton
                    name="session-arrangements-all-present_spokesperson"
                    id="session-arrangements-all-present_spokesperson"
                    label={formatMessage(
                      m.sections.sessionArrangements.options
                        .allPresentSpokesperson,
                    )}
                    checked={
                      checkedRadio ===
                        SessionArrangements.AllPresentSpokesperson ||
                      (!checkedRadio &&
                        workingCase.sessionArrangements ===
                          SessionArrangements.AllPresentSpokesperson)
                    }
                    onChange={() => {
                      setCheckedRadio(
                        SessionArrangements.AllPresentSpokesperson,
                      )
                      setAndSendCaseToServer(
                        [
                          {
                            sessionArrangements:
                              SessionArrangements.AllPresentSpokesperson,
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
                </Box>
                <RadioButton
                  name="session-arrangements-prosecutor-present"
                  id="session-arrangements-prosecutor-present"
                  label={formatMessage(
                    m.sections.sessionArrangements.options.prosecutorPresent,
                  )}
                  checked={
                    checkedRadio === SessionArrangements.ProsecutorPresent ||
                    (!checkedRadio &&
                      workingCase.sessionArrangements ===
                        SessionArrangements.ProsecutorPresent)
                  }
                  onChange={() => {
                    setCheckedRadio(SessionArrangements.ProsecutorPresent)
                    setAndSendCaseToServer(
                      [
                        {
                          sessionArrangements:
                            SessionArrangements.ProsecutorPresent,
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
              </BlueBox>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  {formatMessage(m.sections.requestedCourtDate.title)}
                </Text>
              </Box>
              <Box marginBottom={2}>
                <CourtArrangements
                  workingCase={workingCase}
                  setWorkingCase={setWorkingCase}
                  handleCourtDateChange={handleCourtDateChange}
                  selectedCourtDate={courtDate}
                />
              </Box>
            </Box>
            {(workingCase.sessionArrangements ===
              SessionArrangements.AllPresent ||
              workingCase.sessionArrangements ===
                SessionArrangements.AllPresentSpokesperson) && (
              <Box component="section" marginBottom={8}>
                <DefenderInfo
                  workingCase={workingCase}
                  setWorkingCase={setWorkingCase}
                />
              </Box>
            )}
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              nextButtonIcon="arrowForward"
              previousUrl={`${constants.INVESTIGATION_CASE_OVERVIEW_ROUTE}/${workingCase.id}`}
              onNextButtonClick={() =>
                handleNavigationTo(constants.INVESTIGATION_CASE_RULING_ROUTE)
              }
              nextIsDisabled={!stepIsValid}
              nextButtonText={formatMessage(m.continueButton.label)}
            />
          </FormContentContainer>
          {navigateTo !== undefined && (
            <Modal
              title={formatMessage(m.modal.heading)}
              text={formatMessage(
                workingCase.sessionArrangements ===
                  SessionArrangements.AllPresent
                  ? m.modal.allPresentText
                  : workingCase.sessionArrangements ===
                    SessionArrangements.AllPresentSpokesperson
                  ? m.modal.allPresentSpokespersonText
                  : m.modal.prosecutorPresentText,
                { courtDateHasChanged },
              )}
              onPrimaryButtonClick={async () => {
                const notificationSent = await sendNotification(
                  workingCase.id,
                  NotificationType.COURT_DATE,
                )

                if (notificationSent) {
                  router.push(`${navigateTo}/${workingCase.id}`)
                }
              }}
              onSecondaryButtonClick={() => {
                router.push(`${navigateTo}/${workingCase.id}`)
              }}
              primaryButtonText={formatMessage(m.modal.primaryButtonText)}
              secondaryButtonText={formatMessage(m.modal.secondaryButtonText, {
                courtDateHasChanged,
              })}
              isPrimaryButtonLoading={isSendingNotification}
            />
          )}
        </>
      )}
    </PageLayout>
  )
}

export default HearingArrangements
