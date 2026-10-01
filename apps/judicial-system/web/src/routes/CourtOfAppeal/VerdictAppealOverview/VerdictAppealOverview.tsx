import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Text } from '@island.is/island-ui/core'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import { isRulingOrDismissalCase } from '@island.is/judicial-system/types'
import {
  AllIndictmentCaseFiles,
  Conclusion,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCardClosedIndictment,
  PageHeader,
  PageLayout,
  PageTitle,
  UserContext,
  VerdictAppealFiles,
} from '@island.is/judicial-system-web/src/components'
import CourtOfAppealsVerdictTimelineCard from '@island.is/judicial-system-web/src/components/Cards/VerdictTimelineCard/CourtOfAppealsVerdictTimelineCard'
import { CaseIndictmentRulingDecision } from '@island.is/judicial-system-web/src/graphql/schema'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'

import { getVerdictAppealOverviewHeaderLines } from './VerdictAppealOverview.logic'

/**
 * What the Court of Appeals sees when a verdict appeal reaches it.
 *
 * A page of its own rather than a branch inside the ruling appeal overview: a
 * verdict appeal is a separate proceeding with its own steps, and the two only
 * resemble each other on this first screen. Both of the court's verdict appeal
 * lists open here, in progress and completed, so everything below has to read
 * sensibly before the court has entered anything of its own.
 *
 * The appeal is `workingCase.verdictAppealCase` - a HasOne scoped to the
 * verdict appeal type, so there is exactly one and nothing to resolve from the
 * query string the way the ruling appeal pages do.
 */
const VerdictAppealOverview = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const router = useRouter()

  const handleNavigationTo = (destination: string) =>
    router.push(`${destination}/${workingCase.id}`)

  const headerLines = getVerdictAppealOverviewHeaderLines(workingCase)

  // The district court's own words, which for an indictment live on the last
  // court session rather than on the case. Titled for what was decided, as the
  // district court's completed view titles it.
  const districtCourtConclusion = workingCase.courtSessions?.at(-1)?.ruling
  const districtCourtConclusionTitle = `${
    workingCase.indictmentRulingDecision === CaseIndictmentRulingDecision.RULING
      ? 'Dóms'
      : 'Úrskurðar'
  }orð héraðsdóms`

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={titleForCase(formatMessage, workingCase)} />
      <FormContentContainer>
        <div className={stack({ gap: 5 })}>
          {/* The court's own heading for the proceeding, rather than the case
              state the other overviews title themselves with: by the time a
              case is here the district court is finished with it, and what the
              page is about is the appeal. */}
          <Box>
            <PageTitle marginBottom={1}>Yfirlit</PageTitle>
            {headerLines.map((line) => (
              <Text key={line} as="h5" variant="h5">
                {line}
              </Text>
            ))}
          </Box>
          {/* One per defendant: each has their own verdict, their own service
              and their own deadline, so the court reads them side by side.
              Above the info card because the verdict and its appeal are what
              the court came for; the parties and case numbers below are
              reference. */}
          {workingCase.defendants?.map((defendant) => (
            <CourtOfAppealsVerdictTimelineCard
              key={defendant.id}
              defendant={defendant}
            />
          ))}
          <InfoCardClosedIndictment />
          {isRulingOrDismissalCase(workingCase.indictmentRulingDecision) && (
            <Conclusion
              title={districtCourtConclusionTitle}
              conclusionText={districtCourtConclusion}
              judgeName={workingCase.judge?.name}
            />
          )}
          {/* The court's own conclusion belongs here once there is a step
              that writes one. Nothing does yet, and the case query does not
              select appealConclusion on verdictAppealCase, so it is left to
              the change that makes it reachable. */}
          {/* The appeal declaration and what came with it, titled
              "Áfrýjunarferli"; the áfrýjunarstefna joins it with the ticket
              that creates it. Build those cards with the Stackable component -
              a case carries one per appealing party, and the design piles them
              rather than running them down the page. AllIndictmentCaseFiles
              below carries the district court's own documents. */}
          <VerdictAppealFiles />
          <AllIndictmentCaseFiles />
        </div>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter previousUrl={getStandardUserDashboardRoute(user)} />
      </FormContentContainer>
    </PageLayout>
  )
}

export default VerdictAppealOverview
