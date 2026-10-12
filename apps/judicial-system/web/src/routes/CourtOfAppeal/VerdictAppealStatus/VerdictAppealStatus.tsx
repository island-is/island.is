import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'
import { useRouter } from 'next/router'

import { Box, RadioButton, Text } from '@island.is/island-ui/core'
import { COURT_OF_APPEAL_VERDICT_APPEAL_DEFENDER_ROUTE } from '@island.is/judicial-system/consts'
import {
  BlueBox,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import RadioGroup from '@island.is/judicial-system-web/src/components/RadioGroup/RadioGroup'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'
import { appendAppealCaseIdQuery } from '@island.is/judicial-system-web/src/utils/utils'

import ExpandingSection from './ExpandingSection'
import ScheduleCourtSession from './ScheduleCourtSession'
import type { AppealCourtSession } from './VerdictAppealStatus.logic'
import {
  getVerdictAppealStatusHeaderLines,
  isAppealCourtSessionComplete,
  VerdictAppealStatus as Status,
  verdictAppealStatuses,
  verdictAppealStatusLabels,
} from './VerdictAppealStatus.logic'

/**
 * Where the Court of Appeals records how far a verdict appeal has come, and
 * books the sessions it calls.
 *
 * Frontend only so far. The status and the session form live in this page's
 * state and are lost on reload: there is no column for either yet, and the
 * slice that adds them replaces the state here with the appeal's own record.
 * Filling the form in does nothing either - booking, the list of booked
 * sessions and the notifications are the slices after this one.
 *
 * Not gated behind the feature flag, for the reason the defender step gives:
 * the stepper section this page belongs to only renders for a verdict appeal,
 * and none can exist while the feature is hidden.
 */
const VerdictAppealStatus = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  // Read directly rather than through the shared resolver, for the reason
  // given on the overview: the resolver falls back to the case-level ruling
  // appeal when the URL names no appeal, and this page is never about that
  // one.
  const verdictAppealCase = workingCase.verdictAppealCase
  const { formatMessage } = useIntl()
  const router = useRouter()

  const [status, setStatus] = useState<Status>()
  const [courtSession, setCourtSession] = useState<AppealCourtSession>({})

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

  // Choosing to call a session is only settled once the form is filled in.
  const stepIsValid =
    status !== undefined &&
    (status !== Status.COURT_SESSION_SCHEDULED ||
      isAppealCourtSessionComplete(courtSession))

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
          {/* The design leads with the court's own case number, "Mál nr.
              555/2026". That number is assigned on the registration step,
              which is not built yet, and the appeal does not carry one until
              it is. The line joins the header with that step. */}
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
                    onChange={() => setStatus(value)}
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
        <AnimatePresence initial={false}>
          {status === Status.COURT_SESSION_SCHEDULED && (
            <ExpandingSection key="schedule-court-session">
              <Box paddingTop={5}>
                <ScheduleCourtSession
                  session={courtSession}
                  onChange={setCourtSession}
                />
              </Box>
            </ExpandingSection>
          )}
        </AnimatePresence>
      </FormContentContainer>
      <FormContentContainer isFooter>
        {/* No continue action: this is the last step the court of appeals has
            on a verdict appeal so far. The summary that follows it in the
            design arrives with its own ticket. */}
        <FormFooter previousUrl={defenderUrl} />
      </FormContentContainer>
    </PageLayout>
  )
}

export default VerdictAppealStatus
