import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

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
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseIndictmentRulingDecision } from '@island.is/judicial-system-web/src/graphql/schema'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'

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
