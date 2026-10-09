import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Text } from '@island.is/island-ui/core'
import { COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import {
  AppealAppointmentLetterButtons,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'
import { appendAppealCaseIdQuery } from '@island.is/judicial-system-web/src/utils/utils'

import SelectAppealCivilClaimantAdvocate from './SelectAppealCivilClaimantAdvocate'
import SelectAppealDefender from './SelectAppealDefender'
import {
  areAllAppealAdvocatesConfirmed,
  getCivilClaimantSectionTitle,
  getVerdictAppealDefenderCaseNumber,
  getVerdictAppealDefenderHeaderLines,
} from './VerdictAppealDefender.logic'

/**
 * Where the Court of Appeals settles who represents each party in the appeal.
 *
 * The same job the district court does on its own Advocates screen, and the
 * screen is built to read like it. What differs is whose record it writes: the
 * appeal's own columns, never the district court's, because who defended there
 * is a fact about that proceeding.
 *
 * Nothing follows from confirming yet - no access, no notification. The letter
 * of appointment and what a confirmed advocate may open are the slices after
 * this one.
 *
 * Not gated behind the feature flag, and deliberately so. The stepper section
 * this page belongs to only renders for a verdict appeal, and no verdict
 * appeal can exist while the feature is hidden, so neither this page nor the
 * step that leads to it is reachable. A direct link is the only way in, and
 * the write path refuses one at the API layer.
 */
const VerdictAppealDefender = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  // Read directly rather than through the shared resolver, for the reason
  // given on the overview: the resolver falls back to the case-level ruling
  // appeal when the URL names no appeal, and this page is never about that
  // one.
  const verdictAppealCase = workingCase.verdictAppealCase
  const { formatMessage } = useIntl()
  const router = useRouter()

  const overviewUrl = appendAppealCaseIdQuery(
    `${COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE}/${workingCase.id}`,
    verdictAppealCase?.id,
  )

  const stepIsValid = areAllAppealAdvocatesConfirmed(workingCase)
  const caseNumber = getVerdictAppealDefenderCaseNumber(workingCase)
  const headerLines = getVerdictAppealDefenderHeaderLines(workingCase)
  const hasCivilClaimants = (workingCase.civilClaimants?.length ?? 0) > 0

  const handleNavigationTo = (destination: string) =>
    router.push(
      appendAppealCaseIdQuery(
        `${destination}/${workingCase.id}`,
        verdictAppealCase?.id,
      ),
    )

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
        {/* Which appeal this is, and which district court case it came from.
            The overview leads with the district court because the appeal has
            barely begun there; by here the appeal is the case being worked
            on. */}
        <Box marginBottom={5}>
          <PageTitle marginBottom={caseNumber || headerLines.length ? 1 : 0}>
            Verjandi
          </PageTitle>
          {caseNumber && (
            <Text as="h2" variant="h2">
              {caseNumber}
            </Text>
          )}
          {headerLines.map((line) => (
            <Text key={line} as="h5" variant="h5">
              {line}
            </Text>
          ))}
        </Box>
        <div className={stack({ gap: 5 })}>
          <Box component="section">
            <SectionHeading title="Verjandi" marginBottom={3} />
            <div className={stack({ gap: 5 })}>
              {workingCase.defendants?.map((defendant) => (
                <SelectAppealDefender
                  key={defendant.id}
                  defendant={defendant}
                />
              ))}
            </div>
          </Box>
          {hasCivilClaimants && (
            <Box component="section">
              <SectionHeading
                title={getCivilClaimantSectionTitle(
                  workingCase.civilClaimants?.length ?? 0,
                )}
                marginBottom={3}
              />
              <div className={stack({ gap: 5 })}>
                {workingCase.civilClaimants?.map((civilClaimant) => (
                  <SelectAppealCivilClaimantAdvocate
                    key={civilClaimant.id}
                    civilClaimant={civilClaimant}
                  />
                ))}
              </div>
            </Box>
          )}
          {/* Below every advocate rather than inside each box: the letters are
              what the court takes away once it has settled everyone (design,
              parent ticket). */}
          <AppealAppointmentLetterButtons />
        </div>
      </FormContentContainer>
      <FormContentContainer isFooter>
        {/* No continue action: this is the last step the court of appeals has
            on a verdict appeal so far. The next one arrives with the step
            that follows it. */}
        <FormFooter previousUrl={overviewUrl} />
      </FormContentContainer>
    </PageLayout>
  )
}

export default VerdictAppealDefender
