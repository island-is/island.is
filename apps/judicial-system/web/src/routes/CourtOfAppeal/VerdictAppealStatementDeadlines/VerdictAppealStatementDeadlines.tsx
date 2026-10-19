import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Text } from '@island.is/island-ui/core'
import {
  COURT_OF_APPEAL_VERDICT_APPEAL_DEFENDER_ROUTE,
  COURT_OF_APPEAL_VERDICT_APPEAL_STATUS_ROUTE,
} from '@island.is/judicial-system/consts'
import { core } from '@island.is/judicial-system-web/messages'
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
import useAppealStatementDeadline from '@island.is/judicial-system-web/src/utils/hooks/useAppealStatementDeadline'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'
import { appendAppealCaseIdQuery } from '@island.is/judicial-system-web/src/utils/utils'

import {
  getVerdictAppealDefenderCaseNumber,
  getVerdictAppealDefenderHeaderLines,
} from '../VerdictAppealDefender/VerdictAppealDefender.logic'
import StatementDeadlineCard from './StatementDeadlineCard'
import type { StatementDeadlineParty } from './VerdictAppealStatementDeadlines.logic'
import {
  applyStatementDeadline,
  getStatementDeadlineParties,
} from './VerdictAppealStatementDeadlines.logic'

/**
 * Where the Court of Appeals gives each party of a verdict appeal its
 * deadline to file a statement, and moves it when asked.
 *
 * Each deadline is sent on its own, after the court confirms. The dialog
 * promises the parties a mail, as the design has it; the mail itself is the
 * notification slice that follows. The step asks nothing of the court before it moves on
 * (owner's decision): a deadline is given when there is a party to give it
 * to, and the court can come back for the rest.
 *
 * Not gated behind the feature flag, for the reason the defender step gives:
 * the stepper section this page belongs to only renders for a verdict appeal,
 * and none can exist while the feature is hidden.
 */
const VerdictAppealStatementDeadlines = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  // Read directly rather than through the shared resolver, for the reason
  // given on the overview: the resolver falls back to the case-level ruling
  // appeal when the URL names no appeal, and this page is never about that
  // one.
  const verdictAppealCase = workingCase.verdictAppealCase
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { setAppealStatementDeadline, isSettingAppealStatementDeadline } =
    useAppealStatementDeadline()

  const parties = getStatementDeadlineParties(workingCase)
  const caseNumber = getVerdictAppealDefenderCaseNumber(workingCase)
  const headerLines = getVerdictAppealDefenderHeaderLines(workingCase)

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

  const sendDeadline = async (
    party: StatementDeadlineParty,
    deadline: Date,
  ): Promise<boolean> => {
    if (!verdictAppealCase) {
      return false
    }

    const saved = await setAppealStatementDeadline({
      caseId: workingCase.id,
      appealCaseId: verdictAppealCase.id,
      defendantId: party.party.defendantId ?? undefined,
      civilClaimantId: party.party.civilClaimantId ?? undefined,
      // The picker gives a day at midnight, and that is what is sent: the
      // backend compares deadlines as instants, so a time of day on one
      // would let the same day pass as an extension.
      deadline: deadline.toISOString(),
    })

    if (!saved) {
      return false
    }

    // Written into the working case so the card shows the deadline it just
    // sent, and offers an extension next, without a refetch.
    setWorkingCase((previous) => applyStatementDeadline(previous, saved))

    return true
  }

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={titleForCase(formatMessage, workingCase)} />
      <FormContentContainer>
        <Box marginBottom={5}>
          <PageTitle marginBottom={caseNumber || headerLines.length ? 1 : 0}>
            Greinargerðarfrestir
          </PageTitle>
          {caseNumber && (
            <Text as="h2" variant="h2">
              {caseNumber}
            </Text>
          )}
          {headerLines.map((line) => (
            <Text key={line} as="p" variant="h5">
              {line}
            </Text>
          ))}
        </Box>
        <Box component="section">
          <SectionHeading title="Greinargerðarfrestir" marginBottom={3} />
          <BlueBox className={stack({ gap: 2 })}>
            {parties.map((party) => (
              <StatementDeadlineCard
                key={party.key}
                party={party}
                onSend={sendDeadline}
                isSending={isSettingAppealStatementDeadline}
              />
            ))}
          </BlueBox>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={defenderUrl}
          actions={[
            {
              text: formatMessage(core.continue),
              icon: 'arrowForward',
              onClick: () =>
                handleNavigationTo(COURT_OF_APPEAL_VERDICT_APPEAL_STATUS_ROUTE),
              testId: 'continueButton',
            },
          ]}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default VerdictAppealStatementDeadlines
