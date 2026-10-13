import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'
import { useRouter } from 'next/router'

import { Box, RadioButton, Text } from '@island.is/island-ui/core'
import {
  COURT_OF_APPEAL_VERDICT_APPEAL_DEFENDER_ROUTE,
  COURT_OF_APPEAL_VERDICT_APPEAL_SUMMARY_ROUTE,
} from '@island.is/judicial-system/consts'
import { core } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  ExpandingSection,
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import RadioGroup from '@island.is/judicial-system-web/src/components/RadioGroup/RadioGroup'
import useAppealCourtSession from '@island.is/judicial-system-web/src/utils/hooks/useAppealCourtSession'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'
import { appendAppealCaseIdQuery } from '@island.is/judicial-system-web/src/utils/utils'

import ScheduleCourtSession from './ScheduleCourtSession'
import type { AppealCourtSessionDraft } from './VerdictAppealStatus.logic'
import {
  getVerdictAppealStatusHeaderLines,
  isAppealCourtSessionComplete,
  isAppealCourtSessionEmpty,
  VerdictAppealStatus as Status,
  verdictAppealStatuses,
  verdictAppealStatusLabels,
} from './VerdictAppealStatus.logic'

/**
 * Where the Court of Appeals records how far a verdict appeal has come, and
 * books the sessions it calls.
 *
 * The sessions are saved: continuing with a complete form books it on the
 * appeal, after the court confirms, and the booked ones are listed under the
 * form. The status itself is not saved - there is no column for it - so
 * it is held in page state, and read back from the sessions: an appeal with
 * one is on "Boða til þinghalds" when the page opens.
 *
 * Not gated behind the feature flag, for the reason the defender step gives:
 * the stepper section this page belongs to only renders for a verdict appeal,
 * and none can exist while the feature is hidden.
 */
const VerdictAppealStatus = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  // Read directly rather than through the shared resolver, for the reason
  // given on the overview: the resolver falls back to the case-level ruling
  // appeal when the URL names no appeal, and this page is never about that
  // one.
  const verdictAppealCase = workingCase.verdictAppealCase
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { createAppealCourtSession, isCreatingAppealCourtSession } =
    useAppealCourtSession()

  const bookedSessions = verdictAppealCase?.courtSessions ?? []

  const [chosenStatus, setChosenStatus] = useState<Status>()
  const [courtSession, setCourtSession] = useState<AppealCourtSessionDraft>({})
  const [isConfirmingSession, setIsConfirmingSession] = useState(false)

  // Derived rather than set in an effect: the case arrives after the first
  // render, and the choice the court makes on the page always wins.
  const status =
    chosenStatus ??
    (bookedSessions.length > 0 ? Status.COURT_SESSION_SCHEDULED : undefined)
  const isSchedulingSession = status === Status.COURT_SESSION_SCHEDULED
  const hasSessionToBook =
    isSchedulingSession && isAppealCourtSessionComplete(courtSession)

  const defenderUrl = appendAppealCaseIdQuery(
    `${COURT_OF_APPEAL_VERDICT_APPEAL_DEFENDER_ROUTE}/${workingCase.id}`,
    verdictAppealCase?.id,
  )

  const handleNavigationTo = (destination: string) =>
    router.push(
      appendAppealCaseIdQuery(
        `${destination}/${workingCase.id}`,
        verdictAppealCase?.id,
      ),
    )

  // Calling a session is settled by a complete form, or by one already
  // booked with the form left alone. A form the court has started on is
  // neither.
  const stepIsValid =
    status !== undefined &&
    (!isSchedulingSession ||
      hasSessionToBook ||
      (bookedSessions.length > 0 && isAppealCourtSessionEmpty(courtSession)))

  const continueToSummary = () =>
    handleNavigationTo(COURT_OF_APPEAL_VERDICT_APPEAL_SUMMARY_ROUTE)

  const handleContinue = () => {
    if (hasSessionToBook) {
      setIsConfirmingSession(true)

      return
    }

    continueToSummary()
  }

  const bookSession = async () => {
    if (
      !verdictAppealCase ||
      !courtSession.sessionType ||
      !courtSession.sessionDate ||
      !courtSession.courtRoom
    ) {
      return
    }

    const booked = await createAppealCourtSession({
      caseId: workingCase.id,
      appealCaseId: verdictAppealCase.id,
      sessionType: courtSession.sessionType,
      sessionDate: courtSession.sessionDate.toISOString(),
      courtRoom: courtSession.courtRoom.trim(),
    })

    if (!booked) {
      return
    }

    // Written into the working case so the list is right when the court
    // comes back, without a refetch.
    setWorkingCase((previous) =>
      previous.verdictAppealCase
        ? {
            ...previous,
            verdictAppealCase: {
              ...previous.verdictAppealCase,
              courtSessions: [
                ...(previous.verdictAppealCase.courtSessions ?? []),
                booked,
              ],
            },
          }
        : previous,
    )
    setCourtSession({})
    setIsConfirmingSession(false)
    continueToSummary()
  }

  const headerLines = getVerdictAppealStatusHeaderLines(workingCase)

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={titleForCase(formatMessage, workingCase)} />
      <FormContentContainer>
        <div className={stack({ gap: 5 })}>
          {/* No "Mál nr." line: the appeal has no case number of its own. */}
          <Box>
            <PageTitle marginBottom={1}>Staða og lyktir</PageTitle>
            {headerLines.map((line) => (
              <Text key={line} as="h5" variant="h5">
                {line}
              </Text>
            ))}
          </Box>
          <Box component="section">
            <SectionHeading title="Staða" required />
            <BlueBox>
              <RadioGroup
                legend="Staða"
                hideLegend
                className={stack({ gap: 2 })}
              >
                {verdictAppealStatuses.map((value) => (
                  <RadioButton
                    key={value}
                    name="verdict-appeal-status"
                    id={`verdict-appeal-status-${value}`}
                    label={verdictAppealStatusLabels[value]}
                    checked={status === value}
                    onChange={() => setChosenStatus(value)}
                    large
                    backgroundColor="white"
                  />
                ))}
              </RadioGroup>
            </BlueBox>
          </Box>
        </div>
        {/* Outside the stack so the gap above the section grows and shrinks
            with it, rather than appearing the instant the section mounts. */}
        <ExpandingSection show={isSchedulingSession}>
          <Box paddingTop={5}>
            <ScheduleCourtSession
              session={courtSession}
              onChange={setCourtSession}
              bookedSessions={bookedSessions}
            />
          </Box>
        </ExpandingSection>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={defenderUrl}
          actions={[
            {
              text: formatMessage(core.continue),
              icon: 'arrowForward',
              disabled: !stepIsValid,
              onClick: handleContinue,
              testId: 'continueButton',
            },
          ]}
        />
      </FormContentContainer>
      <AnimatePresence>
        {isConfirmingSession && (
          <Modal
            title="Boða til þinghalds?"
            text="Málið fer á dagskrá og málflytjendur fá sent fundarboð."
            onClose={() => setIsConfirmingSession(false)}
            buttons={[
              {
                text: 'Hætta við',
                onClick: () => setIsConfirmingSession(false),
                variant: 'ghost',
              },
              {
                text: 'Staðfesta',
                onClick: bookSession,
                isLoading: isCreatingAppealCourtSession,
                dataTestId: 'confirmSessionButton',
              },
            ]}
          />
        )}
      </AnimatePresence>
    </PageLayout>
  )
}

export default VerdictAppealStatus
