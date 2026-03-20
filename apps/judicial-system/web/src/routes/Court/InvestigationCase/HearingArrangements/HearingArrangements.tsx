import { useCallback, useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import {
  AlertMessage,
  Box,
  RadioButton,
  Tooltip,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { isDistrictCourtUser } from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  ArraignmentAlert,
  BlueBox,
  CourtArrangements,
  CourtCaseInfo,
  DefenderInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
  useCourtArrangements,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { LegalRightsProtectorInputFields } from '@island.is/judicial-system-web/src/components/VictimInfo/LegalRightsProtectorInputFields'
import {
  NotificationType,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { isNonEmptyArray } from '@island.is/judicial-system-web/src/utils/arrayHelpers'
import { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  useCase,
  useOnceOn,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { hasSentNotification } from '@island.is/judicial-system-web/src/utils/utils'
import { isCourtHearingArrangementsStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'

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
  const { setAndSendCaseToServer, sendNotification, isSendingNotification } =
    useCase()
  const {
    courtDate,
    courtDateHasChanged,
    handleCourtDateChange,
    handleCourtRoomChange,
    sendCourtDateToServer,
  } = useCourtArrangements(workingCase, setWorkingCase, 'arraignmentDate')

  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()
  const [checkedRadio, setCheckedRadio] = useState<SessionArrangements>()

  const initialize = useCallback(() => {
    if (!workingCase.arraignmentDate && workingCase.requestedCourtDate) {
      setWorkingCase((theCase) => ({
        ...theCase,
        arraignmentDate: { date: theCase.requestedCourtDate },
      }))
    }

    setAndSendCaseToServer(
      [
        {
          sessionArrangements: workingCase.defenderName
            ? SessionArrangements.ALL_PRESENT
            : undefined,
        },
      ],
      workingCase,
      setWorkingCase,
    )
  }, [setAndSendCaseToServer, setWorkingCase, workingCase])

  useOnceOn(isCaseUpToDate, initialize)

  const courtDateNotification = useMemo(
    () =>
      hasSentNotification(
        NotificationType.COURT_DATE,
        workingCase.notifications,
      ),
    [workingCase.notifications],
  )

  const isCorrectingRuling = Boolean(workingCase.requestCompletedDate)

  const handleNavigationTo = async (destination: keyof stepValidationsType) => {
    await sendCourtDateToServer()

    if (
      isCorrectingRuling ||
      (courtDateNotification.hasSent && !courtDateHasChanged)
    ) {
      router.push(`${destination}/${workingCase.id}`)
    } else {
      setNavigateTo(destination)
    }
  }

  const stepIsValid = isCourtHearingArrangementsStepValidIC(
    workingCase,
    courtDate,
  )

  return (
    <PageLayout
      workingCase={workingCase}
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
        <ArraignmentAlert />
        <PageTitle>{formatMessage(m.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <div className={grid({ gap: 5, marginBottom: 10 })}>
          <Box component="section">
            <SectionHeading
              title={formatMessage(m.sections.sessionArrangements.heading)}
              required
            />
            <BlueBox className={grid({ gap: 2 })}>
              <RadioButton
                name="session-arrangements-all-present"
                id="session-arrangements-all-present"
                label={formatMessage(
                  m.sections.sessionArrangements.options.allPresent,
                )}
                checked={
                  checkedRadio === SessionArrangements.ALL_PRESENT ||
                  (!checkedRadio &&
                    workingCase.sessionArrangements ===
                      SessionArrangements.ALL_PRESENT)
                }
                onChange={() => {
                  setCheckedRadio(SessionArrangements.ALL_PRESENT)
                  setAndSendCaseToServer(
                    [
                      {
                        sessionArrangements: SessionArrangements.ALL_PRESENT,
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
                name="session-arrangements-all-present_spokesperson"
                id="session-arrangements-all-present_spokesperson"
                label={formatMessage(
                  m.sections.sessionArrangements.options.allPresentSpokesperson,
                )}
                checked={
                  checkedRadio ===
                    SessionArrangements.ALL_PRESENT_SPOKESPERSON ||
                  (!checkedRadio &&
                    workingCase.sessionArrangements ===
                      SessionArrangements.ALL_PRESENT_SPOKESPERSON)
                }
                onChange={() => {
                  setCheckedRadio(SessionArrangements.ALL_PRESENT_SPOKESPERSON)
                  setAndSendCaseToServer(
                    [
                      {
                        sessionArrangements:
                          SessionArrangements.ALL_PRESENT_SPOKESPERSON,
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
                name="session-arrangements-prosecutor-present"
                id="session-arrangements-prosecutor-present"
                label={formatMessage(
                  m.sections.sessionArrangements.options.prosecutorPresent,
                )}
                checked={
                  checkedRadio === SessionArrangements.PROSECUTOR_PRESENT ||
                  (!checkedRadio &&
                    workingCase.sessionArrangements ===
                      SessionArrangements.PROSECUTOR_PRESENT)
                }
                onChange={() => {
                  setCheckedRadio(SessionArrangements.PROSECUTOR_PRESENT)
                  setAndSendCaseToServer(
                    [
                      {
                        sessionArrangements:
                          SessionArrangements.PROSECUTOR_PRESENT,
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
                name="session-arrangements-none-present"
                id="session-arrangements-none-present"
                label={formatMessage(
                  m.sections.sessionArrangements.options.nonePresent,
                )}
                checked={
                  checkedRadio === SessionArrangements.NONE_PRESENT ||
                  (!checkedRadio &&
                    workingCase.sessionArrangements ===
                      SessionArrangements.NONE_PRESENT)
                }
                onChange={() => {
                  setCheckedRadio(SessionArrangements.NONE_PRESENT)
                  setAndSendCaseToServer(
                    [
                      {
                        sessionArrangements: SessionArrangements.NONE_PRESENT,
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
          <Box component="section">
            <SectionHeading
              title={formatMessage(m.sections.requestedCourtDate.title)}
            />
            <CourtArrangements
              handleCourtDateChange={handleCourtDateChange}
              handleCourtRoomChange={handleCourtRoomChange}
              courtDate={workingCase.arraignmentDate}
              courtRoomDisabled={isCorrectingRuling}
              dateTimeDisabled={isCorrectingRuling}
            />
          </Box>
          {(workingCase.sessionArrangements ===
            SessionArrangements.ALL_PRESENT ||
            workingCase.sessionArrangements ===
              SessionArrangements.ALL_PRESENT_SPOKESPERSON) && (
            <Box component="section">
              <DefenderInfo
                workingCase={workingCase}
                setWorkingCase={setWorkingCase}
              />
            </Box>
          )}
          {workingCase.sessionArrangements ===
            SessionArrangements.ALL_PRESENT &&
            isNonEmptyArray(workingCase.victims) && (
              <section className={grid({ gap: 4 })}>
                <SectionHeading
                  title={
                    workingCase.victims && workingCase.victims.length > 1
                      ? 'Réttargæslumenn'
                      : 'Réttargæslumaður'
                  }
                  tooltip={
                    isDistrictCourtUser(user) ? (
                      <Tooltip
                        text="Lögmaður sem er valinn hér verður skipaður réttargæslumaður brotaþola í þinghaldi og fær sendan úrskurð rafrænt."
                        placement="right"
                      />
                    ) : null
                  }
                />
                {workingCase.victims.map((victim) => (
                  <Box key={victim.id} component="section">
                    <BlueBox>
                      <LegalRightsProtectorInputFields
                        victim={victim}
                        workingCase={workingCase}
                        setWorkingCase={setWorkingCase}
                        useVictimNameAsTitle
                      />
                    </BlueBox>
                  </Box>
                ))}
              </section>
            )}
        </div>
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
            workingCase.sessionArrangements === SessionArrangements.ALL_PRESENT
              ? m.modal.allPresentText
              : workingCase.sessionArrangements ===
                SessionArrangements.ALL_PRESENT_SPOKESPERSON
              ? m.modal.allPresentSpokespersonText
              : m.modal.prosecutorPresentText,
            { courtDateHasChanged },
          )}
          primaryButton={{
            text: formatMessage(m.modal.primaryButtonText),
            onClick: async () => {
              const notificationSent = await sendNotification(
                workingCase.id,
                NotificationType.COURT_DATE,
              )

              if (notificationSent) {
                router.push(`${navigateTo}/${workingCase.id}`)
              }
            },
            isLoading: isSendingNotification,
          }}
          secondaryButton={{
            text: formatMessage(m.modal.secondaryButtonText, {
              courtDateHasChanged,
            }),
            onClick: () => {
              sendNotification(
                workingCase.id,
                NotificationType.COURT_DATE,
                true,
              )

              router.push(`${navigateTo}/${workingCase.id}`)
            },
          }}
        />
      )}
    </PageLayout>
  )
}

export default HearingArrangements
